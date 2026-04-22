"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Zap, Shield, Rotate3d, ShieldCheck } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";

interface HexaCardProps {
  name: string;
  uid: string;
  rt: string;
  personality: string;
  aura: number;
  background?: string;
}

export default function HexaCardPreview({ name, uid, rt, personality, aura, background = "default" }: HexaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateYBase = useTransform(x, [-100, 100], [-10, 10]);
  
  // isFlippedがfalseのとき0度（表）、trueのとき180度（裏）
  const finalRotateY = useTransform(rotateYBase, (val) => val + (isFlipped ? 180 : 0));

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <div 
      className="relative w-full max-w-md aspect-[1.6/1] cursor-pointer"
      style={{ perspective: "2000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => {
        playResonanceSound("default");
        setIsFlipped(!isFlipped);
      }}
    >
      <motion.div
        style={{ 
          rotateX, 
          rotateY: finalRotateY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%"
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        {/* 【表面】必ず最初に見える面 */}
        <div 
          className="absolute inset-0 bg-void border border-moonlight/20 shadow-2xl p-8 flex flex-col justify-between"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 1
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 50%, rgba(224,224,224,${aura/100}), transparent)` }} />
          
          <header className="relative z-10 flex justify-between items-start text-white">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border border-moonlight/20 flex items-center justify-center bg-void">
                  <ShieldCheck size={24} className="text-emerald-400" />
               </div>
               <div>
                 <h3 className="text-[8px] tracking-[0.4em] uppercase opacity-40 mb-1">Registered Entity</h3>
                 <p className="text-xl tracking-[0.3em] uppercase font-bold">{name}</p>
               </div>
            </div>
            <div className="text-right">
               <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-1">Status</h3>
               <div className="flex items-center gap-2 text-emerald-400 text-[10px] tracking-widest uppercase">
                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                 Active
               </div>
            </div>
          </header>

          <footer className="relative z-10 flex justify-between items-end">
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-1">Physical UID</h3>
                <p className="font-mono text-[11px] tracking-widest opacity-80">{uid}</p>
              </div>
              <div className="flex gap-4 opacity-60">
                 {personality === "Sentinel" && <Shield size={14} />}
                 <span className="text-[9px] uppercase tracking-[0.2em]">{personality} Mode</span>
              </div>
            </div>
            <div className="flex flex-col items-end opacity-20 hover:opacity-100 transition-opacity">
               <Rotate3d size={16} />
               <span className="text-[6px] uppercase tracking-widest mt-1">Flip Card</span>
            </div>
          </footer>
        </div>

        {/* 【裏面】クリックした時だけ見える面 */}
        <div 
          className="absolute inset-0 bg-gothic-dark border border-moonlight/40 shadow-2xl p-8 flex flex-col justify-center items-center text-center"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 1 : 0
          }}
        >
          <div className="space-y-6">
            <h3 className="text-[10px] tracking-[0.6em] uppercase opacity-40">Resonance Energy</h3>
            <p className="text-4xl font-extralight italic text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              {rt} <span className="text-xs not-italic opacity-40 ml-2">RT</span>
            </p>
            <div className="h-px w-12 bg-white/10 mx-auto" />
            <p className="text-[8px] tracking-[0.4em] uppercase opacity-40 leading-loose">
              SYSTEM ALIGNMENT: 0.12.8<br />
              AUTHORIZED CHIEF ACCESS
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
