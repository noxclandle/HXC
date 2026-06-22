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
  textColor?: "white" | "black";
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

export function mapUserToCardProps(
  user: any, 
  orientation: "horizontal" | "vertical", 
  equippedOverride?: any
): HexaCardProps {
  if (!user) {
    return { name: "MEMBER" };
  }
  
  const safeProfile = user.profile || {};
  const safeEquipped = equippedOverride || user.equipped || {};
  
  const defaultAlign = {
    company: "center",
    title: "center",
    name: "center",
    reading: "center",
    phone: "center",
    email: "center"
  };

  const currentAligns = orientation === "horizontal"
    ? (safeEquipped.hAlign || user.hAlign || defaultAlign)
    : (safeEquipped.vAlign || user.vAlign || defaultAlign);

  return {
    name: user.name || "MEMBER",
    reading: user.handle || user.reading || user.handle_name || "",
    company: safeProfile.company || user.company || "",
    title: safeProfile.title || user.title || "",
    phone: safeProfile.phone || user.phone || "",
    email: safeProfile.contact_email || user.email || user.contact_email || "",
    logoUrl: user.logo_url || user.logoUrl || "",
    faceUrl: user.photo_url || user.faceUrl || "",
    bio: safeProfile.bio || user.bio || "",
    
    // SNS Links (Unified Mapping with Fallbacks)
    link_hp: safeProfile.website || user.link_website || user.website || user.link_hp || "",
    link_x: safeProfile.link_x || user.link_x || "",
    link_instagram: safeProfile.link_instagram || user.link_instagram || "",
    link_line: safeProfile.link_line || user.link_line || "",
    link_facebook: safeProfile.link_facebook || user.link_facebook || "",
    
    // Equipped Assets (Unified Mapping with Fallbacks)
    frame: safeEquipped.frame || "Obsidian",
    background: safeEquipped.background || "Default",
    effect: safeEquipped.effect || "None",
    aura: safeEquipped.aura || "None",
    fontFamily: safeEquipped.fontFamily || "Standard",
    textColor: safeEquipped.textColor || "white",
    sound: safeEquipped.sound || "resonance",
    scaleName: safeEquipped.scaleName || "standard",
    scaleTitle: safeEquipped.scaleTitle || "standard",
    scaleCompany: safeEquipped.scaleCompany || "standard",
    
    // Orientation & Alignments
    orientation: orientation,
    alignCompany: currentAligns.company || "center",
    alignName: currentAligns.name || "center",
    alignReading: currentAligns.reading || "center",
    alignTitle: currentAligns.title || "center",
    alignPhone: currentAligns.phone || "center",
    alignEmail: currentAligns.email || "center",
  };
}

