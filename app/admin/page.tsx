"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, Activity, Database, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { label: "稼働ユーザー (Active Users)", value: "128", icon: <Users size={16} />, trend: "+12%" },
    { label: "カード発行数 (Cards Issued)", value: "512", icon: <CreditCard size={16} />, trend: "85% 稼働中" },
    { label: "流通ポイント (Total Points Flow)", value: "1.2M", icon: <TrendingUp size={16} />, trend: "高" },
    { label: "システム状態 (System Status)", value: "安全", icon: <ShieldCheck size={16} />, trend: "100%" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight">
      <header className="mb-16">
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2">Oversight Center</h1>
        <p className="text-[10px] tracking-widest text-gothic-silver opacity-40 uppercase italic">管理司令塔・コントロールセンター</p>
      </header>

      {/* Admin Monthly Insight Summary */}
      <div className="mb-12 p-8 border border-moonlight/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80} /></div>
        <h2 className="text-[9px] tracking-[0.4em] uppercase opacity-40 mb-4">Master Insight (月次概況)</h2>
        <p className="text-[11px] tracking-widest leading-relaxed uppercase">
          今月は新規カードの稼働率が <span className="text-white font-bold">12% 向上</span> しました。特にビジネスイベントでの利用が活発化しており、ネットワークの熱量は安定しています。
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }} 
            className="p-8 border border-moonlight/10 bg-gothic-dark/10 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 border border-moonlight/20 text-moonlight/40">{s.icon}</div>
              <span className="text-[8px] text-emerald-400 font-mono tracking-widest">{s.trend}</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">{s.label}</p>
            <p className="text-3xl font-extralight tracking-tighter">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Control Hub Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: "台帳 (Ledger)", path: "/admin/ledger", desc: "物理カードの登録・管理" },
          { label: "操作ログ (Logs)", path: "/admin/logs", desc: "全ユーザーの行動履歴の監視" },
          { label: "人脈図 (Graph)", path: "/admin/graph", desc: "ネットワークの視覚化" },
          { label: "全権編集 (Override)", path: "/admin/override", desc: "情報の強制修正・ポイント付与" },
          { label: "称号事典 (Compendium)", path: "/admin/compendium", desc: "称号の取得条件とランク管理" },
          { label: "予約タスク (Tasks)", path: "/admin/tasks", desc: "布告やボーナスのスケジュール管理" },
        ].map((link) => (
          <Link 
            key={link.path} 
            href={link.path} 
            className="p-6 border border-moonlight/10 bg-gothic-dark/20 hover:border-moonlight/40 hover:bg-white/5 transition-all group"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2 group-hover:text-white transition-colors">{link.label}</p>
            <p className="text-[8px] opacity-20 uppercase tracking-widest leading-relaxed">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
            <TrendingUp size={14} /> Top Connectors (活動ランキング)
          </h2>
          <div className="space-y-1">
             {[
               { name: "Sera", contacts: 42, rt: "24.5K", trend: "上昇" },
               { name: "Kenta", contacts: 28, rt: "12.0K", trend: "安定" },
             ].map((u, i) => (
               <div key={i} className="p-4 border border-moonlight/5 bg-gothic-dark/5 flex justify-between items-center hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] opacity-20 font-mono">0{i+1}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] tracking-widest uppercase font-bold">{u.name}</span>
                      <span className="text-[7px] opacity-30 uppercase">{u.contacts} Connections</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-moonlight">{u.rt} Points</span>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
            <Activity size={14} /> System Events (最新イベント)
          </h2>
          <div className="border border-moonlight/5 bg-gothic-dark/5">
             {[1, 2, 3].map((_, i) => (
               <div key={i} className="p-4 border-b border-moonlight/5 flex justify-between items-center">
                  <span className="text-[10px] tracking-widest uppercase">New User Registration</span>
                  <span className="text-[8px] opacity-40 uppercase">2m ago</span>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
