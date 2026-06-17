"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Rotate3d, Building2, User, Phone, Mail, Instagram, Facebook, Twitter, MessageCircle, Globe } from "lucide-react";
import { playConnectionSound } from "@/lib/audio/resonance";

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
  aura?: string;
  fontFamily?: string;
  scaleName?: "standard" | "impact" | "maximum";
  scaleTitle?: "standard" | "impact" | "maximum";
  scaleCompany?: "standard" | "impact" | "maximum";
  sound?: string;
  link_hp?: string;
  link_x?: string;
  link_instagram?: string;
  link_line?: string;
  link_facebook?: string;
}

export default function HexaCardPreview({
  name, reading, company, title, phone, email, bio, logoUrl, faceUrl,
  orientation = "horizontal",
  alignName = "center", alignReading = "center", alignCompany = "center",
  alignTitle = "center", alignPhone = "center", alignEmail = "center",
  frame = "Obsidian", background = "Default", effect = "None", aura = "None",
  fontFamily = "Standard", scaleName = "standard", scaleTitle = "standard", scaleCompany = "standard",
  sound = "resonance", link_hp, link_x, link_instagram, link_line, link_facebook
}: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const glowOpacity = useTransform(x, [-100, 100], [0.2, 0.4]);
  const finalRotateY = useTransform(rotateY, (val) => isFlipped ? val + 180 : val);

  const handleFlip = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    setIsRotating(true);
    setIsFlipped(!isFlipped);
    if (sound) playConnectionSound(sound);
    setTimeout(() => setIsRotating(false), 800);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAuraLayer = () => {
    if (!mounted) return null;
    switch (aura) {
      case "WhiteMist":
        return <motion.div animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-[-60px] bg-white/30 blur-[60px] rounded-full z-0" />;
      case "AzureFlame":
        return <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.4, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-[-80px] bg-azure-500/40 blur-[80px] rounded-full z-0" />;
      case "GoldenHalo":
        return <motion.div animate={{ opacity: [0.4, 0.8, 0.4], rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-100px] border-[20px] border-amber-500/30 blur-[40px] rounded-full z-0" />;
      case "VioletHaze":
        return <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute inset-[-70px] bg-purple-500/40 blur-[70px] rounded-full z-0" />;
      case "EmeraldDust":
        return (
          <div className="absolute inset-[-60px] z-0 pointer-events-none">
             {[...Array(25)].map((_, i) => (
               <motion.div key={i} animate={{ y: [0, -40, 0], x: [0, (Math.random()-0.5)*40, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.1 }} className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[1px]" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
             ))}
             <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full" />
          </div>
        );
      case "CrimsonFlare":
        return <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} className="absolute inset-[-90px] bg-rose-600/40 blur-[90px] rounded-full z-0" />;
      case "VoidEclipse":
        return <div className="absolute inset-[-120px] bg-black blur-[100px] opacity-90 z-0 shadow-[0_0_100px_rgba(255,255,255,0.1)]" />;
      case "PrismGlow":
        return <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-[-110px] bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] opacity-40 blur-[80px] rounded-full z-0" />;
      case "CyberGrid":
        return (
          <div className="absolute inset-[-50px] z-0 overflow-hidden opacity-30">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_2px,transparent_2px),linear-gradient(to_bottom,#3b82f6_2px,transparent_2px)] bg-[size:15px_15px] blur-[2px]" />
             <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-azure-500/10 blur-[40px]" />
          </div>
        );
      default: return null;
    }
  };

  const getFrameStyle = () => {
    switch (frame) {
      case "Silver": return "border-[2px] border-zinc-400 shadow-xl ring-1 ring-white/10";
      case "Gold": return "border-[3px] border-amber-600 shadow-2xl ring-1 ring-amber-300/10";
      case "RoseGold": return "border-[3px] border-rose-300 shadow-[0_0_30px_rgba(244,114,182,0.3)] ring-1 ring-rose-200/40";
      case "PearlWhite": return "border-[2px] border-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.5)] ring-1 ring-white/60";
      case "Moonlight": return "border-[2px] border-indigo-200/50 shadow-[0_0_25px_rgba(199,210,254,0.3)] ring-1 ring-indigo-100/20";
      case "Grace": return "border-[4px] border-white/20 shadow-lg ring-1 ring-white/10 after:absolute after:inset-0 after:border after:border-white/5 after:m-1";
      case "Silk": return "border-[2px] border-slate-200/30 shadow-md ring-1 ring-white/5";
      case "Dynamic": return "border-[3px] border-azure-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]";
      case "Sakura": return "border-[2px] border-rose-400 shadow-xl ring-1 ring-rose-200/10";
      case "Emerald": return "border-[2px] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]";
      case "Platinum": return "border-[4px] border-slate-300 shadow-2xl ring-1 ring-white/20";
      case "Crimson": return "border-[3px] border-rose-700 shadow-[0_0_30px_rgba(190,18,60,0.5)]";
      case "Obsidian": return "border-[2px] border-white/10 shadow-2xl ring-1 ring-white/5 bg-black";
      case "Neon": return "border-[2px] border-azure-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] ring-1 ring-azure-300/30";
      case "Gothic": return "border-[3px] border-stone-800 shadow-2xl ring-1 ring-red-900/20 bg-[#050505]";
      case "Void": return "border-[5px] border-black shadow-[0_0_40px_rgba(255,255,255,0.05)] bg-black";
      case "ImperialGold": return "border-[6px] border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)] bg-[#050505]";
      default: return "border-white/10";
    }
  };

  const getBackgroundStyle = () => {
    const bg = background || "Default";
    switch (bg) {
      case "PastelSakura": return "bg-[#fff5f5] bg-[radial-gradient(circle_at_50%_50%,rgba(255,192,203,0.2),transparent_100%)]";
      case "PearlVeil": return "bg-white/5 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(240,249,255,0.1)_50%,rgba(255,255,255,0.1)_100%)]";
      case "SilkSheet": return "bg-slate-900 before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/silk.png')] before:opacity-10";
      case "GraceGradient": return "bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-rose-900/40";
      case "CrystalGlass": return "bg-white/15 border border-white/10";
      case "Carbon": return "bg-[#0A0A0A] bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:6px_6px]";
      case "BrushedMetal": return "bg-zinc-700 bg-[linear-gradient(105deg,#18181b_0%,#71717a_25%,#27272a_50%,#a1a1aa_75%,#18181b_100%)] opacity-90";
      case "MonochromeGrid": return "bg-[#050505] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:20px_20px]";
      case "Stardust": return "bg-[#050508] bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:32px_32px] opacity-100";
      case "RoyalGold": return "bg-[#1a1408] bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.2),transparent_80%)]";
      case "Nebula": return "bg-[#050510] bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.3),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.3),transparent_60%)]";
      case "SilkBlur": return "bg-black before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5 before:blur-[60px]";
      case "DigitalFlow": return "bg-[#010101] bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-100";
      case "PrismFractal": return "bg-black before:absolute before:inset-0 before:bg-gradient-to-tr before:from-rose-500/20 before:via-azure-500/20 before:to-emerald-500/20 opacity-100";
      default: return "bg-black";
    }
  };

  const getEffectLayer = () => {
    if (!mounted) return null;
    switch (effect) {
      case "Sparkle":
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }} className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1px] shadow-[0_0_8px_white]" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "FallingFlowers":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 360, x: [0, 30, -30, 0] }} transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: i * 0.8 }} className="absolute text-white/80 text-[14px] drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ left: `${Math.random()*100}%` }}>❀</motion.div>
             ))}
          </div>
        );
      case "Petals":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 720, x: [0, 50, -50, 0] }} transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: i * 1.2 }} className="absolute text-rose-300/60 text-[16px] drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]" style={{ left: `${Math.random()*100}%` }}>🌸</motion.div>
             ))}
          </div>
        );
      case "Feathers":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0, opacity: 0 }} animate={{ y: 500, rotate: [0, 45, -45, 0], x: [0, 40, -40, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: i * 2 }} className="absolute text-white/50 text-[20px] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ left: `${Math.random()*100}%` }}>🪶</motion.div>
             ))}
          </div>
        );
      case "Bubbles":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: 500, opacity: 0 }} animate={{ y: -100, x: [0, 10, -10, 0], opacity: [0, 0.5, 0], scale: [0.5, 1, 0.8] }} transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, delay: i * 0.5 }} className="absolute w-4 h-4 border border-white/30 rounded-full bg-white/5 blur-[0.5px] shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "Ribbons":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-40">
             {[...Array(4)].map((_, i) => (
               <motion.div key={i} animate={{ x: ["-120%", "220%"], y: [0, 50, -50, 0] }} transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }} className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_white]" style={{ top: `${20 + i * 20}%`, transform: `rotate(${i * 5}deg)` }} />
             ))}
          </div>
        );
      case "Rain":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(40)].map((_, i) => (
               <motion.div key={i} initial={{ y: -10 }} animate={{ y: 500 }} transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: Math.random() * 2 }} className="absolute w-[1px] h-8 bg-white/20 blur-[0.5px]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "Snow":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(40)].map((_, i) => (
               <motion.div key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 500, x: [0, 20, -20, 0], opacity: [0, 0.8, 0], scale: [0.6, 1.2, 0.6] }} transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }} className="absolute w-2 h-2 bg-white rounded-full blur-[1.5px] shadow-[0_0_8px_white]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "DigitalRain":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, opacity: 0 }} animate={{ y: 500, opacity: [0, 0.6, 0] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }} className="absolute text-[12px] font-mono text-azure-400 blur-[0.5px]" style={{ left: `${Math.random()*100}%` }}>{Math.random() > 0.5 ? '1' : '0'}</motion.div>
             ))}
          </div>
        );
      case "Glitch":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ x: [-8, 8, -3, 0], opacity: [0, 0.3, 0] }} transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }} className="absolute inset-0 bg-red-500/20" />
             <motion.div animate={{ x: [8, -8, 3, 0], opacity: [0, 0.3, 0] }} transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }} className="absolute inset-0 bg-blue-500/20" />
             <motion.div animate={{ opacity: [0, 0.1, 0] }} transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }} className="absolute inset-0 bg-white/10" />
          </div>
        );
      case "Aethereal":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 0.15, repeat: Infinity }} className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
             <motion.div animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 6, repeat: Infinity }} className="absolute inset-0 bg-white/10 blur-[80px]" />
          </div>
        );
      case "Interference":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
             {[...Array(6)].map((_, i) => (
               <motion.div key={i} animate={{ y: ["0%", "100%"], opacity: [0, 0.8, 0] }} transition={{ duration: 0.1 + Math.random() * 0.3, repeat: Infinity, repeatDelay: Math.random() * 5 }} className="absolute w-full h-[2px] bg-azure-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]" style={{ top: `${Math.random() * 100}%` }} />
             ))}
          </div>
        );
      case "Dust":
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(30)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 6 + Math.random() * 12, repeat: Infinity }} className="absolute w-[2px] h-[2px] bg-white/50 blur-[1px] shadow-[0_0_5px_white]" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "Aurora":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ opacity: [0.2, 0.5, 0.2], x: ["-10%", "10%"] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-[-40%] bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.3),transparent,rgba(59,130,246,0.3),transparent)] blur-[120px] mix-blend-screen" />
          </div>
        );
      case "Singularity":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
             <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-[300%] h-[300%] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.08)_40%,transparent_60%)] mix-blend-screen" />
             <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.15),transparent)] blur-[80px]" />
          </div>
        );
      case "Scanline":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Primary "Layer Line" - Refined Beam */}
             <motion.div 
               animate={{ y: ["-15%", "115%"] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }} 
               className="w-full h-5 bg-gradient-to-b from-transparent via-white/40 to-transparent shadow-[0_0_30px_rgba(255,255,255,0.5)] relative z-[60]" 
             />
             {/* Dynamic Scanline Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40" />
             {/* Soft CRT Flicker */}
             <motion.div animate={{ opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 0.08, repeat: Infinity }} className="absolute inset-0 bg-white/10" />
          </div>
        );
      case "Fireflies":
        return (
          <div className="absolute inset-0 pointer-events-none z-20">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 20, -20, 0], y: [0, -30, 10, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }} className="absolute w-1 h-1 bg-amber-200 rounded-full blur-[1px]" style={{ left: `${20+Math.random()*60}%`, top: `${20+Math.random()*60}%` }} />
             ))}
          </div>
        );
      case "Leaves":
        return (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 720, x: [0, 40, -40, 0] }} transition={{ duration: 7 + Math.random() * 3, repeat: Infinity, delay: i * 2 }} className="absolute text-emerald-600/30 text-[12px]" style={{ left: `${Math.random()*100}%` }}>🍃</motion.div>
             ))}
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
        className="relative z-10"
      >
        {/* Aura Layer (Strictly Isolated with hole mask) */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center"
          style={{ 
            transform: 'translateZ(-50px)',
            // 反時計回りの指定により、中央1%〜99%の領域を物理的に穴あけする
            clipPath: 'polygon(-1000% -1000%, -1000% 2000%, 2000% 2000%, 2000% -1000%, -1000% -1000%, 1% 1%, 1% 99%, 99% 99%, 99% 1%, 1% 1%)',
            WebkitClipPath: 'polygon(-1000% -1000%, -1000% 2000%, 2000% 2000%, 2000% -1000%, -1000% -1000%, 1% 1%, 1% 99%, 99% 99%, 99% 1%, 1% 1%)'
          }}
        >
           {getAuraLayer()}
        </div>

        <motion.div style={{ opacity: glowOpacity, rotateY: 90, backfaceVisibility: "hidden" }} className="absolute inset-0 bg-white/10 blur-3xl z-20 pointer-events-none" />

        {/* Front Face */}
        <div 
          className={`absolute inset-0 overflow-hidden border ${getFrameStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          {/* Light Proof Shield: Force pure black base to prevent any light bleed */}
          <div className="absolute inset-[-1px] bg-black -z-50" />
          <div className="absolute inset-0 bg-[#000000] -z-40" />
          <div className={`absolute inset-0 ${getBackgroundStyle()} -z-30`} />

          {getEffectLayer()}

          {/* Main Card Content */}
          {isVertical ? (
            <div className="h-full p-8 md:p-12 flex flex-col items-center justify-between text-center relative overflow-hidden">
               <div className={`w-full flex flex-col items-center z-10 ${getAlignClass(alignCompany)}`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0 relative">
                     {logoUrl ? <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" /> : <Building2 size={32} className="text-white/10" />}
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
                 <div className="w-12 h-12 md:w-16 md:h-16 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0 relative">
                    {logoUrl ? <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" /> : <Building2 size={24} className="text-white/10" />}
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
          {getEffectLayer()}
        </div>

        {/* Back Face */}
        <div 
          className={`absolute inset-0 flex flex-col justify-between items-center text-center border overflow-hidden ${getFrameStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          {/* Light Proof Shield: Force pure black base to prevent any light bleed */}
          <div className="absolute inset-[-1px] bg-black -z-50" />
          <div className="absolute inset-0 bg-[#000000] -z-40" />
          <div className={`absolute inset-0 ${getBackgroundStyle()} -z-30`} />

          {isVertical ? (
            <div className="h-full p-10 md:p-16 flex flex-col justify-between items-center w-full">
              <div />
              <div className="space-y-6 relative z-10 w-full flex flex-col items-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl relative">
                   {faceUrl ? <Image src={faceUrl} alt="Portrait" fill className="object-cover" /> : <User size={48} className="text-white/5" />}
                </div>
                {bio && (
                  <div className="space-y-4 w-full">
                     <p className="text-[12px] md:text-[15px] tracking-[0.1em] uppercase text-white/90 leading-relaxed italic max-w-sm mx-auto line-clamp-5 px-4 whitespace-pre-wrap">
                       {bio}
                     </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-8">
                 {link_hp && <a href={link_hp.startsWith('http') ? link_hp : `https://${link_hp}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Globe size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">HP</span></a>}
                 {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Twitter size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                 {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Instagram size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                 {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><MessageCircle size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                 {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-2 text-white/40 hover:text-white transition-colors"><Facebook size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 md:p-8 flex flex-row items-center justify-center gap-8 md:gap-12 w-full">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl shrink-0 relative">
                  {faceUrl ? <Image src={faceUrl} alt="Portrait" fill className="object-cover" /> : <User size={40} className="text-white/5" />}
               </div>
               <div className="flex flex-col justify-center text-left flex-1 min-w-0">
                  {bio && (
                    <p className="text-[10px] md:text-[13px] tracking-[0.05em] uppercase text-white/90 leading-relaxed italic line-clamp-4 whitespace-pre-wrap mb-4 border-l border-white/10 pl-4">
                      {bio}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {link_hp && <a href={link_hp.startsWith('http') ? link_hp : `https://${link_hp}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Globe size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">HP</span></a>}
                    {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Twitter size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                    {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Instagram size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                    {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><MessageCircle size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                    {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/sns flex items-center gap-1.5 text-white/40 hover:text-white transition-colors"><Facebook size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
                  </div>
               </div>
            </div>
          )}
          {getEffectLayer()}
        </div>
      </motion.div>
    </div>
  );
}
