"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Globe, Shield, Save, ArrowLeft, Languages, Camera, Info, Upload, RotateCcw, Layout, Smartphone, AlignLeft, AlignCenter, AlignRight, Check, Type } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import HexaCardPreview, { Alignment } from "@/components/ui/HexaCardPreview";
import { useToast } from "@/components/ui/ResonanceToast";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultAlign = {
    company: "center",
    title: "center",
    name: "center",
    reading: "center",
    phone: "center",
    email: "center"
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
    logoUrl: "",
    faceUrl: "",
    link_x: "",
    link_instagram: "",
    link_line: "",
    link_facebook: "",
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
    sound: "resonance"
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || session?.user?.name || "",
            reading: data.handle || "", 
            title: data.profile?.title || "",
            company: data.profile?.company || "",
            website: data.profile?.website || "",
            bio: data.profile?.bio || "",
            phone: data.profile?.phone || "",
            email: data.profile?.contact_email || "",
            logoUrl: data.logo_url || "",
            faceUrl: data.photo_url || "",
            link_x: data.profile?.link_x || "",
            link_instagram: data.profile?.link_instagram || "",
            link_line: data.profile?.link_line || "",
            link_facebook: data.profile?.link_facebook || "",
            orientation: data.equipped?.orientation || "horizontal",
            hAlign: data.equipped?.hAlign || { ...defaultAlign },
            vAlign: data.equipped?.vAlign || { ...defaultAlign }
          });
          if (data.equipped) setEquipped((prev: any) => ({ 
            ...prev, 
            ...data.equipped,
            scaleName: data.equipped.scaleName || "standard",
            scaleTitle: data.equipped.scaleTitle || "standard",
            scaleCompany: data.equipped.scaleCompany || "standard"
          }));
        }
      } catch (e) { console.error(e); }
      finally { setIsLoaded(true); }
    };

    if (session) fetchInitialData();
  }, [session]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAlign = (field: string, align: Alignment) => {
    const key = formData.orientation === 'horizontal' ? 'hAlign' : 'vAlign';
    setFormData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: align }
    }));
  };

  const updateOrientation = (orientation: "horizontal" | "vertical") => {
    setFormData(prev => ({ ...prev, orientation }));
  };

  const updateScale = (field: "name" | "title" | "company", scale: string) => {
    const key = field === "name" ? "scaleName" : field === "title" ? "scaleTitle" : "scaleCompany";
    setEquipped((prev: any) => ({ ...prev, [key]: scale }));
  };

  const performAutoSave = async (dataToSave: any, equippedToSave: any) => {
    setSaveStatus("saving");
    try {
      const finalEquipped = {
        ...equippedToSave,
        orientation: dataToSave.orientation,
        hAlign: dataToSave.hAlign,
        vAlign: dataToSave.vAlign
      };

      await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: finalEquipped })
      });

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSave,
          photo_url: dataToSave.faceUrl,
          logo_url: dataToSave.logoUrl,
          equipped_assets: finalEquipped
        })
      });

      if (res.ok) {
        setSaveStatus("saved");
        showToast("Synchronized / 情報を同期しました", "success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        showToast("Synchronization Failed / 同期に失敗しました", "error");
      }
    } catch (err) { 
      console.error(err);
      setSaveStatus("error");
      showToast("Network Error / 通信エラーが発生しました", "error");
    }
  };

  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => performAutoSave(formData, equipped), 1500);
    return () => clearTimeout(timerRef.current);
  }, [formData, equipped, isLoaded]);

  const currentAligns = formData.orientation === 'horizontal' ? formData.hAlign : formData.vAlign;

  const AlignButtons = ({ field }: { field: keyof typeof defaultAlign }) => (
    <div className="flex gap-1 p-1 bg-white/5 border border-white/10 w-fit">
       {['left', 'center', 'right'].map((align) => (
         <button key={align} type="button" onClick={() => updateAlign(field, align as Alignment)} className={`p-1.5 transition-all ${currentAligns[field] === align ? 'bg-white/10 text-white' : 'opacity-20 hover:opacity-100'}`}>
           {align === 'left' ? <AlignLeft size={12}/> : align === 'center' ? <AlignCenter size={12}/> : <AlignRight size={12}/>}
         </button>
       ))}
    </div>
  );

  const ScaleButtons = ({ field }: { field: "name" | "title" | "company" }) => {
    const key = field === "name" ? "scaleName" : field === "title" ? "scaleTitle" : "scaleCompany";
    return (
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 w-fit ml-auto">
         {['standard', 'impact', 'maximum'].map((s) => (
           <button key={s} type="button" onClick={() => updateScale(field, s)} className={`px-2 py-1 text-[7px] uppercase tracking-tighter transition-all ${equipped[key] === s ? 'bg-azure-600 text-white' : 'opacity-40 hover:opacity-100'}`}>{s}</button>
         ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pt-20 lg:pt-32 px-4 lg:px-6 pb-24 relative text-moonlight">
      <header className="mb-8 lg:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-4 w-full lg:w-auto">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.2em] lg:tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-4 lg:mb-8 text-white">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <h1 className="text-2xl lg:text-5xl tracking-[0.2em] lg:tracking-[0.5em] uppercase font-extralight text-white">Tune Identity</h1>
            <AnimatePresence mode="wait">
               {saveStatus === "saving" && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-azure-400 text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-bold px-2 lg:px-3 py-1 bg-azure-500/10 border border-azure-500/20">
                    <Save size={10} className="animate-pulse" /> Syncing
                  </motion.div>
               )}
               {saveStatus === "saved" && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-bold px-2 lg:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20">
                    <Check size={10} /> Aligned
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-white hidden lg:block">プロフィールの調律</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
        {/* Preview Container */}
        <div className="w-full lg:w-5/12 sticky top-0 lg:top-32 z-50 order-1 lg:order-none bg-void/95 backdrop-blur-lg pb-1 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none h-[38vh] lg:h-auto flex items-center justify-center">
           <div className="py-2 lg:p-8 bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center w-full">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent hidden lg:block" />
              
              <div className="absolute top-2 right-6 lg:top-4 lg:right-4 z-30 flex gap-2 p-1 bg-white/10 lg:bg-white/5 border border-white/10 lg:scale-100">
                 <button type="button" onClick={() => updateOrientation('horizontal')} className={`p-1.5 transition-all ${formData.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={10}/>
                 </button>
                 <button type="button" onClick={() => updateOrientation('vertical')} className={`p-1.5 transition-all ${formData.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={10}/>
                 </button>
              </div>

              <div className="py-1 lg:py-0 w-full flex justify-center scale-[0.6] xs:scale-[0.75] sm:scale-85 lg:scale-100 origin-center lg:origin-top transition-transform duration-500">
                <HexaCardPreview 
                  name={formData.name || "NAME"} reading={formData.reading} company={formData.company} title={formData.title} phone={formData.phone} email={formData.email} bio={formData.bio} logoUrl={formData.logoUrl} faceUrl={formData.faceUrl} frame={equipped.frame} background={equipped.background} effect={equipped.effect} sound={equipped.sound} orientation={formData.orientation}
                  link_x={formData.link_x} link_instagram={formData.link_instagram} link_line={formData.link_line} link_facebook={formData.link_facebook}
                  alignName={currentAligns.name as Alignment} alignReading={currentAligns.reading as Alignment} alignCompany={currentAligns.company as Alignment} alignTitle={currentAligns.title as Alignment} alignPhone={currentAligns.phone as Alignment} alignEmail={currentAligns.email as Alignment}
                  fontFamily={equipped.fontFamily} scaleName={equipped.scaleName} scaleTitle={equipped.scaleTitle} scaleCompany={equipped.scaleCompany}
                />
              </div>

              <div className="lg:hidden text-center mt-[-15%] pb-1">
                 <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 font-bold">Live Identity Preview</p>
              </div>
           </div>
        </div>

        <div className="w-full lg:w-7/12 order-2 lg:order-none space-y-12 lg:space-y-16">
           <div className="lg:hidden h-[38vh]" />

           <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">01</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">Base Identity / 基本情報</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Full Name / 氏名</label>
                      <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="漢字・英語" />
                      <div className="flex items-center">
                        <AlignButtons field="name" />
                        <ScaleButtons field="name" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Reading / ふりがな</label>
                      <input type="text" value={formData.reading} onChange={(e) => updateField('reading', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="ひらがな または 英数字" />
                      <AlignButtons field="reading" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Company / 所属企業</label>
                      <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-bronze-400 outline-none text-white" placeholder="企業名" />
                      <div className="flex items-center">
                        <AlignButtons field="company" />
                        <ScaleButtons field="company" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Title / 肩書き</label>
                      <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="CEO, Designer, etc." />
                      <div className="flex items-center">
                        <AlignButtons field="title" />
                        <ScaleButtons field="title" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Phone / 電話番号</label>
                      <input type="text" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="000-0000-0000" />
                      <AlignButtons field="phone" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Contact Email / 公開メール</label>
                      <input type="text" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="contact@example.com" />
                      <AlignButtons field="email" />
                   </div>
                </div>
              </section>

              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">02</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">Social & Links / 接続設定</h3>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
                      <input type="text" value={formData.link_line} onChange={(e) => updateField('link_line', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="ID または https://line.me/..." />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Facebook URL</label>
                      <input type="text" value={formData.link_facebook} onChange={(e) => updateField('link_facebook', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="https://facebook.com/your-id" />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Free Bio / 自由コメント (裏面表示)</label>
                   <textarea value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white h-32 resize-none" placeholder="裏面に表示されるメッセージや紹介文" />
                </div>
              </section>
           </form>
        </div>
      </div>
    </div>
  );
}
