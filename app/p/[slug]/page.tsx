"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Globe, Rotate3d, Twitter, Instagram, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { playResonanceSound } from "@/lib/audio/resonance";
import { QRCodeSVG } from "qrcode.react";

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  // 修正：初期状態は必ず表面 (false)。自動反転は廃止。
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGlassMode, setIsGlassMode] = useState(true);

  const profile = {
    handle: "NOX",
    rank: "Chief Officer",
    name: "Tatsuo Nakamura",
    address: "TOKYO, SHIBUYA",
    phone: "090-XXXX-XXXX",
    email: "t.nakamura@void.org",
    secret_msg: "BUILDING THE FUTURE IN SILENCE.",
    photo_url: "/logo.png",
    link_x: "https://twitter.com",
    link_instagram: "https://instagram.com",
    link_website: "https://hexa-card.com"
  };

  const handleFlip = () => {
    playResonanceSound("default");
    setIsFlipped(!isFlipped);
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nTEL:${profile.phone}\nEMAIL:${profile.email}\nORG:HexaRelation\nPHOTO;VALUE=uri:${profile.photo_url}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.handle}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-radial from-moonlight/5 to-transparent opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-sm aspect-[1/1.6] perspective-2000 cursor-pointer" onClick={handleFlip}>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full h-full preserve-3d"
        >
          {/* 【表面 0deg】最初に見える面 */}
          <div 
            className={`absolute inset-0 backface-hidden border border-moonlight/20 flex flex-col justify-between p-12 shadow-2xl transition-all duration-700
              ${isGlassMode ? 'bg-white/[0.02] backdrop-blur-2xl' : 'bg-void'}
            `}
            style={{ transform: "rotateY(0deg)" }}
          >
            <div className="relative z-10 flex flex-col items-center text-center space-y-16 mt-12">
               <img src="/logo.png" alt="Branding" className="w-20 h-20 opacity-40" />
               <div className="space-y-6">
                 <h1 className="text-5xl tracking-[0.25em] font-extralight uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{profile.handle}</h1>
                 <p className="text-[12px] tracking-[0.8em] uppercase opacity-40 font-bold">{profile.name}</p>
               </div>
            </div>
            <div className="flex justify-center items-center opacity-30 text-[9px] tracking-[0.5em] uppercase">
               <Rotate3d size={14} className="mr-4" /> Tap to reveal details
            </div>
          </div>

          {/* 【裏面 180deg】詳細面 */}
          <div 
            className={`absolute inset-0 backface-hidden border border-moonlight/30 flex flex-col shadow-2xl transition-all duration-700
              ${isGlassMode ? 'bg-white/[0.03] backdrop-blur-3xl' : 'bg-gothic-dark'}
            `}
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="relative z-10 flex-1 flex flex-col">
              <header className="p-8 pb-4 flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400 opacity-60" />
                      <span className="text-xs tracking-[0.3em] uppercase font-bold text-white">{profile.handle}</span>
                    </div>
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-40">{profile.rank}</p>
                 </div>
                 <img src="/logo.png" alt="Logo" className="w-8 h-8 opacity-20" />
              </header>

              <div className="mx-8 h-32 border border-moonlight/10 overflow-hidden relative grayscale opacity-40">
                 <img src={profile.photo_url} alt="Portrait" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent" />
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between text-center">
                <p className="text-[10px] tracking-[0.3em] leading-relaxed italic opacity-80 uppercase mb-8">
                  &quot;{profile.secret_msg}&quot;
                </p>
                
                <div className="space-y-4 border-t border-white/5 pt-8 mb-8 text-left">
                   <div className="flex items-center gap-6 text-[9px] tracking-widest opacity-60 uppercase"><MapPin size={12} className="opacity-30"/> {profile.address}</div>
                   <div className="flex items-center gap-6 text-[9px] tracking-widest opacity-60 uppercase"><Mail size={12} className="opacity-30"/> {profile.email}</div>
                </div>

                <footer className="flex justify-between items-end">
                   <div className="flex gap-6 opacity-40">
                     {profile.link_x && <Twitter size={18} />}
                     {profile.link_instagram && <Instagram size={18} />}
                     {profile.link_website && <Globe size={18} />}
                   </div>
                   <div className="p-2 bg-white rounded-sm shadow-xl">
                     <QRCodeSVG 
                        value={`${typeof window !== 'undefined' ? window.location.href : ''}`}
                        size={40} bgColor="#FFFFFF" fgColor="#000000" level="L"
                     />
                   </div>
                </footer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-12">
        <button onClick={(e) => { e.stopPropagation(); handleSaveContact(); }} className="px-16 py-4 bg-white text-void font-bold text-[10px] tracking-[0.6em] shadow-xl hover:bg-moonlight transition-all">
           Download vCard
        </button>
        <footer className="text-center">
          <p className="text-[9px] tracking-[0.4em] uppercase opacity-20">Hexa Card Premium Delivery</p>
        </footer>
      </div>
    </main>
  );
}
