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

  const handleSync = async () => {
    alert("オフラインデータを同期しています...");
    localStorage.removeItem("pending_scans");
    setPendingSyncCount(0);
    window.dispatchEvent(new CustomEvent("sync-complete"));
  };

  const completeOnboarding = () => {
    localStorage.setItem("hxc_onboarding_seen", "true");
    setShowOnboarding(false);
  };

  const getTitleColor = (title: string) => {
    switch (title) {
      case "Messenger": return "text-blue-400 border-blue-400/20";
      case "Void Voyager": return "text-purple-400 border-purple-400/20";
      case "Headhunter": return "text-rose-400 border-rose-400/20";
      case "Chief Officer": return "text-emerald-400 border-emerald-400/20";
      default: return "opacity-40 border-white/10";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] tracking-[1em] uppercase opacity-40">
          Synchronizing Soul...
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
         <div className="text-center space-y-6">
           <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">Connection Severed. Please Re-authenticate.</p>
           <Link href="/login" className="block px-8 py-3 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white/5">Login</Link>
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
            className="fixed inset-0 z-[1000] bg-void flex items-center justify-center p-12 overflow-hidden"
          >
            <div className="max-w-xl w-full space-y-12 text-center relative z-10">
              <h2 className="text-2xl tracking-[0.8em] uppercase font-light">Welcome, {session.user?.name}</h2>
              <p className="text-xs tracking-[0.4em] leading-loose opacity-60 uppercase italic">
                「主（あるじ）よ、お待ちしておりました。新たな運命を刻みましょう。」
              </p>
              <button onClick={completeOnboarding} className="px-16 py-5 bg-white text-void font-bold text-[11px] tracking-[1em] uppercase">Enter Sanctum</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DecorationRitual title={ritualTitle || ""} isVisible={!!ritualTitle} onComplete={() => setRitualTitle(null)} />
      <SublimationOverlay isVisible={isSublimating} onComplete={() => setIsSublimating(false)} rankName={realStats.rank} />
      <GraceBloomEffect isActive={isGraceActive} onComplete={() => setIsGraceActive(false)} />

      <header className="mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-4xl tracking-[0.4em] uppercase mb-4 font-light">Personal Hub</h1>
          <div className="flex gap-4 items-center">
            <p className="text-emerald-400 text-[10px] tracking-[0.4em] uppercase italic flex items-center gap-2">
              <ShieldCheck size={14} /> {realStats.rank} Status
            </p>
          </div>
        </div>
        <div className="text-right flex gap-2">
           {realStats.titles.map((t) => (
             <span key={t} className={`px-4 py-1.5 border text-[7px] tracking-[0.4em] uppercase font-bold ${getTitleColor(t)}`}>{t}</span>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="relative group">
            <HexaCardPreview 
              name={session.user?.name || "Unknown"} 
              uid={realStats.uid} 
              rt={Number(realStats.rt_balance).toLocaleString()} 
              personality="Sentinel" 
              aura={85}
              frame="Obsidian"
            />
            
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <Link href="/profile/edit" className="flex-1 py-4 border border-moonlight/10 bg-gothic-dark/30 hover:border-moonlight/30 transition-all text-[10px] tracking-[0.4em] uppercase text-center group">
                  Edit Identity <span className="block text-[7px] opacity-40 mt-1">情報の調律</span>
                </Link>
                <Link href="/inventory" className="flex-1 py-4 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.1)] hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] transition-all text-[10px] tracking-[0.4em] uppercase text-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Trophy size={14} className="mx-auto mb-2 text-emerald-400" />
                  Treasury <span className="block text-[7px] opacity-60 mt-1">宝物庫</span>
                </Link>
                <Link href={`/p/${realStats.slug || "architect"}`} className="flex-1 py-4 border border-moonlight/10 bg-white/5 hover:bg-white/10 transition-all text-[10px] tracking-[0.4em] uppercase text-center group">
                  Sanctum <span className="block text-[7px] opacity-40 mt-1">聖域プレビュー</span>
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
                    alert("Identity URL copied.");
                  }}
                  className="w-14 border border-moonlight/10 bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-all"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border border-emerald-500/10 bg-emerald-500/[0.02] flex justify-between items-start">
             <p className="text-[9px] uppercase tracking-[0.4em] text-emerald-400 font-bold">Resonance Energy (RT)</p>
             <p className="text-3xl font-extralight tracking-[0.3em] text-emerald-400">{Number(realStats.rt_balance).toLocaleString()} <span className="text-xs opacity-40">RT</span></p>
          </div>

          {/* Recent Connections */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">Recent Connections</h2>
              <Link href="/library" className="text-[8px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity underline underline-offset-4">すべて見る</Link>
            </div>
            <div className="space-y-1">
              <p className="py-8 text-center text-[10px] uppercase tracking-widest opacity-20 border border-white/5">No recent activity</p>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <MonthlyReport />
          <VoidRadar />
        </aside>
      </div>
    </div>
  );
}
