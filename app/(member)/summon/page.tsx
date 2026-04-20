"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Box, RefreshCw } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

export default function GachaPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rarityColor, setRarityColor] = useState("rgba(224, 224, 224, 0.5)");

  const handleSummon = () => {
    setIsSpinning(true);
    setResult(null);
    playResonanceSound("void");

    setTimeout(() => {
      setIsSpinning(false);
      const items = [
        { name: "Silver Frame", rarity: "common", color: "rgba(224, 224, 224, 0.5)" },
        { name: "Obsidian Frame", rarity: "rare", color: "rgba(255, 215, 0, 0.5)" },
        { name: "Starlight Sound", rarity: "common", color: "rgba(224, 224, 224, 0.5)" },
        { name: "Golden Aura", rarity: "rare", color: "rgba(255, 215, 0, 0.5)" }
      ];
      const win = items[Math.floor(Math.random() * items.length)];
      setResult(win.name);
      setRarityColor(win.color);
      playResonanceSound(win.rarity === "rare" ? "silver" : "default");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight text-center">
      <header className="mb-24">
        <h1 className="text-2xl tracking-[0.6em] uppercase font-extralight mb-4">Ethereal Summon</h1>
        <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase italic">Spend 500 RT to summon a fragment of the soul.</p>
      </header>

      <div className="relative h-80 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!result && !isSpinning && (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="w-32 h-32 border border-moonlight/20 flex items-center justify-center relative">
                 <Box size={40} className="opacity-20" />
                 <div className="absolute inset-0 border border-moonlight/10 animate-slow-spin" />
              </div>
              <button 
                onClick={handleSummon}
                className="px-16 py-5 bg-moonlight text-void text-[11px] font-bold tracking-[0.8em] uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(224,224,224,0.2)]"
              >
                Summon
              </button>
            </motion.div>
          )}

          {isSpinning && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <RefreshCw size={64} className="animate-spin opacity-20 mb-8" />
              <p className="text-[10px] tracking-[0.6em] animate-pulse">Resonating with the Void...</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-12 relative">
                <motion.div 
                  animate={{ scale: [1, 2, 1.5], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 blur-3xl rounded-full"
                  style={{ backgroundColor: rarityColor }}
                />
                <Sparkles size={80} className="relative z-10" style={{ color: rarityColor }} />
              </div>
              <h2 className="text-xl tracking-[0.4em] uppercase mb-4">{result}</h2>
              <p className="text-[10px] tracking-[0.2em] opacity-40 mb-12">New asset bound to your soul record.</p>
              <button 
                onClick={() => setResult(null)}
                className="text-[9px] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity underline underline-offset-8"
              >
                Return to Alter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-48 text-[8px] tracking-[0.5em] opacity-10 uppercase italic">
        &quot;Fortune favors the resonate.&quot;
      </footer>
    </div>
  );
}
