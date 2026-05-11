"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Rotate3d, Building2, User, Phone, Mail, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

export type Alignment = "left" | "center" | "right";

export interface HexaCardProps {
  name: string;
  reading?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  bio?: string;
  logoUrl?: string;
  faceUrl?: string;
  orientation?: "horizontal" | "vertical";
  alignName?: Alignment;
  alignReading?: Alignment;
  alignCompany?: Alignment;
  alignTitle?: Alignment;
  alignPhone?: Alignment;
  alignEmail?: Alignment;
  frame?: string;
  background?: string;
  effect?: string;
  fontFamily?: string;
  scaleName?: "standard" | "impact" | "maximum";
  scaleTitle?: "standard" | "impact" | "maximum";
  scaleCompany?: "standard" | "impact" | "maximum";
  sound?: string;
  link_x?: string;
  link_instagram?: string;
  link_line?: string;
  link_facebook?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export default function HexaCardPreview({ 
  name, reading, company, title, phone, email, bio, logoUrl, faceUrl,
  orientation = "horizontal", 
  alignName = "center", alignReading = "center", alignCompany = "center",
  alignTitle = "center", alignPhone = "center", alignEmail = "center",
  frame = "Obsidian", background = "Default", effect = "None", fontFamily = "Standard", 
  scaleName = "standard", scaleTitle = "standard", scaleCompany = "standard",
  sound = "resonance",
  link_x, link_instagram, link_line, link_facebook,
  onFlip 
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
    const soundType = (sound?.toLowerCase() || "resonance") as any;
    playResonanceSound(soundType);
    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
    setTimeout(() => setIsRotating(false), 800);
  };

  const getFrameStyle = () => {
    switch (frame) {
      case "Silver": return "border-[3px] border-zinc-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] ring-1 ring-white/20";
      case "Gold": return "border-[4px] border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)] ring-1 ring-amber-300/30";
      case "Dynamic": return "border-[4px] border-azure-400 shadow-[0_0_40px_rgba(59,130,246,0.5)] animate-pulse";
      case "Sakura": return "border-[3px] border-rose-400 shadow-[0_0_40px_rgba(251,113,133,0.4)] ring-1 ring-rose-200/30";
      case "Emerald": return "border-[3px] border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.4)] ring-1 ring-emerald-200/30";
      case "Platinum": return "border-[5px] border-slate-300 shadow-[0_0_50px_rgba(255,255,255,0.6)] ring-2 ring-white/40";
      case "Crimson": return "border-[4px] border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.5)] ring-1 ring-rose-400/30";
      case "Void": return "border-[6px] border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,1)] ring-2 ring-zinc-700 bg-black";
      case "ImperialGold": return "border-[6px] border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.7)] ring-2 ring-amber-200/50 bg-amber-950/20";
      case "BlackCard": return "border-[5px] border-zinc-700 shadow-[0_0_50px_rgba(255,255,255,0.15)] ring-2 ring-zinc-600 bg-black";
      case "Obsidian": return "border-[3px] border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] ring-1 ring-zinc-700 bg-[#050505]";
      default: return "border-white/20 shadow-2xl ring-1 ring-white/10";
    }
  };

  const getBackgroundStyle = () => {
    const bg = background || "Default";
    switch (bg) {
      case "Carbon": return "bg-[#0A0A0A] bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:6px_6px]";
      case "BrushedMetal": return "bg-zinc-700 bg-[linear-gradient(105deg,#18181b_0%,#71717a_25%,#27272a_50%,#a1a1aa_75%,#18181b_100%)] opacity-90";
      case "MonochromeGrid": return "bg-[#050505] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:20px_20px]";
      case "Stardust": return "bg-[#050508] bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-100";
      case "RoyalGold": return "bg-[#1a1408] bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.2),transparent_80%)]";
      case "Nebula": return "bg-[#050510] bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.3),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.3),transparent_60%)]";
      case "SilkBlur": return "bg-black before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5 before:blur-[60px]";
      case "DigitalFlow": return "bg-[#010101] bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-100";
      case "PrismFractal": return "bg-black before:absolute before:inset-0 before:bg-gradient-to-tr before:from-rose-500/20 before:via-azure-500/20 before:to-emerald-500/20 opacity-100";
      case "BrandedHex": return "bg-[#050505] bg-[url('/logo.png')] bg-[length:40px_40px] bg-center opacity-30 mix-blend-luminosity";
      case "BlackCard": return "bg-gradient-to-br from-zinc-900 via-black to-zinc-950";
      default: return "bg-[#080808]";
    }
  };

  const getEffectLayer = () => {
    switch (effect) {
      case "Glitch":
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <motion.div animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 0.15, repeat: Infinity }} className="absolute inset-0 bg-white/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.7)_50%)] bg-[length:100%_6px]" />
          </div>
        );
      case "Petals":
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
             {[...Array(12)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: -20, x: Math.random() * 400, opacity: 0 }}
                 animate={{ y: 600, x: (Math.random() * 400), opacity: [0, 0.7, 0], rotate: 720 }}
                 transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: i * 0.8 }}
                 className="absolute w-3 h-3 bg-rose-300/60 rounded-full blur-[1px]"
               />
             ))}
          </div>
        );
      case "Snow":
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
             {[...Array(30)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: -10, x: Math.random() * 400, opacity: 0 }}
                 animate={{ y: 600, opacity: [0, 0.9, 0] }}
                 transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 }}
                 className="absolute w-1 h-1 bg-white/80 rounded-full blur-[0.5px]"
               />
             ))}
          </div>
        );
      case "Aethereal":
        return <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)] z-20" />;
      case "Scanline":
        return <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.12),rgba(0,255,0,0.05),rgba(0,0,255,0.12))] bg-[size:100%_3px,4px_100%] pointer-events-none z-20" />;
      case "Interference":
        return (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
             <motion.div animate={{ x: [-200, 600] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-40 h-full bg-white/10 blur-[60px] -skew-x-24" />
             <motion.div animate={{ x: [600, -200] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="w-20 h-full bg-azure-500/10 blur-[40px] skew-x-12 absolute top-0" />
          </div>
        );
      case "Dust":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
             {[...Array(40)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ 
                   x: [Math.random() * 400, Math.random() * 400], 
                   y: [Math.random() * 600, Math.random() * 600],
                   opacity: [0, 0.6, 0] 
                 }}
                 transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
                 className="absolute w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px]"
               />
             ))}
          </div>
        );
      case "Aurora":
        return <motion.div animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 bg-gradient-to-t from-emerald-400/20 via-azure-400/10 to-transparent mix-blend-screen z-20" />;
      case "Singularity":
        return (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden flex items-center justify-center">
             <motion.div animate={{ scale: [1, 1.4, 1], rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-80 h-80 border-2 border-white/10 rounded-full blur-2xl" />
             <motion.div animate={{ scale: [0.7, 1.1, 0.7], rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 border-2 border-white/20 rounded-full blur-xl" />
             <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 bg-black/60" />
          </div>
        );
      default: return null;
    }
  };

  const getFontStyle = () => {
    switch (fontFamily) {
      case "Overlord": return "font-serif tracking-normal uppercase italic";
      case "Mecha": return "font-mono tracking-tighter uppercase font-black";
      case "Ninja": return "font-serif tracking-widest font-bold";
      case "Future": return "font-sans tracking-[0.3em] font-thin";
      default: return "font-sans tracking-[0.1em] font-light";
    }
  };

  const getAlignClass = (align: Alignment = "center") => {
    if (align === "left") return "items-start text-left self-start";
    if (align === "right") return "items-end text-right self-end";
    return "items-center text-center self-center";
  };

  const getFieldScale = (field: "name" | "title" | "company", isVertical: boolean) => {
    const scale = field === "name" ? scaleName : field === "title" ? scaleTitle : scaleCompany;
    const base = isVertical ? 1.0 : 0.9;
    const maps = {
      standard: base,
      impact: base * 1.2,
      maximum: base * 1.5,
    };
    return maps[scale] || base;
  };

  const isVertical = orientation === "vertical";

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-700 ease-in-out w-full ${isVertical ? "max-w-[320px] aspect-[1/1.58]" : "max-w-[min(450px,90vw)] aspect-[1.58/1]"}`}
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
          className={`absolute inset-0 overflow-hidden border ${getFrameStyle()} ${getBackgroundStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          {getEffectLayer()}

          {/* Main Card Content */}
          {isVertical ? (
            <div className="h-full p-8 md:p-12 flex flex-col items-center justify-between text-center relative overflow-hidden">
               <div className={`w-full flex flex-col items-center z-10 ${getAlignClass(alignCompany)}`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                     {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={32} className="text-white/10" />}
                  </div>
                  <p className={`tracking-[0.25em] uppercase text-white font-medium leading-relaxed mt-4 truncate w-full`} style={{ fontSize: `${getFieldScale('company', true) * 12}px` }}>{company || "CORPORATION"}</p>
               </div>

               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8 flex flex-col items-center transition-all duration-500 z-10`}>
                  <div className="space-y-4 md:space-y-6 w-full flex flex-col items-center">
                    {title && <p className={`tracking-[0.4em] uppercase text-white/30 font-bold w-full ${getAlignClass(alignTitle)}`} style={{ fontSize: `${getFieldScale('title', true) * 11}px` }}>{title}</p>}
                    <div className="flex flex-col gap-2 md:gap-3 w-full items-center">
                       {reading && <p className={`tracking-[0.3em] text-azure-400 font-bold uppercase truncate w-full ${getAlignClass(alignReading)}`} style={{ fontSize: `${getFieldScale('name', true) * 11}px` }}>{reading}</p>}
                       <h2 className={`tracking-[0.1em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)}`} style={{ fontSize: `${getFieldScale('name', true) * 32}px` }}>{name}</h2>
                    </div>
                    <div className={`h-px w-12 md:w-16 bg-azure-500/30 mt-2 ${alignName === 'left' ? 'self-start' : alignName === 'right' ? 'self-end' : 'self-center'}`} />
                  </div>
               </div>

               <div className="w-full space-y-3 md:space-y-4 opacity-40 flex flex-col pb-2 items-center z-10">
                  {phone && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><Phone size={11} className="text-azure-400" /><span className="font-mono text-[11px] md:text-[13px] tracking-[0.2em]">{phone}</span></div>}
                  {email && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignEmail)}`}><Mail size={11} className="text-azure-400" /><span className="font-mono text-[11px] md:text-[13px] tracking-[0.1em] uppercase truncate max-w-full">{email}</span></div>}
               </div>
            </div>
          ) : (
            <div className="h-full p-8 md:p-12 flex flex-col justify-between relative text-center overflow-hidden">
              <header className={`w-full flex flex-row items-center gap-4 z-10 ${getAlignClass(alignCompany)}`}>
                 <div className="w-12 h-12 md:w-16 md:h-16 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                    {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={24} className="text-white/10" />}
                 </div>
                 <p className="tracking-[0.3em] uppercase text-white/80 font-medium leading-tight truncate" style={{ fontSize: `${getFieldScale('company', false) * 12}px` }}>{company || "CORPORATION"}</p>
              </header>

              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-12 flex flex-col items-center transition-all duration-500 z-10`}>
                <div className="flex flex-col gap-2 md:gap-3 w-full items-center">
                   {title && <p className={`tracking-[0.4em] uppercase text-white/30 font-bold w-full ${getAlignClass(alignTitle)}`} style={{ fontSize: `${getFieldScale('title', false) * 10}px` }}>{title}</p>}
                   <div className="flex flex-col w-full items-center">
                      {reading && <span className={`tracking-[0.3em] text-azure-400 font-bold uppercase mb-1 w-full ${getAlignClass(alignReading)}`} style={{ fontSize: `${getFieldScale('name', false) * 9}px` }}>{reading}</span>}
                      <h2 className={`tracking-[0.15em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)}`} style={{ fontSize: `${getFieldScale('name', false) * 28}px` }}>{name}</h2>
                   </div>
                </div>
              </div>

              <footer className="w-full flex flex-col items-center z-10">
                <div className="flex flex-col gap-2 opacity-40 w-full items-center">
                   {phone && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><Phone size={10} /><span className="font-mono text-[11px] md:text-[14px] tracking-widest">{phone}</span></div>}
                   {email && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignEmail)}`}><Mail size={10} /><span className="font-mono text-[11px] md:text-[14px] tracking-widest uppercase truncate">{email}</span></div>}
                </div>
              </footer>
            </div>
          )}
        </div>

        <div 
          className={`absolute inset-0 flex flex-col justify-between items-center text-center border overflow-hidden ${getFrameStyle()} ${getBackgroundStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          {isVertical ? (
            <div className="h-full p-10 md:p-16 flex flex-col justify-between items-center w-full">
              <div />
              <div className="space-y-6 relative z-10 w-full flex flex-col items-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl">
                   {faceUrl ? <img src={faceUrl} alt="Portrait" className="w-full h-full object-cover" /> : <User size={48} className="text-white/5" />}
                </div>
                <div className="space-y-4 w-full">
                   <p className="text-[11px] md:text-[13px] tracking-[0.6em] uppercase text-white/30">Verified Identity</p>
                   <div className="h-px w-12 bg-white/10 mx-auto" />
                   <p className="text-[12px] md:text-[15px] tracking-[0.1em] uppercase text-white/90 leading-relaxed italic max-w-sm mx-auto line-clamp-5 px-4 whitespace-pre-wrap">
                     {bio || "Hexa Relation Protocol"}
                   </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-8">
                 {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Twitter size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                 {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Instagram size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                 {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><MessageCircle size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                 {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Facebook size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 md:p-8 flex flex-row items-center justify-center gap-8 md:gap-12 w-full">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl shrink-0">
                  {faceUrl ? <img src={faceUrl} alt="Portrait" className="w-full h-full object-cover" /> : <User size={40} className="text-white/5" />}
               </div>
               <div className="flex flex-col justify-center text-left flex-1 min-w-0">
                  <p className="text-[9px] md:text-[11px] tracking-[0.5em] uppercase text-white/30 mb-2">Verified Identity</p>
                  <p className="text-[10px] md:text-[13px] tracking-[0.05em] uppercase text-white/90 leading-relaxed italic line-clamp-4 whitespace-pre-wrap mb-4 border-l border-white/10 pl-4">
                    {bio || "Hexa Relation Protocol"}
                  </p>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Twitter size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                    {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Instagram size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                    {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><MessageCircle size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                    {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Facebook size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
                  </div>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
