"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { useState, useEffect } from "react";

export default function VoidRadar() {
  const [detectedPoints, setDetectedPoints] = useState([
    { x: 30, y: 50, id: "UNKNOWN_A", distance: 1.2 },
    { x: 70, y: 20, id: "UNKNOWN_B", distance: 2.5 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDetectedPoints(prev => prev.map(p => ({
        ...p,
        x: p.x + (Math.random() - 0.5) * 2,
        y: p.y + (Math.random() - 0.5) * 2,
        distance: Math.sqrt(Math.pow(p.x - 50, 2) + Math.pow(p.y - 50, 2)) / 20
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-md relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-[9px] tracking-[0.4em] uppercase opacity-40 flex items-center gap-2">
          <Radio size={14} className="animate-pulse" /> Radar: Nearby
        </h3>
        <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest italic">Live Scanning...</span>
      </div>

      <div className="aspect-square w-full relative flex items-center justify-center border border-moonlight/5 rounded-full bg-void/30">
        {/* Radar Ripples */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
            className="absolute inset-0 border border-moonlight/20 rounded-full"
          />
        ))}

        {/* Center (You) */}
        <div className="w-2 h-2 bg-moonlight rounded-full shadow-[0_0_10px_white] relative z-10" />

        {/* Detected Unknown Souls */}
        {detectedPoints.map((p) => (
          <motion.div
            key={p.id}
            animate={{ 
              top: `${p.y}%`, 
              left: `${p.x}%`,
              opacity: p.distance < 2 ? 0.8 : 0.2 
            }}
            className="absolute w-1.5 h-1.5 bg-moonlight rounded-full cursor-help group"
          >
             <div className="absolute -inset-2 border border-moonlight/10 rounded-full animate-ping" />
             {/* Distance Tooltip on Hover */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-moonlight text-void px-2 py-0.5 text-[6px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Dist: {p.distance.toFixed(1)}m
             </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
         <p className="text-[8px] tracking-[0.2em] opacity-30 uppercase italic leading-relaxed">
           未知の座標が {detectedPoints.length} 件、漂っています。<br />
           共鳴（交換）によりその存在を確定させてください。
         </p>
      </div>
    </div>
  );
}
