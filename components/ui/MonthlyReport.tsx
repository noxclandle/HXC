"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function MonthlyReport() {
  const report = {
    month: "April 2026",
    newConnections: 12,
    topTag: "High-Value",
    summary: "今月は経営層との繋がりが30%増加しました。あなたのネットワークはより強固なものへと進化しています。"
  };

  return (
    <Link href="/report" className="block transition-all group">
      <div className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm group-hover:border-moonlight/30">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2 group-hover:opacity-100 transition-opacity">
            <BarChart3 size={14} /> Monthly Insight
          </h3>
          <span className="text-[8px] opacity-20 uppercase tracking-widest">{report.month}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-[8px] uppercase opacity-30">New Links</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extralight">+{report.newConnections}</span>
              <TrendingUp size={10} className="text-emerald-400 opacity-60" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] uppercase opacity-30">Main Essence</p>
            <span className="text-[10px] tracking-widest uppercase text-moonlight/80">{report.topTag}</span>
          </div>
        </div>

        <p className="text-[10px] tracking-widest leading-relaxed opacity-40 uppercase italic border-t border-moonlight/5 pt-6">
          &quot;{report.summary}&quot;
        </p>
      </div>
    </Link>
  );
}
