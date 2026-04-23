"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Rotate3d, Building2, User } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

interface HexaCardProps {
  name: string;
  reading?: string;
  company?: string;
  title?: string;
  photoUrl?: string;
  orientation?: "horizontal" | "vertical";
  frame?: string;
  onFlip?: (isFlipped: boolean) => void;
}

/**
 * HXC プロフェッショナル名刺プレビュー (真実の調律版)
 * アプリ専用のUIDや残高を排除し、純粋な「ビジネスの顔」として再構築。
 */
export default function HexaCardPreview({ 
  name, reading, company, title, photoUrl, 
  orientation = "horizontal", frame = "Obsidian", onFlip 
}: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateYBase = useTransform(x, [-100, 100], [-15, 15]);
  const finalRotateY = useTransform(rotateYBase, (val) => val + (isFlipped ? 180 : 0));

  const glowOpacity = useTransform(finalRotateY, [0, 90, 180], [0, 0.4, 0]);

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
      case "Gold": return "border-bronze-400/40 shadow-xl bg-[#0F1115]";
      case "Dynamic": return "border-azure-500/40 shadow-xl bg-[#0A0C10]";
      default: return "border-white/10 shadow-2xl bg-[#050505]";
    }
  };

  const isVertical = orientation === "vertical";

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-500 ${isVertical ? "w-full max-w-[280px] aspect-[1/1.6]" : "w-full max-w-md aspect-[1.6/1]"}`}
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
        style={{ rotateX, rotateY: finalRotateY, transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        animate={{ scale: isRotating ? 0.96 : 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        <motion.div style={{ opacity: glowOpacity, rotateY: 90, backfaceVisibility: "hidden" }} className="absolute inset-0 bg-white/10 blur-3xl z-20 pointer-events-none" />

        {/* 【表面】Professional Face */}
        <div 
          className={`absolute inset-0 overflow-hidden p-8 flex flex-col justify-between border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          {/* Subtle Background Branding */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[40px] font-bold italic select-none">HXC</div>

          <header className={`flex ${isVertical ? "flex-col gap-6" : "justify-between items-start"}`}>
            <div className="flex items-center gap-5">
               {/* Holder Photo */}
               <div className="w-16 h-16 border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={28} className="text-white/10" />
                  )}
               </div>
               <div>
                 <div className="flex flex-col mb-2">
                   {reading && <span className="text-[9px] tracking-[0.3em] text-azure-400 font-bold uppercase">{reading}</span>}
                 </div>
                 <p className={`tracking-[0.1em] uppercase font-light text-white leading-none ${isVertical ? "text-xl" : "text-3xl"}`}>{name}</p>
               </div>
            </div>
            {!isVertical && (
               <div className="text-right flex flex-col items-end opacity-20">
                  <span className="text-[6px] tracking-[0.4em] uppercase font-bold mb-1">Standard v1.0</span>
                  <div className="w-4 h-[1px] bg-white" />
               </div>
            )}
          </header>

          <footer className={`flex ${isVertical ? "flex-col gap-6" : "justify-between items-end"}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/60">
                <Building2 size={16} className="text-bronze-400 opacity-60" />
                <span className="text-[11px] tracking-[0.3em] uppercase font-medium">{company || "NOT SPECIFIED"}</span>
              </div>
              <div className="px-5 py-2 border border-white/5 bg-white/[0.01] w-fit">
                 <span className="text-[8px] tracking-[0.4em] uppercase text-white/40">{title || "ASSOCIATE"}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end opacity-10 group-hover:opacity-30 transition-opacity">
               <Rotate3d size={14} className="animate-pulse" />
               <span className="text-[6px] tracking-[0.4em] uppercase mt-1">Identity Verified</span>
            </div>
          </footer>
        </div>

        {/* 【裏面】Simple Contact / Blank */}
        <div 
          className={`absolute inset-0 p-8 flex flex-col justify-center items-center text-center border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div className="space-y-8 relative z-10 w-full">
            <div className="w-16 h-16 border border-white/5 mx-auto flex items-center justify-center bg-white/[0.01]">
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            </div>
            <div className="space-y-2">
               <p className="text-[10px] tracking-[0.5em] uppercase text-white/40">Professional Credentials</p>
               <div className="h-px w-12 bg-white/10 mx-auto" />
            </div>
            <p className="text-[8px] tracking-[0.4em] uppercase opacity-20 leading-loose max-w-[200px] mx-auto">
              This identity is authenticated by the Hexa Relation Network Protocol.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
