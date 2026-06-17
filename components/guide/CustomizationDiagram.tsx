"use client";

import { motion } from "framer-motion";

export function CustomizationDiagram() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-void border border-white/5 rounded-sm">
      <div className="relative w-48 h-28 flex flex-col items-center justify-center">
        {/* Layer Stack */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-20 border border-white/20 rounded-md shadow-xl overflow-hidden"
            style={{ 
              backgroundColor: i === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              backdropFilter: i > 0 ? 'blur(2px)' : 'none',
              zIndex: 10 - i
            }}
            initial={{ y: i * 15, opacity: 0.5, scale: 0.9 + i * 0.05 }}
            animate={{ 
              y: [i * 15, i * 25, i * 15],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            {/* Mock content for each layer */}
            {i === 0 && <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/10 to-transparent opacity-50" />}
            {i === 1 && <div className="absolute inset-4 border border-white/10 rounded-sm" />}
            {i === 2 && <div className="absolute top-2 right-2 w-4 h-4 rounded-full border border-white/40" />}
          </motion.div>
        ))}

        {/* Selection Indicator */}
        <motion.div 
          className="absolute w-4 h-4 rounded-full border-2 border-bronze-400 z-30"
          animate={{ 
            x: [40, -40, 40],
            y: [30, -30, 30],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
         <span className="text-[8px] tracking-[0.4em] uppercase opacity-30 text-bronze-400/60">Multilayer Identity Construction</span>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </div>
  );
}
