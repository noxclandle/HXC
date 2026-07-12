"use client";

import { motion } from "framer-motion";

export function getEffectLayer(effect: string | undefined, mounted: boolean) {
    if (!mounted) return null;
    switch (effect) {
      // =================================================================
      // --- COMMON EFFECTS (0-1 Moving Elements - Simple, Quiet) ---
      // =================================================================
      case "Vignette":
        // 0 Moving Elements: Static shadowed border
        return <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />;
        
      case "StaticDust":
        // 0 Moving Elements: Static micro-noise grain overlay
        return (
          <div className="absolute inset-0 pointer-events-none z-50 opacity-20 mix-blend-overlay">
             <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
        );

      case "LightLeak":
        // Legacy Common: Subtle static glow
        return (
          <motion.div 
            animate={{ opacity: [0.4, 0.7, 0.4] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.35),transparent_60%)]" 
          />
        );

      // =================================================================
      // --- RARE EFFECTS (1-2 Moving Elements - Light Particles/Motion) ---
      // =================================================================
      case "Sparkle":
        // 1 Moving Element Type: Blinking star particles
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(8)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }} 
                 transition={{ duration: 3.5 + (i % 3) * 0.8, repeat: Infinity, delay: i * 0.45 }} 
                 className="absolute w-2 h-2 bg-white rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
                 style={{ left: `${15 + (i * 11) % 70}%`, top: `${15 + (i * 7) % 70}%` }} 
               />
             ))}
          </div>
        );

      case "Bubbles":
        // 1 Moving Element Type: Rising ambient bubbles
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: 320, opacity: 0 }} 
                 animate={{ y: -40, opacity: [0, 0.65, 0] }} 
                 transition={{ duration: 5.5 + (i % 3) * 1.5, repeat: Infinity, delay: i * 0.7, ease: "linear" }} 
                 className="absolute w-3 h-3 border border-white/25 rounded-full bg-white/5" 
                 style={{ left: `${10 + (i * 13) % 80}%` }} 
               />
             ))}
          </div>
        );

      case "FallingFlowers":
        // Legacy Rare: Descending flowers
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(10)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 320, rotate: 360, x: [0, 30, -30, 0] }} transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: i * 0.8 }} className="absolute text-white/70 text-[14px]" style={{ left: `${Math.random()*100}%` }}>❀</motion.div>
             ))}
          </div>
        );

      case "Petals":
        // Legacy Rare: Falling petals
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(10)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 320, rotate: 720, x: [0, 50, -50, 0] }} transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: i * 1.2 }} className="absolute text-rose-300/60 text-[16px]" style={{ left: `${Math.random()*100}%` }}>🌸</motion.div>
             ))}
          </div>
        );

      case "Snow":
        // Legacy Rare: Snow particles
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 320, x: [0, 20, -20, 0], opacity: [0, 0.8, 0], scale: [0.6, 1.1, 0.6] }} transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }} className="absolute w-2 h-2 bg-white rounded-full blur-[0.8px] shadow-[0_0_8px_white]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );

      case "Rain":
        // Legacy Rare: Rain streaks
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(25)].map((_, i) => (
               <motion.div key={i} initial={{ y: -10 }} animate={{ y: 320 }} transition={{ duration: 0.7 + Math.random() * 0.4, repeat: Infinity, delay: Math.random() * 2 }} className="absolute w-[1px] h-6 bg-white/30 blur-[0.1px]" style={{ left: `${Math.random()*100}%` }} />
             ))}
          </div>
        );

      case "Fireflies":
        // Legacy Rare: Drifting sparks
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(12)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 30, -30, 0], y: [0, -50, 20, 0], opacity: [0, 0.85, 0], scale: [0, 1, 0] }} transition={{ duration: 4.5 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }} className="absolute w-2 h-2 bg-amber-200 rounded-full blur-[0.4px] shadow-[0_0_10px_rgba(251,191,36,0.7)]" style={{ left: `${15+Math.random()*70}%`, top: `${15+Math.random()*70}%` }} />
             ))}
          </div>
        );

      case "Leaves":
        // Legacy Rare: Green leaves
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0 }} animate={{ y: 320, rotate: 720, x: [0, 45, -45, 0] }} transition={{ duration: 9 + Math.random() * 4, repeat: Infinity, delay: i * 1.8 }} className="absolute text-emerald-600/50 text-[14px]" style={{ left: `${Math.random()*100}%` }}>🍃</motion.div>
             ))}
          </div>
        );

      case "Dandelion":
        // Legacy Rare: Dandelion seeds
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 80, -80, 0], y: [0, -320], opacity: [0, 0.7, 0] }} transition={{ duration: 14 + Math.random() * 8, repeat: Infinity }} className="absolute text-white/30 text-[14px]" style={{ left: `${Math.random()*100}%`, top: "100%" }}>*</motion.div>
             ))}
          </div>
        );

      case "Steam":
        // Legacy Rare: Steaming fog
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(3)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: 150, opacity: 0, scale: 0.8 }} 
                 animate={{ y: -80, opacity: [0, 0.4, 0], scale: 1.4 }} 
                 transition={{ duration: 4.5 + i, repeat: Infinity, ease: "easeOut", delay: i * 1.8 }} 
                 className="absolute w-24 h-24 bg-white/5 blur-[20px] rounded-full" 
                 style={{ left: `${15 + i * 25}%`, bottom: 0 }} 
               />
             ))}
          </div>
        );

      // =================================================================
      // --- EPIC EFFECTS (3 Moving Elements - Structured/Active) ---
      // =================================================================
      case "Scanline":
        // 3 Moving/Structured Elements: 
        // 1. Scanning laser beam
        // 2. Dynamic CRT micro-flicker
        // 3. Static background grid lines (provides structured depth)
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Element 1: Active laser sweep */}
             <motion.div 
               animate={{ y: ["-10%", "110%"] }} 
               transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }} 
               className="w-full h-4 bg-gradient-to-b from-transparent via-white/40 to-transparent shadow-[0_0_25px_rgba(255,255,255,0.55)]" 
             />
             {/* Element 2: Dynamic CRT flicker */}
             <motion.div 
               animate={{ opacity: [0.03, 0.09, 0.03] }} 
               transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }} 
               className="absolute inset-0 bg-white/10" 
             />
             {/* Element 3: Structured grid backdrop */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_6px] opacity-50" />
          </div>
        );

      case "DigitalRain":
        // 3 Moving/Structured Elements:
        // 1. Cascading binary streams
        // 2. Glitchy horizontal sync line
        // 3. Ambient pulse overlay
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Element 1: Falling binary code */}
             {[...Array(10)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: -40, opacity: 0 }} 
                 animate={{ y: 320, opacity: [0, 0.8, 0] }} 
                 transition={{ duration: 2.6 + (i % 3) * 0.7, repeat: Infinity, delay: i * 0.32, ease: "linear" }} 
                 className="absolute text-[9px] font-mono text-azure-400/70" 
                 style={{ left: `${8 + (i * 9) % 85}%` }}
               >
                 {i % 2 === 0 ? "1" : "0"}
               </motion.div>
             ))}
             {/* Element 2: Rapid horizontal glitch sweeps */}
             <motion.div 
               animate={{ y: ["0%", "100%"], opacity: [0, 0.2, 0] }} 
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute w-full h-[1px] bg-azure-500 shadow-[0_0_8px_#3b82f6]" 
             />
             {/* Element 3: Cyber pulse backdrop */}
             <motion.div 
               animate={{ opacity: [0.05, 0.15, 0.05] }} 
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute inset-0 bg-azure-950/15" 
             />
          </div>
        );

      case "Feathers":
        // Legacy Epic: Drifting feathers
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {[...Array(6)].map((_, i) => (
               <motion.div key={i} initial={{ y: -20, rotate: 0, opacity: 0 }} animate={{ y: 320, rotate: [0, 45, -45, 0], x: [0, 30, -30, 0], opacity: [0, 0.65, 0] }} transition={{ duration: 10 + Math.random() * 6, repeat: Infinity, delay: i * 2.2 }} className="absolute text-white/50 text-[18px]" style={{ left: `${Math.random()*100}%` }}>🪶</motion.div>
             ))}
          </div>
        );

      case "Ribbons":
        // Legacy Epic: Shimmering ribbons
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-50">
             {[...Array(3)].map((_, i) => (
               <motion.div key={i} animate={{ x: ["-120%", "220%"], y: [0, 40, -40, 0] }} transition={{ duration: 13 + i * 4, repeat: Infinity, ease: "linear" }} className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_white]" style={{ top: `${25 + i * 25}%`, transform: `rotate(${i * 4}deg)` }} />
             ))}
          </div>
        );

      case "Aethereal":
        // Legacy Epic: Stardust texture pulse
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 0.2, repeat: Infinity }} className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-screen" />
             <motion.div animate={{ opacity: [0.08, 0.2, 0.08] }} transition={{ duration: 5.5, repeat: Infinity }} className="absolute inset-0 bg-white/10 blur-[40px]" />
          </div>
        );

      case "Interference":
        // Legacy Epic: Wave interference lines
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-40">
             {[...Array(4)].map((_, i) => (
               <motion.div key={i} animate={{ y: ["0%", "100%"], opacity: [0, 0.7, 0] }} transition={{ duration: 0.15 + Math.random() * 0.3, repeat: Infinity, repeatDelay: Math.random() * 4 }} className="absolute w-full h-[2px] bg-azure-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ top: `${Math.random() * 100}%` }} />
             ))}
          </div>
        );

      case "Dust":
        // Legacy Epic: Drifting cosmic dust
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(20)].map((_, i) => (
               <motion.div key={i} animate={{ x: [0, 25, -25, 0], y: [0, -25, 25, 0], opacity: [0, 0.75, 0] }} transition={{ duration: 7 + Math.random() * 10, repeat: Infinity }} className="absolute w-[2px] h-[2px] bg-white/70 blur-[0.3px] shadow-[0_0_6px_rgba(255,255,255,0.8)]" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
             ))}
          </div>
        );

      case "DataStream":
        // Legacy Epic: Sliding data packets
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-50">
             {[...Array(4)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ x: ["-120%", "220%"] }} 
                 transition={{ duration: 3.2 + i * 0.6, repeat: Infinity, ease: "linear" }} 
                 className="absolute h-[2px] w-20 bg-gradient-to-r from-transparent via-azure-400 to-transparent shadow-[0_0_8px_#3b82f6]" 
                 style={{ top: `${20 + 20 * i}%` }} 
               />
             ))}
          </div>
        );

      // =================================================================
      // --- LEGENDARY EFFECTS (4 Moving Elements - Rich & Multi-layered) ---
      // =================================================================
      case "CherryPetals":
        // 4 Moving/Distinct Elements:
        // 1. Falling/swaying petals (organic drift)
        // 2. Twinkling rose-gold star dust particles
        // 3. Soft ambient background pink aura flow
        // 4. Diagonal light wind streaks (adds directional speed)
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Element 1: Swaying and falling petals */}
             {[...Array(8)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: -20, rotate: 0 }} 
                 animate={{ 
                   y: 320, 
                   x: [0, 25, -25, 0],
                   rotate: [0, 360] 
                 }} 
                 transition={{ duration: 8.5 + (i % 3) * 1.8, repeat: Infinity, delay: i * 1.3, ease: "easeInOut" }} 
                 className="absolute text-rose-200/65 text-[13px]" 
                 style={{ left: `${5 + (i * 12) % 85}%` }}
               >
                 🌸
               </motion.div>
             ))}
             {/* Element 2: Twinkling gold star dust */}
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={`sparkle-${i}`} 
                 animate={{ scale: [0, 1, 0], opacity: [0, 0.75, 0] }} 
                 transition={{ duration: 2.8 + i * 0.35, repeat: Infinity, delay: i * 0.5 }} 
                 className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full blur-[0.2px] shadow-[0_0_6px_#fbbf24]" 
                 style={{ left: `${20 + (i * 15) % 60}%`, top: `${20 + (i * 11) % 60}%` }} 
               />
             ))}
             {/* Element 3: Soft rose gold background flow */}
             <motion.div 
               animate={{ opacity: [0.18, 0.4, 0.18], scale: [1, 1.025, 1] }} 
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-transparent to-amber-500/5 blur-[18px]" 
             />
             {/* Element 4: Linear wind sweep lines */}
             {[...Array(2)].map((_, i) => (
               <motion.div 
                 key={`wind-${i}`} 
                 animate={{ x: ["-100%", "200%"], y: ["-20%", "120%"] }} 
                 transition={{ duration: 6.5 + i * 1.5, repeat: Infinity, ease: "linear", delay: i * 3.2 }} 
                 className="absolute h-[0.5px] w-40 bg-gradient-to-r from-transparent via-rose-300/25 to-transparent" 
                 style={{ top: `${35 + i * 35}%`, transform: "rotate(-15deg)" }} 
               />
             ))}
          </div>
        );

      case "BinaryCascade":
        // 4 Moving/Distinct Elements:
        // 1. Cascading data streams
        // 2. Blinking glowing data nodes
        // 3. Subtle matrix cyber grid overlay
        // 4. Sweeping horizontal synchronization beam
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Element 1: Cascading code digits */}
             {[...Array(12)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ y: -30 }} 
                 animate={{ y: 320 }} 
                 transition={{ duration: 2.2 + (i % 3) * 0.6, repeat: Infinity, delay: i * 0.28, ease: "linear" }} 
                 className="absolute text-[10px] font-mono text-emerald-400/85" 
                 style={{ left: `${6 + (i * 8) % 88}%` }}
               >
                 {i % 2 === 0 ? "0" : "1"}
               </motion.div>
             ))}
             {/* Element 2: Glowing neural nodes */}
             {[...Array(4)].map((_, i) => (
               <motion.div 
                 key={`node-${i}`} 
                 animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.2, 0.75, 0.2] }} 
                 transition={{ duration: 2.0 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} 
                 className="absolute w-1 h-1 bg-emerald-350 rounded-full shadow-[0_0_8px_#34d399]" 
                 style={{ left: `${15 + (i * 22) % 70}%`, top: `${25 + (i * 14) % 50}%` }} 
               />
             ))}
             {/* Element 3: Grid backdrop */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
             {/* Element 4: Active synchronization sweep beam */}
             <motion.div 
               animate={{ y: ["-10%", "110%"] }} 
               transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute w-full h-[1.5px] bg-emerald-500/25 shadow-[0_0_10px_rgba(52,211,153,0.45)]" 
             />
          </div>
        );

      // =================================================================
      // --- MYTHIC EFFECTS (5+ Moving Elements - Ultimate Masterpieces) ---
      // =================================================================
      case "Singularity":
        // 5 Moving/Distinct Elements:
        // 1. Inward gravity-lensed star particles (converging motion)
        // 2. CW Gravitational space-time swirl (slow conic rotation)
        // 3. CCW Opposing gravitational distortion swirl
        // 4. Outer gravitational lensing ring (breathing scale)
        // 5. Central event horizon black core pulse
        return (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
             {/* Element 1: Inward-bound gravity particles */}
             {[...Array(6)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ 
                   scale: [1, 0], 
                   opacity: [0, 0.9, 0],
                   x: [Math.cos(i * (Math.PI / 3)) * 110, 0],
                   y: [Math.sin(i * (Math.PI / 3)) * 110, 0]
                 }} 
                 transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.45, ease: "easeIn" }} 
                 className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" 
                 style={{ left: "50%", top: "50%", marginLeft: "-2px", marginTop: "-2px" }} 
               />
             ))}
             {/* Element 2: Clockwise gravity swirl */}
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
               className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_40%,rgba(168,85,247,0.15)_50%,transparent_60%)] blur-[22px]" 
             />
             {/* Element 3: Counter-clockwise opposing swirl */}
             <motion.div 
               animate={{ rotate: -360 }} 
               transition={{ duration: 14, repeat: Infinity, ease: "linear" }} 
               className="absolute w-[170%] h-[170%] bg-[conic-gradient(from_180deg,transparent_45%,rgba(59,130,246,0.15)_50%,transparent_55%)] blur-[18px]" 
             />
             {/* Element 4: Gravitational lensing ring */}
             <motion.div 
               animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.25, 0.5, 0.25] }} 
               transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} 
               className="w-40 h-40 border border-purple-500/25 rounded-full blur-[1px] shadow-[0_0_12px_rgba(168,85,247,0.18)]" 
             />
             {/* Element 5: Event horizon core pulse */}
             <motion.div 
               animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.08, 0.2, 0.08] }} 
               transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute w-14 h-14 bg-white/10 rounded-full blur-[10px]" 
             />
          </div>
        );

      case "RealityTear":
        // 5 Moving/Distinct Elements:
        // 1. Active space-time tear (diagonally flickering neon rift)
        // 2. Emitted cyan spark particles (flowing outward from the tear)
        // 3. Dynamic chromatic aberration glitch overlays (flickering color layers)
        // 4. Distorted spatial background purple glow (slow organic breath)
        // 5. Floating dark matter particles (drifting through the void)
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             {/* Element 1: Spatial rift beam */}
             <motion.div 
               animate={{ opacity: [0.2, 0.8, 0.2], scaleY: [1, 1.06, 1] }} 
               transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.0 }} 
               className="absolute top-1/2 left-[-10%] w-[120%] h-[2.5px] bg-white shadow-[0_0_12px_#fff,0_0_24px_rgba(59,130,246,0.65)]" 
               style={{ transform: "rotate(-12deg) translateY(-50%)" }} 
             />
             {/* Element 2: Escaping neon sparks */}
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ 
                   x: [-40, 100], 
                   y: [-5, Math.sin(i) * 35], 
                   opacity: [0, 0.8, 0], 
                   scale: [0.4, 1.0, 0.4] 
                 }} 
                 transition={{ duration: 2.2 + Math.random() * 1.2, repeat: Infinity, delay: i * 0.6 }} 
                 className="absolute w-1.5 h-1.5 bg-cyan-450 rounded-full shadow-[0_0_8px_#22d3ee]" 
                 style={{ left: "30%", top: "45%" }} 
               />
             ))}
             {/* Element 3: Glitch aberration triggers */}
             <motion.div 
               animate={{ x: [-3, 3, -1, 0], opacity: [0, 0.3, 0] }} 
               transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 4.8 }} 
               className="absolute inset-0 bg-red-500/5" 
             />
             <motion.div 
               animate={{ x: [3, -3, 1, 0], opacity: [0, 0.3, 0] }} 
               transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 5.1 }} 
               className="absolute inset-0 bg-blue-500/5" 
             />
             {/* Element 4: Background distortion glow */}
             <motion.div 
               animate={{ scale: [1, 1.02, 1], opacity: [0.05, 0.18, 0.05] }} 
               transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute inset-0 bg-purple-950/15 blur-[12px]" 
             />
             {/* Element 5: Floating dark matter nodules */}
             {[...Array(4)].map((_, i) => (
               <motion.div 
                 key={`dark-${i}`} 
                 animate={{ 
                   y: [0, -35, 0], 
                   x: [0, Math.cos(i) * 15, 0],
                   opacity: [0, 0.6, 0] 
                 }} 
                 transition={{ duration: 5.5 + i, repeat: Infinity, ease: "easeInOut" }} 
                 className="absolute w-2 h-2 bg-zinc-950 rounded-full border border-purple-500/20 shadow-[0_0_5px_rgba(168,85,247,0.25)]" 
                 style={{ left: `${25 + i * 18}%`, top: `${30 + (i * 9) % 45}%` }} 
               />
             ))}
          </div>
        );

      case "Aurora":
        // Legacy Mythic: Shimmering aurora
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div 
               animate={{ 
                 opacity: [0.35, 0.65, 0.35],
                 scaleY: [1, 1.1, 1],
                 rotate: [4, 7, 4]
               }} 
               transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute inset-[-10%] bg-gradient-to-b from-emerald-500/15 via-purple-500/15 to-transparent blur-[28px] mix-blend-screen"
               style={{ transform: "rotate(5deg)" }}
             />
          </div>
        );

      case "Plasma":
        // Legacy Mythic: Shimmering plasma
        return (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
             <motion.div 
               animate={{ 
                 rotate: 360,
                 scale: [1, 1.08, 1],
                 opacity: [0.35, 0.6, 0.35]
               }} 
               transition={{ duration: 11, repeat: Infinity, ease: "linear" }} 
               className="absolute inset-[-20%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.25),transparent,rgba(236,72,153,0.25),transparent)] blur-[35px]" 
             />
          </div>
        );

      case "PrismGlowEffect":
        // Legacy Mythic: Rainbow particles
        return (
          <div className="absolute inset-0 pointer-events-none z-50">
             {[...Array(12)].map((_, i) => (
               <motion.div 
                 key={i} 
                 animate={{ 
                   scale: [0, 1.1, 0], 
                   opacity: [0, 0.75, 0],
                   y: [0, -30, 0]
                 }} 
                 transition={{ duration: 3.2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2.5 }} 
                 className="absolute w-2.5 h-2.5 rounded-full blur-[0.4px]" 
                 style={{ 
                   left: `${Math.random()*100}%`, 
                   top: `${Math.random()*100}%`,
                   background: `linear-gradient(135deg, hsl(${i * 30}, 100%, 75%), hsl(${(i * 30) + 120}, 100%, 75%))`
                 }} 
               />
             ))}
          </div>
        );

      case "Halo":
        // Legacy Mythic: Shimmering celestial halo
        return (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
             <motion.div 
               animate={{ 
                 scale: [0.85, 1.05, 0.85], 
                 opacity: [0.25, 0.6, 0.25],
                 rotate: 360
               }} 
               transition={{ duration: 14, repeat: Infinity, ease: "linear" }} 
               className="w-44 h-44 border-[2px] border-dashed border-white/15 rounded-full blur-[1.5px] shadow-[0_0_12px_rgba(255,255,255,0.15)]" 
             />
          </div>
        );

      default: return null;
    }
}
