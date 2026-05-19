"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/ConnectionToast";

export default function HiddenRTMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isCollecting, setIsCollecting] = useState(false);
  const { showToast } = useToast();

  const spawnFragment = useCallback(() => {
    // 画面のランダムな位置（端すぎないように10-90%の間）
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    setPosition({ x, y });
    setIsVisible(true);

    // 15秒間放置されたら消える
    setTimeout(() => {
      setIsVisible(false);
    }, 15000);
  }, []);

  useEffect(() => {
    // 最初のチェック
    const initialDelay = 30000 + Math.random() * 60000; // 30s - 90s
    
    const timer = setTimeout(() => {
      // 5%の確率で出現チェック（1分ごと）
      const interval = setInterval(() => {
        if (!isVisible && Math.random() < 0.05) {
          spawnFragment();
        }
      }, 60000);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [isVisible, spawnFragment]);

  const collect = async () => {
    if (isCollecting) return;
    setIsCollecting(true);

    try {
      const res = await fetch("/api/user/hidden-rt", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        showToast(`Fragment Observed / 断片を観測しました (+${data.amount} RT)`, "success");
        window.dispatchEvent(new CustomEvent("rt-grace-received"));
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVisible(false);
      setIsCollecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: -20 }}
          style={{ 
            left: `${position.x}%`, 
            top: `${position.y}%`,
            position: 'fixed'
          }}
          className="z-[400] cursor-pointer group"
          onClick={collect}
        >
          <div className="relative">
            {/* Outer Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 bg-azure-400 rounded-full blur-xl"
            />
            
            {/* Core Particle */}
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff] relative z-10">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute -inset-2 border border-azure-500/30 rounded-full border-dashed"
               />
            </div>

            {/* Hint Text (Optional, very subtle) */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-[7px] tracking-[0.3em] uppercase text-azure-400 font-bold bg-void/80 px-2 py-1 backdrop-blur-sm">Observe Fragment</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
