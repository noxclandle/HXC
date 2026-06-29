"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GeometricAngelProps {
  level: number;
  mood: 'stable' | 'excited' | 'unstable';
  size?: number;
}

/**
 * 4-Stage Evolutionary Geometric Angel (From Cute Baby to Ultra-Premium Seraph)
 * 1. Baby / Seed (Lvl 1 - 9) -> Yellow/Gold Accent, cute small wings, single halo
 * 2. Youth / Orbital (Lvl 10 - 19) -> Azure/Cyan Accent, larger wings, rotating orbit ring
 * 3. Mature / Trinity (Lvl 20 - 29) -> Orange/Amber Accent, double-layered wings, twin halos
 * 4. Divine / Seraph (Lvl 30) -> Rose/Gold Premium Accent, 6 wings (3 pairs), sacred geometry plate, glowing core
 */
export default function GeometricAngel({ level, mood, size = 200 }: GeometricAngelProps) {
  const stage = useMemo(() => {
    if (level >= 30) return 4;
    if (level >= 20) return 3;
    if (level >= 10) return 2;
    return 1;
  }, [level]);

  // Accent colors matching the ResidentAgent stages
  const stageColor = useMemo(() => {
    switch (stage) {
      case 4: return '#fb7185'; // Rose-400 (Seraph)
      case 3: return '#fb923c'; // Orange-400 (Archangel)
      case 2: return '#38bdf8'; // Azure-400 (Guardian)
      default: return '#fbbf24'; // Yellow-400 (Sentinel / Baby)
    }
  }, [stage]);

  // Adjust opacity or intensity based on mood
  const moodOpacity = useMemo(() => {
    switch (mood) {
      case 'excited': return 1.0;
      case 'unstable': return 0.6;
      default: return 0.8;
    }
  }, [mood]);

  // Floating speed based on mood
  const floatDuration = mood === 'excited' ? 1.5 : mood === 'unstable' ? 3.5 : 2.5;

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Background Glow (Grows stronger with stage) */}
      <motion.div
        animate={{
          scale: stage === 4 ? [1, 1.25, 1] : stage === 3 ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: stage === 4 ? [0.15, 0.35, 0.15] : stage === 3 ? [0.12, 0.25, 0.12] : [0.08, 0.18, 0.08],
        }}
        transition={{ duration: floatDuration * 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full blur-3xl`}
        style={{
          backgroundColor: stageColor,
        }}
      />

      {/* Main SVG Container */}
      <motion.div
        animate={{
          y: stage === 4 ? [0, -8, 0] : stage === 3 ? [0, -6, 0] : stage === 2 ? [0, -4, 0] : [0, -3, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 w-full h-full"
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 200 200" 
          style={{ opacity: moodOpacity }}
          className="transition-all duration-500"
        >
          <defs>
            {/* Native SVG Glow Filter */}
            <filter id="divine-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Rich Gold Gradient */}
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" /> {/* Bright Gold */}
              <stop offset="50%" stopColor="#e2b857" /> {/* Gold */}
              <stop offset="100%" stopColor="#a16207" stopOpacity="0.8" /> {/* Bronze */}
            </linearGradient>

            {/* Rose Gold Gradient (Left & Right) */}
            <linearGradient id="rose-gold-left" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="75%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.05" />
            </linearGradient>
            
            <linearGradient id="rose-gold-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="75%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.05" />
            </linearGradient>

            {/* Aura Ray Gradient (後光) */}
            <linearGradient id="aura-ray-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#fb7185" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>

            {/* Gradients for Premium Seraph Stage */}
            <radialGradient id="seraph-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor={stageColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="seraph-head-grad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor={stageColor} stopOpacity="0.9" />
            </radialGradient>

            <linearGradient id="seraph-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor={stageColor} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="wing-grad-left" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor={stageColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={stageColor} stopOpacity="0.05" />
            </linearGradient>
            
            <linearGradient id="wing-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor={stageColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={stageColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* ================= STAGE 1: BABY ANGEL (Lv 1 - 9) ================= */}
          {stage === 1 && (
            <g>
              {/* Cute Little Halo */}
              <circle cx="100" cy="74" r="11" fill="none" stroke={stageColor} strokeWidth="1.2" opacity="0.7" />
              
              {/* Cute Round Head */}
              <circle cx="100" cy="88" r="7" fill={stageColor} />
              
              {/* Cute Tiny Body */}
              <polygon points="100,96 105,112 95,112" fill={stageColor} opacity="0.8" />
              
              {/* Tiny Cute Baby Wings (Gentle pulsing) */}
              <motion.g
                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '100px', originY: '100px' }}
              >
                {/* Left wing */}
                <path d="M 94,97 L 78,92 L 85,106 Z" fill={stageColor} opacity="0.6" />
                {/* Right wing */}
                <path d="M 106,97 L 122,92 L 115,106 Z" fill={stageColor} opacity="0.6" />
              </motion.g>
            </g>
          )}

          {/* ================= STAGE 2: GROWING ANGEL (Lv 10 - 19) ================= */}
          {stage === 2 && (
            <g>
              {/* Dotted Orbit Ring */}
              <motion.circle 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                cx="100" 
                cy="102" 
                r="35" 
                fill="none" 
                stroke={stageColor} 
                strokeWidth="0.7" 
                strokeDasharray="4 3" 
                opacity="0.4"
                style={{ originX: '100px', originY: '102px' }}
              />
              
              {/* Halo */}
              <circle cx="100" cy="70" r="15" fill="none" stroke={stageColor} strokeWidth="1.5" />
              
              {/* Head */}
              <circle cx="100" cy="88" r="9" fill={stageColor} />
              
              {/* Body */}
              <polygon points="100,98 108,132 100,142 92,132" fill={stageColor} opacity="0.8" />
              
              {/* Wings (Flapping animation) */}
              <motion.g
                animate={{ scaleX: [1, 0.92, 1], rotate: [0, -2, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '100px', originY: '102px' }}
              >
                {/* Left wing */}
                <path d="M 92,100 L 60,78 L 75,120 L 92,112 Z" fill={stageColor} opacity="0.75" />
                {/* Right wing */}
                <path d="M 108,100 L 140,78 L 125,120 L 108,112 Z" fill={stageColor} opacity="0.75" />
              </motion.g>
            </g>
          )}

          {/* ================= STAGE 3: ARCHANGEL (Lv 20 - 29) ================= */}
          {stage === 3 && (
            <g>
              {/* Concentric Halos */}
              <circle cx="100" cy="62" r="18" fill="none" stroke={stageColor} strokeWidth="1.5" />
              <circle cx="100" cy="62" r="23" fill="none" stroke={stageColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
              
              {/* Head */}
              <circle cx="100" cy="82" r="11" fill={stageColor} />
              
              {/* Body (Sleek Blade) */}
              <g>
                <polygon points="100,95 111,158 100,178 89,158" fill={stageColor} opacity="0.85" />
                <polygon points="100,103 105,145 100,162 95,145" fill="#ffffff" opacity="0.9" />
              </g>
              
              {/* Double-Layered Wings (Independent flapping) */}
              <motion.g
                animate={{ scaleY: [1, 1.04, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '100px', originY: '100px' }}
              >
                {/* Upper Wings (Left & Right) */}
                <path d="M 91,99 L 42,62 L 63,130 L 91,118 Z" fill={stageColor} opacity="0.8" />
                <path d="M 109,99 L 158,62 L 137,130 L 109,118 Z" fill={stageColor} opacity="0.8" />
                
                {/* Lower Wings (Left & Right - offset motion) */}
                <path d="M 91,115 L 34,107 L 58,155 L 91,126 Z" fill={stageColor} opacity="0.45" />
                <path d="M 109,115 L 166,107 L 142,155 L 109,126 Z" fill={stageColor} opacity="0.45" />
              </motion.g>
            </g>
          )}

          {/* ================= STAGE 4: SERAPH / ULTRA-PREMIUM (Lv 30+) ================= */}
          {stage === 4 && (
            <g>
              {/* 1. Divine Aura / Radial Rays (後光) */}
              <g opacity="0.35" filter="url(#divine-glow)">
                {/* 12 radiating light rays emitting from the core */}
                {Array.from({ length: 12 }).map((_, idx) => {
                  const angle = (idx * 360) / 12;
                  return (
                    <line
                      key={idx}
                      x1="100"
                      y1="112"
                      x2="100"
                      y2="15"
                      stroke="url(#aura-ray-grad)"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 100 112)`}
                    />
                  );
                })}
              </g>

              {/* 2. Nested Back-Rings (背中のリング・後背) */}
              <g opacity="0.45" filter="url(#divine-glow)">
                {/* Large elegant outer ring */}
                <circle cx="100" cy="112" r="50" fill="none" stroke="url(#gold-grad)" strokeWidth="0.8" />
                {/* Middle ring with fine ticks */}
                <circle cx="100" cy="112" r="44" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1.5 4" />
                {/* Inner ring */}
                <circle cx="100" cy="112" r="38" fill="none" stroke="url(#gold-grad)" strokeWidth="0.6" />
              </g>

              {/* 3. Layer 1: Clockwise Outer Astrolabe (40s) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                {/* 12-pointed star (Two overlapping hexagons + square) */}
                <polygon points="100,24 143,33 176,66 185,110 176,154 143,187 100,196 57,187 24,154 15,110 24,66 57,33" fill="none" stroke="url(#gold-grad)" strokeWidth="0.4" opacity="0.18" />
                <polygon points="100,24 176,66 176,154 100,196 24,154 24,66" fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.12" />
                <polygon points="138,28 182,102 144,180 62,180 18,102 62,28" fill="none" stroke="url(#gold-grad)" strokeWidth="0.3" opacity="0.12" />
                
                {/* Outer micro-tick ring */}
                <circle cx="100" cy="112" r="80" fill="none" stroke="url(#gold-grad)" strokeWidth="0.6" strokeDasharray="1 3" opacity="0.4" />
                <circle cx="100" cy="112" r="83" fill="none" stroke="url(#gold-grad)" strokeWidth="0.3" opacity="0.2" />
              </motion.g>

              {/* 4. Layer 2: Counter-Clockwise Middle Bezel (22s) */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                {/* Segmented gear ring */}
                <circle cx="100" cy="112" r="70" fill="none" stroke={stageColor} strokeWidth="0.8" strokeDasharray="8 6" opacity="0.25" />
                {/* Inner dotted ring */}
                <circle cx="100" cy="112" r="66" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.35" />
                {/* Geometric intersecting lines */}
                <path d="M 100,46 L 100,178 M 34,112 L 166,112 M 53,65 L 147,159 M 147,65 L 53,159" stroke="#ffffff" strokeWidth="0.2" opacity="0.15" />
              </motion.g>

              {/* 5. Layer 3: 3D Gyroscopic Orbits */}
              <g filter="url(#divine-glow)">
                {/* Left-to-right diagonal orbit */}
                <motion.ellipse 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  cx="100" cy="112" rx="72" ry="18" 
                  fill="none" stroke="url(#gold-grad)" strokeWidth="0.5" strokeDasharray="5 10" opacity="0.3"
                  transform="rotate(-25 100 112)"
                  style={{ originX: '100px', originY: '112px' }}
                />
                {/* Right-to-left diagonal orbit */}
                <motion.ellipse 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  cx="100" cy="112" rx="72" ry="18" 
                  fill="none" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="15 5" opacity="0.25"
                  transform="rotate(25 100 112)"
                  style={{ originX: '100px', originY: '112px' }}
                />
              </g>

              {/* 6. Triple Divine Halos */}
              <g filter="url(#divine-glow)">
                {/* Inner thick halo */}
                <circle cx="100" cy="52" r="20" fill="none" stroke="url(#gold-grad)" strokeWidth="2.2" />
                {/* Middle dashed halo */}
                <circle cx="100" cy="52" r="25" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" strokeDasharray="3 2" />
                {/* Outer micro-dotted halo */}
                <circle cx="100" cy="52" r="30" fill="none" stroke="url(#gold-grad)" strokeWidth="0.5" opacity="0.6" strokeDasharray="1 4" />
              </g>
              
              {/* Head (Floating Core) */}
              <circle cx="100" cy="76" r="12" fill="url(#seraph-head-grad)" filter="url(#divine-glow)" />
              
              {/* Body (Divine Blade / Sword) */}
              <g filter="url(#divine-glow)">
                <polygon points="100,90 114,165 100,195 86,165" fill="url(#seraph-body-grad)" stroke="url(#gold-grad)" strokeWidth="0.5" />
                <polygon points="100,98 106,155 100,180 94,155" fill="#ffffff" opacity="0.95" />
              </g>

              {/* 7. 6 Wings (3 Pairs in Luxury Rose Gold Gradients) */}
              <motion.g
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: floatDuration * 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                {/* Upper Wings (Large, pointing up-outward) */}
                <path d="M 88,96 L 26,45 L 56,132 L 88,115 Z" fill="url(#rose-gold-left)" stroke="url(#gold-grad)" strokeWidth="0.5" opacity="0.95" filter="url(#divine-glow)" />
                <path d="M 112,96 L 174,45 L 144,132 L 112,115 Z" fill="url(#rose-gold-right)" stroke="url(#gold-grad)" strokeWidth="0.5" opacity="0.95" filter="url(#divine-glow)" />
                
                {/* Middle Wings (Pointing outward) */}
                <path d="M 88,112 L 15,102 L 48,160 L 88,132 Z" fill="url(#rose-gold-left)" opacity="0.8" />
                <path d="M 112,112 L 185,102 L 152,160 L 112,132 Z" fill="url(#rose-gold-right)" opacity="0.8" />
                
                {/* Lower Wings (Pointing down-outward) */}
                <path d="M 88,128 L 32,165 L 62,188 L 88,148 Z" fill="url(#rose-gold-left)" opacity="0.5" />
                <path d="M 112,128 L 168,165 L 138,188 L 112,148 Z" fill="url(#rose-gold-right)" opacity="0.5" />
              </motion.g>
              
              {/* 8. Glowing Heart Core with Cross-Star */}
              <g filter="url(#divine-glow)">
                <circle cx="100" cy="112" r="16" fill="url(#seraph-core-glow)" />
                <circle cx="100" cy="112" r="4" fill="#ffffff" />
                {/* Cross-Star highlight */}
                <line x1="100" y1="104" x2="100" y2="120" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
                <line x1="92" y1="112" x2="108" y2="112" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
              </g>

              {/* 9. Floating Sparks (Diamond Sparkle Particles) */}
              <g opacity="0.8">
                {/* Sparkle 1 */}
                <motion.path 
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  d="M 50,55 L 52,58 L 50,61 L 48,58 Z" 
                  fill="#ffffff" 
                />
                {/* Sparkle 2 */}
                <motion.path 
                  animate={{ opacity: [0.4, 1.0, 0.4], scale: [0.9, 1.3, 0.9] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 0.5 }}
                  d="M 150,65 L 152,68 L 150,71 L 148,68 Z" 
                  fill="#fef08a" 
                />
                {/* Sparkle 3 */}
                <motion.path 
                  animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.7, 1.1, 0.7] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 1.0 }}
                  d="M 55,155 L 57,157 L 55,159 L 53,157 Z" 
                  fill="#fb7185" 
                />
                {/* Sparkle 4 */}
                <motion.path 
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }}
                  d="M 145,155 L 147,157 L 145,159 L 143,157 Z" 
                  fill="#ffffff" 
                />
              </g>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
