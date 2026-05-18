"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, Activity, Database, TrendingUp, ShieldCheck, ArrowRight, Shield, BookOpen, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  stats: {
    activeUsers: string;
    issuedCards: string;
    totalCP: string;
  };
  reportCount: number;
}

export default function AdminDashboardClient({ stats, reportCount }: AdminDashboardClientProps) {
  const statCards = [
    { label: "有効な ID ユニット", value: stats.activeUsers, icon: <Users size={16} />, trend: "登録済みユーザー" },
    { label: "発行済み物理カード", value: stats.issuedCards, icon: <CreditCard size={16} />, trend: "物理資産" },
    { label: "総流通トークン (RT)", value: Number(stats.totalCP).toLocaleString(), icon: <TrendingUp size={16} />, trend: "RT 経済圏" },
    { label: "プロトコル完全性", value: "正常", icon: <ShieldCheck size={16} />, trend: "100% 稼働" },
  ];

  const adminLinks = [
    { label: "ユーザー登録簿", path: "/admin/users", icon: <Shield size={18}/>, desc: "データベース管理 & 権限付与" },
    { label: "システム告知", path: "/admin/news", icon: <Activity size={18}/>, desc: "全ユーザー向け通知の発信" },
    { 
      label: "インシデント報告", 
      path: "/admin/reports", 
      icon: (
        <div className="relative">
          <ShieldAlert size={18}/>
          {reportCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </div>
      ), 
      desc: "ユーザーからの不具合・違反報告",
      alert: reportCount > 0
    },
    { label: "アセット大典", path: "/admin/items", icon: <BookOpen size={18}/>, desc: "称号・フレーム等の獲得条件管理" },
    { label: "カード中央台帳", path: "/admin/registry", icon: <Layers size={18}/>, desc: "物理カードの登録 & ペアリング" },
    { label: "発行・登録手順", path: "/admin/onboarding", icon: <ShieldCheck size={18}/>, desc: "新規ユーザー・カード発行プロトコル" },
    { label: "システム構成", path: "/admin/config", icon: <Database size={18}/>, desc: "価格設定 & 内部パラメータ" },
    { label: "セキュリティ司令室", path: "/admin/security", icon: <ShieldCheck size={18}/>, desc: "レートリミット & 不正アクセス監視" },
    { label: "システム実行ログ", path: "/admin/logs", icon: <Database size={18}/>, desc: "全管理操作の証跡記録" },
    { label: "データバックアップ", path: "/api/admin/backup/export", icon: <Layers size={18}/>, desc: "全データのJSONエクスポート" },
  ];

  return (
    <>
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
               {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Control Hub Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {adminLinks.map((link) => (
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
    </>
  );
}
