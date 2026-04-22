"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 翠緑の閃光が画面を駆け、クリックで空間を揺らす「翠緑の衝撃波」が広がる演出
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
    }, 2000);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const id = nextId.current++;
    setTrail((prev) => [...prev.slice(-40), { id, x: e.clientX, y: e.clientY }]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const id = nextId.current++;
    const touch = e.touches[0];
    setTrail((prev) => [...prev.slice(-40), { id, x: touch.clientX, y: touch.clientY }]);
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

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 翠緑の閃光 (Enhanced Trail) */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 2 }}
          animate={{ opacity: 0, scale: 0 }}
          className="absolute w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_20px_#34d399,0_0_40px_#10b981] blur-[0.5px]"
          style={{ left: p.x - 6, top: p.y - 6 }}
        />
      ))}

      {/* 聖域の衝撃波 (Luminous Shockwave) */}
      <AnimatePresence>
        {pulses.map((p) => (
          <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
             {/* Core Flash */}
             <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 -left-5 -top-5 absolute bg-white blur-xl rounded-full"
             />
             
             {/* Primary Shockwave */}
             <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 25, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-20 h-20 -left-10 -top-10 absolute border-[2px] border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.6),inset_0_0_30px_rgba(52,211,153,0.4)] rounded-full"
             />

             {/* Secondary Echo */}
             <motion.div
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 18, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                className="w-20 h-20 -left-10 -top-10 absolute border-[1px] border-emerald-300/50 rounded-full"
             />

             {/* Atmospheric Warp (Distortion Effect) */}
             <motion.div
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 40, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-20 h-20 -left-10 -top-10 absolute bg-emerald-500/5 blur-[60px] rounded-full"
             />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
