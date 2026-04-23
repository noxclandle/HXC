"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Globe, Shield, Save, ArrowLeft, Languages, Camera, Info, Upload, RotateCcw } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ResonanceToast";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    reading: "",
    title: "",
    company: "",
    website: "",
    bio: "",
    photoUrl: ""
  });
  
  const [equipped, setEquipped] = useState({
    frame: "Obsidian",
    title: "ASSOCIATE"
  });

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
          photoUrl: data.photo_url || ""
        });
        if (data.equipped) setEquipped(data.equipped);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (session) fetchInitialData();
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          handle: formData.reading,
          title: formData.title,
          company: formData.company,
          website: formData.website,
          bio: formData.bio,
          photo_url: formData.photoUrl
        })
      });

      if (res.ok) {
        showToast("Identity Synchronized / 情報を記録しました", "success");
        router.refresh();
      } else {
        showToast("Error / 保存に失敗しました", "error");
      }
    } catch (err) { console.error(err); }
    finally { setIsSaving(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
        showToast("Photo Updated / 自画像を仮設定しました（保存で確定）", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 relative text-moonlight">
      <header className="mb-16 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight text-white">Tune Identity</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold">プロフィールの調律</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        {/* Left: Synchronized Mirror */}
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              <h2 className="text-[9px] uppercase tracking-[0.6em] opacity-30 mb-10 text-center italic text-azure-400 font-bold">Professional Reflection</h2>
              <HexaCardPreview 
                name={formData.name || "NAME"} 
                reading={formData.reading}
                company={formData.company}
                title={formData.title}
                photoUrl={formData.photoUrl}
                frame={equipped.frame}
              />
              <p className="mt-8 text-center text-[7px] tracking-[0.4em] opacity-20 uppercase">Current Equipment Applied / 装備反映済み</p>
           </div>

           <div className="p-6 border border-azure-500/20 bg-azure-500/5 space-y-4 shadow-lg">
              <div className="flex items-center gap-3 text-azure-400">
                 <Info size={16} />
                 <p className="text-[10px] tracking-[0.2em] uppercase font-bold">Advisory / 助言</p>
              </div>
              <p className="text-[11px] leading-relaxed opacity-60">
                 自画像を登録することで、名刺交換という儀式の後、相手があなたという存在を思い出す助けとなります。ビジネスの種を、確実な記憶として定着させましょう。
              </p>
           </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-7">
           <form onSubmit={handleSave} className="space-y-12">
              {/* Photo Input (Camera/File) */}
              <div className="space-y-6">
                 <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                    <Camera size={12} className="text-azure-500"/> Holder Photo / 自画像
                 </label>
                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 border border-white/10 flex items-center justify-center bg-white/[0.03] overflow-hidden group relative">
                       {formData.photoUrl ? (
                         <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <User size={32} className="text-white/10" />
                       )}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => setFormData({...formData, photoUrl: ""})} className="text-white/60 hover:text-white"><RotateCcw size={16}/></button>
                       </div>
                    </div>
                    <div className="flex flex-col gap-3">
                       <button 
                         type="button" 
                         onClick={() => fileInputRef.current?.click()}
                         className="px-6 py-3 border border-white/10 bg-white/[0.02] text-[9px] tracking-[0.3em] uppercase hover:border-azure-400 transition-all flex items-center gap-3"
                       >
                          <Upload size={12} /> Select Photo / 写真を選択
                       </button>
                       <p className="text-[7px] opacity-20 uppercase tracking-widest">Supports PNG, JPG (Recommended: Square)</p>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <User size={12} className="text-azure-500"/> Full Name / 氏名
                    </label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm" placeholder="漢字・英語" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Languages size={12} className="text-azure-400"/> Name Reading / ふりがな
                    </label>
                    <input type="text" value={formData.reading} onChange={(e) => setFormData({...formData, reading: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm" placeholder="ひらがな" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Building2 size={12} className="text-bronze-500"/> Company Name / 所属企業
                    </label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-bronze-400 outline-none transition-all shadow-sm" placeholder="企業・団体名" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Globe size={12} className="text-azure-500"/> Professional Title / 肩書き
                    </label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm" placeholder="役職・専門" />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                    <Globe size={12} className="text-azure-500"/> Website / ウェブサイト
                 </label>
                 <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none shadow-sm" placeholder="https://..." />
              </div>

              <div className="space-y-3">
                 <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                    <Shield size={12} className="text-bronze-500"/> Professional Bio / 自己紹介
                 </label>
                 <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none resize-none shadow-sm" placeholder="実績や専門分野" />
              </div>

              <div className="pt-8">
                 <button type="submit" disabled={isSaving} className={`w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-azure-500 transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden ${isSaving && 'opacity-50'}`}>
                    {isSaving ? "Crystalizing..." : <><Save size={14} /> Commit Changes / 情報を確定</>}
                    {isSaving && <motion.div animate={{ left: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
