"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Rotate3d, Building2, User, Phone, Mail } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

export type Alignment = "left" | "center" | "right";

export interface HexaCardProps {
  name: string;
  reading?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  bio?: string; // 裏面用
  logoUrl?: string;
  faceUrl?: string;
  orientation?: "horizontal" | "vertical";
  // 個別整列
  alignName?: Alignment;
  alignReading?: Alignment;
  alignCompany?: Alignment;
  alignTitle?: Alignment;
  alignPhone?: Alignment;
  alignEmail?: Alignment;
  frame?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export default function HexaCardPreview({ 
  name, reading, company, title, phone, email, bio, logoUrl, faceUrl,
  orientation = "horizontal", 
  alignName = "center", alignReading = "center", alignCompany = "center",
  alignTitle = "center", alignPhone = "center", alignEmail = "center",
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

  const getAlignClass = (align: Alignment = "center") => {
    if (align === "left") return "items-start text-left self-start";
    if (align === "right") return "items-end text-right self-end";
    return "items-center text-center self-center";
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

        <div 
          className={`absolute inset-0 overflow-hidden border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          {isVertical ? (
            /* 縦型レイアウト */
            <div className="h-full p-10 flex flex-col items-center">
               {/* 上部: 所属・ロゴ */}
               <div className={`flex flex-col gap-4 w-full ${getAlignClass(alignCompany)}`}>
                  <div className="w-14 h-14 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                     {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={24} className="text-white/10" />}
                  </div>
                  <p className={`text-[11px] tracking-[0.2em] uppercase text-white font-medium leading-relaxed w-full ${getAlignClass(alignCompany)}`}>{company || "CORPORATION"}</p>
               </div>

               <div className="flex-[1.5]" /> {/* 上部の余白を少し多めに取って中央へ寄せる */}

               {/* 中央: メインコンテンツ (肩書き・名前) */}
               <div className="space-y-5 w-full flex flex-col py-4">
                  <p className={`text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold w-full ${getAlignClass(alignTitle)}`}>{title || "ASSOCIATE"}</p>
                  <div className="flex flex-col gap-2 w-full">
                     {reading && <p className={`text-[10px] tracking-[0.3em] text-azure-400 font-bold uppercase truncate w-full ${getAlignClass(alignReading)}`}>{reading}</p>}
                     <h2 className={`text-2xl tracking-[0.1em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)}`}>{name}</h2>
                  </div>
                  <div className={`h-px w-10 bg-azure-500/30 mt-2 ${alignName === 'left' ? 'self-start' : alignName === 'right' ? 'self-end' : 'self-center'}`} />
               </div>

               <div className="flex-1" />

               {/* 下部: 連絡先 */}
               <div className="space-y-3 opacity-40 flex flex-col w-full pb-2">
                  {phone && <div className={`flex items-center gap-2 w-full ${getAlignClass(alignPhone)}`}><Phone size={10} className="text-azure-400" /><span className="font-mono text-[9px] tracking-[0.2em]">{phone}</span></div>}
                  {email && <div className={`flex items-center gap-2 w-full ${getAlignClass(alignEmail)}`}><Mail size={10} className="text-azure-400" /><span className="font-mono text-[9px] tracking-[0.1em] uppercase truncate max-w-full">{email}</span></div>}
               </div>
            </div>
          ) : (
            /* 横型レイアウト */
            <div className="h-full p-8 flex flex-col justify-between">
              <header className={`flex flex-col pt-2 w-full ${getAlignClass(alignCompany)}`}>
                 <div className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                       {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={18} className="text-white/10" />}
                    </div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-white/80 font-medium leading-tight">{company || "CORPORATION"}</p>
                 </div>
              </header>
              <main className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-1 w-full">
                   <p className={`text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold w-full ${getAlignClass(alignTitle)}`}>{title || "ASSOCIATE"}</p>
                   <div className="flex flex-col w-full">
                      {reading && <span className={`text-[8px] tracking-[0.3em] text-azure-400 font-bold uppercase mb-1 w-full ${getAlignClass(alignReading)}`}>{reading}</span>}
                      <h2 className={`text-3xl tracking-[0.1em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)}`}>{name}</h2>
                   </div>
                </div>
                <div className="mt-2 flex flex-col gap-2 opacity-40 w-full">
                   {phone && <div className={`flex items-center gap-2 w-full ${getAlignClass(alignPhone)}`}><Phone size={10} /><span className="font-mono text-[9px] tracking-widest">{phone}</span></div>}
                   {email && <div className={`flex items-center gap-2 w-full ${getAlignClass(alignEmail)}`}><Mail size={10} /><span className="font-mono text-[9px] tracking-widest uppercase">{email}</span></div>}
                </div>
              </main>
              <footer className="flex justify-end opacity-5"><div className="text-[10px] font-bold italic">STANDARD HXC</div></footer>
            </div>
          )}
        </div>

        {/* 【裏面】Identity Verification + Face Photo + BIO */}
        <div 
          className={`absolute inset-0 p-8 flex flex-col justify-center items-center text-center border ${getFrameStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div className="space-y-6 relative z-10 w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl">
               {faceUrl ? <img src={faceUrl} alt="Portrait" className="w-full h-full object-cover" /> : <User size={32} className="text-white/5" />}
            </div>
            <div className="space-y-4 w-full">
               <p className="text-[9px] tracking-[0.5em] uppercase text-white/30">Professional Identity</p>
               <div className="h-px w-12 bg-white/10 mx-auto" />
               <p className="text-[9px] tracking-[0.2em] uppercase text-white/60 leading-relaxed italic max-w-xs mx-auto">
                 {bio || "Hexa Network Verified Identity"}
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
