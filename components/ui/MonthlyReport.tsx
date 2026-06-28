"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";

export default function MonthlyReport({ stats }: { stats?: any }) {
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    // 日本語形式の年月（例: 2026年6月）を表示
    const date = new Date();
    setCurrentMonth(`${date.getFullYear()}年${date.getMonth() + 1}月`);
  }, []);
  
  const newConnections = stats?.monthly_connections ?? 0;
  const totalContacts = stats?.total_contacts ?? 0;

  // ユーザーの登録状況に応じた分かりやすいステータス説明文
  const getSummaryMessage = () => {
    if (totalContacts === 0) {
      return "名刺がまだ登録されていません。上の「Scan Card」から名刺を撮影して登録を開始してください。 / No contacts registered yet. Tap 'Scan Card' above to start digitizing.";
    }
    if (newConnections === 0) {
      return `現在 ${totalContacts} 枚の名刺が登録されています。今月の新規登録はありません。データは名刺帳からCSV出力が可能です。 / ${totalContacts} contacts registered. No new connections this month.`;
    }
    return `今月は新たに ${newConnections} 名の登録がありました。名刺帳（Library）の管理は順調です。 / ${newConnections} new connections established this month.`;
  };

  return (
    <Link href="/library" className="block transition-all group">
      <div className="p-8 border border-white/5 bg-white/[0.01] backdrop-blur-sm group-hover:border-white/20 transition-all">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2 group-hover:opacity-100 transition-opacity text-white">
            <BarChart3 size={14} /> Contacts Report
          </h3>
          <span className="text-[8px] opacity-20 uppercase tracking-widest font-mono">{currentMonth}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-wider opacity-30">New This Month / 今月の登録</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extralight text-azure-400">+{newConnections}</span>
              {newConnections > 0 && <TrendingUp size={10} className="text-emerald-400 opacity-60 animate-pulse" />}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-wider opacity-30">Total / 名刺の総数</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extralight text-white">{totalContacts}</span>
              <BookOpen size={10} className="text-white/20" />
            </div>
          </div>
        </div>

        <p className="text-[9px] tracking-widest leading-relaxed opacity-45 uppercase border-t border-white/5 pt-6 font-sans">
          {getSummaryMessage()}
        </p>
      </div>
    </Link>
  );
}
