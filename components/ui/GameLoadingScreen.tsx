"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

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
            
            {/* HXC Logo Center Circle (Enlarged) */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              {/* Outer rotating dashed ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-azure-500/20 rounded-full"
              />
              {/* Pulsing glow background for the logo */}
              <div className="absolute inset-6 bg-azure-500/5 rounded-full blur-md animate-pulse" />
              
              {/* HXC Logo */}
              <motion.div
                animate={{ 
                  scale: [1, 1.04, 1],
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative w-20 h-20 z-10"
              >
                <Image 
                  src="/logo.png"
                  alt="HXC Logo"
                  width={80}
                  height={80}
                  priority
                  className="object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.25)]"
                />
              </motion.div>
            </div>

            {/* Title & Cyber Logs */}
            <div className="space-y-2">
              <h2 className="text-[10px] tracking-[0.6em] text-white font-light uppercase">HEXA SYSTEM</h2>
              <p className="text-[7px] tracking-[0.3em] text-azure-400 font-mono uppercase animate-pulse">{statusText}</p>
            </div>

            {/* Horizontal Progress Bar with Running Character (Enlarged & Re-aligned) */}
            <div className="space-y-2 relative pt-6">
              {/* Running Character on top of the progress bar */}
              <motion.div 
                className="absolute w-10 h-10 -top-4 z-20 pointer-events-none"
                style={{ 
                  left: `calc(${progress}% - 20px)`,
                  transition: "left 0.1s linear" 
                }}
              >
                <Image 
                  src="/image-removebg-preview.png"
                  alt="Running Loading Character"
                  width={40}
                  height={40}
                  priority
                  className="object-contain"
                />
              </motion.div>

              <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-azure-400 to-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[7px] font-mono tracking-widest text-white/30 pt-1.5">
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
