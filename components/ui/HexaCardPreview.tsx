"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Rotate3d, Building2, User, Phone, Mail } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

type Alignment = "left" | "center" | "right";

interface HexaCardProps {
  name: string;
  reading?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  logoUrl?: string; // 表面: 会社ロゴ
  faceUrl?: string; // 裏面: 顔写真
  orientation?: "horizontal" | "vertical";
  alignHeader?: Alignment; // 縦型限定: ロゴ・社名の揃え
  alignMain?: Alignment;   // 縦型限定: 肩書き・氏名の揃え
  alignFooter?: Alignment; // 縦型限定: 連絡先の揃え
  frame?: string;
  onFlip?: (isFlipped: boolean) => void;
}

/**
 * HXC 実務特化型名刺 (真・黄金比版)
 * 縦型: 氏名を中央に固定し、3ブロックの独立整列を実現。
 */
export default function HexaCardPreview({ 
  name, reading, company, title, phone, email, logoUrl, faceUrl,
  orientation = "horizontal", 
  alignHeader = "center", alignMain = "center", alignFooter = "center",
  frame = "Obsidian", onFlip 
}: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateYBase = useTransform(x, [-100, 100], [-10, 10]);
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

  const getAlignClass = (align: Alignment) => {
    if (align === "left") return "items-start text-left";
    if (align === "right") return "items-end text-right";
    return "items-center text-center";
  };

  const isVertical = orientation === "vertical";

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-700 ease-in-out ${isVertical ? "w-full max-w-[320px] aspect-[1/1.58]" : "w-full max-w-md aspect-[1.58/1]"}`}
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
          className={`absolute inset-0 overflow-hidden border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          {isVertical ? (
            /* 【究極の縦型】垂直中央配置と三段階整列 */
            <div className="h-full p-10 flex flex-col">
               {/* 1. 上部：ロゴ -> 会社名 */}
               <div className={`flex flex-col gap-4 w-full ${getAlignClass(alignHeader)}`}>
                  <div className="w-14 h-14 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                     {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={24} className="text-white/10" />}
                  </div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-white font-medium leading-relaxed">{company || "CORPORATION"}</p>
               </div>

               {/* 可変スペーサー：名前を中央に押し下げる */}
               <div className="flex-1" />

               {/* 2. 中央：肩書き -> 氏名 (ここが名刺の絶対中心) */}
               <div className={`space-y-4 w-full overflow-hidden flex flex-col ${getAlignClass(alignMain)}`}>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold">{title || "ASSOCIATE"}</p>
                  <div className="flex flex-col gap-2 w-full">
                     {reading && <p className="text-[10px] tracking-[0.3em] text-azure-400 font-bold uppercase truncate">{reading}</p>}
                     <h2 className="text-3xl tracking-[0.1em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis">{name}</h2>
                  </div>
                  <div className="h-px w-10 bg-azure-500/30 mt-4" />
               </div>

               {/* 可変スペーサー：名前を中央に押し上げる */}
               <div className="flex-1" />

               {/* 3. 下部：連絡先 */}
               <div className={`space-y-3 opacity-40 flex flex-col w-full ${getAlignClass(alignFooter)}`}>
                  {phone && (
                     <div className="flex items-center gap-2">
                        <Phone size={10} className="text-azure-400" />
                        <span className="font-mono text-[9px] tracking-[0.2em]">{phone}</span>
                     </div>
                  )}
                  {email && (
                     <div className="flex items-center gap-2">
                        <Mail size={10} className="text-azure-400" />
                        <span className="font-mono text-[9px] tracking-[0.1em] uppercase truncate max-w-full">{email}</span>
                     </div>
                  )}
               </div>
            </div>
          ) : (
            /* 横型レイアウト */
            <div className="h-full p-8 flex flex-col justify-between">
              <header className="flex flex-row items-center gap-4 pt-2">
                 <div className="w-12 h-12 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                    {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={18} className="text-white/10" />}
                 </div>
                 <p className="text-[11px] tracking-[0.3em] uppercase text-white/80 font-medium leading-tight">{company || "CORPORATION"}</p>
              </header>
              <main className="flex flex-col gap-2">
                <div className="space-y-1">
                   <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold">{title || "ASSOCIATE"}</p>
                   <div className="flex flex-col">
                      {reading && <span className="text-[8px] tracking-[0.3em] text-azure-400 font-bold uppercase mb-1">{reading}</span>}
                      <h2 className="text-3xl tracking-[0.1em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis">{name}</h2>
                   </div>
                </div>
                <div className="mt-4 flex gap-6 opacity-40">
                   {phone && (
                     <div className="flex items-center gap-2">
                        <Phone size={10} className="text-azure-400" />
                        <span className="font-mono text-[9px] tracking-widest">{phone}</span>
                     </div>
                   )}
                   {email && (
                     <div className="flex items-center gap-2">
                        <Mail size={10} className="text-azure-400" />
                        <span className="font-mono text-[9px] tracking-widest uppercase">{email}</span>
                     </div>
                   )}
                </div>
              </main>
              <footer className="flex justify-end opacity-5">
                <div className="text-[10px] font-bold italic">STANDARD HXC</div>
              </footer>
            </div>
          )}
        </div>

        {/* 【裏面】Identity Verification + Face Photo */}
        <div 
          className={`absolute inset-0 p-8 flex flex-col justify-center items-center text-center border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div className="space-y-8 relative z-10 w-full flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl">
               {faceUrl ? <img src={faceUrl} alt="Portrait" className="w-full h-full object-cover" /> : <User size={48} className="text-white/5" />}
            </div>
            <div className="space-y-4">
               <p className="text-[9px] tracking-[0.5em] uppercase text-white/30">Verified Entity Portrait</p>
               <div className="h-px w-12 bg-white/10 mx-auto" />
               <p className="text-[7px] tracking-[0.4em] uppercase opacity-20 leading-loose max-w-[200px] mx-auto">
                 The physical reflection of this identity<br />is secured by Hexa Network.
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
