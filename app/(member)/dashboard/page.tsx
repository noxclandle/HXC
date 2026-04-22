"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Zap, TrendingUp, Sparkles, UserCircle, Share2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import SublimationOverlay from "@/components/ui/SublimationOverlay";
import VoidRadar from "@/components/ui/VoidRadar";
import GraceBloomEffect from "@/components/ui/GraceBloomEffect";
import DecorationRitual from "@/components/ui/DecorationRitual";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import DigitalIdentityOverlay from "@/components/ui/DigitalIdentityOverlay";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isSublimating, setIsSublimating] = useState(false);
  const [isGraceActive, setIsGraceActive] = useState(false);
  const [ritualTitle, setRitualTitle] = useState<string | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // データベースからの実データ
  const [realStats, setRealStatus] = useState({
    rt_balance: 0,
    rank: "Initiate",
    titles: [] as string[],
    uid: "UNSYNCED",
    handle: "",
    slug: ""
  });

  useEffect(() => {
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
      case "Messenger": return "text-blue-400 border-blue-400/20 shadow-[0_0_10px_rgba(96,165,250,0.2)]";
      case "Void Voyager": return "text-purple-400 border-purple-400/20 shadow-[0_0_10px_rgba(192,132,252,0.2)]";
      case "Headhunter": return "text-rose-400 border-rose-400/20 shadow-[0_0_10px_rgba(251,113,133,0.2)]";
      case "Chief Officer": return "text-emerald-400 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]";
      default: return "opacity-40 border-white/10";
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto pt-24 px-6 pb-24 relative">
      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-void flex items-center justify-center p-12 overflow-hidden"
          >
            {/* Background Effects */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] border border-moonlight/5 rounded-full pointer-events-none"
            />
            
            <div className="max-w-xl w-full space-y-12 text-center relative z-10">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-2xl tracking-[0.8em] uppercase font-light">Welcome, {session.user?.name}</h2>
                <div className="w-12 h-px bg-moonlight/20 mx-auto" />
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 1.5 }}
                className="space-y-6"
              >
                <p className="text-xs tracking-[0.4em] leading-loose opacity-60 uppercase italic">
                  「主（あるじ）よ、お待ちしておりました。<br />
                  このカードは単なる道具ではなく、あなたの運命を刻む鍵です。」
                </p>
              </motion.div>

              <motion.button 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 3 }}
                onClick={completeOnboarding}
                className="px-16 py-5 bg-white text-void font-bold text-[11px] tracking-[1em] uppercase shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
              >
                Enter Sanctum
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DecorationRitual title={ritualTitle || ""} isVisible={!!ritualTitle} onComplete={() => setRitualTitle(null)} />
      <SublimationOverlay isVisible={isSublimating} onComplete={() => setIsSublimating(false)} rankName={realStats.rank} />
      <GraceBloomEffect isActive={isGraceActive} onComplete={() => setIsGraceActive(false)} />

      <header className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-4xl tracking-[0.4em] uppercase mb-4 font-light">Personal Hub</h1>
            <div className="flex gap-4 items-center">
              <p className="text-emerald-400 text-[10px] tracking-[0.4em] uppercase italic flex items-center gap-2">
                <ShieldCheck size={14} /> {realStats.rank} Status
              </p>
              <div className="h-px w-12 bg-moonlight/20" />
            </div>
          </div>
          <div className="text-right space-y-4">
             <div className="flex gap-2 justify-end flex-wrap max-w-[300px]">
               {realStats.titles.map((t) => (
                 <span key={t} className={`px-4 py-1.5 border text-[7px] tracking-[0.4em] uppercase font-bold transition-all ${getTitleColor(t)}`}>
                   {t}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="relative group">
            <HexaCardPreview name={session.user?.name || "Unknown"} uid={realStats.uid} rt={realStats.rt_balance.toLocaleString()} personality="Sentinel" aura={80} />
            
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <Link href="/profile/edit" className="flex-1 py-4 border border-moonlight/10 bg-gothic-dark/30 hover:border-moonlight/30 transition-all text-[10px] tracking-[0.4em] uppercase text-center group">
                  Edit Identity <span className="block text-[7px] opacity-40 mt-1 group-hover:opacity-100 transition-opacity">情報の調律</span>
                </Link>
                <Link 
                  href={`/p/${realStats.slug || "architect"}`} 
                  target="_blank"
                  className="flex-1 py-4 border border-moonlight/10 bg-white/5 hover:bg-white/10 transition-all text-[10px] tracking-[0.4em] uppercase text-center group"
                >
                  Sanctum <span className="block text-[7px] opacity-40 mt-1 group-hover:opacity-100 transition-opacity">公開プレビュー</span>
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
                    alert("Identity URL copied to clipboard.");
                  }}
                  className="w-14 border border-moonlight/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center group"
                >
                  <Share2 size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border border-emerald-500/10 bg-emerald-500/[0.02] relative group overflow-hidden">
             <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />
             <div className="flex justify-between items-start mb-2">
                <p className="text-[9px] uppercase tracking-[0.4em] text-emerald-400 font-bold">Resonance Energy (RT)</p>
             </div>
             <p className="text-3xl font-extralight tracking-[0.3em] text-emerald-400">{realStats.rt_balance.toLocaleString()} <span className="text-xs opacity-40">RT</span></p>
          </div>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">Recent Connections</h2>
              <Link href="/library" className="text-[8px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity underline underline-offset-4">履歴をすべて見る</Link>
            </div>
            <div className="space-y-1">
              {[
                { name: "佐藤 栄作", role: "CEO", date: "2h ago", loc: "Business Summit" },
                { name: "田中 太郎", role: "Manager", date: "1d ago", loc: "Tokyo Office" },
              ].map((c, i) => (
                <div key={i} className="p-5 bg-gothic-dark/10 border border-moonlight/5 flex justify-between items-center group hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[11px] tracking-widest group-hover:text-white transition-colors">{c.name}</span>
                    <span className="text-[8px] opacity-30 uppercase tracking-tighter">{c.role} • {c.loc}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-moonlight/40 font-mono block">{c.date}</span>
                    <span className="text-[7px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">View Details</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Network Analysis */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40">Network Breakdown</h2>
              <TrendingUp size={14} className="opacity-20" />
            </div>
            <div className="p-8 border border-moonlight/5 bg-gothic-dark/10 grid grid-cols-3 gap-8 text-center md:text-left">
               {[
                 { label: "Executive", value: 35, color: "#FFD54F", jp: "経営層" },
                 { label: "Technical", value: 45, color: "#4DD0E1", jp: "技術職" },
                 { label: "Creative", value: 20, color: "#BA68C8", jp: "クリエイティブ" },
               ].map((stat) => (
                 <div key={stat.label} className="space-y-4">
                    <div className="h-1 w-full bg-white/5 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${stat.value}%` }} style={{ backgroundColor: stat.color }} className="h-full shadow-[0_0_10px_currentcolor]" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-baseline gap-1">
                       <span className="text-[8px] uppercase tracking-widest opacity-40">{stat.label} <span className="block text-[6px] opacity-50 lowercase">{stat.jp}</span></span>
                       <span className="text-[10px] font-mono">{stat.value}%</span>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <MonthlyReport />
          <VoidRadar />
          
          <div className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm space-y-8">
            <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
              <Zap size={14} /> System Safety
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">Daily Point Consumption</p>
                <p className="text-xl font-extralight tracking-widest">12 Points</p>
              </div>
              <button 
                onClick={() => confirm("本当にカードの機能を一時停止しますか？")}
                className="w-full py-4 border border-rose-500/20 text-[8px] text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 transition-all font-bold"
              >
                Disable Hardware Card <span className="block text-[6px] opacity-40 mt-1">紛失時のカード封印</span>
              </button>
            </div>
          </div>

          <div className="p-8 border border-moonlight/5 bg-void">
             <p className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed">
               システムの維持にはポイントが必要です。残高が枯渇すると、コンシェルジュの姿は色褪せ、機能が制限されます。
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
