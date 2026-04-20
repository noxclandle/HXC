"use client";

import { motion } from "framer-motion";

export default function ConstellationView({ contacts }: { contacts: any[] }) {
  return (
    <div className="relative w-full h-[400px] border border-moonlight/5 bg-void/50 overflow-hidden mb-12 rounded-sm cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-moonlight/10 to-transparent" />
      
      <motion.div 
        drag
        dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
        className="relative w-full h-full"
      >
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {/* Draw lines */}
          {contacts.map((c, i) => {
            return contacts.slice(i + 1).map((c2, j) => {
              const dist = Math.sqrt(Math.pow(c.x - c2.x, 2) + Math.pow(c.y - c2.y, 2));
              if (dist < 40) {
                return (
                  <motion.line
                    key={`line-${i}-${j}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.15 }}
                    transition={{ duration: 3, delay: i * 0.1 }}
                    x1={`${c.x}%`} y1={`${c.y}%`}
                    x2={`${c2.x}%`} y2={`${c2.y}%`}
                    stroke="white"
                    strokeWidth="0.5"
                  />
                );
              }
              return null;
            });
          })}
        </svg>

        {/* Star Points */}
        {contacts.map((c, i) => (
          <motion.div
            key={c.id}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
            style={{ top: `${c.y}%`, left: `${c.x}%` }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[7px] tracking-widest uppercase opacity-40 whitespace-nowrap group-hover:opacity-100 transition-opacity">
              {c.handle}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-4 left-6 text-[8px] tracking-[0.4em] uppercase opacity-20 italic pointer-events-none">
        Soul Constellation: Interactive Map
      </div>
    </div>
  );
}
