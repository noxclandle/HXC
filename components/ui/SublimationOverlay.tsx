"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Sparkles } from "lucide-react";

interface SublimationOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  rankName: string;
}

export default function SublimationOverlay({ isVisible, onComplete, rankName }: SublimationOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-void/90 flex flex-col items-center justify-center backdrop-blur-2xl"
          onAnimationComplete={() => {
            setTimeout(onComplete, 5000);
          }}
        >
          {/* Radial Bloom */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 0.3, 0] }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute inset-0 bg-moonlight rounded-full blur-[100px]"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 2, ease: "circOut" }}
            className="relative"
          >
            <img src="/logo.png" alt="Sublimation Logo" className="w-[160px] h-[160px] object-contain drop-shadow-[0_0_50px_rgba(224,224,224,0.5)]" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles size={40} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 text-3xl tracking-[0.6em] uppercase font-extralight text-moonlight"
          >
            Sublimation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 text-[10px] tracking-[0.4em] uppercase opacity-40"
          >
            Your resonance has reached: <span className="text-moonlight opacity-100">{rankName}</span>
          </motion.p>

          <div className="absolute bottom-24 overflow-hidden h-px w-64 bg-moonlight/10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full w-full bg-moonlight shadow-[0_0_10px_white]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
