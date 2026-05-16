"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, Book, ShieldCheck, ChevronRight, Newspaper, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import MonthlyReport from "@/components/ui/MonthlyReport";
import IdentityReflection from "@/components/ui/IdentityReflection";
import GeometricAngel from "@/components/ui/GeometricAngel";
import { useToast } from "@/components/ui/ResonanceToast";

export default function HubClientUI({ 
  initialStats, 
  initialContacts, 
  initialNews 
}: { 
  initialStats: any, 
  initialContacts: any[], 
  initialNews: any 
}) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [realStats, setRealStatus] = useState(initialStats);
  const [contacts, setContacts] = useState(initialContacts);
  const [latestNews, setLatestNews] = useState(initialNews);
  const [mood, setMood] = useState<'stable' | 'excited' | 'unstable'>('stable');
  const [isResonating, setIsResonating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, contactsRes, newsRes] = await Promise.all([
        fetch("/api/user/status", { cache: "no-store" }),
        fetch("/api/contacts/list", { cache: "no-store" }),
        fetch("/api/news", { cache: "no-store" })
      ]);
      if (statusRes.ok) setRealStatus(await statusRes.json());
      if (contactsRes.ok) {
        const cData = await contactsRes.json();
        setContacts(cData);
      }
      if (newsRes.ok) {
        const nData = await newsRes.json();
        if (nData.length > 0) setLatestNews(nData[0]);
      }
    } catch (err) { 
      console.error(err);
      showToast("Synchronization Failed / 同期エラー", "error");
    }
  }, [showToast]);

  const handleResonance = async () => {
    setIsResonating(true);
    setMood('excited');
    
    try {
      const res = await fetch("/api/user/daily-resonance", { method: "POST" });
      if (res.ok) {
        await fetchData();
        showToast("Resonance Established / 共鳴完了", "success");
        setTimeout(() => {
          setMood('stable');
          setIsResonating(false);
        }, 3000);
      } else {
        throw new Error("Failed");
      }
    } catch (e) {
      setMood('unstable');
      setIsResonating(false);
      showToast("Resonance Interrupted / 共鳴失敗", "error");
    }
  };

  useEffect(() => {
    // 初回ログイン時にガイドを表示するロジック（簡易版）
    const hasSeenGuide = localStorage.getItem("hxc-guide-seen");
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    const handleUpdate = () => fetchData();
    window.addEventListener("hxc-assets-updated", handleUpdate);
    return () => window.removeEventListener("hxc-assets-updated", handleUpdate);
  }, [fetchData]);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hxc-guide-seen", "true");
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.4em] uppercase font-extralight mb-2 text-white">Member Hub</h1>
          <p className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-40">System Dashboard</p>
        </div>
        <div className="flex items-start gap-8 w-full md:w-auto justify-between md:justify-end">
           <div className="text-left md:text-right flex flex-col items-start md:items-end w-full">
              <div className="mb-4 px-3 py-1.5 border border-azure-500/30 bg-azure-500/[0.05] text-azure-400 text-[8px] tracking-[0.4em] font-bold uppercase flex items-center gap-2">
                 <ShieldCheck size={10} /> {realStats?.equipped?.title || "ASSOCIATE"}
              </div>
              
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Relation Token</p>
              <div className="flex items-center justify-start md:justify-end gap-4">
                 <p className="text-2xl font-extralight tracking-[0.1em] text-white">{Number(realStats?.rt_balance || 0).toLocaleString()} <span className="text-xs opacity-20">RT</span></p>
                 <Link href="/charge" className="px-2 py-1 border border-azure-500/30 bg-azure-500/5 text-azure-400 text-[7px] tracking-[0.2em] font-bold uppercase hover:bg-azure-500/10 transition-all">
                    Charge / RT購入
                 </Link>
              </div>
              <div className="mt-2 flex justify-start md:justify-end items-center gap-2 opacity-40">
                 <span className="text-[7px] uppercase tracking-widest font-bold">Total EXP</span>
                 <span className="text-[10px] font-mono tracking-tighter text-white">{Number(realStats?.exp || 0).toLocaleString()}</span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <IdentityReflection user={{
            name: realStats?.name || session?.user?.name || "ARCHITECT",
            reading: realStats?.handle,
            slug: realStats?.slug,
            logo_url: realStats?.logo_url,
            photo_url: realStats?.photo_url,
            profile: realStats?.profile,
            equipped: realStats?.equipped,
            link_x: realStats?.profile?.link_x,
            link_instagram: realStats?.profile?.link_instagram,
            link_line: realStats?.profile?.link_line,
            link_facebook: realStats?.profile?.link_facebook,
            bio: realStats?.profile?.bio
          }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
             <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white">Identity Archive</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400/60">人脈の記録 (撮影)</p>
                </div>
                <Camera size={32} className="opacity-20 group-hover:opacity-60 transition-all text-white" />
             </Link>
             <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white">Great Library</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-bronze-400/60">名刺帳・ライブラリ</p>
                </div>
                <Book size={32} className="opacity-20 group-hover:opacity-60 transition-all text-white" />
             </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-12">
           {/* Geometric Angel & Resonance Section */}
           <div className="p-8 border border-white/5 bg-white/[0.02] flex flex-col items-center text-center space-y-6 relative overflow-hidden group min-h-[400px] justify-center">
              <div className="absolute inset-0 bg-azure-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <AnimatePresence mode="wait">
                {showGuide ? (
                  <motion.div 
                    key="guide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 relative z-20"
                  >
                    <div className="text-[10px] tracking-[0.4em] text-azure-400 font-bold uppercase mb-4">Initial Guidance</div>
                    <p className="text-[11px] leading-relaxed tracking-widest text-white/70 uppercase">
                      ようこそ、Hexa Relationへ。<br />
                      貴方のアイデンティティは確立されました。<br />
                      「Commune」で世界と共鳴し、<br />
                      「Identity Archive」で人脈を深めましょう。
                    </p>
                    <button 
                      onClick={closeGuide}
                      className="px-8 py-2 border border-white/20 text-[9px] tracking-[0.3em] uppercase hover:bg-white/10 transition-all"
                    >
                      Understood
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="angel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center space-y-6 w-full"
                  >
                    <div className="opacity-30 text-[8px] tracking-[0.5em] uppercase font-bold mb-2 relative z-10">Resident Guardian</div>
                    <div className="relative z-10 py-4">
                      <GeometricAngel level={Math.floor(Math.sqrt(Number(realStats?.exp || 0) / 10)) + 1} mood={mood} size={180} />
                    </div>
                    
                    <div className="space-y-2 relative z-10 w-full">
                      <p className="text-[10px] tracking-widest opacity-40 uppercase">
                        {mood === 'excited' ? 'Resonance active' : mood === 'unstable' ? 'Connection weak' : 'Awaiting observation'}
                      </p>
                      <button 
                        onClick={handleResonance}
                        disabled={isResonating}
                        className={`mt-4 px-10 py-3 border text-[9px] tracking-[0.4em] uppercase transition-all flex items-center gap-3 mx-auto ${
                          isResonating 
                            ? 'border-white/10 text-white/20' 
                            : 'border-white/20 text-white hover:bg-white/5 hover:border-white shadow-lg'
                        }`}
                      >
                        <Sparkles size={12} className={isResonating ? 'animate-spin' : ''} />
                        {isResonating ? 'Communing...' : 'Commune'}
                      </button>
                      
                      <button 
                        onClick={() => setShowGuide(true)}
                        className="mt-4 text-[7px] tracking-[0.5em] uppercase opacity-20 hover:opacity-100 transition-opacity mx-auto block"
                      >
                        Show Guidance
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <div className="p-1 bg-gradient-to-b from-white/5 to-transparent">
              <div className="mb-6 opacity-30 px-4 text-[9px] tracking-[0.4em] uppercase font-bold text-white">
                 <p>Monthly Insight</p>
                 <p className="text-[7px] tracking-[0.2em] mt-1 text-white">分析レポート</p>
              </div>
              <MonthlyReport stats={realStats} />
           </div>
           
           {/* Removed redundant Recent Connections list for a cleaner, focused look */}

           {latestNews && (
             <section className="px-4 mt-12 border-t border-white/5 pt-8">
               <h2 className="text-[8px] tracking-[0.5em] uppercase opacity-30 font-bold flex items-center gap-2 mb-4 text-white">
                  <Newspaper size={10} />
                  System Broadcast
               </h2>
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <span className={`w-1 h-1 rounded-full ${
                        latestNews.type === 'alert' ? 'bg-rose-500' : 
                        latestNews.type === 'event' ? 'bg-amber-500' : 
                        'bg-azure-500'
                     }`} />
                     <p className="text-xs font-light tracking-widest text-white/80">{latestNews.title}</p>
                    </div>
                    <p className="text-[10px] tracking-wider opacity-40 line-clamp-2 leading-relaxed text-white">
                       {latestNews.content}
                    </p>
                    <p className="text-[8px] tracking-widest opacity-20 font-mono mt-2 text-white">
                       {new Date(latestNews.created_at).toLocaleDateString()}
                    </p>
                 </div>
               </section>
             )}
          </aside>
        </div>
    </div>
  );
}
