"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Zap, Lock, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

interface RuleStatus {
  id: string;
  label: string;
  desc: string;
  limit: string;
  blocked24h: number;
  allowed24h: number;
}

interface SecurityStatus {
  rules: RuleStatus[];
  totalBlocked24h: number;
  activeConnections: number | null;
  lockdown: boolean;
}

export default function AdminSecurityPage() {
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/security");
      if (res.ok) setStatus(await res.json());
    } catch (error) {
      logger.error("Failed to fetch security status", { error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleLockdownToggle = async () => {
    if (!status) return;
    const nextEnabled = !status.lockdown;
    const message = nextEnabled
      ? "本当にシステムをロックダウンしますか？管理画面以外の全アクセスが遮断されます。"
      : "ロックダウンを解除しますか？通常アクセスが再開されます。";
    if (!confirm(message)) return;

    setToggling(true);
    try {
      const res = await fetch("/api/admin/security/lockdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: nextEnabled }),
      });
      if (res.ok) {
        await fetchStatus();
      } else {
        const data = await res.json();
        alert(data.error || "切り替えに失敗しました。");
      }
    } catch (error) {
      logger.error("Failed to toggle lockdown", { error });
      alert("通信エラーが発生しました。");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-12">
        <Link href="/admin" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
           <ArrowLeft size={12} /> Return to Hub / 管理ハブへ戻る
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-6">
           <div>
              <h1 className="text-2xl lg:text-3xl tracking-[0.5em] uppercase font-light mb-2">Security Command</h1>
              <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase italic font-bold">Protocol Integrity / セキュリティ司令室</p>
           </div>
           <div className="flex items-center gap-4">
              {status?.lockdown ? (
                <div className="px-4 py-2 border border-rose-500/40 bg-rose-500/10 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                   <span className="text-[9px] tracking-[0.3em] font-bold text-rose-400 uppercase">Lockdown Active</span>
                </div>
              ) : (
                <div className="px-4 py-2 border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                   <span className="text-[9px] tracking-[0.3em] font-bold text-emerald-400 uppercase">System Secure</span>
                </div>
              )}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Rules List */}
        <div className="lg:col-span-8 space-y-8">
           <section>
              <h2 className="text-[11px] tracking-[0.4em] uppercase opacity-30 mb-6 font-bold flex items-center gap-3">
                 <Lock size={12} /> Active Rate-Limit Protocols
              </h2>
              <div className="grid grid-cols-1 gap-4">
                 {loading ? (
                    <p className="text-[9px] uppercase tracking-widest opacity-20 animate-pulse">読み込み中...</p>
                 ) : status?.rules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:border-azure-500/30 transition-all"
                    >
                       <div className="space-y-1">
                          <p className="text-[10px] tracking-[0.3em] text-azure-400 font-bold">{rule.label}</p>
                          <p className="text-xs text-white opacity-80">{rule.desc}</p>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[10px] font-mono tracking-tighter text-white/40 group-hover:text-azure-300 transition-colors">{rule.limit}</p>
                          <p className="text-[8px] tracking-widest text-rose-400 font-bold uppercase">{rule.blocked24h} blocked / 24h</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </section>

           <section className="p-8 border border-rose-500/10 bg-rose-500/[0.02] space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                 <ShieldAlert size={18} />
                 <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold">Threat Detection Rules / 脅威検知ルール</h3>
              </div>
              <p className="text-[10px] leading-relaxed text-white/50 tracking-widest uppercase">
                 以下の挙動を検知した場合、システムは自動的にIPアドレスを一時的、または永続的に隔離プロトコルへ送ります。
              </p>
              <ul className="space-y-2 text-[9px] tracking-widest text-white/40 list-disc list-inside">
                 <li>短時間（1秒以内）の連続したAPIリクエスト</li>
                 <li>存在しないエンドポイントへの執拗なアクセス（ディレクトリ・トラバーサル）</li>
                 <li>不当に長いペイロードの送信（バッファオーバーフロー試行）</li>
                 <li>同一端末からの複数アカウント同時登録</li>
              </ul>
           </section>
        </div>

        {/* Monitoring Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
           <div className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-bold">Live Monitoring</h3>
                 <button onClick={fetchStatus} title="再取得">
                   <RefreshCcw size={12} className="opacity-40 hover:opacity-100 transition-opacity" />
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase tracking-widest opacity-30">
                       <span>Active DB Connections</span>
                       <span>{status?.activeConnections ?? "—"}</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase tracking-widest opacity-30">
                       <span>Blocked Attempts (24h)</span>
                       <span>{status?.totalBlocked24h ?? "—"}</span>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <p className="text-[8px] uppercase tracking-widest text-emerald-400 leading-relaxed italic flex items-center gap-2">
                    <ShieldCheck size={10} /> External Monitoring: Sentry Active
                 </p>
                 <a
                   href="https://hexarelation.sentry.io/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="mt-2 block text-[7px] text-azure-400 hover:text-white transition-colors tracking-[0.2em] uppercase font-bold"
                 >
                    Access Sentry Console →
                 </a>
              </div>
           </div>

           <div className={`p-8 border text-center space-y-4 ${status?.lockdown ? "bg-rose-600/10 border-rose-600/40" : "bg-azure-500/10 border-azure-500/20"}`}>
              <Zap size={24} className={`mx-auto opacity-60 ${status?.lockdown ? "text-rose-400" : "text-azure-400"}`} />
              <p className="text-[10px] tracking-[0.3em] uppercase text-white font-bold">Emergency Protocol</p>
              <button
                onClick={handleLockdownToggle}
                disabled={loading || toggling}
                className={`w-full py-3 border text-[9px] tracking-[0.5em] uppercase font-bold transition-all disabled:opacity-30 ${
                  status?.lockdown
                    ? "bg-emerald-600/20 border-emerald-600/40 text-emerald-500 hover:bg-emerald-600 hover:text-white"
                    : "bg-rose-600/20 border-rose-600/40 text-rose-500 hover:bg-rose-600 hover:text-white"
                }`}
              >
                 {status?.lockdown ? "Lift Lockdown" : "System Lockdown"}
              </button>
              <p className="text-[7px] text-white/30 uppercase tracking-widest">
                {status?.lockdown ? "管理画面以外の全アクセスを遮断中" : "全アクセスを強制遮断（最終手段）"}
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
