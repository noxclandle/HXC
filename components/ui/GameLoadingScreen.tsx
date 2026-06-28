"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function GameLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM...");

  useEffect(() => {
    // ゲーム感を演出するサイバー調の起動ログ
    const texts = [
      "CONNECTING TO HXC NODE...",
      "RETRIEVING IDENTITY MATRIX...",
      "DECRYPTING SECURE CHANNELS...",
      "LOADING VISUAL ASSETS...",
      "SYNCHRONIZING RESONANCE..."
    ];
    
    let textIdx = 0;
    const textInterval = setInterval(() => {
      if (textIdx < texts.length - 1) {
        textIdx++;
        setStatusText(texts[textIdx]);
      }
    }, 300);

    // プログレスバーの進行アニメーション
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          // 100%に達した0.4秒後にフェードアウトを開始
          setTimeout(() => setVisible(false), 400);
          return 100;
        }
        // 最初はランダムに進み、後半（50%以降）は少し細かく進む
        const increment = prev < 50 ? Math.floor(Math.random() * 12) + 8 : Math.floor(Math.random() * 4) + 2;
        return Math.min(prev + increment, 100);
      });
    }, 70);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-void z-[9999] flex flex-col items-center justify-center select-none pointer-events-none"
        >
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_75%)]" />

          <div className="w-full max-w-xs space-y-8 text-center z-10 px-6">
            {/* Geometric Rotating Emblem */}
            <div className="relative w-14 h-14 mx-auto mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-azure-500/20 rounded-xl"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-white/5 rounded-lg flex items-center justify-center"
              >
                <Sparkles className="text-azure-400/50 animate-pulse" size={14} />
              </motion.div>
            </div>

            {/* Title & Cyber Logs */}
            <div className="space-y-2">
              <h2 className="text-[10px] tracking-[0.6em] text-white font-light uppercase">HEXA SYSTEM</h2>
              <p className="text-[7px] tracking-[0.3em] text-azure-400 font-mono uppercase animate-pulse">{statusText}</p>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-azure-400 to-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[7px] font-mono tracking-widest text-white/30">
                <span>LOADING NOW...</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Bottom Branding & Version specs */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[6px] tracking-widest font-mono text-white/15 uppercase">
            <span>SECURE RESONANCE LINK v2.5</span>
            <span>SYSTEM ACTIVE</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
