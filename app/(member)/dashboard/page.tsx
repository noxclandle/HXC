"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Zap, TrendingUp, Sparkles, UserCircle, Share2 } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import SublimationOverlay from "@/components/ui/SublimationOverlay";
import VoidRadar from "@/components/ui/VoidRadar";
import GraceBloomEffect from "@/components/ui/GraceBloomEffect";
import DecorationRitual from "@/components/ui/DecorationRitual";
import MonthlyReport from "@/components/ui/MonthlyReport";

export default function DashboardPage() {
  const [isSublimating, setIsSublimating] = useState(false);
  const [isGraceActive, setIsGraceActive] = useState(false);
  const [ritualTitle, setRitualTitle] = useState<string | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem("pending_scans") || "[]");
    setPendingSyncCount(pending.length);
  }, []);

  const handleSync = async () => {
    alert("オフラインデータを同期しています...");
    localStorage.removeItem("pending_scans");
    setPendingSyncCount(0);
    window.dispatchEvent(new CustomEvent("sync-complete"));
  };

  const userData = {
    name: "Chief Officer",
    uid: "04:A2:3F:81",
    personality: "Sentinel",
    aura: 85,
    level: 12,
    exp: 65,
    rt_balance: 2450,
    titles: ["Premium Member", "Network Architect"],
    current_frame: "Obsidian",
    current_sound: "Silver Resonance"
  };

  const getTitleColor = (title: string) => {
    switch (title) {
      case "Messenger": return "title-rare";
      case "Void Voyager": return "title-elite";
      case "Headhunter": return "title-epic";
      case "Chief Officer": return "title-mythic";
      default: return "opacity-60";
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-24 px-6 pb-24">
      {/* Synchronization Banner */}
      <AnimatePresence>
        {pendingSyncCount > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-12 p-6 border border-moonlight/20 bg-white/5 flex justify-between items-center overflow-hidden">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-moonlight">Pending Connections</p>
              <p className="text-[8px] opacity-40 uppercase tracking-widest">{pendingSyncCount} 件の未同期データがあります</p>
            </div>
            <button onClick={handleSync} className="px-8 py-3 bg-moonlight text-void text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-all">Sync Now</button>
          </motion.div>
        )}
      </AnimatePresence>

      <DecorationRitual title={ritualTitle || ""} isVisible={!!ritualTitle} onComplete={() => setRitualTitle(null)} />
      <SublimationOverlay isVisible={isSublimating} onComplete={() => setIsSublimating(false)} rankName="Premium Member" />
      <GraceBloomEffect isActive={isGraceActive} onComplete={() => setIsGraceActive(false)} />

      <header className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl tracking-[0.3em] uppercase mb-2">Personal Hub</h1>
            <div className="flex gap-4 items-center">
              <p className="text-gothic-silver text-[9px] tracking-[0.4em] opacity-40 uppercase italic">Hexa Card Premium Network</p>
              <div className="h-px w-8 bg-moonlight/20" />
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-moonlight/60">Tier Level: {userData.level}</p>
            </div>
          </div>
          <div className="text-right space-y-4">
             <div className="flex gap-4 justify-end">
               <button onClick={() => setRitualTitle("Premium Member")} className="text-[7px] uppercase tracking-widest opacity-10 hover:opacity-100 transition-opacity">演出：ランクアップ</button>
               <button onClick={() => setIsGraceActive(true)} className="text-[7px] uppercase tracking-widest opacity-10 hover:opacity-100 transition-opacity">演出：ポイント獲得</button>
             </div>
             <div className="flex gap-2 justify-end">
               {userData.titles.map((t) => (
                 <span key={t} className={`px-3 py-1 border border-moonlight/20 text-[7px] tracking-[0.3em] uppercase ${getTitleColor(t)}`}>
                   {t}
                 </span>
               ))}
             </div>
             <div className="w-32 h-[1px] bg-moonlight/10 relative overflow-hidden ml-auto">
                <motion.div initial={{ width: 0 }} animate={{ width: `${userData.exp}%` }} className="h-full bg-moonlight shadow-[0_0_5px_white]" />
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="relative group">
            <HexaCardPreview name={userData.name} uid={userData.uid} rt={userData.rt_balance.toLocaleString()} personality={userData.personality} aura={userData.aura} />
            
            <div className="mt-6 flex gap-4">
              <Link href="/profile/edit" className="flex-1 py-4 border border-moonlight/10 bg-gothic-dark/30 hover:border-moonlight/30 transition-all text-[10px] tracking-[0.4em] uppercase text-center">
                Edit Profile <span className="block text-[7px] opacity-40 mt-1">プロフィールの編集</span>
              </Link>
              <Link 
                href={`/p/${userData.name.toLowerCase().replace(/\s+/g, '-')}`} 
                target="_blank"
                className="flex-1 py-4 border border-moonlight/10 bg-white/5 hover:bg-white/10 transition-all text-[10px] tracking-[0.4em] uppercase text-center"
              >
                View Card <span className="block text-[7px] opacity-40 mt-1">公開プレビュー</span>
              </Link>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/p/${userData.name.toLowerCase().replace(/\s+/g, '-')}`);
                  alert("URLをコピーしました");
                }}
                className="w-14 border border-moonlight/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center group"
                title="URLをコピー"
              >
                <Share2 size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          <div className="p-4 border border-moonlight/5 bg-white/5 relative group">
             <div className="flex justify-between items-start mb-2">
                <p className="text-[8px] uppercase opacity-30">Current Points (RT)</p>
                <div className="relative cursor-help group/info">
                  <div className="w-3 h-3 border border-moonlight/20 rounded-full flex items-center justify-center text-[7px] opacity-40 group-hover/info:opacity-100 transition-opacity">?</div>
                  <div className="absolute right-0 bottom-6 w-48 p-3 bg-void border border-moonlight/20 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50">
                    <p className="text-[8px] tracking-widest text-moonlight leading-relaxed uppercase">
                      名刺交換やログインで蓄積されるエネルギーです。集めておくと、いいこと（限定アセットの交換等）があるかもしれません。
                    </p>
                  </div>
                </div>
             </div>
             <p className="text-xl font-extralight tracking-widest">{userData.rt_balance.toLocaleString()} <span className="text-[8px] opacity-40">RT</span></p>
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
