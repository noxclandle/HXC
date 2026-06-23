"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 軌跡 (Pointer) システムの進化的統合:
 * 1. Safariフリーズを防ぐため、常時動くCanvasを全廃。
 * 2. 装備アイテムの価値を守るため、タップ時に「固有の形状（四角・六角）」が弾ける演出を実装。
 * 3. アニメーションはSafariに最適化されたDOMベースで行う。
 */
export default function ConnectionInteraction() {
  const { data: session } = useSession();
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number; color: string; shape: string }[]>([]);
  const [currentStyle, setCurrentStyle] = useState({ color: "#FFFFFF", shape: "hex" });

  const fetchPointerStyle = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const equippedPointer = data.equipped?.pointer || "Pure White Hex";
        
        // アイテムIDをlib/game/assets.tsの定義と完全に一致させる
        switch (equippedPointer) {
          case "Azure Trace": setCurrentStyle({ color: "#3B82F6", shape: "hex" }); break;
          case "Emerald Trace": setCurrentStyle({ color: "#10B981", shape: "hex" }); break;
          case "Ruby Trace": setCurrentStyle({ color: "#F43F5E", shape: "square" }); break;
          case "Gold Trace": setCurrentStyle({ color: "#F59E0B", shape: "hex" }); break;
          case "Violet Trace": setCurrentStyle({ color: "#8B5CF6", shape: "hex" }); break;
          case "Crimson Trace": setCurrentStyle({ color: "#EF4444", shape: "square" }); break;
          case "Shadow Trace": setCurrentStyle({ color: "#111111", shape: "square" }); break;
          case "Prism Trace": setCurrentStyle({ color: "rgba(255,255,255,0.8)", shape: "hex" }); break;
          case "Void Trace": setCurrentStyle({ color: "#000000", shape: "square" }); break;
          case "Nebula Trace": setCurrentStyle({ color: "#a855f7", shape: "hex" }); break;
          case "Solar Trace": setCurrentStyle({ color: "#f97316", shape: "square" }); break;
          default: setCurrentStyle({ color: "#FFFFFF", shape: "hex" });
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    // セッションがない場合は何もしない
    if (!session?.user) return;
    
    fetchPointerStyle();
    const handleAssetsUpdated = () => fetchPointerStyle();
    window.addEventListener("hxc-assets-updated", handleAssetsUpdated);

    const handleAction = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number;
      try {
        if (e instanceof MouseEvent) {
          x = e.clientX;
          y = e.clientY;
        } else if (e instanceof TouchEvent && e.touches && e.touches[0]) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        } else {
          return;
        }

        const id = Date.now() + Math.random(); // ユニーク性を保証
        setPulses((prev) => [...prev.slice(-8), { id, x, y, ...currentStyle }]);
        
        const timer = setTimeout(() => {
          setPulses((prev) => prev.filter((p) => p.id !== id));
        }, 800);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Interaction error:", err);
      }
    };

    window.addEventListener("mousedown", handleAction, { passive: true });
    window.addEventListener("touchstart", handleAction, { passive: true });

    return () => {
      window.removeEventListener("hxc-assets-updated", handleAssetsUpdated);
      window.removeEventListener("mousedown", handleAction);
      window.removeEventListener("touchstart", handleAction);
    };
  }, [session, currentStyle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {pulses.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 0, x: p.x, y: p.y, rotate: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 2.5, 
              rotate: p.shape === "hex" ? 90 : 180,
              y: p.y - 40 // 少し上に浮かび上がる演出
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`absolute -ml-6 -mt-6 border-2 ${p.shape === "hex" ? "clip-path-hex" : ""}`}
            style={{ 
              borderColor: p.color,
              width: "48px",
              height: "48px",
              // 六角形をCSSで表現
              clipPath: p.shape === "hex" ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" : "none"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
