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
              {/* Sacred Geometry Background (Metatron-style Outer Plate) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '110px' }}
              >
                {/* Outer dodecagon */}
                <polygon points="100,30 135,39 165,65 180,100 175,135 150,165 100,180 50,165 25,135 20,100 35,65 65,39" fill="none" stroke={stageColor} strokeWidth="0.5" opacity="0.2" />
                {/* Outer ring */}
                <circle cx="100" cy="110" r="76" fill="none" stroke={stageColor} strokeWidth="0.5" strokeDasharray="6 4" opacity="0.3" />
                {/* Inner ring */}
                <circle cx="100" cy="110" r="62" fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.4" />
                {/* Geometric intersecting lines */}
                <path d="M 100,30 L 100,180 M 20,100 L 180,100 M 35,65 L 165,135 M 165,65 L 35,135" stroke="#ffffff" strokeWidth="0.2" opacity="0.2" />
              </motion.g>

              {/* Divine Halos */}
              <g>
                <circle cx="100" cy="52" r="22" fill="none" stroke={stageColor} strokeWidth="1.8" />
                <circle cx="100" cy="52" r="28" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" strokeDasharray="3 3" />
              </g>
              
              {/* Head (Floating Core) */}
              <circle cx="100" cy="76" r="12" fill="url(#seraph-head-grad)" />
              
              {/* Body (Divine Blade) */}
              <g>
                <polygon points="100,90 114,165 100,195 86,165" fill="url(#seraph-body-grad)" stroke={stageColor} strokeWidth="0.5" />
                <polygon points="100,98 106,155 100,180 94,155" fill="#ffffff" opacity="0.95" />
              </g>

              {/* 6 Wings (3 Pairs in Premium Gradients) */}
              <motion.g
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: floatDuration * 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '100px', originY: '110px' }}
              >
                {/* Upper Wings (Large, pointing up-outward) */}
                <path d="M 88,96 L 26,45 L 56,132 L 88,115 Z" fill="url(#wing-grad-left)" stroke="#ffffff" strokeWidth="0.5" opacity="0.95" />
                <path d="M 112,96 L 174,45 L 144,132 L 112,115 Z" fill="url(#wing-grad-right)" stroke="#ffffff" strokeWidth="0.5" opacity="0.95" />
                
                {/* Middle Wings (Pointing outward) */}
                <path d="M 88,112 L 15,102 L 48,160 L 88,132 Z" fill="url(#wing-grad-left)" opacity="0.8" />
                <path d="M 112,112 L 185,102 L 152,160 L 112,132 Z" fill="url(#wing-grad-right)" opacity="0.8" />
                
                {/* Lower Wings (Pointing down-outward) */}
                <path d="M 88,128 L 32,165 L 62,188 L 88,148 Z" fill="url(#wing-grad-left)" opacity="0.5" />
                <path d="M 112,128 L 168,165 L 138,188 L 112,148 Z" fill="url(#wing-grad-right)" opacity="0.5" />
              </motion.g>
              
              {/* Glowing Heart Core */}
              <g>
                <circle cx="100" cy="112" r="16" fill="url(#seraph-core-glow)" />
                <circle cx="100" cy="112" r="4" fill="#ffffff" />
              </g>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
