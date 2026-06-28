"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, Loader2, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { playConnectionSound } from "@/lib/audio/resonance";

export default function ScanPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "confirm">("idle");
  const [scannedData, setScannedData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const router = useRouter();

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      playConnectionSound("silver");
    } catch (err) {}
    
    setStatus("processing"); // すぐに解析中画面へ

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setScannedData(data);
        
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([20, 50, 20]);
        }
        setStatus("confirm");
      } else {
        alert("Failed to read the card. Please try again.");
        setStatus("idle");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  const triggerCamera = () => {
    const input = document.getElementById("camera-input") as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const handleArchive = async () => {
    setAiInsight("Synchronizing with the Contacts...");
    
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scannedData,
          coord_x: Math.floor(Math.random() * 100),
          coord_y: Math.floor(Math.random() * 100)
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setAiInsight(`Connection Complete. Synergy: ${Math.floor(Math.random() * 20) + 70}% detected.`);
        setTimeout(() => router.push("/library"), 3000);
      } else {
        setAiInsight("Connection Severed: Failed to anchor the identity.");
      }
    } catch (err) {
      setAiInsight("Critical Error: The void rejected this resonance.");
      console.error(err);
    }
  };

  return (
    <main className="fixed inset-0 bg-void z-[300] flex flex-col items-center justify-center p-0 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] animate-pulse" />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" className="flex flex-col items-center justify-between h-full max-h-[640px] p-6 w-full max-w-sm">
            <header className="text-center space-y-1.5">
              <h2 className="text-xl tracking-[0.6em] uppercase font-light">Scan Card</h2>
              <p className="text-[9px] tracking-[0.4em] opacity-30 uppercase font-bold text-azure-400">OCR Scan / 名刺をスキャンする</p>
            </header>

            {/* Visual Guide (紙名刺の電子化) */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center scale-90">
              {/* Phone Silhouette */}
              <div className="absolute w-36 h-56 border border-moonlight/10 bg-gothic-dark/40 rounded-[32px] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center pt-4 overflow-hidden">
                 <div className="w-10 h-0.5 bg-moonlight/5 rounded-full mb-8" />
                 
                 {/* Simulated Camera Viewfinder */}
                 <div className="w-24 h-32 border border-white/10 bg-black/40 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <ScanLine size={24} className="text-azure-400 opacity-20 animate-pulse" />
                    
                    {/* Simulated Paper Card in Viewfinder */}
                    <div className="absolute inset-3 border border-white/5 bg-white/5 flex flex-col p-1.5 space-y-1">
                       <div className="w-1/2 h-0.5 bg-white/10" />
                       <div className="w-full h-0.5 bg-white/5" />
                       <div className="w-3/4 h-0.5 bg-white/5" />
                    </div>
                 </div>

                 {/* Labels */}
                 <p className="mt-6 text-[6px] tracking-[0.4em] opacity-20 uppercase">Camera Viewfinder</p>
              </div>

              {/* Real World Paper Card (Floating) */}
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
                <div className="absolute top-1.5 right-1.5 w-4 h-4 border border-black/5" />
              </motion.div>
            </div>

            <div className="space-y-4 text-center w-full relative pb-4">
              <input 
                id="camera-input"
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0" 
                onChange={handleCapture}
              />
              <p className="text-[9px] tracking-widest opacity-40 leading-relaxed uppercase px-2">
                {"Capture the other party's \"paper business card\" with the camera, and AI will automatically save it to your digital library. / 相手の「紙の名刺」をカメラで撮影し、AIが自動的にデジタル名刺帳へ保存します。"}
              </p>
              <button 
                type="button"
                className="w-full py-5 bg-white text-void text-[11px] font-bold tracking-[1em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 transition-all active:scale-95 pointer-events-none relative z-10"
              >
                Open Camera
              </button>
              <button onClick={() => router.back()} className="text-[8px] opacity-20 uppercase tracking-[0.4em] hover:opacity-50 transition-opacity block w-full">Return to Home</button>
            </div>
          </motion.div>
        )}



        {status === "processing" && (
          <motion.div key="processing" className="flex flex-col items-center space-y-12 relative">
            <div className="relative w-64 h-40 border border-white/10 bg-white/[0.02] flex items-center justify-center overflow-hidden">
               <motion.div 
                 animate={{ top: ["0%", "100%", "0%"] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute left-0 right-0 h-[1px] bg-azure-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
               />
               <Loader2 className="animate-spin opacity-20 text-white" size={32} />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-[10px] tracking-[0.5em] uppercase text-azure-400 font-bold">Scanning Card...</h2>
              <p className="text-[8px] tracking-[0.3em] uppercase opacity-30">AI is extracting contact details... / 情報抽出中...</p>
            </div>
          </motion.div>
        )}

        {status === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 flex flex-col items-center h-full overflow-y-auto pt-24">
            <h3 className="text-[10px] tracking-[0.5em] uppercase opacity-30 mb-12 text-center">Profile Found</h3>
            
            <div className="w-full aspect-[1.6/1] bg-gothic-dark border border-moonlight/20 p-8 relative mb-12 shadow-2xl">
               <header className="flex justify-between items-start">
                  <h2 className="text-xl tracking-[0.2em] uppercase">{scannedData.name}</h2>
                  <div className="relative w-8 h-8 opacity-20">
                     <Image src="/logo.png" alt="Hexa Relation" fill className="object-contain" />
                  </div>
               </header>
               <footer className="mt-12 space-y-1">
                  <p className="text-[11px] tracking-widest opacity-60">{scannedData.email}</p>
                  <p className="text-[9px] tracking-widest opacity-30 uppercase">{scannedData.role}</p>
               </footer>
            </div>

            <div className="w-full space-y-6 mb-12">
               <input type="text" placeholder="Meeting Location" className="w-full bg-void border border-moonlight/10 p-4 text-[11px] tracking-widest focus:border-moonlight outline-none transition-all uppercase" />
               <textarea placeholder="Private Memo" rows={3} className="w-full bg-void border border-moonlight/10 p-4 text-[11px] tracking-widest focus:border-moonlight outline-none transition-all uppercase resize-none" />
            </div>

            <AnimatePresence>
              {aiInsight && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full p-6 border border-moonlight/10 bg-white/5 mb-8 text-center">
                  <p className="text-[7px] uppercase tracking-[0.4em] opacity-40 mb-2 italic">Concierge Insight</p>
                  <p className="text-[10px] tracking-[0.2em] italic text-moonlight">&quot;{aiInsight}&quot;</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 w-full pb-12">
               <button onClick={() => setStatus("idle")} className="flex-1 py-4 border border-moonlight/10 text-[9px] uppercase tracking-widest">Discard</button>
               <button onClick={handleArchive} className="flex-1 py-4 bg-moonlight text-void font-bold text-[10px] uppercase tracking-[0.4em]">Save Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
