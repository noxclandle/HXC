"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Mail, Phone, Globe, Shield, Save, ArrowLeft, Camera, Sparkles, Languages } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ResonanceToast";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    website: "",
    bio: "",
    reading: "" // handle_nameをこれにマッピング
  });

  const fetchInitialData = async () => {
    try {
      // キャッシュを無効化して最新データを取得
      const res = await fetch("/api/user/status", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || session?.user?.name || "",
          email: session?.user?.email || "",
          reading: data.handle || "",
          title: data.profile?.title || "",
          website: data.profile?.website || "",
          bio: data.profile?.bio || ""
        });
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
          website: formData.website,
          bio: formData.bio
        })
      });

      if (res.ok) {
        showToast("Identity Synchronized / 変更を記録しました", "success");
        // サーバーサイドキャッシュも無効化
        router.refresh();
      } else {
        showToast("Sync Failed / 保存に失敗しました", "error");
      }
    } catch (err) {
      showToast("Connection Severed / 通信エラーが発生しました", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6 pb-24 relative text-moonlight">
      <header className="mb-16 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight">Tune Identity</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase font-bold">プロフィールの調律</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 shadow-2xl rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              <h2 className="text-[9px] uppercase tracking-[0.6em] opacity-30 mb-10 text-center italic text-azure-400">Professional Preview</h2>
              <HexaCardPreview 
                name={formData.name || "NAME"} 
                reading={formData.reading}
                uid="04:XX:XX:XX:XX:XX:XX"
                rt="1,000,150"
                title={formData.title || "ASSOCIATE"}
                aura={85}
                frame="Obsidian"
              />
              <p className="mt-8 text-center text-[7px] tracking-[0.2em] opacity-20 uppercase">Click card to verify flip / 反転を確認</p>
           </div>
        </div>

        <div className="lg:col-span-7">
           <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <User size={12} className="text-azure-500"/> Full Name / 氏名
                    </label>
                    <input 
                       type="text" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="漢字・英語"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Languages size={12} className="text-azure-400"/> Name Reading / ふりがな
                    </label>
                    <input 
                       type="text" 
                       value={formData.reading}
                       onChange={(e) => setFormData({...formData, reading: e.target.value})}
                       className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="ひらがな・ROMAJI"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Briefcase size={12} className="text-azure-500"/> Professional Title / 肩書き
                    </label>
                    <input 
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData({...formData, title: e.target.value})}
                       className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="役職・専門"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                       <Globe size={12} className="text-azure-500"/> Website / ウェブサイト
                    </label>
                    <input 
                       type="url" 
                       value={formData.website}
                       onChange={(e) => setFormData({...formData, website: e.target.value})}
                       className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm"
                       placeholder="https://..."
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold flex items-center gap-2">
                    <Shield size={12} className="text-bronze-500"/> Professional Bio / 自己紹介
                 </label>
                 <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 text-xs tracking-widest focus:border-azure-400 outline-none transition-all shadow-sm resize-none"
                    placeholder="経歴や実績を記述してください"
                 />
              </div>

              <div className="pt-8">
                 <button 
                   type="submit"
                   disabled={isSaving}
                   className={`w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-azure-500 transition-all active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden ${isSaving && 'opacity-50'}`}
                 >
                    {isSaving ? "Synchronizing..." : (
                      <>
                        <Save size={14} /> Commit Changes / 保存する
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
