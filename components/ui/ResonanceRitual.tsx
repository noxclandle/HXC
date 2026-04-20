"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Hexagon } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";
import { useEffect } from "react";

export default function ResonanceRitual({ partnerName, onComplete }: { partnerName: string, onComplete: () => void }) {
  useEffect(() => {
    playResonanceSound("silver"); // 高貴な共鳴音
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-void flex flex-col items-center justify-center p-8 text-center"
      onAnimationComplete={() => setTimeout(onComplete, 4000)}
    >
      {/* Central Resonance Orb */}
      <div className="relative mb-24">
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-moonlight blur-3xl rounded-full"
        />
        <Hexagon size={120} className="text-moonlight relative z-10 animate-pulse" strokeWidth={0.5} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl tracking-[0.5em] uppercase font-extralight italic">Resonating...</h2>
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-40">
           Connecting soul with <span className="text-moonlight opacity-100">{partnerName}</span>
        </p>
      </motion.div>

      {/* Light Stream Animation */}
      <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-moonlight/20 to-transparent animate-shimmer" />

      <footer className="absolute bottom-24">
         <div className="flex gap-1">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.1, 1, 0.1] }}
               transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
               className="w-1 h-1 bg-moonlight rounded-full"
             />
           ))}
         </div>
      </footer>
    </motion.div>
  );
}
