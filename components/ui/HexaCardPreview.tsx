"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Hexagon, Zap, Shield, Rotate3d, ShieldCheck, Sparkles } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

interface HexaCardProps {
  name: string;
  uid: string;
  rt: string;
  personality: string;
  aura: number;
  frame?: string;
  onFlip?: (isFlipped: boolean) => void;
}

/**
 * HXC 究極の名刺プレビュー
 * 次次元への反転モーションと、物理的な重厚感を追求。
 */
export default function HexaCardPreview({ name, uid, rt, personality, aura, frame = "Obsidian", onFlip }: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateYBase = useTransform(x, [-100, 100], [-15, 15]);
  const finalRotateY = useTransform(rotateYBase, (val) => val + (isFlipped ? 180 : 0));

  // 回転中の中間点（90度付近）での発光強度
  const glowOpacity = useTransform(finalRotateY, [0, 90, 180], [0, 1, 0]);

  const handleFlip = () => {
    if (isRotating) return;
    setIsRotating(true);
    
    // 音響効果の再生
    playResonanceSound(isFlipped ? "silver" : "resonance");
    
    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
    
    // モーション完了後にフラグを下ろす
    setTimeout(() => setIsRotating(false), 800);
  };

  const getFrameStyle = () => {
    switch (frame) {
      case "Gold": return "border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)]";
      case "Dynamic": return "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]";
      default: return "border-moonlight/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]";
    }
  };

  return (
    <div 
      className="relative w-full max-w-md aspect-[1.6/1] cursor-pointer"
      style={{ perspective: "2500px" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={handleFlip}
    >
      <motion.div
        style={{ 
          rotateX, 
          rotateY: finalRotateY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%"
        }}
        animate={{ scale: isRotating ? 0.92 : 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        {/* 回転中の中間発光層（次元の裂け目） */}
        <motion.div 
          style={{ 
            opacity: glowOpacity,
            rotateY: 90,
            backfaceVisibility: "hidden"
          }}
          className="absolute inset-0 bg-emerald-400/40 blur-3xl z-20 pointer-events-none"
        />

        {/* 【表面】The Monolith */}
        <div 
          className={`absolute inset-0 bg-void overflow-hidden p-8 flex flex-col justify-between border ${getFrameStyle()}`}
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            zIndex: isFlipped ? 0 : 1
          }}
        >
          {/* Aura Background */}
          <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${aura/200}), transparent)` }} />
          
          <header className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md">
                  <ShieldCheck size={28} className={frame === "Dynamic" ? "text-emerald-400" : "text-moonlight/40"} />
               </div>
               <div>
                 <h3 className="text-[7px] tracking-[0.4em] uppercase opacity-30">Entity Registered</h3>
                 <p className="text-[6px] tracking-[0.2em] opacity-10 mb-1">登録済みの実体</p>
                 <p className="text-2xl tracking-[0.2em] uppercase font-extralight text-white">{name}</p>
               </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
               <span className="text-[8px] tracking-[0.4em] uppercase opacity-20 font-bold italic">Authenticated</span>
               <div className="flex items-center gap-2 text-emerald-400 text-[9px] tracking-widest uppercase">
                 <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                 Ready / 待機中
               </div>
            </div>
          </header>

          <footer className="relative z-10 flex justify-between items-end">
            <div className="space-y-4">
              <div>
                <h3 className="text-[8px] tracking-[0.4em] uppercase opacity-30">Hardware UID</h3>
                <p className="font-mono text-[9px] tracking-[0.2em] text-moonlight/60">{uid}</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-1 border border-white/5 bg-white/5 rounded-full w-fit">
                 <Shield size={10} className="opacity-40" />
                 <span className="text-[7px] uppercase tracking-[0.3em] opacity-60">{personality} Mode</span>
              </div>
            </div>
            <div className="flex flex-col items-end opacity-20 group-hover:opacity-40 transition-opacity">
               <Rotate3d size={16} className="animate-pulse" />
               <span className="text-[6px] uppercase tracking-widest mt-1">Flip Card / 反転</span>
            </div>
          </footer>
        </div>

        {/* 【裏面】The Resonance */}
        <div 
          className={`absolute inset-0 bg-gothic-dark p-8 flex flex-col justify-center items-center text-center border ${getFrameStyle()}`}
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 1 : 0
          }}
        >
          {/* Digital Wax Seal (Hex-Seal) */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div 
                initial={{ scale: 2, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-32 h-32 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm relative flex items-center justify-center" style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}>
                   <Hexagon size={48} className="text-emerald-500/40 animate-pulse" />
                   <motion.div 
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                     className="absolute inset-0 border border-emerald-400/30" 
                     style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", transform: "scale(0.85)" }}
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-10 relative z-10">
            {/* Background Decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-150 pointer-events-none">
               <Hexagon size={200} />
            </div>

            <div className="space-y-2">
              <h3 className="text-[8px] tracking-[0.6em] uppercase opacity-30">Energy Core</h3>
              <p className="text-[6px] tracking-[0.3em] opacity-10 uppercase mb-2">エネルギーコア</p>
              <p className="text-5xl font-extralight italic text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                {rt}<span className="text-sm not-italic opacity-40 ml-3">RT</span>
              </p>
            </div>
            
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
            
            <div className="space-y-4">
               <p className="text-[7px] tracking-[0.4em] uppercase opacity-40 leading-loose">
                 Synchronized by Hexa Relation<br />
                 Sanctum ID: {uid.substring(0,8)}
               </p>
               <div className="flex justify-center gap-2 text-emerald-400/20">
                  <Sparkles size={10} />
                  <Sparkles size={10} />
                  <Sparkles size={10} />
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