export default function HexaCardPreview({
  name, reading, company, title, phone, email, bio, logoUrl, faceUrl,
  orientation = "horizontal",
  alignName = "center", alignReading = "center", alignCompany = "center",
  alignTitle = "center", alignPhone = "center", alignEmail = "center",
  frame = "Obsidian", background = "Default", effect = "None", aura = "None",
  fontFamily = "Standard", textColor = "white",
  scaleName = "standard", scaleTitle = "standard", scaleCompany = "standard",
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
        return <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-[-15px] bg-white/20 blur-[15px] rounded-lg z-0" />;
      case "AzureFlame":
        return <motion.div animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-[-18px] bg-azure-500/30 blur-[20px] rounded-lg z-0" />;
      case "GoldenHalo":
        return <motion.div animate={{ opacity: [0.5, 0.8, 0.5], rotate: 360, scale: [1, 1.03, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-15px] border-[6px] border-amber-500/20 blur-[10px] rounded-lg z-0" />;
      case "VioletHaze":
        return <motion.div animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute inset-[-16px] bg-purple-500/30 blur-[18px] rounded-lg z-0" />;
      case "EmeraldDust":
        return (
          <div className="absolute inset-[-15px] z-0 pointer-events-none rounded-lg overflow-hidden">
             {[...Array(15)].map((_, i) => (
                <motion.div key={i} animate={{ y: [0, -15, 0], x: [0, (Math.random()-0.5)*15, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.15 }} className="absolute w-1 h-1 bg-emerald-400 rounded-full blur-[0.5px]" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
             ))}
             <motion.div animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 bg-emerald-500/15 blur-[15px] rounded-lg" />
          </div>
        );
      case "CrimsonFlare":
        return <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 0.8, repeat: Infinity }} className="absolute inset-[-20px] bg-rose-600/30 blur-[22px] rounded-lg z-0" />;
      case "VoidEclipse":
        return <div className="absolute inset-[-25px] bg-black blur-[25px] opacity-95 z-0 shadow-[0_0_25px_rgba(255,255,255,0.05)] rounded-lg" />;
      case "PrismGlow":
        return <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-[-22px] bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] opacity-30 blur-[20px] rounded-lg z-0" />;
      case "CyberGrid":
        return (
          <div className="absolute inset-[-12px] z-0 overflow-hidden opacity-30 rounded-lg">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_2px,transparent_2px),linear-gradient(to_bottom,#3b82f6_2px,transparent_2px)] bg-[size:10px_10px] blur-[1px]" />
             <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-azure-500/15 blur-[10px] rounded-lg" />
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
      case "Obsidian": return "border-[2px] border-white/10 shadow-2xl ring-1 ring-white/5";
      case "Neon": return "border-[2px] border-azure-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] ring-1 ring-azure-300/30";
      case "Gothic": return "border-[3px] border-stone-800 shadow-2xl ring-1 ring-red-900/20";
      case "Void": return "border-[5px] border-black shadow-[0_0_40px_rgba(255,255,255,0.05)]";
      case "ImperialGold": return "border-[6px] border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)]";
      case "Glass": return "border-[2px] border-white/20 shadow-xl";
      case "Titanium": return "border-[3px] border-slate-500 shadow-lg";
      case "Marble": return "border-[4px] border-slate-200 shadow-2xl ring-1 ring-black/5";
      case "PrismLine": return "border-[2px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]";
      case "CarbonFiber": return "border-[2px] border-zinc-700 shadow-lg";
      case "Linen": return "border-[1px] border-stone-300 shadow-sm";
      case "Opal": return "border-[3px] border-indigo-100 shadow-[0_0_30px_rgba(199,210,254,0.4)]";
      case "Iron": return "border-[3px] border-zinc-600 shadow-inner";
      case "Copper": return "border-[2px] border-orange-800 shadow-xl";
      case "Velvet": return "border-[5px] border-rose-900 shadow-2xl";
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
      case "InkWash": return "bg-[#f5f5f5] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1),transparent)] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]";
      case "SandDune": return "bg-[#d2b48c] bg-[linear-gradient(135deg,#c19a6b_25%,transparent_25%),linear-gradient(225deg,#c19a6b_25%,transparent_25%)] bg-[size:50px_50px]";
      case "DeepOcean": return "bg-[#000033] bg-[radial-gradient(circle_at_center,rgba(0,102,204,0.2),transparent)]";
      case "Paper": return "bg-[#fdfcf0] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]";
      case "NightCity": return "bg-[#050505] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_90%,rgba(59,130,246,0.1))]";
      case "Slate": return "bg-zinc-800 before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]";
      case "CosmicVoid": return "bg-black after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent)]";
      case "Circuit": return "bg-[#020202] bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)]";
      case "MorningMist": return "bg-[#e6e6e6] bg-gradient-to-b from-white/20 to-transparent";
      case "RoseQuartzBG": return "bg-[#fff0f5] bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.3),transparent)]";
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
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 360, x: [0, 30, -30, 0] }} transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: i * 0.8 }} className="absolute text-white/80 text-[14px]" style={{ left: `${Math.random()*100}%` }}>❀</motion.div>
             ))}
          </div>
        );
      case "Petals":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 720, x: [0, 50, -50, 0] }} transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: i * 1.2 }} className="absolute text-rose-300/60 text-[16px]" style={{ left: `${Math.random()*100}%` }}>🌸</motion.div>
             ))}
          </div>
        );
      case "Feathers":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0, opacity: 0 }} animate={{ y: 500, rotate: [0, 45, -45, 0], x: [0, 40, -40, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: i * 2 }} className="absolute text-white/50 text-[20px]" style={{ left: `${Math.random()*100}%` }}>🪶</motion.div>
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
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 40, -40, 0], y: [0, -60, 20, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }} transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }} className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full blur-[1.5px] shadow-[0_0_10px_rgba(251,191,36,0.4)]" style={{ left: `${10+Math.random()*80}%`, top: `${10+Math.random()*80}%` }} />
             ))}
          </div>
        );
      case "Leaves":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(10)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 720, x: [0, 60, -60, 0] }} transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay: i * 2 }} className="absolute text-emerald-600/40 text-[14px]" style={{ left: `${Math.random()*100}%` }}>🍃</motion.div>
             ))}
          </div>
        );
      case "Dandelion":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(12)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 100, -100, 0], y: [0, -400], opacity: [0, 0.6, 0] }} transition={{ duration: 15 + Math.random() * 10, repeat: Infinity }} className="absolute text-white/30 text-[12px]" style={{ left: `${Math.random()*100}%`, top: "100%" }}>*</motion.div>
             ))}
          </div>
        );
      case "Steam":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ y: [0, -10], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent blur-3xl" />
          </div>
        );
      case "DataStream":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
             {[...Array(5)].map((_, i) => (
               <motion.div key={i} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }} className="absolute h-px w-24 bg-azure-400" style={{ top: `${20 * i}%` }} />
             ))}
          </div>
        );
      case "Plasma":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 opacity-40">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.2),transparent)] blur-3xl" />
          </div>
        );
      case "Halo":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
             <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="w-64 h-64 border border-white/20 rounded-full blur-xl" />
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

  const getDynamicFontSize = (text: string, baseSize: number, field: "name" | "company", isVertical: boolean) => {
    const scale = getFieldScale(field === "name" ? "name" : "company", isVertical);
    const limit = field === "name" ? 10 : 20;
    if (text.length > limit) {
      const reduction = Math.max(0.6, 1 - (text.length - limit) * 0.03);
      return baseSize * scale * reduction;
    }
    return baseSize * scale;
  };

  const isVertical = orientation === "vertical";
  const textStyle = textColor === "black" ? "text-black" : "text-white";
  const textMutedStyle = textColor === "black" ? "text-black/30" : "text-white/30";
  const textAzureStyle = "text-azure-400";
  const accentLineStyle = textColor === "black" ? "bg-black/20" : "bg-azure-500/30";

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-700 ease-in-out shrink-0 ${isVertical ? "w-[285px] h-[450px]" : "w-[450px] h-[285px]"}`}
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
        <div 
          className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center"
          style={{ 
            transform: 'translateZ(-50px)',
            clipPath: 'polygon(-1000% -1000%, -1000% 2000%, 2000% 2000%, 2000% -1000%, -1000% -1000%, 1% 1%, 1% 99%, 99% 99%, 99% 1%, 1% 1%)',
            WebkitClipPath: 'polygon(-1000% -1000%, -1000% 2000%, 2000% 2000%, 2000% -1000%, -1000% -1000%, 1% 1%, 1% 99%, 99% 99%, 99% 1%, 1% 1%)'
          }}
        >
           {getAuraLayer()}
        </div>

        <motion.div style={{ opacity: glowOpacity, rotateY: 90, backfaceVisibility: "hidden" }} className="absolute inset-0 bg-white/10 blur-3xl z-20 pointer-events-none" />

        <div 
          className={`absolute inset-0 overflow-hidden border bg-zinc-950 ${getFrameStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          <div className={`absolute inset-0 ${getBackgroundStyle()} -z-30`} />

          {isVertical ? (
            <div className="h-full p-6 md:p-10 relative overflow-hidden">
               {/* Header: Company & Logo (Moved Higher & Larger gap) */}
               <div className={`absolute top-4 left-6 right-6 md:top-6 md:left-10 md:right-10 flex flex-col z-10 ${getAlignClass(alignCompany)}`}>
                  <div className={`w-16 h-16 md:w-20 md:h-20 border ${textColor === 'black' ? 'border-black/5' : 'border-white/5'} flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0 relative mb-5`}>
                     {logoUrl ? <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" /> : <Building2 size={32} className={textMutedStyle} />}
                  </div>
                  <p className={`tracking-[0.25em] uppercase ${textStyle} font-medium leading-relaxed truncate w-full`} style={{ fontSize: `${getDynamicFontSize(company || "CORPORATION", 14, "company", true)}px` }}>{company || "CORPORATION"}</p>
               </div>

               {/* Absolute Center: Name Anchor */}
               <div className="absolute top-1/2 left-6 right-6 md:left-10 md:right-10 -translate-y-1/2 flex flex-col z-10 pointer-events-none">
                  <div className="relative w-full flex justify-center items-center">
                    {/* Elements floating strictly above the name */}
                    <div className="absolute bottom-[100%] mb-4 w-full flex flex-col items-center justify-end">
                       {title && <p className={`tracking-[0.4em] uppercase ${textMutedStyle} font-bold w-full mb-3 ${getAlignClass(alignTitle)} pointer-events-auto`} style={{ fontSize: `${getFieldScale('title', true) * 11}px` }}>{title}</p>}
                       {reading && <p className={`tracking-[0.3em] ${textAzureStyle} font-bold uppercase truncate w-full ${getAlignClass(alignReading)} pointer-events-auto`} style={{ fontSize: `${getDynamicFontSize(reading, 11, "name", true)}px` }}>{reading}</p>}
                    </div>
                    
                    {/* The Name Itself (Dead Center Anchor) */}
                    <h2 className={`tracking-[0.1em] uppercase font-light ${textStyle} whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)} pointer-events-auto leading-none`} style={{ fontSize: `${getDynamicFontSize(name, 32, "name", true)}px` }}>{name}</h2>
                    
                    {/* Element floating strictly below the name */}
                    <div className="absolute top-[100%] mt-4 w-full flex justify-center pointer-events-none">
                       <div className={`h-px w-12 md:w-16 ${accentLineStyle} ${alignName === 'left' ? 'mr-auto' : alignName === 'right' ? 'ml-auto' : 'mx-auto'}`} />
                    </div>
                  </div>
               </div>

               {/* Footer: Contact Info */}
               <div className={`absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 space-y-3 md:space-y-4 ${textColor === 'black' ? 'opacity-60' : 'opacity-40'} flex flex-col z-10 ${textStyle}`}>
                  {phone && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><Phone size={11} /><span className="font-mono text-[11px] md:text-[13px] tracking-[0.2em]">{phone}</span></div>}
                  {email && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignEmail)}`}><Mail size={11} /><span className="font-mono text-[11px] md:text-[13px] tracking-[0.1em] uppercase truncate max-w-full">{email}</span></div>}
               </div>
            </div>
          ) : (
            <div className="h-full p-6 md:p-10 relative overflow-hidden">
              {/* Header: Company & Logo (Moved Higher & Larger gap) */}
              <header className={`absolute top-4 left-6 right-6 md:top-6 md:left-10 md:right-10 flex flex-row items-center gap-6 z-10 ${getAlignClass(alignCompany)}`}>
                 <div className={`w-12 h-12 md:w-16 md:h-16 border ${textColor === 'black' ? 'border-black/5' : 'border-white/5'} flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0 relative`}>
                    {logoUrl ? <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" /> : <Building2 size={24} className={textMutedStyle} />}
                 </div>
                 <p className={`tracking-[0.3em] uppercase ${textStyle} font-medium leading-tight truncate`} style={{ fontSize: `${getDynamicFontSize(company || "CORPORATION", 14, "company", false)}px` }}>{company || "CORPORATION"}</p>
              </header>

              {/* Absolute Center: Name Anchor */}
              <div className="absolute top-1/2 left-6 right-6 md:left-10 md:right-10 -translate-y-1/2 flex flex-col z-10 pointer-events-none">
                 <div className="relative w-full flex justify-center items-center">
                   {/* Elements floating strictly above the name */}
                   <div className="absolute bottom-[100%] mb-3 w-full flex flex-col items-center justify-end">
                      {title && <p className={`tracking-[0.4em] uppercase ${textMutedStyle} font-bold w-full mb-2.5 ${getAlignClass(alignTitle)} pointer-events-auto`} style={{ fontSize: `${getFieldScale('title', false) * 10}px` }}>{title}</p>}
                      {reading && <span className={`tracking-[0.3em] ${textAzureStyle} font-bold uppercase w-full ${getAlignClass(alignReading)} pointer-events-auto`} style={{ fontSize: `${getDynamicFontSize(reading, 9, "name", false)}px` }}>{reading}</span>}
                   </div>
                   {/* The Name Itself (Dead Center) */}
                   <h2 className={`tracking-[0.15em] uppercase font-light ${textStyle} whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)} pointer-events-auto leading-none`} style={{ fontSize: `${getDynamicFontSize(name, 28, "name", false)}px` }}>{name}</h2>
                 </div>
              </div>

              {/* Footer: Contact Info */}
              <footer className={`absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col z-10`}>
                <div className={`flex flex-col gap-2 ${textColor === 'black' ? 'opacity-60' : 'opacity-40'} w-full ${textStyle}`}>
                   {phone && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><Phone size={10} /><span className="font-mono text-[11px] md:text-[14px] tracking-widest">{phone}</span></div>}
                   {email && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignEmail)}`}><Mail size={10} /><span className="font-mono text-[11px] md:text-[14px] tracking-widest uppercase truncate">{email}</span></div>}
                </div>
              </footer>
            </div>
          )}
          {getEffectLayer()}
        </div>

        <div 
          className={`absolute inset-0 flex flex-col justify-between items-center text-center border overflow-hidden bg-zinc-950 ${getFrameStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div className={`absolute inset-0 ${getBackgroundStyle()} -z-30`} />

          {isVertical ? (
            <div className="h-full p-10 md:p-16 flex flex-col justify-between items-center w-full absolute inset-0">
              <div />
              <div className="space-y-6 relative z-10 w-full flex flex-col items-center">
                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full border ${textColor === 'black' ? 'border-black/10' : 'border-white/10'} flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl relative`}>
                   {faceUrl ? <Image src={faceUrl} alt="Portrait" fill className="object-cover" /> : <User size={48} className={textMutedStyle} />}
                </div>
                {bio && (
                  <div className="space-y-4 w-full">
                     <p className={`text-[12px] md:text-[15px] tracking-[0.1em] uppercase ${textStyle} leading-relaxed italic max-w-sm mx-auto line-clamp-5 px-4 whitespace-pre-wrap`}>
                       {bio}
                     </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-8 z-10">
                 {link_hp && <a href={link_hp.startsWith('http') ? link_hp : `https://${link_hp}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-2 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Globe size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">HP</span></a>}
                 {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-2 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Twitter size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                 {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-2 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Instagram size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                 {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-2 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><MessageCircle size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                 {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-2 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Facebook size={18} /><span className="text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 md:p-8 flex flex-row items-center justify-center gap-8 md:gap-12 w-full absolute inset-0">
               <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border ${textColor === 'black' ? 'border-black/10' : 'border-white/10'} flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl shrink-0 relative z-10`}>
                  {faceUrl ? <Image src={faceUrl} alt="Portrait" fill className="object-cover" /> : <User size={40} className={textMutedStyle} />}
               </div>
               <div className="flex flex-col justify-center text-left flex-1 min-w-0 z-10">
                  {bio && (
                    <p className={`text-[10px] md:text-[13px] tracking-[0.05em] uppercase ${textStyle} leading-relaxed italic line-clamp-4 whitespace-pre-wrap mb-4 border-l ${textColor === 'black' ? 'border-black/10' : 'border-white/10'} pl-4`}>
                      {bio}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {link_hp && <a href={link_hp.startsWith('http') ? link_hp : `https://${link_hp}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Globe size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">HP</span></a>}
                    {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Twitter size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                    {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Instagram size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                    {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><MessageCircle size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                    {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Facebook size={14} /><span className="text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
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
