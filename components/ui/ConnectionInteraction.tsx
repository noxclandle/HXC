"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 軌跡 (Pointer) システムの構造改革:
 * Safariでのフリーズ（焼き付き）を防ぐため、常時稼働するCanvasを完全に廃止。
 * 代わりに、タップ/クリック時のみ軽量なDOMアニメーションを生成する方式へ移行。
 */
export default function ConnectionInteraction() {
  const { data: session } = useSession();
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [color, setColor] = useState("#FFFFFF");

  const fetchPointerStyle = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const equippedPointer = data.equipped?.pointer || "Pure White Hex";
        
        switch (equippedPointer) {
          case "Azure Trace": setColor("#3B82F6"); break;
          case "Emerald Pulse": setColor("#10B981"); break;
          case "Ruby Flare": setColor("#F43F5E"); break;
          case "Gold Trace": setColor("#F59E0B"); break;
          case "Violet Connection": setColor("#8B5CF6"); break;
          case "Crimson Ember": setColor("#EF4444"); break;
          case "Shadow Trace": setColor("#111111"); break;
          case "Prism Trace": setColor("rgba(255,255,255,0.8)"); break;
          case "Void Trace": setColor("#000000"); break;
          default: setColor("#FFFFFF");
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (session) fetchPointerStyle();
    const handleAssetsUpdated = () => fetchPointerStyle();
    window.addEventListener("hxc-assets-updated", handleAssetsUpdated);

    const handleAction = (e: MouseEvent | TouchEvent) => {
      let x, y;
      if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }

      const id = Date.now();
      setPulses((prev) => [...prev.slice(-5), { id, x, y }]);
      
      // 自動削除
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    };

    window.addEventListener("mousedown", handleAction, { passive: true });
    window.addEventListener("touchstart", handleAction, { passive: true });

    return () => {
      window.removeEventListener("hxc-assets-updated", handleAssetsUpdated);
      window.removeEventListener("mousedown", handleAction);
      window.removeEventListener("touchstart", handleAction);
    };
  }, [session]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {pulses.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 0, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-12 h-12 -ml-6 -mt-6 border-2 rotate-45"
            style={{ borderColor: color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
