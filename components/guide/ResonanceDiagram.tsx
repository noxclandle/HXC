"use client";

import { motion } from "framer-motion";

export function ResonanceDiagram() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-void border border-white/5 rounded-sm">
      <div className="relative">
        {/* Central Core */}
        <motion.div 
          className="w-12 h-12 rounded-full bg-azure-500/20 border border-azure-400/50 flex items-center justify-center relative z-10"
          animate={{ 
            boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 40px rgba(59,130,246,0.5)", "0 0 20px rgba(59,130,246,0.2)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-4 h-4 rounded-full bg-azure-400 shadow-[0_0_10px_#60a5fa]" />
        </motion.div>

        {/* Expanding Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-azure-500/30 rounded-full"
            initial={{ width: 48, height: 48, opacity: 0.5 }}
            animate={{ 
              width: 160, 
              height: 160, 
              opacity: 0 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 0.8,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Floating Particles (RT Symbols) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-azure-300 rounded-full"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: Math.cos(i * 60 * Math.PI / 180) * 80,
              y: Math.sin(i * 60 * Math.PI / 180) * 80,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
         <span className="text-[8px] tracking-[0.4em] uppercase opacity-30">Syncing with Resonance</span>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </div>
  );
}
