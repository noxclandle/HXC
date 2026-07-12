"use client";
 
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Rotate3d, Building2, User, Phone, Mail, Instagram, Facebook, Twitter, MessageCircle, Globe, MapPin } from "lucide-react";
import { playConnectionSound } from "@/lib/audio/resonance";
import { getAuraLayer } from "@/lib/game/effects/auraLayer";
import { getEffectLayer } from "@/lib/game/effects/effectLayer";
import { getFrameStyle } from "@/lib/game/effects/frameStyle";
import { getBackgroundStyle } from "@/lib/game/effects/backgroundStyle";

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
  // IMAGE_LARGE を安全に無効な値としてフィルタリングし、Next.jsのクラッシュや画像リンク切れを防ぐ
  const safeLogoUrl = logoUrl === "IMAGE_LARGE" ? null : logoUrl;
  const safeFaceUrl = faceUrl === "IMAGE_LARGE" ? null : faceUrl;

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
           {getAuraLayer(aura, mounted)}
        </div>

        <div 
          className={`absolute inset-0 overflow-hidden border bg-zinc-950 ${getFrameStyle(frame)} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}
        >
          <div className="absolute inset-0 bg-zinc-950 z-0" />
          <div className={`absolute inset-0 ${getBackgroundStyle(background)} z-0`} />

          {isVertical ? (
            <div className="h-full p-6 md:p-10 relative overflow-hidden">
               {/* Header: Company & Logo (Moved Higher & Larger gap) */}
               <div className={`absolute top-4 left-6 right-6 md:top-6 md:left-10 md:right-10 flex flex-col z-10 ${getAlignClass(alignCompany)}`}>
                  <div className={`w-16 h-16 md:w-20 md:h-20 border ${textColor === 'black' ? 'border-black/5' : 'border-white/5'} flex items-center justify-center bg-white/[0.02] overflow-hidden shrink-0 relative mb-5`}>
                     {safeLogoUrl ? <Image src={safeLogoUrl} alt="Logo" fill className="object-contain p-2" /> : <Building2 size={32} className={textMutedStyle} />}
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
                    {safeLogoUrl ? <Image src={safeLogoUrl} alt="Logo" fill className="object-contain p-2" /> : <Building2 size={24} className={textMutedStyle} />}
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
          {getEffectLayer(effect, mounted)}
          
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
          className={`absolute inset-0 flex flex-col justify-between items-center text-center border overflow-hidden bg-zinc-950 ${getFrameStyle(frame)} ${getFontStyle()}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-zinc-950 z-0" />
          <div className={`absolute inset-0 ${getBackgroundStyle(background)} z-0`} />

          {isVertical ? (
            <div className="h-full p-6 py-8 flex flex-col justify-between items-center w-full absolute inset-0">
              <div />
              <div className="space-y-4 relative z-10 w-full flex flex-col items-center">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border ${textColor === 'black' ? 'border-black/10' : 'border-white/10'} flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl relative`}>
                   {safeFaceUrl ? <Image src={safeFaceUrl} alt="Portrait" fill className="object-cover" /> : <User size={36} className={textMutedStyle} />}
                </div>
                {bio && (
                  <div className="space-y-2 w-full">
                     <p className={`text-[11px] md:text-[12px] tracking-[0.1em] uppercase ${textStyle} leading-relaxed italic max-w-sm mx-auto line-clamp-4 px-4 whitespace-pre-wrap`}>
                       {bio}
                     </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pb-4 z-10 w-full px-2">
                 {link_hp && <a href={link_hp.startsWith('http') ? link_hp : `https://${link_hp}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Globe size={15} /><span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">HP</span></a>}
                 {link_x && <a href={link_x.startsWith('http') ? link_x : `https://x.com/${link_x}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Twitter size={15} /><span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity">X</span></a>}
                 {link_instagram && <a href={link_instagram.startsWith('http') ? link_instagram : `https://instagram.com/${link_instagram}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Instagram size={15} /><span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">Insta</span></a>}
                 {link_line && <a href={link_line.startsWith('http') ? link_line : `https://line.me/ti/p/~${link_line}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><MessageCircle size={15} /><span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">LINE</span></a>}
                 {link_facebook && <a href={link_facebook.startsWith('http') ? link_facebook : `https://facebook.com/${link_facebook}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`group/sns flex items-center gap-1.5 ${textColor === 'black' ? 'text-black/40' : 'text-white/40'} hover:${textStyle} transition-colors`}><Facebook size={15} /><span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase opacity-30 group-hover/sns:opacity-100 transition-opacity whitespace-nowrap">FB</span></a>}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 md:p-8 flex flex-row items-center justify-center gap-8 md:gap-12 w-full absolute inset-0">
               <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border ${textColor === 'black' ? 'border-black/10' : 'border-white/10'} flex items-center justify-center bg-white/[0.02] overflow-hidden shadow-2xl shrink-0 relative z-10`}>
                  {safeFaceUrl ? <Image src={safeFaceUrl} alt="Portrait" fill className="object-cover" /> : <User size={40} className={textMutedStyle} />}
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
          {getEffectLayer(effect, mounted)}
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
