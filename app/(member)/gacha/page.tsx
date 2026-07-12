"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Box, RefreshCw, AlertCircle } from "lucide-react";
import { playConnectionSound } from "@/lib/audio/resonance";
import { getRarityColor, Asset } from "@/lib/game/assets";

export default function GachaPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Asset | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGacha = async () => {
    setIsSpinning(true);
    setResult(null);
    setError(null);
    setIsDuplicate(false);
    playConnectionSound("void");

    try {
      const res = await fetch("/api/gacha", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resonate with the Void.");
      }

      // 演出のために少し待つ
      setTimeout(() => {
        setIsSpinning(false);
        setResult(data.item);
        setIsDuplicate(data.isDuplicate);
        playConnectionSound(data.item.rarity === "mythic" ? "void" : data.item.rarity === "epic" ? "silver" : "default");
      }, 2500);

    } catch (error: unknown) {
      setIsSpinning(false);
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight text-center">
      <header className="mb-24">
        <h1 className="text-2xl tracking-[0.6em] uppercase font-extralight mb-4">Ethereal Gacha / 霊的召喚</h1>
        <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase italic">Spend 500 RT to summon a fragment of the soul / 500 RTを消費して、魂の破片を召喚します。</p>
      </header>

      <div className="relative h-80 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!result && !isSpinning && !error && (
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
                onClick={handleGacha}
                className="px-16 py-5 bg-moonlight text-void text-[11px] font-bold tracking-[0.8em] uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(224,224,224,0.2)]"
              >
                Summon / 召喚する
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
              <p className="text-[10px] tracking-[0.6em] animate-pulse">Resonating with the Void... / 境界と同調中...</p>
            </motion.div>
          )}

          {error && (
             <motion.div
               key="error"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center gap-6"
             >
               <AlertCircle size={48} className="text-rose-500 opacity-50" />
               <p className="text-[10px] tracking-[0.4em] text-rose-500/80 uppercase">{error}</p>
               <button 
                 onClick={() => setError(null)}
                 className="text-[9px] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity underline underline-offset-8"
               >
                 Try Again / 再試行
               </button>
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
                  style={{ backgroundColor: getRarityColor(result.rarity) }}
                />
                <Sparkles size={80} className="relative z-10" style={{ color: getRarityColor(result.rarity) }} />
              </div>
              <div className="space-y-2 mb-12">
                <p className={`text-[8px] tracking-[0.4em] uppercase font-bold mb-2`}>{result.rarity}</p>
                <h2 className="text-xl tracking-[0.4em] uppercase">{result.name}</h2>
                <p className="text-[10px] tracking-[0.2em] opacity-40 max-w-xs mx-auto">{result.description}</p>
              </div>
              
              {isDuplicate && (
                <p className="text-[9px] tracking-[0.3em] text-azure-400 uppercase mb-8 animate-pulse">
                  Duplicate Identity // 200 RT Refunded / 重複する存在 // 200 RT 返還
                </p>
              )}

              <p className="text-[9px] tracking-[0.2em] opacity-40 mb-12">New asset bound to your soul record. / 新たなアセットが魂の記録に紐付けられました。</p>
              <button 
                onClick={() => setResult(null)}
                className="text-[9px] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity underline underline-offset-8"
              >
                Return to Altar / 祭壇へ戻る
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
