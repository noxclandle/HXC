"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 翠緑の閃光が画面を駆け、タップで聖域の波動（波紋）が広がる演出
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
    }, 1500);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const id = nextId.current++;
    setTrail((prev) => [...prev.slice(-25), { id, x: e.clientX, y: e.clientY }]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const id = nextId.current++;
    const touch = e.touches[0];
    setTrail((prev) => [...prev.slice(-25), { id, x: touch.clientX, y: touch.clientY }]);
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
      {/* 翠緑の閃光 (Trail) */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.9, scale: 1.5 }}
          animate={{ opacity: 0, scale: 0 }}
          className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] blur-[0.5px]"
          style={{ left: p.x - 4, top: p.y - 4 }}
        />
      ))}

      {/* 聖域の波動 (Ripple Pulse) */}
      <AnimatePresence>
        {pulses.map((p) => (
          <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
             {/* Main Ring */}
             <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 12, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[1px] border-emerald-400/80 rounded-full shadow-[0_0_40px_rgba(52,211,153,0.3)]"
             />
             {/* Secondary Ring */}
             <motion.div
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.05, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[1px] border-emerald-300/40 rounded-full"
             />
             {/* Inner Glow */}
             <motion.div
                initial={{ scale: 0, opacity: 0.4 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute bg-emerald-500/10 blur-xl rounded-full"
             />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
