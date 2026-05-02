"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Terminal, Radio, ArrowLeft, ShieldAlert, User, Globe } from "lucide-react";
import Link from "next/link";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs");
      if (res.ok) setLogs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes("ERROR") || action.includes("DENIED") || action.includes("REPORT"))
      return "text-rose-500 border-rose-500/20 bg-rose-500/5";
    if (action.includes("UPDATE") || action.includes("CREATE"))
      return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (action.includes("GRANT") || action.includes("AUTH"))
      return "text-azure-400 border-azure-500/20 bg-azure-500/5";
    return "text-white/40 border-white/10 bg-white/5";
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div>
          <Link
            href="/admin"
            className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8"
          >
            <ArrowLeft size={12} /> 管理ハブへ戻る
          </Link>
          <h1 className="text-2xl tracking-[0.6em] uppercase flex items-center gap-4">
            <Terminal className="text-azure-400" size={20} />
            Chief&apos;s Gaze
          </h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase mt-2 font-bold italic">
            Audit Logs / リアルタイム監査ログ
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 border border-azure-500/20 bg-azure-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-azure-500 animate-pulse" />
            <span className="text-[9px] tracking-widest uppercase text-azure-400 font-bold">
              Live Monitoring
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
              <Activity size={14} /> Historical Records
            </h2>
            <button
              onClick={fetchLogs}
              className="text-[8px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity"
            >
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-12 p-4 border-b border-white/5 text-[8px] uppercase tracking-[0.3em] opacity-30 font-bold">
            <div className="col-span-3">アクション / 区分</div>
            <div className="col-span-3">実行ユーザー</div>
            <div className="col-span-4">詳細 / ペイロード</div>
            <div className="col-span-2 text-right">タイムスタンプ</div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-[10px] uppercase tracking-[1em] opacity-20">
              Scanning Registry...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/5 opacity-20 text-[10px] uppercase tracking-[0.5em]">
              No logs found in the archives.
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-12 p-5 bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] transition-all items-center"
                  >
                    <div className="col-span-3">
                      <span
                        className={`px-3 py-1 border text-[9px] tracking-widest font-bold uppercase ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-6 h-6 border border-white/10 rounded-full flex items-center justify-center text-[8px] opacity-40">
                        {log.user ? log.user.name[0] : <Globe size={10} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] tracking-widest text-white/80">
                          {log.user?.name || "SYSTEM"}
                        </span>
                        <span className="text-[8px] opacity-20 font-mono">
                          {log.ip_address || "Internal"}
                        </span>
                      </div>
                    </div>
                    <div
                      className="col-span-4 text-[10px] tracking-wider opacity-40 truncate pr-8 font-sans"
                      title={JSON.stringify(log.details)}
                    >
                      {typeof log.details === "string"
                        ? log.details
                        : JSON.stringify(log.details)}
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-[10px] font-mono text-white/60">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                      <p className="text-[8px] opacity-20 font-mono mt-1">
                        {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <aside className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-500" /> Security Feed
            </h2>
            <div className="p-6 border border-rose-500/10 bg-rose-500/[0.02] space-y-4">
              <p className="text-[9px] tracking-[0.2em] leading-relaxed text-rose-400/60 uppercase">
                不正なアクセス試行や例外エラーはここに集約されます。
              </p>
              <div className="space-y-3 pt-4">
                {logs
                  .filter(
                    (l) =>
                      l.action.includes("DENIED") || l.action.includes("ERROR")
                  )
                  .slice(0, 3)
                  .map((l, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 border-l border-rose-500/20 pl-4 py-1"
                    >
                      <span className="text-[8px] font-bold text-rose-500">
                        {l.action}
                      </span>
                      <span className="text-[7px] opacity-40 font-mono">
                        {new Date(l.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                {logs.filter(
                  (l) =>
                    l.action.includes("DENIED") || l.action.includes("ERROR")
                ).length === 0 && (
                  <p className="text-[8px] tracking-widest opacity-20 italic">
                    No threats detected.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
              <Radio size={14} /> Master Proclamations
            </h2>
            <div className="space-y-4">
              {[
                {
                  msg: "Welcome to the First Phase.",
                  date: "2026.04.17",
                  target: "All",
                },
                {
                  msg: "RT distribution for Early Birds.",
                  date: "2026.04.15",
                  target: "Black Tier",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="p-6 border border-white/5 bg-white/[0.01] space-y-4 hover:bg-white/[0.03] transition-all group"
                >
                  <p className="text-[10px] tracking-widest leading-relaxed italic opacity-40 group-hover:opacity-80 transition-opacity">
                    &quot;{p.msg}&quot;
                  </p>
                  <div className="flex justify-between items-center text-[7px] tracking-widest uppercase opacity-20">
                    <span>To: {p.target}</span>
                    <span>{p.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
