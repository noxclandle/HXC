"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, Clock, Trash2, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default function ReportsAdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/report/list");
      if (res.ok) setReports(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/report/resolve`, {
        method: "POST",
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchReports();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-6xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <Link href="/admin" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> 管理ハブへ戻る
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <ShieldAlert className="text-rose-500" size={24} /> System Reports
        </h1>
        <p className="text-[10px] tracking-widest text-rose-500 opacity-40 uppercase font-bold">インシデント監視 / コミュニティ安全管理</p>
      </header>

      {loading ? (
        <div className="py-32 text-center text-[10px] uppercase tracking-[1em] opacity-20">アーカイブをスキャン中...</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-6 p-4 border-b border-white/10 text-[9px] uppercase tracking-[0.3em] opacity-40 font-bold mb-2">
             <div className="col-span-2">報告対象</div>
             <div className="col-span-2">理由</div>
             <div>ステータス</div>
             <div className="text-right">操作</div>
          </div>

          <AnimatePresence>
            {reports.map((r) => (
              <motion.div 
                key={r.id} 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-6 p-6 bg-white/[0.02] border border-white/[0.05] hover:border-rose-500/20 transition-all items-center"
              >
                <div className="col-span-2 flex items-center gap-4">
                   <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/5 opacity-40">
                      <User size={16} />
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white">{r.targetName}</p>
                      <p className="text-[8px] opacity-20 font-mono mt-1">{r.targetId}</p>
                   </div>
                </div>
                <div className="col-span-2">
                   <p className="text-[10px] tracking-widest opacity-60 leading-relaxed pr-8 line-clamp-2">
                      {r.reason}
                   </p>
                </div>
                <div>
                   <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 border ${r.status === 'pending' ? 'border-amber-500/30 text-amber-500' : 'border-emerald-500/30 text-emerald-500'}`}>
                      {r.status === 'pending' ? '保留中' : '解決済み'}
                   </span>
                </div>
                <div className="text-right">
                   {r.status === 'pending' ? (
                      <button 
                        onClick={() => handleResolve(r.id)}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-[8px] uppercase tracking-widest hover:bg-emerald-500 hover:text-void hover:border-emerald-500 transition-all font-bold"
                      >
                         解決済みにする
                      </button>
                   ) : (
                      <div className="text-emerald-500/40 p-2"><CheckCircle size={16} className="ml-auto" /></div>
                   )}
                </div>
              </motion.div>
            ))}
            {reports.length === 0 && (
               <div className="py-24 text-center border border-dashed border-white/5 opacity-20 text-[10px] uppercase tracking-[0.5em]">現在、報告されているインシデントはありません。</div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
