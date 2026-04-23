"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Zap, TrendingUp, Sparkles, UserCircle, Share2, ShieldCheck, Briefcase, Trophy } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import SublimationOverlay from "@/components/ui/SublimationOverlay";
import VoidRadar from "@/components/ui/VoidRadar";
import GraceBloomEffect from "@/components/ui/GraceBloomEffect";
import DecorationRitual from "@/components/ui/DecorationRitual";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import DigitalIdentityOverlay from "@/components/ui/DigitalIdentityOverlay";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isSublimating, setIsSublimating] = useState(false);
  const [isGraceActive, setIsGraceActive] = useState(false);
  const [ritualTitle, setRitualTitle] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [realStats, setRealStatus] = useState({
    rt_balance: "0",
    rank: "Initiate",
    titles: [] as string[],
    uid: "UNSYNCED",
    handle: "",
    slug: "",
    equipped: {
      frame: "Obsidian",
      title: "Chief Officer",
      sound: "Resonance",
      pointer: "Pure White Hex",
      angel: "Sentinel"
    }
  });

  const fetchLatestStats = async () => {
    try {
      const res = await fetch("/api/user/status");
      if (res.ok) {
        const data = await res.json();
        setRealStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch soul stats:", err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchLatestStats();
    }
    const hasSeenOnboarding = localStorage.getItem("hxc_onboarding_seen");
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 1500);
    }
  }, [session]);

  const completeOnboarding = () => {
    localStorage.setItem("hxc_onboarding_seen", "true");
    setShowOnboarding(false);
  };

  const getTitleColor = (title: string) => {
    switch (title) {
      case "Chief Officer": return "text-azure-400 border-azure-400/30 bg-azure-400/5";
      case "Founder": return "text-bronze-400 border-bronze-400/30 bg-bronze-400/5";
      case "Architect": return "text-blue-500 border-blue-500/30 bg-blue-500/5";
      case "Initiate": return "text-moonlight/40 border-white/10 bg-white/5";
      default: return "opacity-40 border-white/10";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="text-center">
          <div className="text-[10px] tracking-[1.2em] uppercase opacity-40 font-extralight mb-4">Synchronizing Soul</div>
          <div className="text-[8px] tracking-[0.4em] opacity-20">魂の同調中...</div>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void text-center">
         <div className="space-y-8">
           <p className="text-[10px] tracking-[0.5em] uppercase opacity-30">Connection Severed / 接続切れ</p>
           <Link href="/login" className="inline-block px-12 py-4 border border-white/10 text-[9px] uppercase tracking-[0.6em] hover:bg-white/5 transition-all">Re-Authenticate</Link>
         </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto pt-24 px-6 pb-24 relative">
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-void/95 backdrop-blur-md flex items-center justify-center p-12 overflow-hidden"
          >
            <div className="max-w-xl w-full space-y-12 text-center relative">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h2 className="text-2xl tracking-[1em] uppercase font-extralight mb-4">Welcome, {session.user?.name}</h2>
                <p className="text-[9px] tracking-[0.4em] leading-loose opacity-60 uppercase italic">
                  「主（あるじ）よ、お待ちしておりました。<br />
                  この領域は、あなたの存在を定義する聖域です。」
                </p>
              </motion.div>
              <button onClick={completeOnboarding} className="px-16 py-5 bg-white text-void font-bold text-[10px] tracking-[1em] uppercase">Enter Sanctum</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DecorationRitual title={ritualTitle || ""} isVisible={!!ritualTitle} onComplete={() => setRitualTitle(null)} />
      <SublimationOverlay isVisible={isSublimating} onComplete={() => setIsSublimating(false)} rankName={realStats.rank} />
      <GraceBloomEffect isActive={isGraceActive} onComplete={() => setIsGraceActive(false)} />

      <header className="mb-20 flex justify-between items-end">
        <div>
          <h1 className="text-4xl tracking-[0.5em] uppercase font-extralight">Personal Hub</h1>
          <p className="text-azure-400 text-[9px] tracking-[0.5em] uppercase italic flex items-center gap-3 mt-4">
            <ShieldCheck size={14} /> {realStats.rank} Status
          </p>
        </div>
        <div className="text-right flex gap-3">
           {realStats.titles.map((t) => (
             <span key={t} className={`px-5 py-2 border text-[8px] tracking-[0.5em] uppercase font-bold transition-all ${getTitleColor(t)}`}>
               {t}
             </span>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-16">
          <div className="relative group">
            <HexaCardPreview 
              name={session.user?.name || "Unknown"} 
              uid={realStats.uid} 
              rt={Number(realStats.rt_balance).toLocaleString()} 
              personality={realStats.equipped.angel} 
              aura={85}
              frame={realStats.equipped.frame}
            />
            
            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <Link href="/profile/edit" className="flex-1 py-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-center group flex flex-col items-center justify-center gap-1">
                  <span className="text-[9px] tracking-[0.5em] uppercase">Edit Identity</span>
                  <span className="text-[7px] opacity-30 uppercase tracking-[0.2em]">情報の調律</span>
                </Link>
                <Link href="/inventory" className="flex-1 py-5 border border-azure-500/30 bg-azure-500/5 hover:bg-azure-500/10 transition-all text-center group relative overflow-hidden flex flex-col items-center justify-center gap-1">
                  <Trophy size={14} className="mx-auto mb-2 text-azure-400 opacity-60" />
                  <span className="text-[9px] tracking-[0.5em] uppercase">Treasury</span>
                  <span className="text-[7px] opacity-40 uppercase tracking-[0.2em]">宝物庫</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-8 border border-azure-500/20 bg-azure-500/[0.03] flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-azure-400/40" />
             <div>
                <p className="text-[10px] uppercase tracking-[0.6em] text-azure-400/60 font-bold mb-1">Resonance Energy</p>
                <p className="text-[7px] uppercase tracking-[0.2em] opacity-30 italic text-bronze-400/60">Next Sublimation at 5,000 RT</p>
             </div>
             <p className="text-4xl font-extralight tracking-[0.4em] text-azure-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.2)]">
               {Number(realStats.rt_balance).toLocaleString()} <span className="text-xs opacity-40 ml-2">RT</span>
             </p>
          </div>

          <section className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <h2 className="text-[11px] tracking-[0.6em] uppercase opacity-40 font-bold">Equipped Assets</h2>
              <Link href="/inventory" className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-all flex items-center gap-2">
                Manage Treasury <Trophy size={10} className="text-bronze-400" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: "Frame", value: realStats.equipped.frame, icon: <ShieldCheck size={14} className="text-azure-400/60"/>, sub: "外枠" },
                 { label: "Title", value: realStats.equipped.title, icon: <Trophy size={14} className="text-bronze-400/60"/>, sub: "称号" },
                 { label: "Pointer", value: realStats.equipped.pointer, icon: <Zap size={14} className="text-azure-400/60"/>, sub: "軌跡" },
                 { label: "Concierge", value: realStats.equipped.angel, icon: <UserCircle size={14} className="text-bronze-400/60"/>, sub: "執事" },
               ].map((asset) => (
                 <Link key={asset.label} href="/inventory" className="p-4 border border-white/5 bg-white/[0.01] hover:bg-azure-500/5 transition-all group">
                    <div className="flex items-center gap-3 mb-3 opacity-30 group-hover:opacity-100 transition-opacity">
                       {asset.icon}
                       <span className="text-[8px] uppercase tracking-widest">{asset.label}</span>
                    </div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-moonlight/80 mb-1">{asset.value}</p>
                    <p className="text-[7px] opacity-20 uppercase">{asset.sub}</p>
                 </Link>
               ))}
            </div>
          </section>
        </div>

        <aside className="space-y-16">
          <MonthlyReport />
          <VoidRadar />
        </aside>
      </div>
    </div>
  );
}
