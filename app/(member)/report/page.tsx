"use client";

import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Calendar, Award, Zap, History } from "lucide-react";
import Link from "next/link";

export default function MonthlyDeepDivePage() {
  const stats = {
    month: "April 2026",
    newConnections: 12,
    meetingsCount: 8,
    growthRate: "+24%",
    topLocation: "Tokyo Tech Summit",
    unlockedTitles: ["Messenger", "Headhunter"]
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16 flex justify-between items-center">
        <div>
          <h1 className="text-2xl tracking-[0.4em] uppercase mb-2">Monthly Deep Dive</h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase italic">月次分析レポート</p>
        </div>
        <Link href="/dashboard" className="opacity-40 hover:opacity-100 transition-opacity">
          <ArrowLeft size={20} />
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: "New Connections", value: stats.newConnections, icon: <Users size={14} />, detail: stats.growthRate, jp: "新規の繋がり" },
          { label: "Events Attended", value: stats.meetingsCount, icon: <Calendar size={14} />, detail: stats.topLocation, jp: "参加イベント数" },
          { label: "Titles Bestowed", value: stats.unlockedTitles.length, icon: <Award size={14} />, detail: "New Milestone", jp: "獲得した称号" },
        ].map((s, i) => (
          <div key={i} className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm">
             <div className="flex justify-between items-start mb-6 opacity-40">
                {s.icon}
                <span className="text-[8px] font-mono">{s.detail}</span>
             </div>
             <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">{s.label}</p>
             <p className="text-3xl font-extralight mb-2">{s.value}</p>
             <p className="text-[7px] uppercase tracking-widest opacity-20">{s.jp}</p>
          </div>
        ))}
      </section>

      {/* Network Evolution (Timeline) */}
      <div className="mb-24">
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-12 flex items-center gap-2">
          <History size={14} /> Network Evolution (Weekly Growth)
        </h2>
        <div className="space-y-4">
           {["Executive", "Technical"].map((type) => (
             <div key={type} className="space-y-1">
                <p className="text-[7px] uppercase tracking-widest opacity-20">{type} Trend</p>
                <div className="h-4 flex gap-1">
                   {[15, 30, 25, 45, 60, 55, 80].map((h, i) => (
                     <div key={i} className="flex-1 bg-white/5 relative">
                        <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className={`absolute bottom-0 w-full ${type === 'Executive' ? 'bg-amber-500/20' : 'bg-cyan-500/20'}`} />
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
        <div className="flex justify-between mt-4 text-[7px] uppercase tracking-widest opacity-20">
           <span>Week 1</span>
           <span>Week 4</span>
        </div>
      </div>

      {/* Focus of the Month */}
      <div className="p-12 border border-moonlight/10 bg-gothic-dark/10 relative overflow-hidden mb-24">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Award size={120} strokeWidth={0.5} />
        </div>
        <h2 className="text-[9px] tracking-[0.5em] uppercase opacity-30 mb-8 font-bold">Focus of the Month (今月の総括)</h2>
        <div className="space-y-4 relative z-10">
           <h3 className="text-xl tracking-[0.2em] uppercase font-light text-white">Strategic Alliance</h3>
           <p className="text-[11px] tracking-widest opacity-60 leading-relaxed uppercase">
             今月は経営層との繋がりが飛躍的に伸びました。この繋がりを足がかりに、次月はさらに上の階層へのアプローチが期待されます。
           </p>
        </div>
      </div>

      <div className="space-y-12">
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
          <Zap size={14} /> Notable Accomplishments (主な実績)
        </h2>
        <div className="space-y-4">
           {stats.unlockedTitles.map((title) => (
             <div key={title} className="p-6 border border-moonlight/5 bg-white/5 flex justify-between items-center group hover:border-moonlight/20 transition-all">
                <div className="space-y-1">
                   <p className="text-sm tracking-[0.2em] uppercase">{title}</p>
                   <p className="text-[8px] opacity-30 uppercase tracking-widest">Unlocked during this cycle</p>
                </div>
                <div className="px-4 py-1 border border-moonlight/20 text-[7px] tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">Verified</div>
             </div>
           ))}
        </div>
      </div>

      <footer className="mt-32 text-center opacity-10 text-[8px] tracking-[0.5em] uppercase italic">
        &quot;Reflecting on the past to define the future.&quot;
      </footer>
    </div>
  );
}
