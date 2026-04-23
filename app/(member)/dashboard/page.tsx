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
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [realStats, setRealStatus] = useState({
    rt_balance: "0",
    rank: "Initiate",
    titles: [] as string[],
    uid: "UNSYNCED",
    handle: "",
    slug: ""
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

    const pending = JSON.parse(localStorage.getItem("pending_scans") || "[]");
    setPendingSyncCount(pending.length);

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
        <motion.div 
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.98, 1, 0.98] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
          className="text-center"
        >
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
           <div>
             <p className="text-[10px] tracking-[0.5em] uppercase opacity-30 mb-2">Connection Severed</p>
             <p className="text-[8px] tracking-[0.2em] opacity-20">接続が切断されました</p>
           </div>
           <Link href="/login" className="inline-block px-12 py-4 border border-white/10 text-[9px] uppercase tracking-[0.6em] hover:bg-white/5 transition-all">Re-Authenticate / 再認証</Link>
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
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl tracking-[1em] uppercase font-extralight mb-4">Welcome, {session.user?.name}</h2>
                <div className="w-12 h-px bg-azure-400/40 mx-auto mb-8" />
                <p className="text-[9px] tracking-[0.4em] leading-loose opacity-60 uppercase italic">
                  「主（あるじ）よ、お待ちしておりました。<br />
                  この領域は、あなたの存在を定義する聖域です。」
                </p>
              </motion.div>
              <button onClick={completeOnboarding} className="px-16 py-5 bg-white text-void font-bold text-[10px] tracking-[1em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 transition-all">Enter Sanctum / 聖域に入る</button>
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
          <p className="text-[9px] tracking-[0.4em] opacity-30 mt-3 mb-6">個人拠点管理</p>
          <div className="flex gap-6 items-center">
            <div>
              <p className="text-azure-400 text-[9px] tracking-[0.5em] uppercase italic flex items-center gap-3">
                <ShieldCheck size={14} /> {realStats.rank} Status
              </p>
              <p className="text-[7px] tracking-[0.2em] opacity-20 ml-7 mt-1">現在の権限状態</p>
            </div>
            <div className="h-px w-16 bg-white/10" />
            <div>
              <p className="text-[8px] tracking-[0.3em] uppercase opacity-30">Sanctum Sync: Active</p>
              <p className="text-[6px] tracking-[0.1em] opacity-10 mt-1 uppercase text-azure-400/40">同期中</p>
            </div>
          </div>
        </div>
        <div className="text-right flex gap-3">
           {realStats.titles.map((t) => (
             <span key={t} className={`px-5 py-2 border text-[8px] tracking-[0.5em] uppercase font-bold transition-all shadow-sm ${getTitleColor(t)}`}>
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
              personality="Sentinel" 
              aura={85}
              frame="Obsidian"
            />
            
            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <Link href="/profile/edit" className="flex-1 py-5 border border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all text-center group flex flex-col items-center justify-center gap-1">
                  <span className="text-[9px] tracking-[0.5em] uppercase">Edit Identity</span>
                  <span className="text-[7px] opacity-30 uppercase tracking-[0.2em]">情報の調律</span>
                </Link>
                <Link href="/inventory" className="flex-1 py-5 border border-azure-500/30 bg-azure-500/5 hover:bg-azure-500/10 shadow-[0_0_25px_rgba(59,130,246,0.05)] hover:shadow-[0_0_35px_rgba(59,130,246,0.1)] transition-all text-center group relative overflow-hidden flex flex-col items-center justify-center gap-1">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-azure-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Trophy size={14} className="mx-auto mb-2 text-azure-400 opacity-60" />
                  宝物庫 <span className="block text-[7px] opacity-40 mt-1 uppercase tracking-[0.2em]">Treasury</span>
                </Link>
                <Link href={`/p/${realStats.slug || "architect"}`} className="flex-1 py-5 border border-white/5 bg-white/[0.02] hover:bg-white/10 transition-all text-center group flex flex-col items-center justify-center gap-1">
                  <span className="text-[9px] tracking-[0.5em] uppercase">Sanctum View</span>
                  <span className="text-[7px] opacity-30 uppercase tracking-[0.2em]">聖域プレビュー</span>
                </Link>
              </div>
              <div className="flex gap-4">
                <DigitalIdentityOverlay user={{ 
                  name: session.user?.name || "", 
                  handle: realStats.handle, 
                  role: realStats.rank, 
                  slug: realStats.slug || "architect" 
                }} />
                <button 
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    const url = `${origin}/p/${realStats.slug || "architect"}`;
                    navigator.clipboard.writeText(url);
                    alert("Identity Anchor Link copied.");
                  }}
                  className="w-16 border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center opacity-30 hover:opacity-100 transition-all hover:bg-white/5 gap-1"
                >
                  <Share2 size={16} />
                  <span className="text-[6px] tracking-[0.1em] uppercase">Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 border border-azure-500/20 bg-azure-500/[0.03] flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-azure-400/40" />
             <div>
                <p className="text-[10px] uppercase tracking-[0.6em] text-azure-400/60 font-bold mb-1">Resonance Energy</p>
                <p className="text-[7px] uppercase tracking-[0.2em] opacity-30 italic text-bronze-400/60">Next Sublimation at 5,000 RT</p>
             </div>
             <p className="text-4xl font-extralight tracking-[0.4em] text-azure-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
               {Number(realStats.rt_balance).toLocaleString()} <span className="text-xs opacity-40 ml-2">RT</span>
             </p>
          </div>

          {/* Equipped Assets Quick Access */}
          <section className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div>
                <h2 className="text-[11px] tracking-[0.6em] uppercase opacity-40 font-bold">Equipped Assets</h2>
                <p className="text-[7px] tracking-[0.2em] opacity-20 mt-1 uppercase">現在の装備構成</p>
              </div>
              <Link href="/inventory" className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-all flex items-center gap-2">
                Manage Treasury <Trophy size={10} className="text-bronze-400" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: "Frame", value: "Obsidian", icon: <ShieldCheck size={14} className="text-azure-400/60"/>, sub: "外枠" },
                 { label: "Title", value: realStats.titles[0] || "Initiate", icon: <Trophy size={14} className="text-bronze-400/60"/>, sub: "称号" },
                 { label: "Sound", value: "Resonance", icon: <Zap size={14} className="text-azure-400/60"/>, sub: "共鳴音" },
                 { label: "Concierge", value: "Sentinel", icon: <UserCircle size={14} className="text-bronze-400/60"/>, sub: "執事" },
               ].map((asset) => (
                 <Link key={asset.label} href="/inventory" className="p-4 border border-white/5 bg-white/[0.01] hover:bg-azure-500/5 hover:border-azure-500/20 transition-all group">
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

          {/* Recent Connections */}
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
              <div>
                <h2 className="text-[11px] tracking-[0.6em] uppercase opacity-40 font-bold">Recent Connections</h2>
                <p className="text-[7px] tracking-[0.2em] opacity-20 mt-1 uppercase">最近の接続履歴</p>
              </div>
              <Link href="/library" className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-60 transition-all">Archive Access / すべて見る</Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="py-16 text-center space-y-3 border border-dashed border-white/10">
                <p className="text-[9px] uppercase tracking-[0.8em] opacity-10 font-light text-azure-400/20">The Archive is currently silent</p>
                <p className="text-[7px] uppercase tracking-[0.4em] opacity-5">記録された実体はありません</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-16">
          <div className="p-1 bg-gradient-to-b from-white/10 to-transparent">
             <div className="mb-4 flex flex-col items-end">
                <p className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold">Monthly Insight</p>
                <p className="text-[7px] tracking-[0.2em] opacity-20 uppercase text-bronze-400/40">月次分析レポート</p>
             </div>
             <MonthlyReport />
          </div>
          <div className="opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
             <div className="mb-6 flex flex-col items-center">
                <p className="text-[9px] tracking-[0.4em] uppercase opacity-40 font-bold">Void Radar</p>
                <p className="text-[7px] tracking-[0.2em] opacity-20 uppercase text-azure-400/40">近隣スキャン</p>
             </div>
             <VoidRadar />
          </div>
        </aside>
      </div>
    </div>
  );
}
