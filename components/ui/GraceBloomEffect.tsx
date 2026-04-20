"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function GraceBloomEffect({ isActive, onComplete }: { isActive: boolean, onComplete: () => void }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
      setTimeout(onComplete, 6000);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: "-10vh", opacity: 0 }}
              animate={{ 
                y: "110vh", 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{ 
                duration: p.duration, 
                delay: p.delay, 
                ease: "linear",
                repeat: Infinity 
              }}
              className="absolute w-1 h-1 bg-moonlight shadow-[0_0_8px_white] rounded-full"
            />
          ))}
          {/* Subtle Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-white"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
