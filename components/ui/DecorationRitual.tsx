"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function DecorationRitual({ title, isVisible, onComplete }: { title: string, isVisible: boolean, onComplete: () => void }) {
  // 称号名から色を判定
  const getRitualColor = (title: string) => {
    if (title === "Messenger") return "#4DD0E1"; // 水色
    if (title === "Void Voyager") return "#BA68C8"; // 紫
    if (title === "Headhunter") return "#FFD54F"; // 金
    if (title === "Blood Covenant") return "#E57373"; // 赤
    if (title.includes("Architect") || title.includes("Chief")) return "#4A4A4A"; // 黒グレー
    return "#E0E0E0"; // デフォルト（白銀）
  };

  const ritualColor = getRitualColor(title);

  useEffect(() => {
    if (isVisible) {
      setTimeout(onComplete, 7000);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] bg-void/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center"
        >
          {/* Beams of Light */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {[...Array(6)].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, rotate: i * 60 }}
                 animate={{ opacity: [0, 0.2, 0], scale: [1, 2, 1.5] }}
                 transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                 className="absolute top-1/2 left-1/2 w-[200vw] h-[1px] origin-left"
                 style={{ backgroundColor: ritualColor }}
               />
             ))}
          </div>
          {/* ... (rest of the award UI using ritualColor) ... */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "circOut" }}
            className="relative mb-16"
          >
            <div className="w-32 h-32 border border-moonlight/30 rounded-full flex items-center justify-center relative">
               <Award size={64} style={{ color: ritualColor }} className="animate-pulse" strokeWidth={0.5} />
               <div className="absolute inset-0 border rounded-full animate-ping" style={{ borderColor: ritualColor, boxShadow: `0 0 30px ${ritualColor}` }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-6"
          >
            <h2 className="text-sm tracking-[0.8em] uppercase opacity-40">Divine Bestowal</h2>
            <h1 className="text-4xl tracking-[0.4em] uppercase font-extralight italic text-white drop-shadow-[0_0_10px_white]">
               {title}
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mt-8">
               チーフオフィサーの意志により、あなたの魂は昇華されました。
            </p>
          </motion.div>

          <div className="absolute bottom-24 w-48 h-px bg-moonlight/10 overflow-hidden">
             <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: "100%" }}
               transition={{ duration: 7, ease: "linear" }}
               className="w-full h-full bg-moonlight" 
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
