"use client";
 
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Rotate3d, Building2, User, Phone, Mail, Instagram, Facebook, Twitter, MessageCircle, Globe, MapPin } from "lucide-react";
import { playConnectionSound } from "@/lib/audio/resonance";
 
export type Alignment = "left" | "center" | "right";

export interface HexaCardProps {
  name: string;
  reading?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
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
  scaleReading?: "standard" | "impact" | "maximum";
  scalePhone?: "standard" | "impact" | "maximum";
  scaleEmail?: "standard" | "impact" | "maximum";
  scaleAddress?: "standard" | "impact" | "maximum";
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
    address: user.address || safeProfile.address || "",
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
    scaleReading: safeEquipped.scaleReading || "standard",
    scalePhone: safeEquipped.scalePhone || "standard",
    scaleEmail: safeEquipped.scaleEmail || "standard",
    scaleAddress: safeEquipped.scaleAddress || "standard",
    
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
  name, reading, company, title, phone, email, address, bio, logoUrl, faceUrl,
  orientation = "horizontal",
  alignName = "center", alignReading = "center", alignCompany = "center",
  alignTitle = "center", alignPhone = "center", alignEmail = "center",
  frame = "Obsidian", background = "Default", effect = "None", aura = "None",
  fontFamily = "Standard", textColor = "white",
  scaleName = "standard", scaleTitle = "standard", scaleCompany = "standard",
  scaleReading = "standard", scalePhone = "standard", scaleEmail = "standard", scaleAddress = "standard",
  sound = "resonance", link_hp, link_x, link_instagram, link_line, link_facebook
}: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  // Spring physical movement mapping
  const xDrag = useMotionValue(0);
  const yDrag = useMotionValue(0);
  const x = useSpring(xDrag, { stiffness: 150, damping: 20 });
  const y = useSpring(yDrag, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const glowOpacity = useTransform(x, [-100, 100], [0.2, 0.4]);
  const finalRotateY = useTransform(rotateY, (val) => isFlipped ? val + 180 : val);

  const glareX = useTransform(x, [-225, 225], [-150, 150]);
  const glareY = useTransform(y, [-142, 142], [-100, 100]);
  const glareOpacity = useTransform(x, [-225, 225], [0.15, 0.4]);

  // Touch tracking for mobile
  const touchStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const handleFlip = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    setIsRotating(true);
    setIsFlipped(!isFlipped);
    if (sound) playConnectionSound(sound);
    setTimeout(() => setIsRotating(false), 800);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    hasDraggedRef.current = false;

    const touchX = touch.clientX - (rect.left + rect.width / 2);
    const touchY = touch.clientY - (rect.top + rect.height / 2);
    xDrag.set(Math.max(-rect.width/2, Math.min(rect.width/2, touchX)));
    yDrag.set(Math.max(-rect.height/2, Math.min(rect.height/2, touchY)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();

    // Check if dragging distance is significant enough to cancel the flip click
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 10) {
      hasDraggedRef.current = true;
    }

    const touchX = touch.clientX - (rect.left + rect.width / 2);
    const touchY = touch.clientY - (rect.top + rect.height / 2);
    xDrag.set(Math.max(-rect.width/2, Math.min(rect.width/2, touchX)));
    yDrag.set(Math.max(-rect.height/2, Math.min(rect.height/2, touchY)));
  };

  const handleTouchEnd = () => {
    xDrag.set(0);
    yDrag.set(0);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAuraLayer = () => {
    if (!mounted) return null;
    switch (aura) {
      // --- Common Auras (Subtle, single-layer slow animation) ---
      case "DimGlow":
        return (
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1.0, 1.01, 1.0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-12px] bg-gradient-to-tr from-white/5 via-zinc-300/12 to-white/5 blur-[12px] rounded-xl z-0"
          />
        );
      case "ShadowBorder":
        return (
          <motion.div 
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(0,0,0,0.5)", 
                "0 0 20px rgba(0,0,0,0.8)", 
                "0 0 10px rgba(0,0,0,0.5)"
              ],
              scale: [1.0, 1.005, 1.0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-8px] border border-white/5 rounded-xl z-0" 
          />
        );
      case "Pulse":
        return (
          <motion.div
            animate={{ 
              opacity: [0.2, 0.55, 0.2],
              scale: [1.0, 1.015, 1.0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-16px] bg-gradient-to-tr from-azure-600/10 via-cyan-400/20 to-azure-600/10 blur-[15px] rounded-xl z-0"
          />
        );

      // --- Rare Auras (Breathing, scaling, multi-layered volumetric flow) ---
      case "WhiteMist":
        return (
          <div className="absolute inset-[-20px] z-0 rounded-xl pointer-events-none">
            {/* Outer Volumetric Mist Layer */}
            <motion.div
              animate={{ 
                opacity: [0.35, 0.65, 0.35], 
                scale: [1.0, 1.03, 1.0],
                filter: ["blur(20px)", "blur(30px)", "blur(20px)"]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-white/20 rounded-xl"
            />
            {/* Inner Volumetric Shift Layer */}
            <motion.div
              animate={{ 
                opacity: [0.25, 0.55, 0.25], 
                scale: [0.99, 1.015, 0.99],
                filter: ["blur(14px)", "blur(20px)", "blur(14px)"]
              }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
              className="absolute inset-2 bg-zinc-200/15 rounded-xl"
            />
          </div>
        );
      case "AzureFlame":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl pointer-events-none">
            {/* Outer Flame Glow */}
            <motion.div
              animate={{ 
                opacity: [0.4, 0.75, 0.4], 
                scale: [1.0, 1.035, 1.0],
                y: [-3, 3, -3]
              }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-t from-azure-600/25 via-cyan-500/30 to-transparent blur-[25px] rounded-xl"
            />
            {/* Inner Core Flame */}
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3], 
                scale: [0.98, 1.015, 0.98],
                y: [2, -2, 2]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
              className="absolute inset-[8px] bg-gradient-to-t from-cyan-400/20 via-blue-500/25 to-transparent blur-[15px] rounded-xl"
            />
          </div>
        );
      case "VioletHaze":
        return (
          <div className="absolute inset-[-20px] z-0 rounded-xl pointer-events-none">
            {/* Clockwise swirl */}
            <motion.div
              animate={{ 
                opacity: [0.4, 0.65, 0.4], 
                scale: [1.0, 1.025, 1.0],
                rotate: [0, 360]
              }}
              transition={{ 
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 14, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-500/25 via-purple-600/10 to-transparent blur-[22px] rounded-xl"
            />
            {/* Counter-clockwise swirl */}
            <motion.div
              animate={{ 
                opacity: [0.25, 0.5, 0.25], 
                scale: [0.98, 1.015, 0.98],
                rotate: [360, 0]
              }}
              transition={{ 
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                rotate: { duration: 11, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-[4px] bg-gradient-to-bl from-indigo-500/20 via-indigo-600/5 to-transparent blur-[18px] rounded-xl"
            />
          </div>
        );
      case "EmeraldDust":
        return (
          <div className="absolute inset-[-20px] z-0 pointer-events-none rounded-xl overflow-hidden">
             {/* Dynamic drifting particles with glowing shadows */}
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [25, -25, 25],
                    x: [0, Math.sin(i) * 15, 0],
                    opacity: [0, 0.85, 0],
                    scale: [0.7, 1.1, 0.7]
                  }}
                  transition={{
                    duration: 3.5 + (i % 3) * 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[0.4px]"
                  style={{
                    left: `${15 + (i * 7) % 70}%`,
                    top: `${15 + (i * 9) % 70}%`,
                    boxShadow: "0 0 8px rgba(52, 211, 153, 0.8)"
                  }}
                />
             ))}
             {/* Ambient green backdrop pulse */}
             <motion.div
               animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.02, 1] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-emerald-500/20 blur-[20px] rounded-xl"
             />
          </div>
        );
      case "SakuraRemembrance":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Rose gold & Sakura soft gradient background */}
             <motion.div
               animate={{ 
                 opacity: [0.35, 0.65, 0.35], 
                 scale: [1.0, 1.025, 1.0],
                 rotate: [0, 15, 0]
               }}
               transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-tr from-rose-400/20 via-rose-300/25 to-amber-200/10 blur-[22px]"
             />
             {/* Wind-blown sakura petals with circular motion */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [40, -40],
                    x: [0, Math.sin(i) * 20, 0],
                    rotate: [0, 360],
                    opacity: [0, 0.8, 0],
                    scale: [0.6, 1.0, 0.6]
                  }}
                  transition={{ 
                    duration: 5.5 + i * 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.45,
                    ease: "easeInOut" 
                  }}
                  className="absolute text-[11px]"
                  style={{
                    left: `${15 + (i * 10) % 70}%`,
                    top: `${80 - (i * 8) % 60}%`,
                    filter: "drop-shadow(0 0 4px rgba(244, 63, 94, 0.35))"
                  }}
                >
                  🌸
                </motion.div>
             ))}
          </div>
        );

      // --- Epic Auras (Active borders, dynamic grids / neon runs) ---
      case "GoldenHalo":
        return (
          <div className="absolute inset-[-16px] z-0 rounded-xl overflow-hidden flex items-center justify-center">
             {/* Shimmering rotating gold gradient */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
               className="absolute w-[180%] h-[180%] bg-[conic-gradient(from_0deg,#d97706_0%,#f59e0b_25%,#fbbf24_50%,#f59e0b_75%,#d97706_100%)] opacity-35 blur-[22px]"
             />
             <div className="absolute inset-[6px] bg-zinc-950/80 rounded-xl" />
             {/* Gold dust flare particles */}
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.15, 0.85, 0.15], 
                    scale: [0.5, 1.25, 0.5],
                    y: [0, -15, 0]
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
                  className="absolute w-1 h-1 bg-amber-200 rounded-full"
                  style={{
                    left: `${20 + (i * 12) % 60}%`,
                    top: `${15 + (i * 14) % 70}%`,
                    boxShadow: "0 0 10px #fbbf24, 0 0 3px #fbbf24"
                  }}
                />
             ))}
          </div>
        );
      case "CrimsonFlare":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl pointer-events-none">
             {/* Heartbeat pulse glow */}
             <motion.div
               animate={{ 
                 scale: [1.0, 1.04, 0.98, 1.03, 1.0], 
                 opacity: [0.4, 0.85, 0.35, 0.75, 0.4] 
               }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-red-500/20 to-rose-700/25 blur-[25px] rounded-xl"
             />
             {/* Inner corona line */}
             <motion.div
               animate={{ 
                 scale: [0.99, 1.015, 0.99],
                 rotate: [0, -10, 0]
               }}
               transition={{ duration: 4.5, repeat: Infinity }}
               className="absolute inset-[6px] border border-red-500/25 blur-[4px] rounded-xl"
             />
          </div>
        );
      case "CyberGrid":
        return (
          <div className="absolute inset-[-20px] z-0 overflow-hidden rounded-xl border border-azure-500/20">
             {/* Flowing circuit grid mesh */}
             <motion.div 
               animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_1.5px,transparent_1.5px),linear-gradient(to_bottom,#3b82f6_1.5px,transparent_1.5px)] bg-[size:12px_12px] opacity-40 blur-[0.4px]" 
             />
             {/* Perimeter routing active nodes */}
             {[
               { top: 0, left: "0%" },
               { top: "50%", left: 0 },
               { top: "100%", left: "50%" },
               { top: "25%", left: "100%" }
             ].map((node, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.8, 1.4, 0.8]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                  style={{
                    ...node,
                    boxShadow: "0 0 10px #22d3ee"
                  }}
                />
             ))}
             {/* Grid backglow */}
             <motion.div
               animate={{ opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-azure-500/20 blur-[15px] rounded-xl"
             />
          </div>
        );
      case "HolyChamber":
        return (
          <div className="absolute inset-[-16px] z-0 rounded-xl overflow-hidden flex items-center justify-center pointer-events-none">
             {/* Fast, sharp conic sweeping light ray */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_42%,#ffffff_50%,#fbbf24_52%,transparent_58%)] opacity-90 blur-[1.5px]"
             />
             {/* Geometry frame center lock */}
             <div className="absolute inset-[3px] bg-zinc-950/92 rounded-xl" />
             {/* Background soft pulse */}
             <motion.div
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 3.5, repeat: Infinity }}
               className="absolute inset-0 bg-amber-500/10 blur-[12px]"
             />
          </div>
        );

      // --- Mythic Auras (Conic gradient rotation, gravity lensing, distortion, eclipse) ---
      case "VoidEclipse":
        return (
          <div className="absolute inset-[-30px] z-0 rounded-xl flex items-center justify-center pointer-events-none">
             {/* Outer solar flares (scaling rings) */}
             <motion.div
               animate={{ scale: [1, 2.2], opacity: [0.65, 0] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
               className="absolute w-[120%] h-[120%] border-2 border-white/35 rounded-xl blur-[2px]"
             />
             <motion.div
               animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 1.75 }}
               className="absolute w-[120%] h-[120%] border-2 border-white/15 rounded-xl blur-[4px]"
             />
             {/* Shimmering solar silver/white corona */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               className="absolute w-[220%] h-[220%] bg-[conic-gradient(from_0deg,transparent_35%,rgba(255,255,255,0.9)_50%,transparent_65%)] opacity-95 blur-[10px]"
             />
             {/* Secondary opposing corona */}
             <motion.div
               animate={{ rotate: -360 }}
               transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_40%,rgba(168,85,247,0.4)_50%,transparent_60%)] opacity-75 blur-[15px]"
             />
             {/* Inner Void Shell (Eclipse core) */}
             <motion.div 
               animate={{ scale: [0.98, 1.02, 0.98] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-[10px] bg-black border border-white/30 blur-[18px] opacity-95 shadow-[0_0_35px_rgba(255,255,255,0.3)] rounded-xl" 
             />
          </div>
        );
      case "PrismGlow":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden flex items-center justify-center">
             {/* CW Color Spectrum Rotation */}
             <motion.div
               animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
               transition={{ 
                 rotate: { duration: 7, repeat: Infinity, ease: "linear" },
                 scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
               }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#ff007f,#ff7f00,#ffff00,#00ff7f,#00ffff,#007fff,#7f00ff,#ff007f)] opacity-55 blur-[22px]"
             />
             {/* CCW Shifting Counter-Spectrum */}
             <motion.div
               animate={{ rotate: [360, 0], scale: [1.03, 0.95, 1.03] }}
               transition={{ 
                 rotate: { duration: 9, repeat: Infinity, ease: "linear" },
                 scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
               }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_180deg,#7f00ff,#007fff,#00ffff,#00ff7f,#ffff00,#ff7f00,#ff007f,#7f00ff)] opacity-45 blur-[18px]"
             />
             {/* Prism reflection particles */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.1, 0.9, 0.1],
                    scale: [0.4, 1.2, 0.4],
                    backgroundColor: ["#3b82f6", "#ec4899", "#10b981", "#ff7f00", "#3b82f6"]
                  }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${10 + (i * 12) % 80}%`,
                    top: `${10 + (i * 11) % 80}%`,
                    boxShadow: "0 0 10px currentColor"
                  }}
                />
             ))}
             {/* Glistening stars */}
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  animate={{ 
                    opacity: [0, 0.95, 0],
                    scale: [0.2, 1.3, 0.2],
                    rotate: [0, 180]
                  }}
                  transition={{ duration: 1.8 + Math.random() * 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  className="absolute w-2.5 h-2.5 bg-white rounded-full blur-[0.2px] shadow-[0_0_15px_#fff]"
                  style={{
                    left: `${Math.random()*90 + 5}%`,
                    top: `${Math.random()*90 + 5}%`
                  }}
                />
             ))}
          </div>
        );
      case "SingularityCore":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl flex items-center justify-center pointer-events-none">
             {/* Pulsing event horizon boundary ring */}
             <motion.div
               animate={{ scale: [1.02, 1.06, 1.02], opacity: [0.3, 0.7, 0.3] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-[10px] border border-purple-500/40 rounded-xl blur-[1px] shadow-[0_0_20px_rgba(168,85,247,0.4)]"
             />
             {/* Rotating Gravitational Lens core */}
             <motion.div
               animate={{ 
                 scale: [0.96, 1.05, 0.96],
                 rotate: [0, 360]
               }}
               transition={{ 
                 scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                 rotate: { duration: 5, repeat: Infinity, ease: "linear" }
               }}
               className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(0,0,0,0.98)_30%,rgba(168,85,247,0.7)_50%,rgba(0,0,0,0.98)_70%)] blur-[12px] rounded-xl"
             />
             {/* Lensing Distortion rings */}
             <motion.div
               animate={{ scale: [1.04, 0.96, 1.04], rotate: [360, 0] }}
               transition={{ 
                 scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                 rotate: { duration: 7, repeat: Infinity, ease: "linear" }
               }}
               className="absolute inset-[4px] bg-[conic-gradient(from_180deg,rgba(0,0,0,0.95)_35%,rgba(59,130,246,0.65)_50%,rgba(0,0,0,0.95)_65%)] border border-azure-500/30 blur-[18px] rounded-xl"
             />
             {/* Captured star elements falling into singularity with swirling motion */}
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0.8, 0],
                    opacity: [1, 0],
                    rotate: [0, 360],
                    x: [Math.cos(i * (Math.PI / 6)) * 60, 0],
                    y: [Math.sin(i * (Math.PI / 6)) * 60, 0]
                  }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3, ease: "easeIn" }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    boxShadow: "0 0 6px #fff"
                  }}
                />
             ))}
          </div>
        );

      // --- Legendary Auras (Ultimate multi-layer particle wind, orbits, gas drift, entanglement) ---
      case "StellarWind":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Cosmic Wind gas flow */}
             <motion.div
               animate={{ 
                 opacity: [0.4, 0.75, 0.4], 
                 scale: [1.0, 1.03, 1.0],
                 rotate: [0, 10, 0]
               }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-rose-500/20 to-indigo-600/20 blur-[25px]"
             />
             {/* Circular Star Orbits - Real Circular Orbit Paths */}
             {[
               { cx: "50%", cy: "50%", rx: [0, 45, 0, -45, 0], ry: [-65, 0, 65, 0, -65], delay: 0 },
               { cx: "50%", cy: "50%", rx: [45, 0, -45, 0, 45], ry: [0, 65, 0, -65, 0], delay: 0.8 },
               { cx: "50%", cy: "50%", rx: [0, -45, 0, 45, 0], ry: [65, 0, -65, 0, 65], delay: 1.6 },
               { cx: "50%", cy: "50%", rx: [-45, 0, 45, 0, -45], ry: [0, -65, 0, 65, 0], delay: 2.4 },
               { cx: "50%", cy: "50%", rx: [0, 30, 0, -30, 0], ry: [-45, 0, 45, 0, -45], delay: 0.4 },
               { cx: "50%", cy: "50%", rx: [-30, 0, 30, 0, -30], ry: [0, 45, 0, -45, 0], delay: 1.2 }
             ].map((orb, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: orb.rx,
                    y: orb.ry,
                    scale: [0.6, 1.1, 0.6],
                    opacity: [0.2, 0.95, 0.2]
                  }}
                  transition={{ 
                    duration: 5.5, 
                    repeat: Infinity, 
                    delay: orb.delay, 
                    ease: "linear" 
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: orb.cx,
                    top: orb.cy,
                    boxShadow: "0 0 9px #fff, 0 0 3px #fff"
                  }}
                />
             ))}
          </div>
        );
      case "AbyssalEcho":
        return (
          <div className="absolute inset-[-20px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Triple organic wave background interference */}
             <motion.div
               animate={{ scale: [1.0, 1.04, 1.0], opacity: [0.45, 0.75, 0.45] }}
               transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-t from-sky-900/35 via-teal-900/20 to-transparent border border-sky-400/10 blur-[20px] rounded-xl"
             />
             <motion.div
               animate={{ scale: [1.02, 1.07, 1.02], opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 3.2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
               className="absolute inset-[6px] bg-gradient-to-tr from-cyan-900/30 via-sky-800/15 to-transparent blur-[16px] rounded-xl"
             />
             <motion.div
               animate={{ scale: [1.04, 1.11, 1.04], opacity: [0.1, 0.35, 0.1] }}
               transition={{ duration: 6.5, repeat: Infinity, delay: 1.6, ease: "easeInOut" }}
               className="absolute inset-[12px] bg-gradient-to-b from-blue-900/10 to-transparent blur-[12px] rounded-xl"
             />
             {/* Rising bioluminescent bubbles */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [50, -60],
                    x: [0, Math.sin(i) * 12, 0],
                    opacity: [0, 0.85, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ 
                    duration: 4.5 + i * 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.45,
                    ease: "easeInOut" 
                  }}
                  className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  style={{
                    left: `${15 + (i * 11) % 70}%`,
                    top: "85%",
                    boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)"
                  }}
                />
             ))}
          </div>
        );
      case "QuantumEntanglement":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Quantum energy path sweep 1 (CW) */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_46%,#22d3ee_50%,transparent_54%)] opacity-45 blur-[15px]"
             />
             {/* Quantum energy path sweep 2 (CCW) */}
             <motion.div
               animate={{ rotate: [360, 0] }}
               transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_46%,#a855f7_50%,transparent_54%)] opacity-35 blur-[12px]"
             />
             {/* Entangled nodes in synchronous blinking pairs */}
             {[
               { id: 0, pair: 0, x: "20%", y: "20%" },
               { id: 1, pair: 0, x: "80%", y: "80%" },
               { id: 2, pair: 1, x: "75%", y: "25%" },
               { id: 3, pair: 1, x: "25%", y: "75%" },
               { id: 4, pair: 2, x: "50%", y: "15%" },
               { id: 5, pair: 2, x: "50%", y: "85%" }
             ].map((node) => (
                <motion.div
                  key={node.id}
                  animate={{ 
                    opacity: [0.15, 0.95, 0.15],
                    scale: [0.6, 1.35, 0.6]
                  }}
                  transition={{ 
                    duration: node.pair === 0 ? 2.2 : node.pair === 1 ? 3.0 : 1.7,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
                  style={{
                    left: node.x,
                    top: node.y,
                    boxShadow: "0 0 10px rgba(34, 211, 238, 0.8), 0 0 3px #22d3ee"
                  }}
                />
             ))}
             {/* Background soft ambient */}
             <motion.div
               animate={{ opacity: [0.35, 0.65, 0.35] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute inset-0 bg-blue-950/20 blur-[20px] rounded-xl"
             />
          </div>
        );
      case "NebulaDrift":
        return (
          <div className="absolute inset-[-28px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Cloud Layer 1 (Indigo/Pink) */}
             <motion.div
               animate={{ 
                 rotate: [0, 360],
                 scale: [0.93, 1.05, 0.93]
               }}
               transition={{ 
                 rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                 scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
               }}
               className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.25)_0%,rgba(79,70,229,0.3)_50%,transparent_100%)] blur-[25px]"
             />
             {/* Cloud Layer 2 (Teal/Purple) */}
             <motion.div
               animate={{ 
                 rotate: [360, 0],
                 scale: [1.04, 0.95, 1.04]
               }}
               transition={{ 
                 rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                 scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
               }}
               className="absolute inset-[6px] bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.2)_0%,rgba(168,85,247,0.25)_50%,transparent_100%)] blur-[20px]"
             />
             {/* Twinkling star elements */}
             {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.15, 0.85, 0.15],
                    scale: [0.6, 1.25, 0.6]
                  }}
                  transition={{ 
                    duration: 3 + (i % 3) * 0.9, 
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2.5 h-2.5 rounded-full bg-pink-100 blur-[0.4px]"
                  style={{
                    left: `${20 + (i * 13) % 60}%`,
                    top: `${20 + (i * 11) % 60}%`,
                    boxShadow: "0 0 10px rgba(244, 114, 182, 0.8), 0 0 3px #fff"
                  }}
                />
             ))}
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
      case "Void": return "border-[5px] border-black shadow-[0_0_50px_rgba(0,0,0,0.95),0_0_30px_rgba(168,85,247,0.3),inset_0_0_20px_rgba(0,0,0,0.9)] ring-1 ring-zinc-800/60";
      case "ImperialGold": return "border-[5px] border-transparent shadow-[0_0_40px_rgba(251,191,36,0.45),inset_0_0_15px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 ring-2 ring-yellow-400/30";
      case "Glass": return "border-[2px] border-white/20 shadow-xl";
      case "Titanium": return "border-[3px] border-slate-500 shadow-lg";
      case "Marble": return "border-[4px] border-slate-200 shadow-2xl ring-1 ring-black/5";
      case "PrismLine": return "border-[2px] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]";
      case "CarbonFiber": return "border-[2px] border-zinc-700 shadow-lg";
      case "Linen": return "border-[1px] border-stone-300 shadow-sm";
      case "Opal": return "border-[3px] border-transparent shadow-[0_0_35px_rgba(255,255,255,0.7),0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-white/60 bg-gradient-to-tr from-rose-200 via-azure-200 to-emerald-100";
      case "Iron": return "border-[3px] border-zinc-600 shadow-inner";
      case "Copper": return "border-[2px] border-orange-800 shadow-xl";
      case "Velvet": return "border-[5px] border-rose-900 shadow-2xl";
      case "NebulaSteel": return "border-[3px] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]";
      case "GildedRose": return "border-[4px] border-rose-300 shadow-[0_0_25px_rgba(244,114,182,0.3)] ring-1 ring-amber-400/20";
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
      case "PrismFractal": return "bg-[#04010a] bg-[linear-gradient(135deg,rgba(244,63,94,0.15)_0%,rgba(59,130,246,0.15)_50%,rgba(168,85,247,0.15)_100%)] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] before:bg-[size:30px_30px] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)] animate-pulse";
      case "InkWash": return "bg-[#f5f5f5] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1),transparent)] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]";
      case "SandDune": return "bg-[#d2b48c] bg-[linear-gradient(135deg,#c19a6b_25%,transparent_25%),linear-gradient(225deg,#c19a6b_25%,transparent_25%)] bg-[size:50px_50px]";
      case "DeepOcean": return "bg-[#000033] bg-[radial-gradient(circle_at_center,rgba(0,102,204,0.2),transparent)]";
      case "Paper": return "bg-[#fdfcf0] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]";
      case "NightCity": return "bg-[#050505] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_90%,rgba(59,130,246,0.1))]";
      case "Slate": return "bg-zinc-800 before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]";
      case "CosmicVoid": return "bg-black before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,transparent_80%)] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.01)_0%,transparent_50%)] animate-[pulse_10s_infinite]";
      case "Circuit": return "bg-[#020202] bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)]";
      case "MorningMist": return "bg-[#e6e6e6] bg-gradient-to-b from-white/20 to-transparent";
      case "RoseQuartzBG": return "bg-[#fff0f5] bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.3),transparent)]";
      case "GoldenHour": return "bg-gradient-to-tr from-[#1a1408] via-[#2d220d] to-[#120e06] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_30%,rgba(217,119,6,0.15),transparent)] before:opacity-80";
      case "MonochromeCyber": return "bg-[#080808] bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:16px_16px] before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent";
      default: return "bg-black";
    }
  };

  const getEffectLayer = () => {
    if (!mounted) return null;
    switch (effect) {
      case "StaticDust":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 opacity-40 mix-blend-overlay">
             <div className="absolute inset-0 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-[size:16px_16px]" />
          </div>
        );
      case "Vignette":
        return <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />;
      case "LightLeak":
        return (
          <motion.div 
            animate={{ opacity: [0.4, 0.7, 0.4] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.35),transparent_60%)]" 
          />
        );
      case "Sparkle":
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} animate={{ scale: [0, 1.2, 0], opacity: [0, 0.9, 0] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }} className="absolute w-2.5 h-2.5 bg-white rounded-full blur-[0.5px] shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "FallingFlowers":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 360, x: [0, 30, -30, 0] }} transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: i * 0.8 }} className="absolute text-white/90 text-[16px]" style={{ left: `${Math.random()*100}%` }}>❀</motion.div>
             ))}
          </div>
        );
      case "Petals":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 720, x: [0, 50, -50, 0] }} transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: i * 1.2 }} className="absolute text-rose-300/80 text-[18px]" style={{ left: `${Math.random()*100}%` }}>🌸</motion.div>
             ))}
          </div>
        );
      case "Feathers":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0, opacity: 0 }} animate={{ y: 500, rotate: [0, 45, -45, 0], x: [0, 40, -40, 0], opacity: [0, 0.7, 0] }} transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: i * 2 }} className="absolute text-white/60 text-[20px]" style={{ left: `${Math.random()*100}%` }}>🪶</motion.div>
             ))}
          </div>
        );
      case "Bubbles":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(15)].map((_, i) => (
               <motion.div key={i} initial={{ y: 500, opacity: 0 }} animate={{ y: -100, x: [0, 10, -10, 0], opacity: [0, 0.7, 0], scale: [0.6, 1.2, 0.8] }} transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, delay: i * 0.5 }} className="absolute w-4 h-4 border border-white/40 rounded-full bg-white/10 blur-[0.5px] shadow-[0_0_12px_rgba(255,255,255,0.3)]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "Ribbons":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-60">
             {[...Array(4)].map((_, i) => (
               <motion.div key={i} animate={{ x: ["-120%", "220%"], y: [0, 50, -50, 0] }} transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }} className="absolute h-[1.5px] w-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_white]" style={{ top: `${20 + i * 20}%`, transform: `rotate(${i * 5}deg)` }} />
             ))}
          </div>
        );
      case "Rain":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(40)].map((_, i) => (
               <motion.div key={i} initial={{ y: -10 }} animate={{ y: 500 }} transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: Math.random() * 2 }} className="absolute w-[1.5px] h-8 bg-white/40 blur-[0.2px]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "Snow":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(40)].map((_, i) => (
               <motion.div key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 500, x: [0, 20, -20, 0], opacity: [0, 0.9, 0], scale: [0.6, 1.2, 0.6] }} transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }} className="absolute w-2.5 h-2.5 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "DigitalRain":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, opacity: 0 }} animate={{ y: 500, opacity: [0, 0.8, 0] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }} className="absolute text-[13px] font-mono text-azure-400 blur-[0.5px]" style={{ left: `${Math.random()*100}%` }}>{Math.random() > 0.5 ? '1' : '0'}</motion.div>
             ))}
          </div>
        );
      case "Glitch":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ x: [-8, 8, -3, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }} className="absolute inset-0 bg-red-500/20" />
             <motion.div animate={{ x: [8, -8, 3, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }} className="absolute inset-0 bg-blue-500/20" />
             <motion.div animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }} className="absolute inset-0 bg-white/10" />
          </div>
        );
      case "Aethereal":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 0.15, repeat: Infinity }} className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 mix-blend-screen" />
             <motion.div animate={{ opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute inset-0 bg-white/15 blur-[50px]" />
          </div>
        );
      case "Interference":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-50">
             {[...Array(6)].map((_, i) => (
               <motion.div key={i} animate={{ y: ["0%", "100%"], opacity: [0, 0.8, 0] }} transition={{ duration: 0.1 + Math.random() * 0.3, repeat: Infinity, repeatDelay: Math.random() * 5 }} className="absolute w-full h-[3px] bg-azure-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]" style={{ top: `${Math.random() * 100}%` }} />
             ))}
          </div>
        );
      case "Dust":
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(30)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 6 + Math.random() * 12, repeat: Infinity }} className="absolute w-[3px] h-[3px] bg-white/80 blur-[0.2px] shadow-[0_0_8px_rgba(255,255,255,0.9)]" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
             ))}
          </div>
        );
      case "Aurora":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div 
               animate={{ 
                 opacity: [0.4, 0.7, 0.4],
                 scaleY: [1, 1.15, 1],
                 rotate: [5, 8, 5]
               }} 
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute inset-[-10%] bg-gradient-to-b from-emerald-500/20 via-purple-500/20 to-transparent blur-[30px] mix-blend-screen"
               style={{ transform: "rotate(5deg)" }}
             />
          </div>
        );
      case "Singularity":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
             <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1], opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-[300%] h-[300%] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.12)_40%,transparent_60%)] mix-blend-screen" />
             <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.2),transparent)] blur-[60px]" />
          </div>
        );
      case "Scanline":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Primary "Layer Line" - Refined Beam */}
             <motion.div 
               animate={{ y: ["-15%", "115%"] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }} 
               className="w-full h-5 bg-gradient-to-b from-transparent via-white/50 to-transparent shadow-[0_0_35px_rgba(255,255,255,0.6)] relative z-[60]" 
             />
             {/* Dynamic Scanline Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40" />
             {/* Soft CRT Flicker */}
             <motion.div animate={{ opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 0.08, repeat: Infinity }} className="absolute inset-0 bg-white/10" />
          </div>
        );
      case "Fireflies":
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 40, -40, 0], y: [0, -60, 20, 0], opacity: [0, 0.9, 0], scale: [0, 1, 0] }} transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }} className="absolute w-2.5 h-2.5 bg-amber-200 rounded-full blur-[0.5px] shadow-[0_0_12px_rgba(251,191,36,0.8)]" style={{ left: `${10+Math.random()*80}%`, top: `${10+Math.random()*80}%` }} />
             ))}
          </div>
        );
      case "Leaves":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(10)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 720, x: [0, 60, -60, 0] }} transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay: i * 2 }} className="absolute text-emerald-600/60 text-[16px]" style={{ left: `${Math.random()*100}%` }}>🍃</motion.div>
             ))}
          </div>
        );
      case "Dandelion":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(12)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 100, -100, 0], y: [0, -400], opacity: [0, 0.8, 0] }} transition={{ duration: 15 + Math.random() * 10, repeat: Infinity }} className="absolute text-white/40 text-[16px]" style={{ left: `${Math.random()*100}%`, top: "100%" }}>*</motion.div>
             ))}
          </div>
        );
      case "Steam":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(4)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: 200, opacity: 0, scale: 0.8 }} 
                 animate={{ y: -100, opacity: [0, 0.5, 0], scale: 1.5 }} 
                 transition={{ duration: 4 + i, repeat: Infinity, ease: "easeOut", delay: i * 1.5 }} 
                 className="absolute w-32 h-32 bg-white/10 blur-[25px] rounded-full" 
                 style={{ left: `${10 + i * 20}%`, bottom: 0 }} 
               />
             ))}
          </div>
        );
      case "DataStream":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-60">
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ x: ["-120%", "220%"] }} 
                 transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" }} 
                 className="absolute h-[3px] w-24 bg-gradient-to-r from-transparent via-azure-400 to-transparent shadow-[0_0_8px_#3b82f6]" 
                 style={{ top: `${15 + 18 * i}%` }} 
               />
             ))}
          </div>
        );
      case "Plasma":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div 
               animate={{ 
                 rotate: 360,
                 scale: [1, 1.1, 1],
                 opacity: [0.4, 0.7, 0.4]
               }} 
               transition={{ duration: 12, repeat: Infinity, ease: "linear" }} 
               className="absolute inset-[-20%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.3),transparent,rgba(236,72,153,0.3),transparent)] blur-[40px]" 
             />
          </div>
        );
      case "Halo":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
             <motion.div 
               animate={{ 
                 scale: [0.8, 1.1, 0.8], 
                 opacity: [0.3, 0.7, 0.3],
                 rotate: 360
               }} 
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
               className="w-48 h-48 border-[3px] border-dashed border-white/20 rounded-full blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
             />
          </div>
        );
      case "PrismGlowEffect":
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(15)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ 
                   scale: [0, 1.2, 0], 
                   opacity: [0, 0.8, 0],
                   y: [0, -40, 0]
                 }} 
                 transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }} 
                 className="absolute w-3 h-3 rounded-full blur-[0.5px]" 
                 style={{ 
                   left: `${Math.random()*100}%`, 
                   top: `${Math.random()*100}%`,
                   background: `linear-gradient(135deg, hsl(${i * 24}, 100%, 70%), hsl(${(i * 24) + 120}, 100%, 70%))`
                 }} 
               />
             ))}
          </div>
        );
      case "RealityTear":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div 
               animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [1, 1.05, 1] }} 
               transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
               className="absolute top-1/2 left-[-10%] w-[120%] h-[3px] bg-white shadow-[0_0_15px_#fff,0_0_30px_rgba(59,130,246,0.6)]" 
               style={{ transform: "rotate(-15deg)" }}
             />
          </div>
        );
      case "CherryPetals":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(12)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 500, rotate: 360, x: [0, 40, -40, 0] }} transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: i * 1.5 }} className="absolute text-rose-200/60 text-[14px]" style={{ left: `${Math.random()*100}%` }}>🌸</motion.div>
             ))}
          </div>
        );
      case "BinaryCascade":
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-50">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20 }} animate={{ y: 500 }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }} className="absolute text-[11px] font-mono text-emerald-400/80" style={{ left: `${Math.random()*100}%` }}>{Math.random() > 0.5 ? '0' : '1'}</motion.div>
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

  const getFieldScale = (field: "name" | "title" | "company" | "reading" | "phone" | "email" | "address", isVertical: boolean) => {
    let scale = "standard";
    if (field === "name") scale = scaleName;
    else if (field === "title") scale = scaleTitle;
    else if (field === "company") scale = scaleCompany;
    else if (field === "reading") scale = scaleReading || "standard";
    else if (field === "phone") scale = scalePhone || "standard";
    else if (field === "email") scale = scaleEmail || "standard";
    else if (field === "address") scale = scaleAddress || "standard";

    const base = isVertical ? 1.0 : 0.9;
    const maps = {
      standard: base,
      impact: base * 1.2,
      maximum: base * 1.5,
    };
    return maps[scale as "standard" | "impact" | "maximum"] || base;
  };

  const getDynamicFontSize = (text: string, baseSize: number, field: "name" | "title" | "company" | "reading" | "phone" | "email" | "address", isVertical: boolean) => {
    const scale = getFieldScale(field, isVertical);
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
        xDrag.set(e.clientX - (rect.left + rect.width / 2));
        yDrag.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { xDrag.set(0); yDrag.set(0); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
            transform: isFlipped ? 'translateZ(50px)' : 'translateZ(-50px)',
            clipPath: 'polygon(-1000% -1000%, -1000% 2000%, 2000% 2000%, 2000% -1000%, -1000% -1000%, 1% 1%, 1% 99%, 99% 99%, 99% 1%, 1% 1%)',
            WebkitClipPath: 'polygon(-1000% -1000%, -1000% 2000%, 2000% 2000%, 2000% -1000%, -1000% -1000%, 1% 1%, 1% 99%, 99% 99%, 99% 1%, 1% 1%)'
          }}
        >
           {getAuraLayer()}
        </div>

        <div 
          className={`absolute inset-0 overflow-hidden border bg-zinc-950 ${getFrameStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          <div className="absolute inset-0 bg-zinc-950 z-0" />
          <div className={`absolute inset-0 ${getBackgroundStyle()} z-0`} />

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
                       {title && <p className={`tracking-[0.4em] uppercase ${textMutedStyle} font-bold w-full mb-3 ${getAlignClass(alignTitle)} pointer-events-auto`} style={{ fontSize: `${getDynamicFontSize(title, 11, "title", true)}px` }}>{title}</p>}
                       {reading && <p className={`tracking-[0.3em] ${textAzureStyle} font-bold uppercase truncate w-full ${getAlignClass(alignReading)} pointer-events-auto`} style={{ fontSize: `${getDynamicFontSize(reading, 11, "reading", true)}px` }}>{reading}</p>}
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
               <div className={`absolute bottom-4 left-6 right-6 md:bottom-6 md:left-10 md:right-10 space-y-2 md:space-y-3 ${textColor === 'black' ? 'opacity-60' : 'opacity-40'} flex flex-col z-10 ${textStyle}`}>
                  {address && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><MapPin size={11} /><span className="font-mono tracking-[0.15em] truncate max-w-full" style={{ fontSize: `${getDynamicFontSize(address, 12, "address", true)}px` }}>{address}</span></div>}
                  {phone && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><Phone size={11} /><span className="font-mono tracking-[0.2em]" style={{ fontSize: `${getDynamicFontSize(phone, 12, "phone", true)}px` }}>{phone}</span></div>}
                  {email && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignEmail)}`}><Mail size={11} /><span className="font-mono tracking-[0.1em] uppercase truncate max-w-full" style={{ fontSize: `${getDynamicFontSize(email, 12, "email", true)}px` }}>{email}</span></div>}
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
                      {title && <p className={`tracking-[0.4em] uppercase ${textMutedStyle} font-bold w-full mb-2.5 ${getAlignClass(alignTitle)} pointer-events-auto`} style={{ fontSize: `${getDynamicFontSize(title, 10, "title", false)}px` }}>{title}</p>}
                      {reading && <span className={`tracking-[0.3em] ${textAzureStyle} font-bold uppercase w-full ${getAlignClass(alignReading)} pointer-events-auto`} style={{ fontSize: `${getDynamicFontSize(reading, 9, "reading", false)}px` }}>{reading}</span>}
                   </div>
                   {/* The Name Itself (Dead Center) */}
                   <h2 className={`tracking-[0.15em] uppercase font-light ${textStyle} whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)} pointer-events-auto leading-none`} style={{ fontSize: `${getDynamicFontSize(name, 28, "name", false)}px` }}>{name}</h2>
                 </div>
              </div>

              {/* Footer: Contact Info */}
              <footer className={`absolute bottom-4 left-6 right-6 md:bottom-6 md:left-10 md:right-10 flex flex-col z-10`}>
                <div className={`flex flex-col gap-1.5 ${textColor === 'black' ? 'opacity-60' : 'opacity-40'} w-full ${textStyle}`}>
                   {address && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><MapPin size={10} /><span className="font-mono tracking-widest truncate" style={{ fontSize: `${getDynamicFontSize(address, 12, "address", false)}px` }}>{address}</span></div>}
                   {phone && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignPhone)}`}><Phone size={10} /><span className="font-mono tracking-widest" style={{ fontSize: `${getDynamicFontSize(phone, 12, "phone", false)}px` }}>{phone}</span></div>}
                   {email && <div className={`flex items-center gap-2.5 w-full ${getAlignClass(alignEmail)}`}><Mail size={10} /><span className="font-mono tracking-widest uppercase truncate" style={{ fontSize: `${getDynamicFontSize(email, 12, "email", false)}px` }}>{email}</span></div>}
                </div>
              </footer>
            </div>
          )}
          {getEffectLayer()}
          
          {/* spec-glare layer (moving specular highlight) */}
          <motion.div 
            style={{ 
              x: glareX, 
              y: glareY, 
              opacity: glareOpacity, 
              background: "linear-gradient(135deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 70%)"
            }} 
            className="absolute inset-[-50%] z-20 pointer-events-none blur-xl" 
          />
        </div>

        <div 
          className={`absolute inset-0 flex flex-col justify-between items-center text-center border overflow-hidden bg-zinc-950 ${getFrameStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-zinc-950 z-0" />
          <div className={`absolute inset-0 ${getBackgroundStyle()} z-0`} />

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
          <motion.div 
            style={{ 
              x: glareX, 
              y: glareY, 
              opacity: glareOpacity, 
              background: "linear-gradient(135deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 70%)"
            }} 
            className="absolute inset-[-50%] z-20 pointer-events-none blur-xl" 
          />
        </div>
      </motion.div>
    </div>
  );
}
