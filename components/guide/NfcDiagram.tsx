"use client";

import { motion } from "framer-motion";

export function NfcDiagram() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-void border border-white/5 rounded-sm">
      <div className="relative w-64 h-full flex items-center justify-center gap-8">
        
        {/* Left Side: Sender holding the Card */}
        <motion.div 
          className="relative flex flex-col items-center"
          animate={{ 
            x: [-20, 15, 15, -20],
            rotate: [-5, 5, 5, -5],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            times: [0, 0.35, 0.75, 1],
            ease: "easeInOut"
          }}
        >
          {/* Card outline */}
          <div className="w-24 h-14 bg-gradient-to-br from-white/10 to-white/5 border border-white/30 rounded-sm shadow-lg backdrop-blur-sm relative flex items-center justify-center">
            {/* Holographic lines inside card */}
            <div className="absolute inset-1 border border-white/5 rounded-sm" />
            <div className="w-10 h-1 bg-white/20 rounded-full absolute bottom-2 right-2" />
            <div className="w-4 h-4 rounded-full border border-white/20 absolute top-2 left-2" />
          </div>
          <span className="text-[6px] tracking-widest uppercase opacity-30 mt-2">Sender Card</span>
        </motion.div>

        {/* Center: Glowing Connection Point */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {/* Touch point highlight */}
          <motion.div 
            className="w-4 h-4 rounded-full bg-azure-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            animate={{ 
              scale: [0.5, 1.2, 1.2, 0.5],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              times: [0, 0.35, 0.75, 1],
              ease: "easeInOut"
            }}
          />
          {/* Signal Waves */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-azure-500/40"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ 
              width: [0, 60, 120, 0],
              height: [0, 60, 120, 0],
              opacity: [0, 0.6, 0, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              times: [0, 0.35, 0.65, 1],
              ease: "easeOut"
            }}
          />
        </div>

        {/* Right Side: Recipient holding the Phone */}
        <motion.div 
          className="relative flex flex-col items-center animate-fade-in"
          animate={{ 
            x: [20, -15, -15, 20],
            rotate: [5, -5, -5, 5],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            times: [0, 0.35, 0.75, 1],
            ease: "easeInOut"
          }}
        >
          {/* Smartphone outline */}
          <div className="w-14 h-24 bg-neutral-900 border border-white/20 rounded-[12px] shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Top speaker bezel */}
            <div className="w-6 h-1 bg-white/10 rounded-full mt-1.5" />
            {/* Screen border */}
            <div className="absolute inset-1.5 border border-white/5 rounded-[8px] bg-gradient-to-b from-white/[0.02] to-transparent flex items-center justify-center">
              {/* NFC Hotspot indicator on phone */}
              <div className="w-2 h-2 rounded-full bg-azure-500/20 border border-azure-500/30 absolute top-1 animate-pulse" />
            </div>
          </div>
          <span className="text-[6px] tracking-widest uppercase opacity-30 mt-2">Recipient Phone</span>
        </motion.div>

      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
         <span className="text-[7px] tracking-[0.4em] uppercase opacity-30">Touch & Resonance Exchange</span>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </div>
  );
}
