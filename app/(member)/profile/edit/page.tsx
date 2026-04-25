"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Globe, Shield, Save, ArrowLeft, Languages, Camera, Info, Upload, RotateCcw, Smartphone, Layout, Phone, Mail, AlignLeft, AlignCenter, AlignRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import HexaCardPreview, { Alignment, FieldAlignments } from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ResonanceToast";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const defaultAlign: FieldAlignments = {
    company: "center", title: "center", name: "center", reading: "center", phone: "center", email: "center"
  };

  const [formData, setFormData] = useState({
    name: "", reading: "", title: "", company: "", website: "", bio: "", phone: "", email: "",
    logoUrl: "", faceUrl: "",
    orientation: "horizontal" as "horizontal" | "vertical",
    hAlign: { ...defaultAlign },
    vAlign: { ...defaultAlign }
  });
  
  const [equipped, setEquipped] = useState({ frame: "Obsidian", title: "ASSOCIATE" });

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
            orientation: data.equipped?.orientation || "horizontal",
            hAlign: data.equipped?.hAlign || { ...defaultAlign },
            vAlign: data.equipped?.vAlign || { ...defaultAlign }
          });
          if (data.equipped) setEquipped({ ...equipped, ...data.equipped });
        }
      } catch (e) { console.error(e); }
    };
    if (session) fetchInitialData();
  }, [session]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateAlign = (field: keyof FieldAlignments, align: Alignment) => {
    const key = formData.orientation === 'horizontal' ? 'hAlign' : 'vAlign';
    setFormData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: align }
    }));
    setIsDirty(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          handle: formData.reading,
          photo_url: formData.faceUrl,
          logo_url: formData.logoUrl
        })
      });

      if (res.ok) {
        showToast("Identity Synchronized / 情報を記録しました", "success");
        setIsDirty(false);
        router.refresh();
      } else {
        showToast("Error / 保存に失敗しました", "error");
      }
    } catch (err) { console.error(err); }
    finally { setIsSaving(false); }
  };

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

  const AlignButtons = ({ field }: { field: keyof FieldAlignments }) => {
    const currentAlign = formData.orientation === 'horizontal' ? formData.hAlign[field] : formData.vAlign[field];
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

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 relative text-moonlight">
      <AnimatePresence>
        {isDirty && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-8 py-3 bg-rose-600 text-white text-[10px] tracking-[0.2em] font-bold uppercase shadow-2xl flex items-center gap-3">
             <AlertTriangle size={14} /> Unsaved Changes / 変更を保存するには下部のコミットを押してください
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-16 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight text-white">Tune Identity</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              <div className="absolute top-6 right-6 z-30 flex gap-2 p-1 bg-white/5 border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                 <button type="button" onClick={() => updateField('orientation', 'horizontal')} className={`p-1.5 transition-all ${formData.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={12}/>
                 </button>
                 <button type="button" onClick={() => updateField('orientation', 'vertical')} className={`p-1.5 transition-all ${formData.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={12}/>
                 </button>
              </div>
              <HexaCardPreview 
                name={formData.name || "NAME"} reading={formData.reading} company={formData.company} title={formData.title || equipped.title} phone={formData.phone} email={formData.email} logoUrl={formData.logoUrl} faceUrl={formData.faceUrl} frame={equipped.frame} orientation={formData.orientation}
                alignments={formData.orientation === 'horizontal' ? formData.hAlign : formData.vAlign}
              />
           </div>
           <div className="p-6 border border-azure-500/20 bg-azure-500/5 space-y-4">
              <div className="flex items-center gap-3 text-azure-400"><Info size={16} /><p className="text-[10px] tracking-[0.2em] uppercase font-bold">Advisory / 助言</p></div>
              <p className="text-[11px] opacity-60 italic">「表面に組織を、裏面にあなたを。」</p>
           </div>
        </div>

        <div className="lg:col-span-7">
           <form onSubmit={handleSave} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/5 pb-12">
                 <div className="space-y-6">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2"><Building2 size={12} className="text-bronze-500"/> Company Logo / 会社ロゴ</label>
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 border border-white/10 flex items-center justify-center bg-white/[0.03] overflow-hidden group relative text-white">
                          {formData.logoUrl ? <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={24} className="text-white/5" />}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button type="button" onClick={() => updateField('logoUrl', '')} className="text-white/60 hover:text-white"><RotateCcw size={14}/></button>
                          </div>
                       </div>
                       <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 border border-white/10 bg-white/[0.02] text-[8px] tracking-[0.2em] uppercase hover:border-bronze-400 transition-all text-white/60">Upload Logo</button>
                       <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange('logo', e)} accept="image/*" className="hidden" />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2"><Camera size={12} className="text-azure-500"/> Holder Portrait / 顔写真</label>
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03] overflow-hidden group relative text-white">
                          {formData.faceUrl ? <img src={formData.faceUrl} alt="Face" className="w-full h-full object-cover" /> : <User size={24} className="text-white/5" />}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button type="button" onClick={() => updateField('faceUrl', '')} className="text-white/60 hover:text-white"><RotateCcw size={14}/></button>
                          </div>
                       </div>
                       <button type="button" onClick={() => faceInputRef.current?.click()} className="px-4 py-2 border border-white/10 bg-white/[0.02] text-[8px] tracking-[0.2em] uppercase hover:border-azure-400 transition-all text-white/60">Upload Face</button>
                       <input type="file" ref={faceInputRef} onChange={(e) => handleFileChange('face', e)} accept="image/*" className="hidden" />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold">Full Name / 氏名</label>
                    <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none" placeholder="漢字・英語" />
                    <AlignButtons field="name" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold">Reading / ふりがな</label>
                    <input type="text" value={formData.reading} onChange={(e) => updateField('reading', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none" placeholder="ひらがな" />
                    <AlignButtons field="reading" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold">Company / 所属企業</label>
                    <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-bronze-400 outline-none" placeholder="企業名" />
                    <AlignButtons field="company" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold">Professional Title / 肩書き</label>
                    <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none" placeholder="役職・専門" />
                    <AlignButtons field="title" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2"><Phone size={12} className="text-azure-400"/> Phone / 電話番号</label>
                    <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none" placeholder="090-XXXX-XXXX" />
                    <AlignButtons field="phone" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2"><Mail size={12} className="text-azure-400"/> Contact Email / 連絡用メール</label>
                    <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-sm tracking-widest focus:border-azure-400 outline-none" placeholder="contact@example.com" />
                    <AlignButtons field="email" />
                 </div>
              </div>

              <div className="pt-8">
                 <button type="submit" disabled={isSaving} className={`w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-azure-500 transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden ${isSaving && 'opacity-50'}`}>
                    {isSaving ? "Synchronizing..." : <><Save size={14} /> Commit Identity / 調律を完了</>}
                    {isSaving && <motion.div animate={{ left: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
