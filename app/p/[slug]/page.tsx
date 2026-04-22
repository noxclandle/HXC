"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Mail, Phone, Rotate3d, Twitter, Instagram, Globe, ShieldCheck, MapPin, Loader2 } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";
import { QRCodeSVG } from "qrcode.react";

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateYBase = useTransform(x, [-100, 100], [-10, 10]);
  
  // falseで0度（表面）、trueで180度（裏面）
  const finalRotateY = useTransform(rotateYBase, (val) => val + (isFlipped ? 180 : 0));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
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
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
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
      case "Architect": return "shadow-[0_0_80px_rgba(52,211,153,0.3)] border-emerald-500/40";
      case "Black Tier": return "shadow-[0_0_80px_rgba(251,191,36,0.3)] border-amber-500/40";
      default: return "shadow-[0_0_60px_rgba(255,255,255,0.1)] border-white/20";
    }
  };

  if (loading) return <div className="min-h-screen bg-void flex items-center justify-center"><Loader2 className="animate-spin text-moonlight/20" size={32} /></div>;
  if (!profile) return <div className="min-h-screen bg-void flex items-center justify-center text-[10px] uppercase tracking-[0.5em] opacity-40">Identity Not Found</div>;

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div 
        className="w-full max-w-sm aspect-[1/1.6] perspective-2000 cursor-pointer z-10" 
        onClick={handleFlip}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
      >
        <motion.div
          style={{ 
            rotateX, 
            rotateY: finalRotateY,
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%"
          }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          {/* 【表面】The Monolith */}
          <div 
            className={`absolute inset-0 flex flex-col justify-between p-10 bg-gothic-dark/90 backdrop-blur-xl border-t transition-all duration-700 ${getRankGlow(profile.rank)}`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              zIndex: isFlipped ? 0 : 1
            }}
          >
            <div className="flex flex-col items-center text-center mt-12 space-y-12">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                 <ShieldCheck size={64} className="opacity-20" strokeWidth={0.5} />
               </motion.div>
               <div className="space-y-4">
                 <h1 className="text-4xl tracking-[0.3em] font-extralight uppercase text-white">{profile.handle_name || profile.name.split(' ')[0]}</h1>
                 <p className="text-[10px] tracking-[0.6em] uppercase opacity-40 font-bold">{profile.name}</p>
                 <p className="text-[8px] tracking-[0.4em] uppercase text-emerald-400">{profile.rank}</p>
               </div>
            </div>
            <div className="flex justify-center items-center opacity-30 text-[8px] tracking-[0.5em] uppercase">
               <Rotate3d size={12} className="mr-3" /> Tap to Reveal
            </div>
          </div>

          {/* 【裏面】The Archive */}
          <div 
            className={`absolute inset-0 flex flex-col bg-gothic-dark border-t backdrop-blur-3xl transition-all duration-700 ${getRankGlow(profile.rank)}`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              zIndex: isFlipped ? 1 : 0
            }}
          >
             <header className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="text-left">
                  <p className="text-xs font-bold uppercase text-white">{profile.name}</p>
                  <p className="text-[8px] opacity-40 uppercase tracking-widest">{profile.role || "Member"}</p>
                </div>
                <ShieldCheck size={20} className="opacity-20" />
             </header>

             <div className="p-8 flex-1 flex flex-col justify-center space-y-8">
                <div className="space-y-4 text-left">
                   {profile.address && <div className="flex items-center gap-4 text-[9px] tracking-widest opacity-80 uppercase"><MapPin size={12} className="opacity-40"/> {profile.address}</div>}
                   {profile.phone && <div className="flex items-center gap-4 text-[9px] tracking-widest opacity-80 uppercase"><Phone size={12} className="opacity-40"/> {profile.phone}</div>}
                   {profile.email && <div className="flex items-center gap-4 text-[9px] tracking-widest opacity-80 uppercase"><Mail size={12} className="opacity-40"/> {profile.email}</div>}
                </div>

                <div className="flex justify-center py-4">
                   <div className="p-3 bg-white rounded-sm">
                      <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : ''} size={100} level="M" />
                   </div>
                </div>

                <div className="flex justify-center gap-6 opacity-40">
                   {profile.link_x && <a href={profile.link_x} target="_blank"><Twitter size={18} /></a>}
                   {profile.link_instagram && <a href={profile.link_instagram} target="_blank"><Instagram size={18} /></a>}
                   {profile.link_website && <a href={profile.link_website} target="_blank"><Globe size={18} /></a>}
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 w-full max-w-sm">
        <button 
          onClick={handleSaveContact} 
          className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.8em] uppercase shadow-2xl hover:scale-[1.02] transition-all active:scale-95"
        >
           Save Contact
        </button>
      </div>
    </main>
  );
}
