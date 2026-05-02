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
  frame = "Obsidian", background = "Default", effect = "None", fontFamily = "Standard", sound = "resonance",
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
      case "Gold": return "border-bronze-400/40 shadow-xl";
      case "Dynamic": return "border-azure-500/40 shadow-xl";
      case "Sakura": return "border-rose-400/40 shadow-[0_0_20px_rgba(251,113,133,0.1)]";
      case "Emerald": return "border-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.1)]";
      case "Platinum": return "border-[3px] border-slate-500 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-1 ring-white/20 ring-inset";
      case "ImperialGold": return "border-[4px] border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.4)] ring-2 ring-amber-300/30 ring-inset bg-amber-900/5";
      case "BlackCard": return "border-[2px] border-zinc-900 ring-1 ring-zinc-800/50 ring-inset shadow-[0_30px_60px_rgba(0,0,0,1)]";
      default: return "border-white/10 shadow-2xl";
    }
  };

  const getBackgroundStyle = () => {
    const bg = background || "Default";
    switch (bg) {
      case "Carbon": return "bg-[#0A0A0A] bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-[size:4px_4px]";
      case "MonochromeGrid": return "bg-[#050505] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px]";
      case "BrushedMetal": return "bg-zinc-800 bg-[linear-gradient(105deg,#27272a_0%,#52525b_25%,#27272a_50%,#52525b_75%,#27272a_100%)] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)] before:pointer-events-none";
      case "SilkBlur": return "bg-black before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:blur-[60px] before:opacity-50 before:pointer-events-none";
      case "Nebula": return "bg-[#050505] bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(30,58,138,0.15),transparent_40%)]";
      case "CrimsonVelvet": return "bg-[#1a0505] bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] before:mix-blend-overlay before:pointer-events-none";
      case "IceGlass": return "bg-[#0a0f15] before:absolute before:inset-0 before:backdrop-blur-[20px] before:bg-white/[0.02] before:border before:border-white/10 before:pointer-events-none";
      case "BrandedHex": return "bg-[#080808] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxwYXRoIGQ9Ik0zMCAwbDE1IDI2djI2TDMwIDYwIDE1IDUybDAtMjZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L3N2Zz4=')] bg-[size:30px_30px]";
      case "BlackCard": return "bg-[#030303] bg-[radial-gradient(ellipse_at_top,#1a1a1a,transparent_80%)]";
      case "Stardust": return "bg-[#050508] bg-[radial-gradient(white_0.5px,transparent_0.5px)] bg-[size:20px_20px] opacity-90";
      case "RoyalGold": return "bg-[#0f0a05] bg-[radial-gradient(circle_at_50%_50%,rgba(180,139,94,0.15),transparent_70%)] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjYmI5OTVlIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] before:pointer-events-none";
      case "MidnightMist": return "bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] before:absolute before:inset-0 before:bg-white/[0.02] before:blur-xl before:pointer-events-none";
      case "DigitalFlow": return "bg-[#020202] bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100%_4px]";
      case "PrismFractal": return "bg-[#050505] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-rose-500/5 before:via-azure-500/5 before:to-emerald-500/5 before:pointer-events-none";
      default: return "bg-[#050505]";
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
          className={`absolute inset-0 overflow-hidden border ${getFrameStyle()} ${getBackgroundStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          {/* Effects Layer */}
          {effect === "Aethereal" && (
            <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwaDF2MUgwem0yIDyaDF2MUgyeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPC9zdmc+')] animate-[shimmer_5s_linear_infinite]" />
          )}
          {effect === "Glitch" && (
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse opacity-70" />
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_50%)] bg-[size:100%_2px] opacity-40 pointer-events-none" />
               <div className="absolute inset-x-0 h-[1px] bg-white/30 animate-[scan_3s_linear_infinite]" />
            </div>
          )}
          {effect === "Interference" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 border-[2px] border-white/20 rounded-full scale-0 opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute inset-0 border-[1px] border-white/10 rounded-full scale-0 opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1.5s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.03] to-transparent animate-pulse" />
            </div>
          )}
          {effect === "Petals" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               {[...Array(6)].map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute bg-rose-300/30 rounded-full blur-[1px] animate-fall" 
                   style={{ 
                     width: `${Math.random() * 6 + 4}px`, 
                     height: `${Math.random() * 6 + 4}px`, 
                     left: `${Math.random() * 100}%`, 
                     top: `-20px`,
                     animationDelay: `${Math.random() * 10}s`,
                     animationDuration: `${Math.random() * 5 + 7}s`
                   }} 
                 />
               ))}
            </div>
          )}

          {isVertical ? (
            <div className="h-full p-10 flex flex-col items-center">
               <div className={`flex flex-col gap-4 w-full ${getAlignClass(alignCompany)}`}>
                  <div className="w-14 h-14 border border-white/5 flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0">
                     {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 size={24} className="text-white/10" />}
                  </div>
                  <p className={`text-[11px] tracking-[0.2em] uppercase text-white font-medium leading-relaxed w-full ${getAlignClass(alignCompany)}`}>{company || "CORPORATION"}</p>
               </div>
               <div className="flex-1" />
               <div className="space-y-3 w-full flex flex-col py-2">
                  {title && <p className={`text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold w-full ${getAlignClass(alignTitle)}`}>{title}</p>}
                  <div className="flex flex-col gap-2 w-full">
                     {reading && <p className={`text-[10px] tracking-[0.3em] text-azure-400 font-bold uppercase truncate w-full ${getAlignClass(alignReading)}`}>{reading}</p>}
                     <h2 className={`text-2xl tracking-[0.1em] uppercase font-light text-white whitespace-nowrap overflow-hidden text-ellipsis w-full ${getAlignClass(alignName)}`}>{name}</h2>
                  </div>
                  <div className={`h-px w-10 bg-azure-500/30 mt-1 ${alignName === 'left' ? 'self-start' : alignName === 'right' ? 'self-end' : 'self-center'}`} />
               </div>
               <div className="flex-[2]" />
               <div className="space-y-3 opacity-40 flex flex-col w-full pb-2">
                  {phone && <div className={`flex items-center gap-2 w-full ${getAlignClass(alignPhone)}`}><Phone size={10} className="text-azure-400" /><span className="font-mono text-[9px] tracking-[0.2em]">{phone}</span></div>}
                  {email && <div className={`flex items-center gap-2 w-full ${getAlignClass(alignEmail)}`}><Mail size={10} className="text-azure-400" /><span className="font-mono text-[9px] tracking-[0.1em] uppercase truncate max-w-full">{email}</span></div>}
               </div>
            </div>
          ) : (
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
                   {title && <p className={`text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold w-full ${getAlignClass(alignTitle)}`}>{title}</p>}
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

        <div 
          className={`absolute inset-0 p-8 flex flex-col justify-between items-center text-center border ${getFrameStyle()} ${getBackgroundStyle()} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div />
          <div className="space-y-4 relative z-10 w-full flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl">
               {faceUrl ? <img src={faceUrl} alt="Portrait" className="w-full h-full object-cover" /> : <User size={32} className="text-white/5" />}
            </div>
            <div className="space-y-3 w-full">
               <p className="text-[8px] tracking-[0.5em] uppercase text-white/30">Verified Identity</p>
               <div className="h-px w-8 bg-white/10 mx-auto" />
               <p className="text-[9px] tracking-[0.1em] uppercase text-white/60 leading-relaxed italic max-w-xs mx-auto line-clamp-3">
                 {bio || "Hexa Network Verified Identity"}
               </p>
            </div>
          </div>
          <div className="flex gap-4 pb-4">
             {link_x && <Twitter size={14} className="text-white/20" />}
             {link_instagram && <Instagram size={14} className="text-white/20" />}
             {link_line && <MessageCircle size={14} className="text-white/20" />}
             {link_facebook && <Facebook size={14} className="text-white/20" />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
