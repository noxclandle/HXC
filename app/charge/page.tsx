"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

const RT_PACKS = [
  { id: "pack_1000", amount: 2000, price: 1000, label: "Minor Resonance", desc: "基本的な調律と1回のアセット召喚に。" },
  { id: "pack_5000", amount: 11000, price: 5000, label: "Significant Pulse", desc: "深層との強い同期。5回分の召喚エネルギー。", popular: true },
  { id: "pack_10000", amount: 23000, price: 10000, label: "Grand Vibration", desc: "長期的な活動を支える膨大なエネルギー。" },
];

export default function ChargePage() {
  const [selectedPack, setSelectedPack] = useState(RT_PACKS[1]);
  const [loading, setLoading] = useState(false);

  const handleCharge = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/rt-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: selectedPack.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate charge.");
      }
    } catch (e) {
      console.error(e);
      alert("Network Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-void text-moonlight pt-32 px-6 pb-40 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/hub" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-16 group">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Sanctum
        </Link>

        <header className="mb-24 space-y-4">
          <h1 className="text-3xl tracking-[0.6em] uppercase font-extralight text-white">Charge Resonance</h1>
          <p className="text-[10px] tracking-[0.3em] opacity-30 uppercase font-bold text-azure-400">Relation Token の補充</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RT_PACKS.map((pack) => (
            <motion.div
              key={pack.id}
              onClick={() => setSelectedPack(pack)}
              className={`p-8 border transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                selectedPack.id === pack.id ? 'bg-white/[0.05] border-white/40' : 'bg-white/[0.01] border-white/5 hover:border-white/20'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-azure-500 text-void text-[7px] font-bold tracking-[0.2em] uppercase">Recommended</div>
              )}
              
              <div className="space-y-8">
                <div className="space-y-1">
                   <p className="text-[8px] tracking-[0.4em] opacity-30 uppercase font-bold">{pack.label}</p>
                   <h2 className="text-2xl font-light tracking-tighter text-white">
                      {pack.amount.toLocaleString()} <span className="text-xs opacity-20">RT</span>
                   </h2>
                </div>
                
                <p className="text-[10px] tracking-widest opacity-40 leading-relaxed h-12">
                   {pack.desc}
                </p>

                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                   <p className="text-lg font-extralight text-white">¥{pack.price.toLocaleString()}</p>
                   {selectedPack.id === pack.id && <Check size={16} className="text-azure-400" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 border border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-2 text-center md:text-left">
              <p className="text-[9px] tracking-[0.4em] opacity-30 uppercase font-bold">Selected Protocol</p>
              <div className="flex items-baseline gap-4 justify-center md:justify-start">
                 <span className="text-xl tracking-widest text-white uppercase font-light">{selectedPack.amount.toLocaleString()} RT</span>
                 <span className="text-sm opacity-20 italic">for ¥{selectedPack.price.toLocaleString()}</span>
              </div>
           </div>
           
           <button 
             onClick={handleCharge}
             disabled={loading}
             className="px-16 py-5 bg-white text-void text-[11px] font-bold tracking-[0.8em] uppercase shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
           >
             {loading ? "Establishing..." : "Authorize Charge"}
           </button>
        </div>

        <footer className="mt-32 text-center space-y-4">
           <p className="text-[9px] tracking-[0.3em] opacity-20 uppercase leading-relaxed max-w-xs mx-auto italic">
              &quot;Energy is finite. Presence is eternal.&quot;
           </p>
        </footer>
      </div>
    </main>
  );
}
