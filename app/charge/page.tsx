"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/ConnectionToast";

const RT_PACKS = [
  { id: "rt_small", price: 1000, rt: 2000, label: "2,000 RT Pack", description: "基本的なポイント補充。1回のアセット購入に。" },
  { id: "rt_medium", price: 5000, rt: 11000, label: "11,000 RT Pack", description: "推奨パック。広範なカスタマイズを可能にします。", popular: true },
  { id: "rt_large", price: 10000, rt: 23000, label: "23,000 RT Pack", description: "最大限の補充。すべてのアイテムを揃える方に。" },
];

export default function SimpleChargePage() {
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCharge = async (packId: string) => {
    setLoadingId(packId);
    try {
      showToast("Processing...", "success");
      const res = await fetch("/api/stripe/rt-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Connection failed.", "error");
      }
    } catch (e) {
      showToast("Gateway error.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-void text-moonlight pt-32 px-6 pb-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/hub" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-16 group">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <header className="mb-24 space-y-4 text-center md:text-left">
          <h1 className="text-3xl tracking-[0.6em] uppercase font-extralight text-white">Buy Points</h1>
          <p className="text-[10px] tracking-[0.3em] opacity-30 uppercase font-bold text-azure-400">Relation Token (RT) の購入</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RT_PACKS.map((pack) => (
            <motion.div
              key={pack.id}
              onClick={() => handleCharge(pack.id)}
              className={`p-8 border bg-white/[0.01] border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer relative overflow-hidden group`}
            >
              {pack.popular && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-azure-500 text-void text-[7px] font-bold tracking-[0.2em] uppercase">Popular</div>
              )}
              
              <div className="space-y-8">
                <div className="space-y-1">
                   <p className="text-[8px] tracking-[0.4em] opacity-30 uppercase font-bold">{pack.label}</p>
                   <h2 className="text-2xl font-light tracking-tighter text-white">
                      {pack.rt.toLocaleString()} <span className="text-xs opacity-20">RT</span>
                   </h2>
                </div>
                
                <p className="text-[10px] tracking-widest opacity-40 leading-relaxed h-12">
                   {pack.description}
                </p>

                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                   <p className="text-lg font-extralight text-white">¥{pack.price.toLocaleString()}</p>
                   {loadingId === pack.id ? <Loader2 size={16} className="animate-spin text-azure-400" /> : <Sparkles size={16} className="opacity-20 group-hover:opacity-100 transition-opacity text-azure-400" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-32 text-center">
           <p className="text-[8px] tracking-[0.4em] opacity-10 uppercase italic">
              Authorized by Hexa Protocol Commerce
           </p>
        </footer>
      </div>
    </main>
  );
}
