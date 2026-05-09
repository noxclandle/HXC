"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

/**
 * 軌跡 (Pointer) アセットの色彩と形状をリアルタイムに同期させる
 * 10種類のポインターをフル実装
 */
export default function ResonanceInteraction() {
  const { data: session } = useSession();
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const [config, setPointerConfig] = useState({ color: "#FFFFFF", size: 10, shape: "hex" });
  const nextId = useRef(0);

  const fetchPointerStyle = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const equippedPointer = data.equipped?.pointer || "Pure White Hex";
        
        switch (equippedPointer) {
          case "Azure Trace": setPointerConfig({ color: "#3B82F6", size: 10, shape: "hex" }); break;
          case "Emerald Pulse": setPointerConfig({ color: "#10B981", size: 10, shape: "hex" }); break;
          case "Ruby Flare": setPointerConfig({ color: "#F43F5E", size: 12, shape: "star" }); break;
          case "Gold Trace": setPointerConfig({ color: "#F59E0B", size: 10, shape: "hex" }); break;
          case "Violet Resonance": setPointerConfig({ color: "#8B5CF6", size: 10, shape: "hex" }); break;
          case "Crimson Ember": setPointerConfig({ color: "#EF4444", size: 14, shape: "flare" }); break;
          case "Shadow Trace": setPointerConfig({ color: "#111111", size: 18, shape: "ink" }); break;
          case "Prism Trace": setPointerConfig({ color: "rgba(255,255,255,0.8)", size: 12, shape: "prism" }); break;
          case "Void Trace": setPointerConfig({ color: "#000000", size: 20, shape: "tear" }); break;
          default: setPointerConfig({ color: "#FFFFFF", size: 8, shape: "hex" });
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (session) fetchPointerStyle();
    const handleAssetsUpdated = () => fetchPointerStyle();
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
    setTrail((prev) => [...prev.slice(-25), { id, x: e.clientX, y: e.clientY }]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const id = nextId.current++;
    const touch = e.touches[0];
    setTrail((prev) => [...prev.slice(-25), { id, x: touch.clientX, y: touch.clientY }]);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", (e) => addPulse(e.clientX, e.clientY));
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", (e) => addPulse(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const getClipPath = (shape: string) => {
    if (shape === "hex") return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
    if (shape === "star") return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    if (shape === "flare") return "circle(50% at 50% 50%)";
    if (shape === "ink") return "circle(50% at 50% 50%)"; // Ink uses blur
    return "none";
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {trail.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          className="absolute"
          style={{ 
            left: p.x, top: p.y,
            width: config.size, height: config.size,
            marginLeft: -config.size/2, marginTop: -config.size/2,
            clipPath: getClipPath(config.shape),
            backgroundColor: config.color,
            filter: config.shape === "ink" ? "blur(8px)" : config.shape === "prism" ? "hue-rotate(360deg)" : "none",
            boxShadow: `0 0 15px ${config.color}`,
            border: config.shape === "tear" ? "1px solid white" : "none"
          }}
          transition={{ duration: 0.5 }}
        />
      ))}

      <AnimatePresence>
        {pulses.map((p) => (
          <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
             <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 -left-4 -top-4 absolute border"
                style={{ 
                  borderRadius: config.shape === "hex" ? "0%" : "50%",
                  clipPath: getClipPath(config.shape),
                  borderColor: config.color,
                  boxShadow: `0 0 20px ${config.color}`
                }}
             />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
