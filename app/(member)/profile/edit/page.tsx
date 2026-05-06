"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Globe, Shield, Save, ArrowLeft, Languages, Camera, Info, Upload, RotateCcw, Smartphone, Layout, Phone, Mail, AlignLeft, AlignCenter, AlignRight, AlertTriangle, Type, Check } from "lucide-react";
import Link from "next/link";
import HexaCardPreview, { Alignment } from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ResonanceToast";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultAlign = {
    company: "center" as Alignment, 
    title: "center" as Alignment, 
    name: "center" as Alignment, 
    reading: "center" as Alignment, 
    phone: "center" as Alignment, 
    email: "center" as Alignment
  };

  const [formData, setFormData] = useState({
    name: "", reading: "", title: "", company: "", website: "", bio: "", phone: "", email: "",
    logoUrl: "", faceUrl: "",
    link_x: "", link_instagram: "", link_line: "", link_facebook: "",
    orientation: "horizontal" as "horizontal" | "vertical",
    hAlign: { ...defaultAlign },
    vAlign: { ...defaultAlign }
  });
  
  const [equipped, setEquipped] = useState<any>({ 
    frame: "Obsidian", 
    background: "Default",
    effect: "None",
    sound: "resonance",
    title: "", 
    fontFamily: "Standard" 
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || session?.user?.name || "",
            reading: data.handle || "", // handle_name from DB comes through as handle here
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
          if (data.equipped) setEquipped((prev: any) => ({ ...prev, ...data.equipped }));
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

  const performAutoSave = async (dataToSave: any, equippedToSave: any) => {
    setSaveStatus("saving");
    try {
      await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: equippedToSave })
      });

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSave,
          photo_url: dataToSave.faceUrl,
          logo_url: dataToSave.logoUrl
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

  useEffect(() => {
    if (!isLoaded) return;
    
    const timer = setTimeout(() => {
      performAutoSave(formData, equipped);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, equipped, isLoaded]);

  const handleFileChange = (type: 'logo' | 'face', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') updateField('logoUrl', reader.result as string);
        else updateField('faceUrl', reader.result as string);
        showToast("Image Buffered / プレビューに反映しました", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const AlignButtons = ({ field }: { field: string }) => {
    const currentAlign = formData.orientation === 'horizontal' ? (formData.hAlign as any)[field] : (formData.vAlign as any)[field];
    return (
      <div className="flex gap-1 bg-white/5 border border-white/5 p-1 w-fit mt-3">
        {[
          { id: "left", icon: AlignLeft },
          { id: "center", icon: AlignCenter },
          { id: "right", icon: AlignRight }
        ].map((a) => (
          <button 
            key={a.id} type="button"
            onClick={() => updateAlign(field, a.id as Alignment)}
            className={`p-1.5 transition-all ${currentAlign === a.id ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`}
          >
            <a.icon size={10} />
          </button>
        ))}
      </div>
    );
  };

  const currentAligns = formData.orientation === 'horizontal' ? formData.hAlign : formData.vAlign;

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
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-azure-400 text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-bold px-2 lg:px-3 py-1 bg-azure-500/10 border border-azure-500/20">
                    <Save size={10} className="animate-pulse" /> Syncing
                  </motion.div>
               )}
               {saveStatus === "saved" && (
                  <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-400 text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-bold px-2 lg:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20">
                    <Check size={10} /> Saved
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-white hidden lg:block">プロフィールの調律</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
        {/* Preview Container: Optimized for mobile viewport and keyboard */}
        <div className="w-full lg:w-5/12 sticky top-0 lg:top-32 z-50 order-1 lg:order-none bg-void/95 backdrop-blur-lg pb-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none">
           <div className="py-4 lg:p-8 bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent hidden lg:block" />
              
              <div className="absolute top-2 right-6 lg:top-4 lg:right-4 z-30 flex gap-2 p-1 bg-white/10 lg:bg-white/5 border border-white/10">
                 <button type="button" onClick={() => updateField('orientation', 'horizontal')} className={`p-1.5 transition-all ${formData.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={10}/>
                 </button>
                 <button type="button" onClick={() => updateField('orientation', 'vertical')} className={`p-1.5 transition-all ${formData.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={10}/>
                 </button>
              </div>

              {/* Mobile-friendly scaling: scale down significantly on mobile to leave room for input/keyboard */}
              <div className="py-2 lg:py-0 w-full flex justify-center scale-[0.6] xs:scale-[0.75] sm:scale-90 lg:scale-100 origin-center lg:origin-top transition-transform duration-500">
                <HexaCardPreview 
                  name={formData.name || "NAME"} reading={formData.reading} company={formData.company} title={formData.title} phone={formData.phone} email={formData.email} bio={formData.bio} logoUrl={formData.logoUrl} faceUrl={formData.faceUrl} frame={equipped.frame} background={equipped.background} effect={equipped.effect} sound={equipped.sound} orientation={formData.orientation}
                  link_x={formData.link_x} link_instagram={formData.link_instagram} link_line={formData.link_line} link_facebook={formData.link_facebook}
                  alignName={currentAligns.name} alignReading={currentAligns.reading} alignCompany={currentAligns.company} alignTitle={currentAligns.title} alignPhone={currentAligns.phone} alignEmail={currentAligns.email}
                  fontFamily={equipped.fontFamily}
                />
              </div>

              {/* Mobile instruction helper */}
              <div className="lg:hidden text-center mt-[-15%] pb-2">
                 <p className="text-[7px] tracking-[0.3em] uppercase opacity-20">Live Preview Alignment</p>
              </div>
           </div>
        </div>

        <div className="w-full lg:w-7/12 order-2 lg:order-none space-y-12 lg:space-y-16">
           {/* Responsive spacer - significantly reduced on mobile due to scaling and sticky top-0 */}
           <div className={`lg:hidden ${formData.orientation === 'vertical' ? 'h-[250px]' : 'h-[140px]'}`} />

           <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
              {/* Identity Section */}
              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">01</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">Base Identity / 基本情報</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Full Name / 氏名</label>
                      <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="漢字・英語" />
                      <AlignButtons field="name" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Reading / ふりがな</label>
                      <input type="text" value={formData.reading} onChange={(e) => updateField('reading', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="ひらがな または 英数字" />
                      <AlignButtons field="reading" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Company / 所属企業</label>
                      <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-bronze-400 outline-none text-white" placeholder="企業名" />
                      <AlignButtons field="company" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Title / 肩書き</label>
                      <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="役職・専門" />
                      <AlignButtons field="title" />
                   </div>
                </div>
              </section>

              {/* Visuals Section */}
              <section className="space-y-10 p-4 lg:p-0 bg-white/[0.01] lg:bg-transparent py-10 lg:py-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">02</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">Visual Tuning / 視覚設定</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold flex items-center gap-2"><Building2 size={12}/> Company Logo</label>
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 border border-white/10 flex items-center justify-center bg-white/[0.03] overflow-hidden group relative">
                            {formData.logoUrl ? <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={24} className="text-white/5" />}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button type="button" onClick={() => updateField('logoUrl', '')} className="text-white/60 hover:text-white"><RotateCcw size={14}/></button>
                            </div>
                         </div>
                         <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 border border-white/10 bg-white/[0.02] text-[8px] tracking-[0.2em] uppercase hover:border-white transition-all text-white/60">Upload</button>
                         <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange('logo', e)} accept="image/*" className="hidden" />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold flex items-center gap-2"><Camera size={12}/> Portrait</label>
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03] overflow-hidden group relative">
                            {formData.faceUrl ? <img src={formData.faceUrl} alt="Face" className="w-full h-full object-cover" /> : <User size={24} className="text-white/5" />}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button type="button" onClick={() => updateField('faceUrl', '')} className="text-white/60 hover:text-white"><RotateCcw size={14}/></button>
                            </div>
                         </div>
                         <button type="button" onClick={() => faceInputRef.current?.click()} className="px-4 py-2 border border-white/10 bg-white/[0.02] text-[8px] tracking-[0.2em] uppercase hover:border-white transition-all text-white/60">Upload</button>
                         <input type="file" ref={faceInputRef} onChange={(e) => handleFileChange('face', e)} accept="image/*" className="hidden" />
                      </div>
                   </div>
                   
                   {/* Mobile Typography Selector (shown only on mobile here) */}
                   <div className="lg:hidden space-y-4 col-span-full">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold flex items-center gap-2"><Type size={12}/> Typography</label>
                      <div className="flex flex-wrap gap-2">
                        {["Standard", "Overlord", "Mecha", "Ninja", "Future"].map((f) => (
                           <button
                             key={f}
                             type="button"
                             onClick={() => setEquipped((prev: any) => ({ ...prev, fontFamily: f }))}
                             className={`py-2 px-3 border text-[9px] tracking-widest uppercase transition-all ${equipped.fontFamily === f ? 'border-azure-500 bg-azure-500/10 text-azure-400' : 'border-white/5 opacity-40'}`}
                           >
                             {f}
                           </button>
                        ))}
                      </div>
                   </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="space-y-10 p-4 lg:p-0">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">03</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">Contact / 連絡手段</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold flex items-center gap-2"><Phone size={10}/> Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="090-XXXX-XXXX" />
                      <AlignButtons field="phone" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold flex items-center gap-2"><Mail size={10}/> Email</label>
                      <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="contact@example.com" />
                      <AlignButtons field="email" />
                   </div>
                </div>
              </section>

              {/* Bio & Social */}
              <section className="space-y-10 p-4 lg:p-0 pb-20">
                <header className="flex items-center gap-4 opacity-40 border-b border-white/5 pb-4">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px]">04</div>
                   <h3 className="text-[11px] tracking-[0.5em] uppercase font-bold">Archive & Social / その他</h3>
                </header>

                <div className="space-y-4">
                   <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Back Side Bio / 裏面メッセージ</label>
                   <textarea rows={4} value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm focus:border-azure-400 outline-none resize-none text-white" placeholder="信念や得意分野を自由にご記入ください" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">X (Twitter)</label>
                      <input type="text" value={formData.link_x} onChange={(e) => updateField('link_x', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="https://x.com/your-id" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-bold">Instagram</label>
                      <input type="text" value={formData.link_instagram} onChange={(e) => updateField('link_instagram', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none text-white" placeholder="https://instagram.com/your-id" />
                   </div>
                </div>
              </section>
           </form>
        </div>
      </div>
    </div>
  );
}
