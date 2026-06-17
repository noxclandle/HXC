"use client";

import { motion } from "framer-motion";

export function OcrDiagram() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-void border border-white/5 rounded-sm">
      <div className="relative w-48 h-28 border border-white/10 rounded-sm bg-neutral-900 overflow-hidden shadow-inner">
        {/* Mock Card Data */}
        <div className="p-4 space-y-2 opacity-30">
           <div className="w-20 h-2 bg-white/20 rounded-full" />
           <div className="w-32 h-2 bg-white/10 rounded-full" />
           <div className="w-24 h-2 bg-white/10 rounded-full" />
           <div className="w-16 h-4 border border-white/20 rounded-sm" />
        </div>

        {/* Scanning Line */}
        <motion.div 
          className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981] z-20"
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Recognized Text Highlights */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-3 bg-emerald-500/20 border border-emerald-500/40 rounded-sm"
            initial={{ opacity: 0, width: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              width: ["0%", "40%", "40%"],
              left: ["10%", "10%", "10%"],
              top: [(i + 1) * 20 + "%", (i + 1) * 20 + "%", (i + 1) * 20 + "%"]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              delay: 0.5 + i * 0.2
            }}
          />
        ))}

        {/* Camera Corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500/50" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-500/50" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-500/50" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500/50" />
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
         <span className="text-[8px] tracking-[0.4em] uppercase opacity-30 text-emerald-500/60">AI Optical Analysis</span>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </div>
  );
}
