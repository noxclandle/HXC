"use client";

import { motion } from "framer-motion";

export function getAuraLayer(aura: string | undefined, mounted: boolean) {
    if (!mounted) return null;
    switch (aura) {
      // --- Common Auras (Subtle, single-layer slow animation) ---
      case "DimGlow":
        return (
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1.0, 1.01, 1.0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-12px] bg-gradient-to-tr from-white/5 via-zinc-300/12 to-white/5 blur-[12px] rounded-xl z-0"
          />
        );
      case "ShadowBorder":
        return (
          <motion.div 
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(0,0,0,0.5)", 
                "0 0 20px rgba(0,0,0,0.8)", 
                "0 0 10px rgba(0,0,0,0.5)"
              ],
              scale: [1.0, 1.005, 1.0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-8px] border border-white/5 rounded-xl z-0" 
          />
        );
      case "Pulse":
        return (
          <motion.div
            animate={{ 
              opacity: [0.2, 0.55, 0.2],
              scale: [1.0, 1.015, 1.0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-16px] bg-gradient-to-tr from-azure-600/10 via-cyan-400/20 to-azure-600/10 blur-[15px] rounded-xl z-0"
          />
        );

      // --- Rare Auras (Breathing, scaling, multi-layered volumetric flow) ---
      case "WhiteMist":
        return (
          <div className="absolute inset-[-20px] z-0 rounded-xl pointer-events-none">
            {/* Outer Volumetric Mist Layer */}
            <motion.div
              animate={{ 
                opacity: [0.35, 0.65, 0.35], 
                scale: [1.0, 1.03, 1.0],
                filter: ["blur(20px)", "blur(30px)", "blur(20px)"]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-white/20 rounded-xl"
            />
            {/* Inner Volumetric Shift Layer */}
            <motion.div
              animate={{ 
                opacity: [0.25, 0.55, 0.25], 
                scale: [0.99, 1.015, 0.99],
                filter: ["blur(14px)", "blur(20px)", "blur(14px)"]
              }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
              className="absolute inset-2 bg-zinc-200/15 rounded-xl"
            />
          </div>
        );
      case "AzureFlame":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl pointer-events-none">
            {/* Outer Flame Glow */}
            <motion.div
              animate={{ 
                opacity: [0.4, 0.75, 0.4], 
                scale: [1.0, 1.035, 1.0],
                y: [-3, 3, -3]
              }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-t from-azure-600/25 via-cyan-500/30 to-transparent blur-[25px] rounded-xl"
            />
            {/* Inner Core Flame */}
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3], 
                scale: [0.98, 1.015, 0.98],
                y: [2, -2, 2]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
              className="absolute inset-[8px] bg-gradient-to-t from-cyan-400/20 via-blue-500/25 to-transparent blur-[15px] rounded-xl"
            />
          </div>
        );
      case "VioletHaze":
        return (
          <div className="absolute inset-[-20px] z-0 rounded-xl pointer-events-none">
            {/* Clockwise swirl */}
            <motion.div
              animate={{ 
                opacity: [0.4, 0.65, 0.4], 
                scale: [1.0, 1.025, 1.0],
                rotate: [0, 360]
              }}
              transition={{ 
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 14, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-500/25 via-purple-600/10 to-transparent blur-[22px] rounded-xl"
            />
            {/* Counter-clockwise swirl */}
            <motion.div
              animate={{ 
                opacity: [0.25, 0.5, 0.25], 
                scale: [0.98, 1.015, 0.98],
                rotate: [360, 0]
              }}
              transition={{ 
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                rotate: { duration: 11, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-[4px] bg-gradient-to-bl from-indigo-500/20 via-indigo-600/5 to-transparent blur-[18px] rounded-xl"
            />
          </div>
        );
      case "EmeraldDust":
        return (
          <div className="absolute inset-[-20px] z-0 pointer-events-none rounded-xl overflow-hidden">
             {/* Dynamic drifting particles with glowing shadows */}
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [25, -25, 25],
                    x: [0, Math.sin(i) * 15, 0],
                    opacity: [0, 0.85, 0],
                    scale: [0.7, 1.1, 0.7]
                  }}
                  transition={{
                    duration: 3.5 + (i % 3) * 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[0.4px]"
                  style={{
                    left: `${15 + (i * 7) % 70}%`,
                    top: `${15 + (i * 9) % 70}%`,
                    boxShadow: "0 0 8px rgba(52, 211, 153, 0.8)"
                  }}
                />
             ))}
             {/* Ambient green backdrop pulse */}
             <motion.div
               animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.02, 1] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-emerald-500/20 blur-[20px] rounded-xl"
             />
          </div>
        );
      case "SakuraRemembrance":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Rose gold & Sakura soft gradient background */}
             <motion.div
               animate={{ 
                 opacity: [0.35, 0.65, 0.35], 
                 scale: [1.0, 1.025, 1.0],
                 rotate: [0, 15, 0]
               }}
               transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-tr from-rose-400/20 via-rose-300/25 to-amber-200/10 blur-[22px]"
             />
             {/* Wind-blown sakura petals with circular motion */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [40, -40],
                    x: [0, Math.sin(i) * 20, 0],
                    rotate: [0, 360],
                    opacity: [0, 0.8, 0],
                    scale: [0.6, 1.0, 0.6]
                  }}
                  transition={{ 
                    duration: 5.5 + i * 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.45,
                    ease: "easeInOut" 
                  }}
                  className="absolute text-[11px]"
                  style={{
                    left: `${15 + (i * 10) % 70}%`,
                    top: `${80 - (i * 8) % 60}%`,
                    filter: "drop-shadow(0 0 4px rgba(244, 63, 94, 0.35))"
                  }}
                >
                  🌸
                </motion.div>
             ))}
          </div>
        );

      // --- Epic Auras (Active borders, dynamic grids / neon runs) ---
      case "GoldenHalo":
        return (
          <div className="absolute inset-[-16px] z-0 rounded-xl overflow-hidden flex items-center justify-center">
             {/* Shimmering rotating gold gradient */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
               className="absolute w-[180%] h-[180%] bg-[conic-gradient(from_0deg,#d97706_0%,#f59e0b_25%,#fbbf24_50%,#f59e0b_75%,#d97706_100%)] opacity-35 blur-[22px]"
             />
             <div className="absolute inset-[6px] bg-zinc-950/80 rounded-xl" />
             {/* Gold dust flare particles */}
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.15, 0.85, 0.15], 
                    scale: [0.5, 1.25, 0.5],
                    y: [0, -15, 0]
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
                  className="absolute w-1 h-1 bg-amber-200 rounded-full"
                  style={{
                    left: `${20 + (i * 12) % 60}%`,
                    top: `${15 + (i * 14) % 70}%`,
                    boxShadow: "0 0 10px #fbbf24, 0 0 3px #fbbf24"
                  }}
                />
             ))}
          </div>
        );
      case "CrimsonFlare":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl pointer-events-none">
             {/* Heartbeat pulse glow */}
             <motion.div
               animate={{ 
                 scale: [1.0, 1.04, 0.98, 1.03, 1.0], 
                 opacity: [0.4, 0.85, 0.35, 0.75, 0.4] 
               }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-red-500/20 to-rose-700/25 blur-[25px] rounded-xl"
             />
             {/* Inner corona line */}
             <motion.div
               animate={{ 
                 scale: [0.99, 1.015, 0.99],
                 rotate: [0, -10, 0]
               }}
               transition={{ duration: 4.5, repeat: Infinity }}
               className="absolute inset-[6px] border border-red-500/25 blur-[4px] rounded-xl"
             />
          </div>
        );
      case "CyberGrid":
        return (
          <div className="absolute inset-[-20px] z-0 overflow-hidden rounded-xl border border-azure-500/20">
             {/* Flowing circuit grid mesh */}
             <motion.div 
               animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_1.5px,transparent_1.5px),linear-gradient(to_bottom,#3b82f6_1.5px,transparent_1.5px)] bg-[size:12px_12px] opacity-40 blur-[0.4px]" 
             />
             {/* Perimeter routing active nodes */}
             {[
               { top: 0, left: "0%" },
               { top: "50%", left: 0 },
               { top: "100%", left: "50%" },
               { top: "25%", left: "100%" }
             ].map((node, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.8, 1.4, 0.8]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                  style={{
                    ...node,
                    boxShadow: "0 0 10px #22d3ee"
                  }}
                />
             ))}
             {/* Grid backglow */}
             <motion.div
               animate={{ opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-azure-500/20 blur-[15px] rounded-xl"
             />
          </div>
        );
      case "HolyChamber":
        return (
          <div className="absolute inset-[-16px] z-0 rounded-xl overflow-hidden flex items-center justify-center pointer-events-none">
             {/* Fast, sharp conic sweeping light ray */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_42%,#ffffff_50%,#fbbf24_52%,transparent_58%)] opacity-90 blur-[1.5px]"
             />
             {/* Geometry frame center lock */}
             <div className="absolute inset-[3px] bg-zinc-950/92 rounded-xl" />
             {/* Background soft pulse */}
             <motion.div
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 3.5, repeat: Infinity }}
               className="absolute inset-0 bg-amber-500/10 blur-[12px]"
             />
          </div>
        );

      // --- Mythic Auras (Conic gradient rotation, gravity lensing, distortion, eclipse) ---
      case "VoidEclipse":
        return (
          <div className="absolute inset-[-30px] z-0 rounded-xl flex items-center justify-center pointer-events-none">
             {/* Outer solar flares (scaling rings) */}
             <motion.div
               animate={{ scale: [1, 2.2], opacity: [0.65, 0] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
               className="absolute w-[120%] h-[120%] border-2 border-white/35 rounded-xl blur-[2px]"
             />
             <motion.div
               animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 1.75 }}
               className="absolute w-[120%] h-[120%] border-2 border-white/15 rounded-xl blur-[4px]"
             />
             {/* Shimmering solar silver/white corona */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               className="absolute w-[220%] h-[220%] bg-[conic-gradient(from_0deg,transparent_35%,rgba(255,255,255,0.9)_50%,transparent_65%)] opacity-95 blur-[10px]"
             />
             {/* Secondary opposing corona */}
             <motion.div
               animate={{ rotate: -360 }}
               transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_40%,rgba(168,85,247,0.4)_50%,transparent_60%)] opacity-75 blur-[15px]"
             />
             {/* Inner Void Shell (Eclipse core) */}
             <motion.div 
               animate={{ scale: [0.98, 1.02, 0.98] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-[10px] bg-black border border-white/30 blur-[18px] opacity-95 shadow-[0_0_35px_rgba(255,255,255,0.3)] rounded-xl" 
             />
          </div>
        );
      case "PrismGlow":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden flex items-center justify-center">
             {/* CW Color Spectrum Rotation */}
             <motion.div
               animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
               transition={{ 
                 rotate: { duration: 7, repeat: Infinity, ease: "linear" },
                 scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
               }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#ff007f,#ff7f00,#ffff00,#00ff7f,#00ffff,#007fff,#7f00ff,#ff007f)] opacity-55 blur-[22px]"
             />
             {/* CCW Shifting Counter-Spectrum */}
             <motion.div
               animate={{ rotate: [360, 0], scale: [1.03, 0.95, 1.03] }}
               transition={{ 
                 rotate: { duration: 9, repeat: Infinity, ease: "linear" },
                 scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
               }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_180deg,#7f00ff,#007fff,#00ffff,#00ff7f,#ffff00,#ff7f00,#ff007f,#7f00ff)] opacity-45 blur-[18px]"
             />
             {/* Prism reflection particles */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.1, 0.9, 0.1],
                    scale: [0.4, 1.2, 0.4],
                    backgroundColor: ["#3b82f6", "#ec4899", "#10b981", "#ff7f00", "#3b82f6"]
                  }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${10 + (i * 12) % 80}%`,
                    top: `${10 + (i * 11) % 80}%`,
                    boxShadow: "0 0 10px currentColor"
                  }}
                />
             ))}
             {/* Glistening stars */}
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  animate={{ 
                    opacity: [0, 0.95, 0],
                    scale: [0.2, 1.3, 0.2],
                    rotate: [0, 180]
                  }}
                  transition={{ duration: 1.8 + Math.random() * 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  className="absolute w-2.5 h-2.5 bg-white rounded-full blur-[0.2px] shadow-[0_0_15px_#fff]"
                  style={{
                    left: `${Math.random()*90 + 5}%`,
                    top: `${Math.random()*90 + 5}%`
                  }}
                />
             ))}
          </div>
        );
      case "SingularityCore":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl flex items-center justify-center pointer-events-none">
             {/* Pulsing event horizon boundary ring */}
             <motion.div
               animate={{ scale: [1.02, 1.06, 1.02], opacity: [0.3, 0.7, 0.3] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-[10px] border border-purple-500/40 rounded-xl blur-[1px] shadow-[0_0_20px_rgba(168,85,247,0.4)]"
             />
             {/* Rotating Gravitational Lens core */}
             <motion.div
               animate={{ 
                 scale: [0.96, 1.05, 0.96],
                 rotate: [0, 360]
               }}
               transition={{ 
                 scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                 rotate: { duration: 5, repeat: Infinity, ease: "linear" }
               }}
               className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(0,0,0,0.98)_30%,rgba(168,85,247,0.7)_50%,rgba(0,0,0,0.98)_70%)] blur-[12px] rounded-xl"
             />
             {/* Lensing Distortion rings */}
             <motion.div
               animate={{ scale: [1.04, 0.96, 1.04], rotate: [360, 0] }}
               transition={{ 
                 scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                 rotate: { duration: 7, repeat: Infinity, ease: "linear" }
               }}
               className="absolute inset-[4px] bg-[conic-gradient(from_180deg,rgba(0,0,0,0.95)_35%,rgba(59,130,246,0.65)_50%,rgba(0,0,0,0.95)_65%)] border border-azure-500/30 blur-[18px] rounded-xl"
             />
             {/* Captured star elements falling into singularity with swirling motion */}
             {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0.8, 0],
                    opacity: [1, 0],
                    rotate: [0, 360],
                    x: [Math.cos(i * (Math.PI / 6)) * 60, 0],
                    y: [Math.sin(i * (Math.PI / 6)) * 60, 0]
                  }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3, ease: "easeIn" }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    boxShadow: "0 0 6px #fff"
                  }}
                />
             ))}
          </div>
        );

      // --- Legendary Auras (Ultimate multi-layer particle wind, orbits, gas drift, entanglement) ---
      case "StellarWind":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Cosmic Wind gas flow */}
             <motion.div
               animate={{ 
                 opacity: [0.4, 0.75, 0.4], 
                 scale: [1.0, 1.03, 1.0],
                 rotate: [0, 10, 0]
               }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-rose-500/20 to-indigo-600/20 blur-[25px]"
             />
             {/* Circular Star Orbits - Real Circular Orbit Paths */}
             {[
               { cx: "50%", cy: "50%", rx: [0, 45, 0, -45, 0], ry: [-65, 0, 65, 0, -65], delay: 0 },
               { cx: "50%", cy: "50%", rx: [45, 0, -45, 0, 45], ry: [0, 65, 0, -65, 0], delay: 0.8 },
               { cx: "50%", cy: "50%", rx: [0, -45, 0, 45, 0], ry: [65, 0, -65, 0, 65], delay: 1.6 },
               { cx: "50%", cy: "50%", rx: [-45, 0, 45, 0, -45], ry: [0, -65, 0, 65, 0], delay: 2.4 },
               { cx: "50%", cy: "50%", rx: [0, 30, 0, -30, 0], ry: [-45, 0, 45, 0, -45], delay: 0.4 },
               { cx: "50%", cy: "50%", rx: [-30, 0, 30, 0, -30], ry: [0, 45, 0, -45, 0], delay: 1.2 }
             ].map((orb, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: orb.rx,
                    y: orb.ry,
                    scale: [0.6, 1.1, 0.6],
                    opacity: [0.2, 0.95, 0.2]
                  }}
                  transition={{ 
                    duration: 5.5, 
                    repeat: Infinity, 
                    delay: orb.delay, 
                    ease: "linear" 
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: orb.cx,
                    top: orb.cy,
                    boxShadow: "0 0 9px #fff, 0 0 3px #fff"
                  }}
                />
             ))}
          </div>
        );
      case "AbyssalEcho":
        return (
          <div className="absolute inset-[-20px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Triple organic wave background interference */}
             <motion.div
               animate={{ scale: [1.0, 1.04, 1.0], opacity: [0.45, 0.75, 0.45] }}
               transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-gradient-to-t from-sky-900/35 via-teal-900/20 to-transparent border border-sky-400/10 blur-[20px] rounded-xl"
             />
             <motion.div
               animate={{ scale: [1.02, 1.07, 1.02], opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 3.2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
               className="absolute inset-[6px] bg-gradient-to-tr from-cyan-900/30 via-sky-800/15 to-transparent blur-[16px] rounded-xl"
             />
             <motion.div
               animate={{ scale: [1.04, 1.11, 1.04], opacity: [0.1, 0.35, 0.1] }}
               transition={{ duration: 6.5, repeat: Infinity, delay: 1.6, ease: "easeInOut" }}
               className="absolute inset-[12px] bg-gradient-to-b from-blue-900/10 to-transparent blur-[12px] rounded-xl"
             />
             {/* Rising bioluminescent bubbles */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [50, -60],
                    x: [0, Math.sin(i) * 12, 0],
                    opacity: [0, 0.85, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ 
                    duration: 4.5 + i * 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.45,
                    ease: "easeInOut" 
                  }}
                  className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  style={{
                    left: `${15 + (i * 11) % 70}%`,
                    top: "85%",
                    boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)"
                  }}
                />
             ))}
          </div>
        );
      case "QuantumEntanglement":
        return (
          <div className="absolute inset-[-24px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Quantum energy path sweep 1 (CW) */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_46%,#22d3ee_50%,transparent_54%)] opacity-45 blur-[15px]"
             />
             {/* Quantum energy path sweep 2 (CCW) */}
             <motion.div
               animate={{ rotate: [360, 0] }}
               transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_46%,#a855f7_50%,transparent_54%)] opacity-35 blur-[12px]"
             />
             {/* Entangled nodes in synchronous blinking pairs */}
             {[
               { id: 0, pair: 0, x: "20%", y: "20%" },
               { id: 1, pair: 0, x: "80%", y: "80%" },
               { id: 2, pair: 1, x: "75%", y: "25%" },
               { id: 3, pair: 1, x: "25%", y: "75%" },
               { id: 4, pair: 2, x: "50%", y: "15%" },
               { id: 5, pair: 2, x: "50%", y: "85%" }
             ].map((node) => (
                <motion.div
                  key={node.id}
                  animate={{ 
                    opacity: [0.15, 0.95, 0.15],
                    scale: [0.6, 1.35, 0.6]
                  }}
                  transition={{ 
                    duration: node.pair === 0 ? 2.2 : node.pair === 1 ? 3.0 : 1.7,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
                  style={{
                    left: node.x,
                    top: node.y,
                    boxShadow: "0 0 10px rgba(34, 211, 238, 0.8), 0 0 3px #22d3ee"
                  }}
                />
             ))}
             {/* Background soft ambient */}
             <motion.div
               animate={{ opacity: [0.35, 0.65, 0.35] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute inset-0 bg-blue-950/20 blur-[20px] rounded-xl"
             />
          </div>
        );
      case "NebulaDrift":
        return (
          <div className="absolute inset-[-28px] z-0 rounded-xl overflow-hidden pointer-events-none">
             {/* Cloud Layer 1 (Indigo/Pink) */}
             <motion.div
               animate={{ 
                 rotate: [0, 360],
                 scale: [0.93, 1.05, 0.93]
               }}
               transition={{ 
                 rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                 scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
               }}
               className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.25)_0%,rgba(79,70,229,0.3)_50%,transparent_100%)] blur-[25px]"
             />
             {/* Cloud Layer 2 (Teal/Purple) */}
             <motion.div
               animate={{ 
                 rotate: [360, 0],
                 scale: [1.04, 0.95, 1.04]
               }}
               transition={{ 
                 rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                 scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
               }}
               className="absolute inset-[6px] bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.2)_0%,rgba(168,85,247,0.25)_50%,transparent_100%)] blur-[20px]"
             />
             {/* Twinkling star elements */}
             {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.15, 0.85, 0.15],
                    scale: [0.6, 1.25, 0.6]
                  }}
                  transition={{ 
                    duration: 3 + (i % 3) * 0.9, 
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2.5 h-2.5 rounded-full bg-pink-100 blur-[0.4px]"
                  style={{
                    left: `${20 + (i * 13) % 60}%`,
                    top: `${20 + (i * 11) % 60}%`,
                    boxShadow: "0 0 10px rgba(244, 114, 182, 0.8), 0 0 3px #fff"
                  }}
                />
             ))}
          </div>
        );
      default: return null;
    }
}
