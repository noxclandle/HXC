"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 聖域の共鳴演出
 * シャープな六角形の残光と、凝縮された結晶波動を生成する
 */
export default function ResonanceInteraction() {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  const addPulse = (x: number, y: number) => {
    const id = nextId.current++;
    setPulses((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setPulses((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const id = nextId.current++;
    setTrail((prev) => [...prev.slice(-30), { id, x: e.clientX, y: e.clientY }]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const id = nextId.current++;
    const touch = e.touches[0];
    setTrail((prev) => [...prev.slice(-30), { id, x: touch.clientX, y: touch.clientY }]);
  };

  const handleMouseDown = (e: MouseEvent) => {
    addPulse(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    addPulse(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  // より鋭利な正六角形のパス
  const hexPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 翠緑の六角形残光 (Hex Trail) */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1.5, rotate: 0 }}
          animate={{ opacity: 0, scale: 0, rotate: 45 }}
          className="absolute w-3 h-3 bg-emerald-400 shadow-[0_0_12px_#34d399]"
          style={{ 
            left: p.x - 6, 
            top: p.y - 6,
            clipPath: hexPath
          }}
        />
      ))}

      {/* 六角形の結晶波動 (Hex Crystal Pulse) */}
      <AnimatePresence>
        {pulses.map((p) => (
          <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
             {/* Core Crystal */}
             <motion.div
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{ scale: 2.5, opacity: 0, rotate: 60 }}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 -left-5 -top-5 absolute bg-white/60 backdrop-blur-sm"
                style={{ clipPath: hexPath }}
             />
             
             {/* Main Hex Wave - サイズを縮小(scale 10) */}
             <motion.div
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{ scale: 10, opacity: 0, rotate: -30 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[2px] border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                style={{ clipPath: hexPath }}
             />

             {/* Outward Ring (Hex) */}
             <motion.div
                initial={{ scale: 0, opacity: 0.5, rotate: 0 }}
                animate={{ scale: 7, opacity: 0, rotate: 30 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[1px] border-emerald-300/40"
                style={{ clipPath: hexPath }}
             />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
