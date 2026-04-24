"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

/**
 * 純白の六角形相互作用 (Pure White Hex Resonance) + Dynamic Color Sync
 * 装備中の「軌跡(Pointer)」アセットと色彩をリアルタイムに同期させる
 */
export default function ResonanceInteraction() {
  const { data: session } = useSession();
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pointerColor, setPointerColor] = useState("#FFFFFF");
  const nextId = useRef(0);

  const fetchColor = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const equippedPointer = data.equipped?.pointer || "Pure White Hex";
        switch (equippedPointer) {
          case "Azure Trace": setPointerColor("#3B82F6"); break; // 蒼
          case "Emerald Hex": setPointerColor("#10B981"); break; // 翠
          case "Bronze Trace": setPointerColor("#B48B5E"); break; // 琥珀
          default: setPointerColor("#FFFFFF"); // 白
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (session) fetchColor();

    // 宝物庫での変更を即座に検知するリスナー
    const handleAssetsUpdated = () => {
      fetchColor();
    };
    window.addEventListener("hxc-assets-updated", handleAssetsUpdated);
    return () => window.removeEventListener("hxc-assets-updated", handleAssetsUpdated);
  }, [session]);

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

  const hexPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 同期された色の六角形残光 */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1.2, rotate: 0 }}
          animate={{ opacity: 0, scale: 0, rotate: 45 }}
          className="absolute w-2.5 h-2.5"
          style={{ 
            left: p.x - 5, 
            top: p.y - 5,
            clipPath: hexPath,
            backgroundColor: pointerColor,
            boxShadow: `0 0 12px ${pointerColor}`
          }}
        />
      ))}

      {/* 同期された色の硬質六角波動 */}
      <AnimatePresence>
        {pulses.map((p) => (
          <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
             {/* 中心フラッシュ */}
             <motion.div
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{ scale: 2, opacity: 0, rotate: 30 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 -left-5 -top-5 absolute"
                style={{ clipPath: hexPath, backgroundColor: pointerColor }}
             />
             
             {/* メイン波動 */}
             <motion.div
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{ scale: 8, opacity: 0, rotate: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[2px]"
                style={{ 
                  clipPath: hexPath, 
                  borderColor: pointerColor,
                  boxShadow: `0 0 20px ${pointerColor}80` 
                }}
             />

             {/* セカンダリエコー */}
             <motion.div
                initial={{ scale: 0, opacity: 0.4, rotate: 0 }}
                animate={{ scale: 6, opacity: 0, rotate: 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
                className="w-16 h-16 -left-8 -top-8 absolute border-[1px]"
                style={{ clipPath: hexPath, borderColor: pointerColor }}
             />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
