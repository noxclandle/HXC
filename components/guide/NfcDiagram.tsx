"use client";

import { motion } from "framer-motion";

export function NfcDiagram() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-void border border-white/5 rounded-sm">
      <div className="relative w-48 h-full flex items-center justify-center">
        {/* Smartphone Silhouette */}
        <div className="relative w-24 h-36 bg-neutral-900 border border-white/20 rounded-[20px] shadow-2xl overflow-hidden">
           {/* NFC Target Area */}
           <motion.div 
             className="absolute top-0 left-0 right-0 h-8 bg-azure-500/10 border-b border-azure-500/20"
             animate={{ opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/10 rounded-full" />
           <div className="absolute inset-2 border border-white/5 rounded-[12px] bg-gradient-to-b from-white/[0.02] to-transparent" />
        </div>

        {/* Hexa Card Silhouette */}
        <motion.div 
          className="absolute w-28 h-16 bg-gradient-to-br from-white/10 to-white/5 border border-white/30 rounded-md backdrop-blur-sm shadow-xl z-10"
          initial={{ x: 60, y: 0, rotate: 10, opacity: 0 }}
          animate={{ 
            x: [60, 0, 0, 60],
            y: [20, -10, -10, 20],
            rotate: [10, -5, -5, 10],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut"
          }}
        >
          <div className="absolute top-2 left-2 w-4 h-4 rounded-full border border-white/20" />
          <div className="absolute bottom-2 right-2 w-8 h-1 bg-white/20 rounded-full" />
        </motion.div>

        {/* Signal Waves */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 2, 3],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 1.2,
            repeatDelay: 2
          }}
        >
          <div className="w-12 h-12 rounded-full border border-azure-500/30" />
        </motion.div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </div>
  );
}
