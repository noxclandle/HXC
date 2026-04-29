"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, CreditCard, Activity, Database, TrendingUp, ShieldCheck, ArrowRight, Shield, BookOpen, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) setStats(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "有効な ID ユニット", value: stats?.activeUsers || "0", icon: <Users size={16} />, trend: "登録済みユーザー" },
    { label: "発行済み物理カード", value: stats?.issuedCards || "0", icon: <CreditCard size={16} />, trend: "物理資産" },
    { label: "総流通トークン (RT)", value: Number(stats?.totalCP || 0).toLocaleString(), icon: <TrendingUp size={16} />, trend: "RT 経済圏" },
    { label: "プロトコル完全性", value: "正常", icon: <ShieldCheck size={16} />, trend: "100% 稼働" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2">Central Oversight</h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase italic font-bold">Hexa Protocol / 管理ハブ</p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {statCards.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }} 
            className="p-8 border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 border border-white/10 text-azure-400/60">{s.icon}</div>
              <span className="text-[7px] text-azure-400 font-bold tracking-[0.2em] uppercase">{s.trend}</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">{s.label}</p>
            <p className="text-3xl font-extralight tracking-tighter text-white">
               {loading ? "---" : s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Control Hub Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: "ユーザー登録簿", path: "/admin/users", icon: <Shield size={18}/>, desc: "データベース管理 & 権限付与" },
          { label: "システム告知", path: "/admin/news", icon: <Activity size={18}/>, desc: "全ユーザー向け通知の発信" },
          { label: "インシデント報告", path: "/admin/reports", icon: <ShieldAlert size={18}/>, desc: "ユーザーからの不具合・違反報告" },
          { label: "アセット大典", path: "/admin/compendium", icon: <BookOpen size={18}/>, desc: "称号・フレーム等の獲得条件管理" },
          { label: "カード中央台帳", path: "/admin/ledger", icon: <Layers size={18}/>, desc: "物理カードの登録 & ペアリング" },
          { label: "システム構成", path: "/admin/config", icon: <Database size={18}/>, desc: "価格設定 & 内部パラメータ" },
        ].map((link) => (
          <Link 
            key={link.path} href={link.path} 
            className="p-8 border border-white/10 bg-white/[0.03] hover:border-azure-500/40 hover:bg-azure-500/[0.02] transition-all group relative overflow-hidden"
          >
             <div className="mb-4 text-azure-400 opacity-40 group-hover:opacity-100 transition-opacity">{link.icon}</div>
             <p className="text-[11px] tracking-[0.4em] uppercase mb-2 text-white font-bold">{link.label}</p>
             <p className="text-[8px] opacity-20 uppercase tracking-widest leading-relaxed mb-6">{link.desc}</p>
             <div className="flex items-center gap-2 text-[7px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all text-azure-400 font-bold">
                Access Archives <ArrowRight size={10} />
             </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
              <Database size={14} /> Latest System Ledger (最新の取引履歴)
            </h2>
            <Link href="/admin/ledger" className="text-[8px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity">すべて表示</Link>
          </div>
          <div className="space-y-1">
             {loading ? (
               <div className="py-12 text-center text-[10px] opacity-10 uppercase tracking-[1em]">Scanning Registry...</div>
             ) : (
               stats?.recentTransactions?.map((t: any, i: number) => (
                 <div key={i} className="p-5 bg-white/[0.01] border border-white/[0.03] flex justify-between items-center hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-6">
                      <span className="text-[8px] opacity-20 font-mono">#{t.id}</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-white/80">{t.userName}</span>
                        <span className="text-[8px] opacity-30 uppercase">{t.description}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[11px] font-mono font-bold ${t.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()} RT
                       </p>
                       <p className="text-[7px] opacity-20 uppercase mt-1">{new Date(t.date).toLocaleString()}</p>
                    </div>
                 </div>
               ))
             )}
          </div>
        </section>
      </div>
    </div>
  );
}
