"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Hexagon, Rotate3d, ShieldCheck, Sparkles } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

interface HexaCardProps {
  name: string;
  reading?: string; // ふりがな
  uid: string;
  rt: string;
  title?: string;
  aura: number;
  frame?: string;
  onFlip?: (isFlipped: boolean) => void;
}

/**
 * HXC プロフェッショナル名刺プレビュー
 * サイトの機能名を排除し、実務における「信頼」を可視化する。
 */
export default function HexaCardPreview({ name, reading, uid, rt, title = "ASSOCIATE", aura, frame = "Obsidian", onFlip }: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateYBase = useTransform(x, [-100, 100], [-15, 15]);
  const finalRotateY = useTransform(rotateYBase, (val) => val + (isFlipped ? 180 : 0));

  const glowOpacity = useTransform(finalRotateY, [0, 90, 180], [0, 0.8, 0]);

  const handleFlip = () => {
    if (isRotating) return;
    setIsRotating(true);
    playResonanceSound(isFlipped ? "silver" : "resonance");
    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
    setTimeout(() => setIsRotating(false), 800);
  };

  const getFrameStyle = () => {
    switch (frame) {
      case "Gold": return "border-bronze-400/50 shadow-[0_0_40px_rgba(139,94,60,0.2)]";
      case "Dynamic": return "border-azure-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]";
      default: return "border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]";
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
        animate={{ scale: isRotating ? 0.95 : 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        {/* 次元発光（純白） */}
        <motion.div 
          style={{ opacity: glowOpacity, rotateY: 90, backfaceVisibility: "hidden" }}
          className="absolute inset-0 bg-white/20 blur-2xl z-20 pointer-events-none"
        />

        {/* 【表面】Modern Business */}
        <div 
          className={`absolute inset-0 bg-[#0A0A0A] overflow-hidden p-8 flex flex-col justify-between border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          <header className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/[0.03]">
                  <ShieldCheck size={24} className="text-white/20" />
               </div>
               <div>
                 <div className="flex flex-col mb-1">
                   <h3 className="text-[7px] tracking-[0.4em] uppercase opacity-30 font-bold">Holder Name</h3>
                   {reading && <span className="text-[8px] tracking-[0.2em] text-azure-400 font-medium">{reading}</span>}
                 </div>
                 <p className="text-2xl tracking-[0.15em] uppercase font-light text-white leading-none">{name}</p>
               </div>
            </div>
            <div className="text-right flex flex-col items-end">
               <span className="text-[8px] tracking-[0.4em] uppercase opacity-20 font-bold mb-1 italic">Verified</span>
               <div className="w-2 h-2 bg-white/10 rounded-full" />
            </div>
          </header>

          <footer className="relative z-10 flex justify-between items-end">
            <div className="space-y-4">
              <div>
                <h3 className="text-[8px] tracking-[0.4em] uppercase opacity-20 font-bold mb-1">Identification</h3>
                <p className="font-mono text-[9px] tracking-[0.2em] text-white/40">{uid}</p>
              </div>
              <div className="px-4 py-1.5 border border-white/5 bg-white/[0.02] w-fit">
                 <span className="text-[7px] uppercase tracking-[0.4em] text-white/60">{title}</span>
              </div>
            </div>
            <div className="flex flex-col items-end opacity-10 group-hover:opacity-40 transition-opacity">
               <Rotate3d size={14} className="animate-pulse text-white" />
               <span className="text-[5px] uppercase tracking-[0.3em] mt-1">Authenticity</span>
            </div>
          </footer>
        </div>

        {/* 【裏面】Information Seal */}
        <div 
          className={`absolute inset-0 bg-[#0F1115] p-8 flex flex-col justify-center items-center text-center border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          {/* Digital Wax Seal (Pure White) */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div 
                initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]"
              >
                <div className="w-32 h-32 border border-white/20 flex items-center justify-center" style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}>
                   <Hexagon size={64} className="text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-10 relative z-10 w-full">
            <div className="space-y-3">
              <h3 className="text-[8px] tracking-[0.8em] uppercase opacity-30 font-bold">Credit Balance</h3>
              <p className="text-4xl font-extralight tracking-[0.1em] text-white">
                {rt}<span className="text-xs opacity-20 ml-2 tracking-widest">CP</span>
              </p>
            </div>
            
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
            
            <div className="space-y-4">
               <p className="text-[7px] tracking-[0.4em] uppercase opacity-30 leading-loose">
                 Hexa Relation Network<br />
                 Global Protocol Standard
               </p>
               <div className="flex justify-center gap-3 text-white/10">
                  <Sparkles size={8} />
                  <Sparkles size={8} />
                  <Sparkles size={8} />
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
