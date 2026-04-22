"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 画面をなぞるとネオンの光が走り、タップで波紋が広がる演出
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
    setTrail((prev) => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY }]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const id = nextId.current++;
    const touch = e.touches[0];
    setTrail((prev) => [...prev.slice(-15), { id, x: touch.clientX, y: touch.clientY }]);
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
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* ネオンの軌跡 (Trail) */}
      {trail.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          className="absolute w-2 h-2 rounded-full bg-emerald-400/30 blur-[2px]"
          style={{ left: p.x - 4, top: p.y - 4 }}
        />
      ))}

      {/* タップ時の波紋 (Pulse) */}
      <AnimatePresence>
        {pulses.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-20 h-20 border border-emerald-500/40 rounded-full blur-[4px]"
            style={{ left: p.x - 40, top: p.y - 40 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
