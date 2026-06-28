"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ScanLine, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { playConnectionSound } from "@/lib/audio/resonance";

// クライアント側で画像をリサイズ＆圧縮するユーティリティ（転送速度の向上とエラー防止）
const compressImage = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context is null"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob returned null"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function ScanPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "confirm">("idle");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    address: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      playConnectionSound("silver");
    } catch (err) {}
    
    setStatus("processing");
    setAiInsight("Optimizing image... / 画像を解析用に最適化中...");

    let targetFile: File | Blob = file;

    try {
      // 1. 画像の圧縮（巨大な写真データを150KB前後に圧縮して転送スピードを最速化）
      const compressedBlob = await compressImage(file, 1000, 1000, 0.85);
      targetFile = new File([compressedBlob], "card.jpg", { type: "image/jpeg" });
    } catch (compressErr) {
      console.error("Compression failed, using original file:", compressErr);
      targetFile = file;
    }

    try {
      // 2. 文字認識（無料のサーバーサイドOCRへ圧縮画像を直接送信。画像自体は保存されません）
      setAiInsight("Extracting text details... / 文字情報を抽出中...");
      const ocrData = new FormData();
      ocrData.append("image", targetFile);

      const ocrRes = await fetch("/api/ocr", {
        method: "POST",
        body: ocrData,
      });

      if (ocrRes.ok) {
        const ocrResult = await ocrRes.json();
        // フォームデータを自動入力
        setFormData({
          name: ocrResult.name && ocrResult.name !== "Unknown" ? ocrResult.name : "",
          role: ocrResult.role || "",
          address: ocrResult.address || "",
          phone: ocrResult.phone || "",
          email: ocrResult.email || "",
          notes: ""
        });
        setAiInsight("Auto-fill complete. Please verify the details.");
      } else {
        setAiInsight("Auto-fill unavailable. Please enter details manually.");
      }
    } catch (err) {
      console.error("OCR failed:", err);
      setAiInsight("Auto-fill unavailable. Please enter details manually.");
    } finally {
      // 何があっても必ず入力フォーム画面へ遷移させ、ローディング画面での永続フリーズを防止します
      setStatus("confirm");
    }
  };

  const handleArchive = async () => {
    if (!formData.name) return;
    setIsSaving(true);
    setAiInsight("Saving contact...");
    
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes,
          coord_x: Math.floor(Math.random() * 100),
          coord_y: Math.floor(Math.random() * 100)
        }),
      });

      if (res.ok) {
        setAiInsight("Contact saved successfully.");
        try {
          playConnectionSound("resonance");
        } catch (soundErr) {}
        setTimeout(() => router.push("/library"), 1500);
      } else {
        setAiInsight("Failed to save the contact.");
        setIsSaving(false);
      }
    } catch (err) {
      setAiInsight("An error occurred while saving.");
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-void z-[300] flex flex-col items-center justify-center p-0 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] animate-pulse" />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div 
            key="idle" 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-between h-full max-h-[640px] p-6 w-full max-w-sm z-10"
          >
            <header className="text-center space-y-1.5 w-full relative">
              <button 
                onClick={() => router.back()} 
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl tracking-[0.6em] uppercase font-light">Scan Card</h2>
              <p className="text-[9px] tracking-[0.4em] opacity-30 uppercase font-bold text-azure-400">Add Contact / 名刺登録</p>
            </header>

            {/* Visual Guide */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center scale-90">
              {/* Phone Silhouette */}
              <div className="absolute w-36 h-56 border border-moonlight/10 bg-gothic-dark/40 rounded-[32px] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center pt-4 overflow-hidden">
                 <div className="w-10 h-0.5 bg-moonlight/5 rounded-full mb-8" />
                 
                 {/* Simulated Camera Viewfinder */}
                 <div className="w-24 h-32 border border-white/10 bg-black/40 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <ScanLine size={24} className="text-azure-400 opacity-20 animate-pulse" />
                    
                    <div className="absolute inset-3 border border-white/5 bg-white/5 flex flex-col p-1.5 space-y-1">
                       <div className="w-1/2 h-0.5 bg-white/10" />
                       <div className="w-full h-0.5 bg-white/5" />
                       <div className="w-3/4 h-0.5 bg-white/5" />
                    </div>
                 </div>

                 <p className="mt-6 text-[6px] tracking-[0.4em] opacity-20 uppercase">Camera Viewfinder</p>
              </div>

              {/* Floating Card Representation */}
              <motion.div 
                animate={{ 
                  y: [15, 0, 15],
                  rotateX: [10, 0, 10],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 w-32 h-18 bg-white/85 backdrop-blur-sm border border-white/90 shadow-2xl z-10 flex flex-col p-3 space-y-1.5 rounded-sm"
              >
                <div className="w-1/2 h-1.5 bg-black/20" />
                <div className="w-full h-0.5 bg-black/10" />
                <div className="w-3/4 h-0.5 bg-black/10" />
              </motion.div>
            </div>

            {/* Actions */}
            <div className="space-y-4 text-center w-full relative pb-4">
              <input 
                id="camera-input"
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                onChange={handleCapture}
              />
              <p className="text-[9px] tracking-widest opacity-40 leading-relaxed uppercase px-2">
                {"Take a photo of the card to automatically extract and register details. / 名刺を撮影して情報を自動判別し、登録します。"}
              </p>
              <button 
                type="button"
                className="w-full py-5 bg-white text-void text-[11px] font-bold tracking-[1em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 transition-all active:scale-95 pointer-events-none relative z-10"
              >
                Open Camera
              </button>
              <button 
                onClick={() => setStatus("confirm")} 
                className="text-[8px] opacity-30 uppercase tracking-[0.4em] hover:opacity-60 transition-opacity block w-full py-2 z-30"
              >
                Or Enter Manually / 手動で入力する
              </button>
            </div>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.div 
            key="processing" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-8 z-10 p-6 text-center"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-white opacity-40" size={36} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-[10px] tracking-[0.5em] uppercase text-azure-400 font-bold">Processing...</h2>
              <p className="text-[8px] tracking-[0.3em] uppercase opacity-40 text-white/80">{aiInsight}</p>
            </div>
          </motion.div>
        )}

        {status === "confirm" && (
          <motion.div 
            key="confirm" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md h-full flex flex-col bg-void z-10"
          >
            {/* Header */}
            <header className="text-center py-6 border-b border-white/5 flex-shrink-0">
              <h2 className="text-sm tracking-[0.4em] uppercase font-light">Verify Details</h2>
              <p className="text-[9px] tracking-[0.3em] opacity-30 uppercase font-bold text-azure-400">Save to Library / 登録情報の確認</p>
            </header>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {/* Form Inputs */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] tracking-[0.2em] opacity-45 uppercase block">Name / お名前 <span className="text-red-500/80">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 田中 太郎" 
                    className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[11px] tracking-widest focus:border-white/30 outline-none transition-all text-white rounded-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] tracking-[0.2em] opacity-45 uppercase block">Company & Title / 会社名・役職</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. 株式会社ヘキサ / 代表取締役" 
                    className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[11px] tracking-widest focus:border-white/30 outline-none transition-all text-white rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] tracking-[0.2em] opacity-45 uppercase block">Location / 所在地</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 東京都港区南青山 1-1-1" 
                    className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[11px] tracking-widest focus:border-white/30 outline-none transition-all text-white rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] tracking-[0.2em] opacity-45 uppercase block">Phone / 電話番号</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 03-1234-5678" 
                    className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[11px] tracking-widest focus:border-white/30 outline-none transition-all text-white rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] tracking-[0.2em] opacity-45 uppercase block">Email / メールアドレス</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. taro.tanaka@example.com" 
                    className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[11px] tracking-widest focus:border-white/30 outline-none transition-all text-white rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] tracking-[0.2em] opacity-45 uppercase block">Private Memo / メモ</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="出会った場所や、相手のメモなど" 
                    rows={3} 
                    className="w-full bg-white/[0.02] border border-white/10 p-4 text-[11px] tracking-widest focus:border-white/30 outline-none transition-all text-white rounded-none resize-none"
                  />
                </div>
              </div>

              {aiInsight && (
                <div className="w-full p-4 border border-white/10 bg-white/[0.02] text-center">
                  <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-1">Status</p>
                  <p className="text-[10px] tracking-[0.1em] text-white/80">{aiInsight}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-white/5 flex gap-4 flex-shrink-0 bg-void">
              <button 
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setFormData({ name: "", role: "", address: "", phone: "", email: "", notes: "" });
                  setAiInsight(null);
                }} 
                className="flex-1 py-4 border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all"
                disabled={isSaving}
              >
                Discard / 破棄
              </button>
              <button 
                type="button"
                onClick={handleArchive} 
                className="flex-1 py-4 bg-white text-void font-bold text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all"
                disabled={isSaving || !formData.name}
              >
                {isSaving ? "Saving..." : "Save Contact"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
