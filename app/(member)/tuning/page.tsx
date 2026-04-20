"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Volume2, Shield, Gem } from "lucide-react";

export default function TuningShopPage() {
  const items = [
    { name: "Silver Whisper", type: "Sound", cost: 1000, locked: false },
    { name: "Obsidian Frame", type: "Frame", cost: 2500, locked: true },
    { name: "Chief Officer Aura", type: "Visual", cost: 99999, locked: true },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-24 text-moonlight">
      <header className="mb-16">
        <h1 className="text-2xl tracking-[0.4em] uppercase mb-2">The Exchange</h1>
        <p className="text-[10px] tracking-widest opacity-40 uppercase">Transcendent Tuning Assets</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item, i) => (
          <div 
            key={i}
            className={`p-8 border ${item.locked ? "border-moonlight/5 opacity-40" : "border-moonlight/20"} bg-white/5 relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                 <p className="text-[8px] uppercase opacity-40">{item.type}</p>
                 <h3 className="text-sm tracking-widest uppercase">{item.name}</h3>
               </div>
               {item.locked ? <Lock size={16} className="opacity-40" /> : <Gem size={16} className="text-moonlight animate-pulse" />}
            </div>
            
            <div className="flex justify-between items-end">
               <div className="text-lg font-extralight tracking-tighter italic">
                 {item.cost} <span className="text-[8px] not-italic opacity-40 uppercase ml-1">RT</span>
               </div>
               <button className={`px-6 py-2 text-[9px] uppercase tracking-widest border border-moonlight/20 hover:bg-white/10 transition-all ${item.locked ? "cursor-not-allowed" : ""}`}>
                 {item.locked ? "Restricted" : "Resonate"}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
