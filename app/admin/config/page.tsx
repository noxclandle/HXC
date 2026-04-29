"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Save, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ConfigAdminPage() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config");
        if (res.ok) setPrices(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        body: JSON.stringify(prices)
      });
      if (res.ok) alert("Asset prices synchronized.");
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const updatePrice = (rarity: string, val: number) => {
    setPrices(prev => ({ ...prev, [rarity]: val }));
  };

  if (loading) return <div className="py-32 text-center text-[10px] uppercase tracking-[1em] opacity-20">Loading Parameters...</div>;

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <Link href="/admin" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Oversight
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <Database className="text-azure-400" size={24} /> System Parameters
        </h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase">Economic Config / Dynamic Pricing</p>
      </header>

      <div className="space-y-12">
        <section className="p-10 border border-white/5 bg-white/[0.02] space-y-8">
           <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Sparkles size={16} className="text-azure-400" />
              <h2 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white">Asset Price Configuration (CP)</h2>
           </div>

           <div className="grid grid-cols-1 gap-6">
              {['common', 'rare', 'epic', 'legendary', 'mythic'].map((rarity) => (
                <div key={rarity} className="flex items-center justify-between group">
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">{rarity}</p>
                      <p className="text-[8px] opacity-20 uppercase tracking-widest">Base cost for {rarity} grade assets</p>
                   </div>
                   <div className="relative">
                      <input 
                        type="number" 
                        value={prices[rarity] || 0}
                        onChange={(e) => updatePrice(rarity, Number(e.target.value))}
                        className="bg-white/5 border border-white/10 p-3 w-48 text-right font-mono text-azure-400 outline-none focus:border-azure-500 transition-all"
                      />
                      <span className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-[9px] opacity-20 font-bold">CP</span>
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-8 border-t border-white/5">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-5 bg-azure-600 hover:bg-azure-500 text-white font-bold text-[10px] uppercase tracking-[0.6em] transition-all flex items-center justify-center gap-4 shadow-xl"
              >
                {saving ? "Synchronizing..." : <><Save size={14} /> Commit Parameters</>}
              </button>
           </div>
        </section>

        <section className="p-8 border border-rose-500/20 bg-rose-500/5 flex gap-6 items-start">
           <ShieldAlert size={24} className="text-rose-500 shrink-0" />
           <div className="space-y-2">
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-rose-400">Security Advisory</h3>
              <p className="text-[11px] leading-relaxed opacity-60 italic">
                「価格設定の変更は即座に全てのユーザーの宝物庫（Treasury）に反映されます。急激なインフレやデフレはユーザーのモチベーションに影響するため、慎重に調律してください。」
              </p>
           </div>
        </section>
      </div>
    </div>
  );
}
