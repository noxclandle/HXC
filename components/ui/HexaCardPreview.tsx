"use client";

import { motion } from "framer-motion";
import { Hexagon, Zap, Shield, Cpu } from "lucide-react";

interface HexaCardProps {
  name: string;
  uid: string;
  rt: string;
  personality: string;
  aura: number;
  background?: string;
}

export default function HexaCardPreview({ name, uid, rt, personality, aura, background = "default" }: HexaCardProps) {
  const getBgStyle = () => {
    switch (background) {
      case "Marble": return "url('https://www.transparenttextures.com/patterns/black-linen.png')";
      case "Constellation": return "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)";
      default: return "none";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full max-w-md aspect-[1.6/1] bg-void border border-moonlight/20 shadow-2xl overflow-hidden group perspective-1000"
      style={{ 
        backgroundImage: getBgStyle(),
        backgroundSize: background === "Constellation" ? "30px 30px" : "cover"
      }}
    >
      {/* Dynamic Aura Background */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-1000 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(224,224,224,${aura/100}), transparent)`,
        }}
      />
      
      {/* Geometric Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <img src="/logo.png" alt="Card Logo" className="w-24 h-24 object-contain" />
      </div>

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <header className="flex justify-between items-start">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border border-moonlight/20 overflow-hidden bg-void">
                <img src="/logo.png" alt="Profile" className="w-full h-full object-contain opacity-40" />
             </div>
             <div>
               <h3 className="text-[8px] tracking-[0.4em] uppercase opacity-40 mb-1">Registered Entity</h3>
               <p className="text-xl tracking-[0.3em] uppercase font-extralight">{name}</p>
             </div>
          </div>
          <div className="text-right">
             <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-1">Status</h3>
             <div className="flex items-center gap-2 text-emerald-400 text-[10px] tracking-widest uppercase">
               <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
               Synchronized
             </div>
          </div>
        </header>

        <footer className="flex justify-between items-end">
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-1">Physical UID</h3>
              <p className="font-mono text-[11px] tracking-widest opacity-80">{uid}</p>
            </div>
            <div className="flex gap-4 opacity-60">
               {personality === "Sentinel" && <Shield size={14} />}
               {personality === "Scholar" && <Cpu size={14} />}
               {personality === "Guide" && <Zap size={14} />}
               <span className="text-[9px] uppercase tracking-[0.2em]">{personality} Mode</span>
            </div>
          </div>
          <div className="text-right">
             <h3 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-2">Stored RT</h3>
             <p className="text-2xl tracking-tighter font-extralight italic">
               {rt} <span className="text-[10px] not-italic opacity-40 tracking-widest ml-1">RT</span>
             </p>
          </div>
        </footer>
      </div>

      {/* Glass shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </motion.div>
  );
}
