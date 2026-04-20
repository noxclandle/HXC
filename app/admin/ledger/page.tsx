"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, CreditCard, RotateCcw, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LedgerPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ uid: "", serial: "" });

  const fetchLedger = async () => {
    try {
      const res = await fetch("/api/admin/card/list");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const toggleStatus = async (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    // UIを即時更新（楽観的アップデート）
    setCards(cards.map(c => c.uid === uid ? { ...c, status: nextStatus } : c));
    
    try {
      await fetch("/api/admin/card/update-status", {
        method: "POST",
        body: JSON.stringify({ uid, status: nextStatus })
      });
    } catch (e) {
      fetchLedger(); // エラー時は再取得
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-400";
      case "suspended": return "text-amber-500";
      case "void": return "text-rose-500";
      default: return "text-moonlight/40";
    }
  };

  const createSlot = async () => {
    if (!newCard.uid || !newCard.serial) return;
    try {
      const res = await fetch("/api/admin/card/create", {
        method: "POST",
        body: JSON.stringify(newCard)
      });
      if (res.ok) {
        fetchLedger();
        setNewCard({ uid: "", serial: "" });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create slot.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-12 border-b border-moonlight/10 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
            <CreditCard className="text-moonlight opacity-40" size={20} />
            Central Asset Ledger
          </h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase mt-2">中央台帳：物理カードの登録と管理</p>
        </div>
        <a href="/docs/NTAG_SETUP_GUIDE.md" target="_blank" className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline underline-offset-8">Setup Manual</a>
      </header>

      {/* Slot Creation Form */}
      <section className="mb-16 p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-md">
        <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 font-bold">Create New Card Slot (新規カード枠の作成)</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-1">
            <label className="text-[8px] uppercase opacity-30 tracking-widest">Physical UID</label>
            <input
              type="text" placeholder="04:A2:3F:..." value={newCard.uid}
              onChange={(e) => setNewCard({ ...newCard, uid: e.target.value })}
              className="w-full bg-void border border-moonlight/10 p-3 text-xs tracking-widest outline-none focus:border-moonlight transition-all uppercase"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[8px] uppercase opacity-30 tracking-widest">Serial Number</label>
            <input
              type="text" placeholder="HXC-2026-XXXX" value={newCard.serial}
              onChange={(e) => setNewCard({ ...newCard, serial: e.target.value })}
              className="w-full bg-void border border-moonlight/10 p-3 text-xs tracking-widest outline-none focus:border-moonlight transition-all uppercase"
            />
          </div>
          <div className="flex items-end">
            <button onClick={createSlot} className="px-12 py-3 bg-moonlight text-void text-[10px] font-bold uppercase tracking-[0.6em] hover:bg-white transition-all shadow-xl">Create</button>
          </div>
        </div>
      </section>

      {/* Table Headers */}
      <div className="grid grid-cols-5 p-6 border-b border-moonlight/10 text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-bold bg-white/5">
         <div>UID</div>
         <div>Serial Number</div>
         <div>Status</div>
         <div>Linked Identity</div>
         <div className="text-right">Action</div>
      </div>

      {/* Ledger Rows */}
      <div className="space-y-1">
        {loading ? (
          <div className="py-24 text-center animate-pulse text-[10px] uppercase opacity-20 tracking-widest">Synchronizing Registry...</div>
        ) : (
          <AnimatePresence>
            {cards.map((c) => (
              <motion.div
                key={c.uid}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-5 p-6 bg-gothic-dark/10 border border-transparent hover:border-moonlight/10 transition-all text-xs font-mono items-center"
              >
                <div className="tracking-widest">{c.uid}</div>
                <div className="opacity-60">{c.serial}</div>
                <div className={`uppercase text-[10px] tracking-[0.2em] font-sans font-bold ${statusColor(c.status)}`}>{c.status}</div>
                <div className="opacity-40 font-sans uppercase text-[10px] tracking-widest">{c.user}</div>
                <div className="flex justify-end gap-6">
                   {c.status !== "unissued" && (
                     <button 
                       onClick={() => toggleStatus(c.uid, c.status)}
                       className="flex items-center gap-2 text-[8px] uppercase tracking-widest border border-moonlight/20 px-4 py-1.5 hover:bg-white/5 transition-all group"
                     >
                       {c.status === "active" ? <Lock size={10} className="opacity-40 group-hover:opacity-100" /> : <RotateCcw size={10} className="opacity-40 group-hover:opacity-100" />}
                       {c.status === "active" ? "Suspend" : "Resume"}
                     </button>
                   )}
                   <button className="text-rose-500/40 hover:text-rose-500 transition-colors"><ShieldAlert size={16} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
