"use client";

import { motion } from "framer-motion";
import { Lock, CreditCard, ShieldCheck, Zap } from "lucide-react";

export default function CheckoutPage() {
  const items = [
    { name: "Alias Contract", desc: "偽名の結界（別名名刺機能）の解放", price: "¥2,000", id: "alias" },
    { name: "Black Tier Sublimation", desc: "ブラックカード保有者への昇華権利", price: "¥10,000", id: "black" },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16 border-b border-moonlight/10 pb-8 text-center">
        <h1 className="text-xl tracking-[0.6em] uppercase flex items-center justify-center gap-4">
          <Lock className="text-moonlight opacity-40" size={20} />
          The Threshold
        </h1>
        <p className="text-[9px] tracking-widest opacity-20 uppercase mt-4">Transcend your current existence.</p>
      </header>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="p-8 border border-moonlight/5 bg-gothic-dark/20 flex justify-between items-center group relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-sm tracking-[0.4em] uppercase mb-2">{item.name}</h3>
              <p className="text-[10px] tracking-widest opacity-40">{item.desc}</p>
            </div>
            
            <div className="flex flex-col items-end relative z-10">
               <span className="text-xl font-extralight italic mb-4">{item.price}</span>
               <button className="px-8 py-3 bg-moonlight text-void text-[9px] font-bold uppercase tracking-widest opacity-60 cursor-not-allowed">
                  RESTRICTED
               </button>
            </div>

            {/* Locked Visual Overlay */}
            <div className="absolute inset-0 bg-void/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex flex-col items-center gap-2">
                 <Lock size={20} className="opacity-40" />
                 <span className="text-[8px] tracking-[0.5em] uppercase opacity-40">Awaiting Ritual Authorization</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-24 text-center opacity-10 text-[8px] tracking-[0.5em] uppercase leading-relaxed">
        Payments are currently disabled.<br />Rituals must be authorized by the Chief Officer.
      </footer>
    </div>
  );
}
