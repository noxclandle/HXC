"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Globe, Shield, Save, ArrowLeft, Languages, Camera, Info, Upload, RotateCcw, Layout, Smartphone, AlignLeft, AlignCenter, AlignRight, Check, Type, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import HexaCardPreview, { Alignment, mapUserToCardProps } from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import { useToast } from "@/components/ui/ConnectionToast";
import { logger } from "@/lib/logger";

const defaultAlign = {
  company: "center",
  title: "center",
  name: "center",
  reading: "center",
  phone: "center",
  email: "center"
};

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isUploading, setIsUploading] = useState<string | null>(null); // "face" or "logo"
  const [isLoaded, setIsLoaded] = useState(false);
  const originalDataRef = useRef<any>(null);

  // 強力な画像リサイズ・圧縮ユーティリティ (iOS/Safari 最適化)
  const compressImage = (file: File, type: "face" | "logo"): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          
          // 憲法に基づき、名刺用画像は 300x300 を基準にクロップ・リサイズ
          // アスペクト比を維持しつつ、中央で切り抜く
          const targetSize = type === "face" ? 400 : 300; 
          let width = img.width;
          let height = img.height;
          
          let offsetX = 0;
          let offsetY = 0;
          
          if (width > height) {
            offsetX = (width - height) / 2;
            width = height;
          } else {
            offsetY = (height - width) / 2;
            height = width;
          }

          canvas.width = targetSize;
          canvas.height = targetSize;
          
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, targetSize, targetSize);
          }
          
          resolve(canvas.toDataURL("image/jpeg", 0.85)); // 高品質を保ちつつJPEG圧縮
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "face" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB以上の生ファイルはガード
    if (file.size > 10 * 1024 * 1024) {
      showToast("Please select an image under 10MB. / 10MB以下の画像を選択してください", "error");
      return;
    }

    setIsUploading(type);
    try {
      // 1. 強力なリサイズと圧縮
      const compressedBase64 = await compressImage(file, type);
      
      // 2. 圧縮後のBase64をBlobに変換してFormDataを作成
      const resBlob = await fetch(compressedBase64);
      const blob = await resBlob.blob();
      
      logger.debug("Optimized image size", { type, sizeKb: (blob.size / 1024).toFixed(2) });

      const formData = new FormData();
      formData.append("file", blob, `upload.${type === "face" ? "jpg" : "png"}`);
      formData.append("type", type === "face" ? "photo" : "logo");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      updateField(type === "face" ? "faceUrl" : "logoUrl", uploadData.url);
      showToast("Image optimized and uploaded. / 画像を最適化してアップロードしました", "success");
    } catch (err) {
      logger.error("Image upload failed", { error: err });
      showToast("Upload failed. / アップロードに失敗しました", "error");
    } finally {
      setIsUploading(null);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    reading: "",
    title: "",
    company: "",
    website: "",
    bio: "",
    phone: "",
    email: "",
    address: "",
    logoUrl: "",
    faceUrl: "",
    link_x: "",
    link_instagram: "",
    link_line: "",
    link_facebook: "",
    portfolio_links: [] as { title: string, url: string }[],
    orientation: "horizontal" as "horizontal" | "vertical",
    hAlign: { ...defaultAlign },
    vAlign: { ...defaultAlign }
  });

  const [equipped, setEquipped] = useState<any>({
    frame: "Obsidian",
    background: "Default",
    effect: "None",
    fontFamily: "Standard",
    scaleName: "standard",
    scaleTitle: "standard",
    scaleCompany: "standard",
    scaleReading: "standard",
    scalePhone: "standard",
    scaleEmail: "standard",
    scaleAddress: "standard",
    sound: "resonance"
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          
          const initialFormData = {
            name: data.name || session?.user?.name || "",
            reading: data.handle || "", 
            title: data.profile?.title || "",
            company: data.profile?.company || "",
            website: data.profile?.website || "",
            bio: data.profile?.bio || "",
            phone: data.profile?.phone || "",
            email: data.profile?.contact_email || session?.user?.email || "",
            address: data.profile?.address || "",
            logoUrl: data.logo_url || "",
            faceUrl: data.photo_url || "",
            link_x: data.profile?.link_x || "",
            link_instagram: data.profile?.link_instagram || "",
            link_line: data.profile?.link_line || "",
            link_facebook: data.profile?.link_facebook || "",
            portfolio_links: data.portfolio_links || [],
            orientation: data.equipped?.orientation || "horizontal",
            hAlign: data.equipped?.hAlign || { ...defaultAlign },
            vAlign: data.equipped?.vAlign || { ...defaultAlign }
          };

          setFormData(initialFormData);
          originalDataRef.current = initialFormData;

          // 画像が巨大な場合の非同期取得（プレビュー表示用）
          if (data.photo_url === "IMAGE_LARGE") {
            fetch("/api/user/resource?type=photo").then(res => res.json()).then(res => {
              if (res.data) setFormData(prev => ({ ...prev, faceUrl: res.data }));
            });
          }
          if (data.logo_url === "IMAGE_LARGE") {
            fetch("/api/user/resource?type=logo").then(res => res.json()).then(res => {
              if (res.data) setFormData(prev => ({ ...prev, logoUrl: res.data }));
            });
          }

          if (data.equipped) setEquipped((prev: any) => ({ 
            ...prev, 
            ...data.equipped,
            scaleName: data.equipped.scaleName || "standard",
            scaleTitle: data.equipped.scaleTitle || "standard",
            scaleCompany: data.equipped.scaleCompany || "standard",
            scaleReading: data.equipped.scaleReading || "standard",
            scalePhone: data.equipped.scalePhone || "standard",
            scaleEmail: data.equipped.scaleEmail || "standard",
            scaleAddress: data.equipped.scaleAddress || "standard"
          }));
        }
      } catch (e) { logger.error("Failed to fetch initial profile data", { error: e }); }
      finally { setIsLoaded(true); }
    };

    if (session) fetchInitialData();
  }, [session]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, { title: "", url: "" }]
    }));
  };

  const updatePortfolioLink = (index: number, field: "title" | "url", value: string) => {
    setFormData(prev => {
      const newList = [...prev.portfolio_links];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, portfolio_links: newList };
    });
  };

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index)
    }));
  };

  const updateAlign = (field: string, align: Alignment) => {
    const key = formData.orientation === 'horizontal' ? 'hAlign' : 'vAlign';
    setFormData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: align }
    }));
    setEquipped((prev: any) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: align
      }
    }));
  };

  const updateOrientation = (orientation: "horizontal" | "vertical") => {
    setFormData(prev => ({ ...prev, orientation }));
    setEquipped((prev: any) => ({ ...prev, orientation }));
  };

  const updateScale = (field: "name" | "title" | "company" | "reading" | "phone" | "email" | "address", scale: string) => {
    const key = 
      field === "name" ? "scaleName" : 
      field === "title" ? "scaleTitle" : 
      field === "company" ? "scaleCompany" : 
      field === "reading" ? "scaleReading" : 
      field === "phone" ? "scalePhone" : 
      field === "email" ? "scaleEmail" : "scaleAddress";
    setEquipped((prev: any) => ({ ...prev, [key]: scale }));
  };

  const performAutoSave = useCallback(async (dataToSave: any, equippedToSave: any) => {
    setSaveStatus("saving");
    try {
      const finalEquipped = {
        ...equippedToSave,
        orientation: dataToSave.orientation,
        hAlign: dataToSave.hAlign,
        vAlign: dataToSave.vAlign
      };

      // 画像データが巨大なBase64（長さ10000超）の場合は、転送制限回避のため常に "IMAGE_LARGE" を送信する
      // これにより 2回目以降の自動保存時における Payload Too Large (413) エラーを完全に防止する
      const photoToSend = (dataToSave.faceUrl?.length > 10000) ? "IMAGE_LARGE" : dataToSave.faceUrl;
      const logoToSend = (dataToSave.logoUrl?.length > 10000) ? "IMAGE_LARGE" : dataToSave.logoUrl;

      // 単一のAPI呼び出しに統合（原子性を確保し、レースコンディションを防止）
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSave,
          photo_url: photoToSend,
          logo_url: logoToSend,
          equipped_assets: finalEquipped
        })
      });

      if (res.ok) {
        setSaveStatus("saved");
        originalDataRef.current = dataToSave; // 次回自動保存時の画像無駄送信(413 Payload Too Large)を防止するために同期
        showToast("Profile saved. / 保存しました", "success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        const errData = await res.json();
        setSaveStatus("error");
        // サーバーからの具体的なエラーメッセージを表示
        showToast(errData.error || "Save failed. / 保存に失敗しました", "error");
        logger.error("Auto-save sync error", { error: errData });
      }
      } catch (err) {
      logger.error("Auto-save network error", { error: err });
      setSaveStatus("error");
      showToast("Network error. / 通信エラーが発生しました", "error");
      }
      }, [showToast]);

  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    // 保存間隔を2秒に広げて安定性を向上
    timerRef.current = setTimeout(() => performAutoSave(formData, equipped), 2000);
    return () => clearTimeout(timerRef.current);
  }, [formData, equipped, isLoaded, performAutoSave]);

  const currentAligns = formData.orientation === 'horizontal' ? formData.hAlign : formData.vAlign;

  const AlignButtons = ({ field }: { field: keyof typeof defaultAlign }) => (
    <div className="flex gap-1 p-1 bg-white/5 border border-white/10 w-fit">
       {['left', 'center', 'right'].map((align) => (
         <button key={align} type="button" onClick={() => updateAlign(field, align as Alignment)} className={`p-1.5 transition-all ${currentAligns[field] === align ? 'bg-azure-600 text-white' : 'opacity-30 hover:opacity-100'}`}>
           {align === 'left' ? <AlignLeft size={12}/> : align === 'center' ? <AlignCenter size={12}/> : <AlignRight size={12}/>}
         </button>
       ))}
    </div>
  );

  const ScaleButtons = ({ field }: { field: "name" | "title" | "company" | "reading" | "phone" | "email" | "address" }) => {
    const key = 
      field === "name" ? "scaleName" : 
      field === "title" ? "scaleTitle" : 
      field === "company" ? "scaleCompany" :
      field === "reading" ? "scaleReading" :
      field === "phone" ? "scalePhone" :
      field === "email" ? "scaleEmail" : "scaleAddress";
    return (
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 w-fit ml-auto">
         {['standard', 'impact', 'maximum'].map((s) => (
           <button key={s} type="button" onClick={() => updateScale(field, s)} className={`px-2 py-1 text-[7px] uppercase tracking-tighter transition-all ${equipped[key] === s ? 'bg-azure-600 text-white' : 'opacity-40 hover:opacity-100'}`}>{s}</button>
         ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pt-14 lg:pt-32 px-4 lg:px-6 pb-24 relative text-moonlight">
      <header className="mb-8 lg:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-4 w-full lg:w-auto">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.2em] lg:tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-4 lg:mb-8 text-white">
            <ArrowLeft size={12} /> ホームへ戻る / Back to Atelier
          </Link>
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <h1 className="text-2xl lg:text-5xl tracking-[0.2em] lg:tracking-[0.5em] uppercase font-extralight text-white">プロフィール編集 / Edit Profile</h1>
            <AnimatePresence mode="wait">
               {saveStatus === "saving" && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-azure-400 text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-bold px-2 lg:px-3 py-1 bg-azure-500/10 border border-azure-500/20">
                    <Save size={10} className="animate-pulse" /> 保存中 / Saving
                  </motion.div>
               )}
               {saveStatus === "saved" && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-bold px-2 lg:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20">
                    <Check size={10} /> 保存完了 / Saved
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
        {/* Preview Container */}
        <div className="w-full lg:w-5/12 relative lg:sticky lg:top-32 z-30 order-1 lg:order-none pb-4 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none h-auto flex items-center justify-center">
           <UnifiedCardContainer 
             orientation={formData.orientation}
             onOrientationChange={updateOrientation}
             previewLabel="ライブプレビュー / Live Preview"
             compact={true}
           >
                <HexaCardPreview 
                  {...mapUserToCardProps(formData, formData.orientation, equipped)}
                />
           </UnifiedCardContainer>
        </div>

        <div className="w-full lg:w-7/12 order-2 lg:order-none space-y-12 lg:space-y-16">

           <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">01</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">基本情報 / Basic Info</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">氏名 / Name</label>
                      <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="DAISUKE SASAKI / 佐々木 大輔" />
                      <div className="flex items-center">
                        <AlignButtons field="name" />
                        <ScaleButtons field="name" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">フリガナ / Reading</label>
                      <input type="text" value={formData.reading} onChange={(e) => updateField('reading', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="SASAKI DAISUKE / ささき だいすけ" />
                      <div className="flex items-center">
                        <AlignButtons field="reading" />
                        <ScaleButtons field="reading" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">所属企業 / Company</label>
                      <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-bronze-400 outline-none text-white" placeholder="COMPANY NAME / 企業名" />
                      <div className="flex items-center">
                        <AlignButtons field="company" />
                        <ScaleButtons field="company" />
                      </div>
                   </div>
                    <div className="space-y-3">
                       <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">肩書き / Title</label>
                       <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="CEO, Designer, etc." />
                       <div className="flex items-center">
                         <AlignButtons field="title" />
                         <ScaleButtons field="title" />
                       </div>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">会社の所在地 / Company Location</label>
                       <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="MINAMI-AOYAMA, MINATO-KU, TOKYO / 東京都港区南青山..." />
                       <ScaleButtons field="address" />
                    </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">電話番号 / Phone</label>
                      <input type="text" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="000-0000-0000" />
                      <div className="flex items-center">
                        <AlignButtons field="phone" />
                        <ScaleButtons field="phone" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">公開メールアドレス / Email Address</label>
                      <input type="text" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="contact@example.com" />
                      <div className="flex items-center">
                        <AlignButtons field="email" />
                        <ScaleButtons field="email" />
                      </div>
                   </div>
                </div>
              </section>

              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">02</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold text-white opacity-100">ロゴ画像設定 / Brand Logo Setup</h3>
                </header>
                <div className="flex flex-col gap-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">表面：ブランドロゴ / Front: Brand Logo</label>
                        {formData.logoUrl && (
                          <button type="button" onClick={() => updateField('logoUrl', "")} className="text-[7px] uppercase tracking-widest opacity-30 hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <RotateCcw size={10} /> 削除 / Remove
                          </button>
                        )}
                      </div>
                      <div className="relative group w-full aspect-video md:w-48 md:h-32 bg-white/[0.05] border border-azure-500/30 flex flex-col items-center justify-center cursor-pointer hover:bg-azure-500/10 transition-all overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                         {(formData.logoUrl || isUploading === "logo") ? (
                            <Image src={formData.logoUrl === "IMAGE_LARGE" ? "/logo.png" : formData.logoUrl} alt="Preview" fill className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                         ) : (
                            <Building2 size={32} className="opacity-20" />
                         )}
                         <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "logo")} />
                         {isUploading === "logo" && <div className="absolute inset-0 bg-void/80 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-azure-400" /></div>}
                         <div className="absolute bottom-0 w-full py-2 bg-black/60 backdrop-blur-md">
                            <p className="text-[7px] text-center uppercase tracking-widest font-bold text-white">画像を変更 / Change Image</p>
                         </div>
                      </div>
                      <p className="text-[8px] opacity-20 uppercase tracking-widest">名刺の表面（右下）に配置されます。背景透過PNGを推奨。 / Displayed on the front (bottom right). Transparent PNG recommended.</p>
                   </div>
                </div>
              </section>

              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">03</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">SNS・リンク設定 / Links & SNS</h3>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Website URL / WebサイトURL (HP)</label>
                      <input type="text" value={formData.website} onChange={(e) => updateField('website', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="https://example.com" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">X (Twitter) ID</label>
                      <input type="text" value={formData.link_x} onChange={(e) => updateField('link_x', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="@username" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Instagram ID</label>
                      <input type="text" value={formData.link_instagram} onChange={(e) => updateField('link_instagram', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="username" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">LINE ID / URL</label>
                      <input type="text" value={formData.link_line} onChange={(e) => updateField('link_line', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="ID or URL / ID または URL (https://line.me/...)" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Facebook URL</label>
                      <input type="text" value={formData.link_facebook} onChange={(e) => updateField('link_facebook', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="https://facebook.com/your-id" />
                   </div>
                </div>
                <div className="space-y-3">
                 <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">自己紹介（裏面表示） / Biography (Backface)</label>
                 <textarea value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white h-32 resize-none" placeholder="裏面に表示されるメッセージや紹介文 / Displayed on the back of the card." />
                </div>
                </section>

              <section className="space-y-10 p-4 lg:p-0 pb-20">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">04</div>
                 <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">プロフィール写真設定 / Portrait Setup</h3>
                </header>
                <div className="flex flex-col gap-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Back: Portrait / 裏面：プロフィール写真</label>
                        {formData.faceUrl && (
                          <button type="button" onClick={() => updateField('faceUrl', "")} className="text-[7px] uppercase tracking-widest opacity-30 hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <RotateCcw size={10} /> 削除 / Remove
                          </button>
                        )}
                      </div>
                      <div className="relative group w-full aspect-square md:w-32 md:h-32 bg-white/[0.05] border border-azure-500/30 flex flex-col items-center justify-center cursor-pointer hover:bg-azure-500/10 transition-all overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                         {(formData.faceUrl || isUploading === "face") ? (
                            <Image src={formData.faceUrl === "IMAGE_LARGE" ? "/logo.png" : formData.faceUrl} alt="Preview" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         ) : (
                            <User size={32} className="opacity-20" />
                         )}
                         <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "face")} />
                         {isUploading === "face" && <div className="absolute inset-0 bg-void/80 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-azure-400" /></div>}
                         <div className="absolute bottom-0 w-full py-2 bg-black/60 backdrop-blur-md">
                            <p className="text-[7px] text-center uppercase tracking-widest font-bold text-white">画像を変更 / Change Image</p>
                         </div>
                      </div>
                      <p className="text-[8px] opacity-20 uppercase tracking-widest">名刺の裏面に大きく表示されます。正方形の写真を推奨。 / Displayed prominently on the back of the card. Square photo recommended.</p>
                   </div>
                </div>
              </section>
           </form>
        </div>
      </div>
    </div>
  );
}
