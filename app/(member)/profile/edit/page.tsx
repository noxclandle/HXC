"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Mail, Phone, Globe, Shield, Save, ArrowLeft, Camera, Sparkles } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ResonanceToast";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    bio: "",
    handle: ""
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || ""
      }));
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // 保存シミュレーション
    setTimeout(() => {
      setIsSaving(false);
      showToast("Identity Crystalized / プロフィールを保存しました", "success");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6 pb-24 relative">
      <header className="mb-16 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight">Tune Identity</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase">情報の調律・プロフィール編集</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Preview with Flip Motion */}
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white border border-black/5 shadow-xl rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              <h2 className="text-[9px] uppercase tracking-[0.6em] opacity-30 mb-10 text-center italic text-azure-600">Dynamic Preview / リアルタイムプレビュー</h2>
              <HexaCardPreview 
                name={formData.name || "ARCHITECT"} 
                uid="04:XX:XX:XX:XX:XX:XX"
                rt="1,000,150"
                personality="Sentinel"
                aura={85}
                frame="Obsidian"
              />
              <p className="mt-8 text-center text-[7px] tracking-[0.2em] opacity-20 uppercase">Click the card to flip / クリックで反転を確認</p>
           </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-7">
           <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Name */}
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <User size={12} className="text-azure-500"/> Full Name / 氏名
                    </label>
                    <input 
                       type="text" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-white border border-black/5 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="NAME"
                    />
                 </div>

                 {/* Handle */}
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Sparkles size={12} className="text-bronze-500"/> Handle Name / 通称
                    </label>
                    <input 
                       type="text" 
                       value={formData.handle}
                       onChange={(e) => setFormData({...formData, handle: e.target.value})}
                       className="w-full bg-white border border-black/5 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="HANDLE"
                    />
                 </div>

                 {/* Title */}
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Briefcase size={12} className="text-azure-500"/> Professional Title / 肩書き
                    </label>
                    <input 
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData({...formData, title: e.target.value})}
                       className="w-full bg-white border border-black/5 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="TITLE"
                    />
                 </div>

                 {/* Website */}
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Globe size={12} className="text-azure-500"/> Identity Anchor / ウェブサイト
                    </label>
                    <input 
                       type="url" 
                       value={formData.website}
                       onChange={(e) => setFormData({...formData, website: e.target.value})}
                       className="w-full bg-white border border-black/5 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="https://..."
                    />
                 </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                 <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                    <Shield size={12} className="text-bronze-500"/> Identity Core / 自己紹介
                 </label>
                 <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-white border border-black/5 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm resize-none"
                    placeholder="Describe your essence..."
                 />
              </div>

              <div className="pt-8">
                 <button 
                   type="submit"
                   disabled={isSaving}
                   className={`w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-azure-500 transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden ${isSaving && 'opacity-50'}`}
                 >
                    {isSaving ? "Crystalizing..." : (
                      <>
                        <Save size={14} /> Commit Identity / 変更を保存
                      </>
                    )}
                    {isSaving && (
                      <motion.div 
                        animate={{ left: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
