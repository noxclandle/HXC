"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 純白の六角形相互作用 (Pure White Hex Resonance)
 * 硬質な正六角形の結晶が画面を切り裂き、クリックで鋭い幾何学波動を放つ
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
    }, 1000);
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

  // より完璧な正六角形のパス
  const hexPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 純白の六角形残光 (White Hex Trail) */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1.2, rotate: 0 }}
          animate={{ opacity: 0, scale: 0, rotate: 45 }}
          className="absolute w-2.5 h-2.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ 
            left: p.x - 5, 
            top: p.y - 5,
            clipPath: hexPath
          }}
        />
      ))}

      {/* 純白の硬質六角波動 (Pure White Crystal Pulse) */}
      <AnimatePresence>
        {pulses.map((p) => (
          <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
             {/* 中心フラッシュ (Hard White) */}
             <motion.div
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{ scale: 2, opacity: 0, rotate: 30 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 -left-5 -top-5 absolute bg-white"
                style={{ clipPath: hexPath }}
             />
             
             {/* メイン波動 (Hard Border Hex) - サイズをさらに抑制し密度向上 */}
             <motion.div
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{ scale: 8, opacity: 0, rotate: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[2px] border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                style={{ clipPath: hexPath }}
             />

             {/* セカンダリエコー (White Wireframe) */}
             <motion.div
                initial={{ scale: 0, opacity: 0.4, rotate: 0 }}
                animate={{ scale: 6, opacity: 0, rotate: 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[1px] border-white/50"
                style={{ clipPath: hexPath }}
             />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
