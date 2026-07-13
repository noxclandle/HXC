"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Award, Zap, History, Link2 } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

interface MonthlyReport {
  month: string;
  newConnections: number;
  resonanceCount: number;
  totalTitles: number;
  unlockedTitles: string[];
  weeklyGrowth: number[];
  topTag: string | null;
  topTagCount: number;
}

export default function MonthlyDeepDivePage() {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/report/monthly")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setReport(data))
      .catch((error) => logger.error("Failed to fetch monthly report", { error }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight text-center">
        <p className="text-[10px] uppercase tracking-widest opacity-20 animate-pulse">読み込み中...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight text-center">
        <p className="text-[10px] uppercase tracking-widest opacity-40">レポートの取得に失敗しました。</p>
      </div>
    );
  }

  const maxWeek = Math.max(...report.weeklyGrowth, 1);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16 flex justify-between items-center">
        <div>
          <h1 className="text-2xl tracking-[0.4em] uppercase mb-2">Monthly Deep Dive</h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase italic">{report.month} / 月次分析レポート</p>
        </div>
        <Link href="/hub" className="opacity-40 hover:opacity-100 transition-opacity">
          <ArrowLeft size={20} />
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: "New Connections", value: report.newConnections, icon: <Users size={14} />, jp: "新規の繋がり" },
          { label: "Resonance Established", value: report.resonanceCount, icon: <Link2 size={14} />, jp: "成立した共鳴" },
          { label: "Titles Held", value: report.totalTitles, icon: <Award size={14} />, jp: "保有称号数（累計）" },
        ].map((s, i) => (
          <div key={i} className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm">
             <div className="flex justify-between items-start mb-6 opacity-40">
                {s.icon}
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
          <History size={14} /> Network Evolution (Weekly New Connections)
        </h2>
        <div className="h-16 flex gap-1">
           {report.weeklyGrowth.map((count, i) => (
              <div key={i} className="flex-1 bg-white/5 relative">
                 <motion.div
                   initial={{ height: 0 }}
                   animate={{ height: `${(count / maxWeek) * 100}%` }}
                   className="absolute bottom-0 w-full bg-cyan-500/30"
                 />
                 <span className="absolute -top-5 w-full text-center text-[8px] opacity-40 font-mono">{count}</span>
              </div>
           ))}
        </div>
        <div className="flex justify-between mt-4 text-[7px] uppercase tracking-widest opacity-20">
           <span>4 Weeks Ago</span>
           <span>This Week</span>
        </div>
      </div>

      {/* Focus of the Month */}
      <div className="p-12 border border-moonlight/10 bg-gothic-dark/10 relative overflow-hidden mb-24">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Award size={120} strokeWidth={0.5} />
        </div>
        <h2 className="text-[9px] tracking-[0.5em] uppercase opacity-30 mb-8 font-bold">Focus of the Month (今月の総括)</h2>
        <div className="space-y-4 relative z-10">
           {report.topTag ? (
             <>
               <h3 className="text-xl tracking-[0.2em] uppercase font-light text-white">{report.topTag}</h3>
               <p className="text-[11px] tracking-widest opacity-60 leading-relaxed uppercase">
                 今月追加した繋がりのうち、「{report.topTag}」タグが最も多く付けられました（{report.topTagCount}件）。
               </p>
             </>
           ) : (
             <p className="text-[11px] tracking-widest opacity-40 leading-relaxed uppercase">
               今月はまだ十分なデータがありません。新しい繋がりを追加してみましょう。
             </p>
           )}
        </div>
      </div>

      <div className="space-y-12">
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
          <Zap size={14} /> Held Titles (保有している称号)
        </h2>
        <div className="space-y-4">
           {report.unlockedTitles.length === 0 ? (
             <p className="text-[9px] uppercase tracking-widest opacity-20 italic">まだ称号を獲得していません。</p>
           ) : report.unlockedTitles.map((title) => (
             <div key={title} className="p-6 border border-moonlight/5 bg-white/5 flex justify-between items-center group hover:border-moonlight/20 transition-all">
                <div className="space-y-1">
                   <p className="text-sm tracking-[0.2em] uppercase">{title}</p>
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
