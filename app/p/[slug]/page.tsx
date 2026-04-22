"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Mail, Phone, Globe, Rotate3d, Twitter, Instagram, ExternalLink, ShieldCheck, MapPin, Loader2 } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";
import { QRCodeSVG } from "qrcode.react";
export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // マウス/タッチ時の3D傾き効果 (反転とは別の、わずかな傾き)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateYBase = useTransform(x, [-100, 100], [-10, 10]);

  // 反転角度を計算 (表は0度付近、裏は180度付近)
  const finalRotateY = useTransform(rotateYBase, (val) => val + (isFlipped ? 180 : 0));

  useEffect(() => {
    // ... fetch logic ...

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({
            ...data,
            secret_msg: (data.ai_config && data.ai_config.personality) ? `ALIGNMENT: ${data.ai_config.personality.toUpperCase()}` : "AWAITING RESONANCE.",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.slug]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFlip = () => {
    playResonanceSound("silver");
    setIsFlipped(!isFlipped);
  };

  const handleSaveContact = () => {
    if (!profile) return;
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nTEL:${profile.phone || ""}\nEMAIL:${profile.email || ""}\nORG:HexaRelation\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.handle_name || profile.name}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRankGlow = (rank: string) => {
    switch (rank) {
      case "Architect": return "shadow-[0_0_60px_rgba(52,211,153,0.3)] border-emerald-500/30"; // Emerald
      case "Black Tier": return "shadow-[0_0_60px_rgba(251,191,36,0.3)] border-amber-500/30"; // Amber
      case "Void Voyager": return "shadow-[0_0_60px_rgba(192,132,252,0.3)] border-purple-500/30"; // Purple
      default: return "shadow-[0_0_50px_rgba(255,255,255,0.1)] border-moonlight/20"; // Silver
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-moonlight">
         <Loader2 className="animate-spin opacity-20 mb-8" size={32} />
         <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 animate-pulse">Summoning Identity...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-moonlight">
         <ShieldCheck className="opacity-10 mb-8" size={48} />
         <p className="text-[10px] tracking-[0.5em] uppercase opacity-40">Identity Not Found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* 舞い散る星屑エフェクト (Background Particles) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [null, 0, Math.random() * 0.5 + 0.1]
            }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />
      
      {/* 3Dカードコンテナ */}
      <div 
        className="w-full max-w-sm aspect-[1/1.6] perspective-2000 cursor-pointer z-10" 
        onClick={handleFlip}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY: finalRotateY }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full h-full preserve-3d"
        >
          {/* 【表面】The Monolith */}
          <div 
            className={`absolute inset-0 backface-hidden flex flex-col justify-between p-10 transition-all duration-700 bg-gothic-dark/80 backdrop-blur-xl ${getRankGlow(profile.rank)}`}
            style={{ transform: "rotateY(0deg)" }}
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center mt-16 space-y-12">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               >
                 <ShieldCheck size={56} className="opacity-20" strokeWidth={0.5} />
               </motion.div>
               <div className="space-y-6">
                 <h1 className="text-4xl tracking-[0.3em] font-extralight uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                   {profile.handle_name || profile.name.split(' ')[0]}
                 </h1>
                 <p className="text-[10px] tracking-[0.6em] uppercase opacity-40 font-bold">{profile.name}</p>
                 <div className="h-px w-12 bg-white/20 mx-auto" />
                 <p className="text-[8px] tracking-[0.4em] uppercase text-emerald-400">{profile.rank}</p>
               </div>
            </div>
            <div className="flex justify-center items-center opacity-30 text-[8px] tracking-[0.5em] uppercase pb-4">
               <Rotate3d size={12} className="mr-3 animate-pulse" /> Tap to reveal soul
            </div>
          </div>

          {/* 【裏面】The Archive */}
          <div 
            className={`absolute inset-0 backface-hidden flex flex-col transition-all duration-700 bg-gothic-dark/90 backdrop-blur-3xl ${getRankGlow(profile.rank)}`}
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="relative z-10 flex-1 flex flex-col">
              <header className="p-8 pb-6 flex justify-between items-start border-b border-white/5 bg-white/[0.02]">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-[0.4em] uppercase font-bold text-white">{profile.name}</span>
                    </div>
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-50">{profile.role || "Member"}</p>
                 </div>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <ShieldCheck size={14} className="opacity-40" />
                 </div>
              </header>

              <div className="p-8 flex-1 flex flex-col justify-between text-center relative overflow-hidden">
                {/* 透かしの装飾 */}
                <div className="absolute -left-16 top-1/4 opacity-[0.02] rotate-90 text-[100px] font-black tracking-widest pointer-events-none">HXC</div>

                <p className="text-[9px] tracking-[0.4em] leading-loose italic opacity-60 uppercase mb-8 relative z-10">
                  &quot;{profile.secret_msg}&quot;
                </p>
                
                <div className="space-y-5 text-left relative z-10">
                   {profile.address && (
                     <div className="flex items-center gap-4 text-[9px] tracking-widest opacity-80 uppercase group">
                       <MapPin size={12} className="opacity-40 group-hover:text-emerald-400 transition-colors"/> 
                       <span>{profile.address}</span>
                     </div>
                   )}
                   {profile.phone && (
                     <div className="flex items-center gap-4 text-[9px] tracking-widest opacity-80 uppercase group">
                       <Phone size={12} className="opacity-40 group-hover:text-emerald-400 transition-colors"/> 
                       <span>{profile.phone}</span>
                     </div>
                   )}
                   {profile.email && (
                     <div className="flex items-center gap-4 text-[9px] tracking-widest opacity-80 uppercase group">
                       <Mail size={12} className="opacity-40 group-hover:text-emerald-400 transition-colors"/> 
                       <span>{profile.email}</span>
                     </div>
                   )}
                </div>

                <footer className="flex justify-between items-end mt-8 relative z-10 pt-6 border-t border-white/5">
                   <div className="flex gap-5 opacity-40">
                     {profile.link_x && <a href={profile.link_x} target="_blank" onClick={e=>e.stopPropagation()}><Twitter size={16} className="hover:text-white transition-colors" /></a>}
                     {profile.link_instagram && <a href={profile.link_instagram} target="_blank" onClick={e=>e.stopPropagation()}><Instagram size={16} className="hover:text-white transition-colors" /></a>}
                     {profile.link_website && <a href={profile.link_website} target="_blank" onClick={e=>e.stopPropagation()}><Globe size={16} className="hover:text-white transition-colors" /></a>}
                   </div>
                   <div className="p-2 bg-white rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                     <QRCodeSVG 
                        value={`${typeof window !== 'undefined' ? window.location.href : ''}`}
                        size={48} bgColor="#FFFFFF" fgColor="#000000" level="M"
                        includeMargin={false}
                     />
                   </div>
                </footer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-8 relative z-10 w-full max-w-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); handleSaveContact(); }} 
          className="w-full py-5 bg-moonlight text-void font-bold text-[10px] tracking-[0.8em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-white hover:scale-[1.02] transition-all active:scale-95"
        >
           Save to Contacts
        </button>
        <p className="text-[7px] tracking-[0.5em] uppercase opacity-20">Secured by Hexa Card System</p>
      </div>
    </main>
  );
}
