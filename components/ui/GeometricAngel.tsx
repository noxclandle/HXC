"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GeometricAngelProps {
  level: number;
  mood: 'stable' | 'excited' | 'unstable';
  size?: number;
}

/**
 * 4段階に進化する幾何学天使コンポーネント
 * 1. Seed (Lvl 1+)
 * 2. Orbital (Lvl 10+)
 * 3. Trinity (Lvl 25+)
 * 4. Primordial (Lvl 50+)
 */
export default function GeometricAngel({ level, mood, size = 200 }: GeometricAngelProps) {
  const stage = useMemo(() => {
    if (level >= 30) return 4;
    if (level >= 20) return 3;
    if (level >= 10) return 2;
    return 1;
  }, [level]);

  const moodColor = useMemo(() => {
    switch (mood) {
      case 'excited': return 'rgba(255, 255, 255, 0.9)';
      case 'unstable': return 'rgba(255, 100, 100, 0.6)';
      default: return 'rgba(255, 255, 255, 0.5)';
    }
  }, [mood]);

  const rotationDuration = mood === 'excited' ? 3 : mood === 'unstable' ? 10 : 15;

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-white blur-3xl"
      />

      {/* Level 1: Core Hexagon (Seed) */}
      <motion.div
        animate={{
          rotate: 360,
          scale: mood === 'excited' ? [1, 1.1, 1] : 1,
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.5, repeat: Infinity }
        }}
        className="relative z-10"
      >
        <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 100 100">
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none"
            stroke={moodColor}
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="10" fill={moodColor} />
        </svg>
      </motion.div>

      {/* Level 2: First Ring (Orbital) */}
      {stage >= 2 && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
          className="absolute border border-white/20 rounded-full"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      )}

      {/* Level 3: Triple Rings (Trinity) */}
      {stage >= 3 && (
        <>
          <motion.div
            animate={{ rotateX: 360, rotateY: 180 }}
            transition={{ duration: rotationDuration * 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute border border-white/10 rounded-full"
            style={{ width: size * 0.7, height: size * 0.7, transformStyle: 'preserve-3d' }}
          />
          <motion.div
            animate={{ rotateX: 180, rotateY: 360 }}
            transition={{ duration: rotationDuration * 0.8, repeat: Infinity, ease: "linear" }}
            className="absolute border border-white/10 rounded-full"
            style={{ width: size * 0.7, height: size * 0.7, transformStyle: 'preserve-3d' }}
          />
        </>
      )}

      {/* Level 4: Vector Wings (Primordial) */}
      {stage >= 4 && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg width={size} height={size} viewBox="0 0 200 200" className="opacity-40">
            <line x1="100" y1="0" x2="100" y2="200" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="white" strokeWidth="0.5" />
            <path d="M50 50 L150 150 M150 50 L50 150" stroke="white" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="4 4" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
