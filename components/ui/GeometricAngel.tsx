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
          scale: stage === 4 ? [1, 1.3, 1] : stage === 3 ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: stage === 4 ? [0.25, 0.5, 0.25] : stage === 3 ? [0.12, 0.25, 0.12] : [0.08, 0.18, 0.08],
        }}
        transition={{ duration: floatDuration * 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full blur-3xl`}
        style={{
          backgroundColor: stage === 4 ? '#ffffff' : stageColor, // Pure White surrounding glow for Seraph
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
          viewBox="-10 0 220 224" 
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

            {/* Weak Gold / Yellow Gradient */}
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" /> {/* Gold */}
              <stop offset="100%" stopColor="#e2b857" stopOpacity="0.4" />
            </linearGradient>

            {/* Intense Pink Dominant Rose Gold Gradient (Left & Right) */}
            <linearGradient id="rose-gold-left" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" /> {/* White */}
              <stop offset="20%" stopColor="#fef08a" /> {/* Gold (Weak) */}
              <stop offset="45%" stopColor="#f43f5e" /> {/* Pink */}
              <stop offset="80%" stopColor="#ec4899" /> {/* Deep Pink (Strong) */}
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
            </linearGradient>
            
            <linearGradient id="rose-gold-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f43f5e" />
              <stop offset="80%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
            </linearGradient>

            {/* Pure White Emitting Aura Ray Gradient (後光) */}
            <linearGradient id="aura-ray-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Blinding White Backlight Radial Gradient */}
            <radialGradient id="hyper-white-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Gradients for Premium Seraph Stage */}
            <radialGradient id="seraph-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="seraph-head-grad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.95" />
            </radialGradient>

            <linearGradient id="seraph-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#ec4899" />
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
              {/* 要素3: 超発光純白バックライトオーラ (Hyper-Glow White Back Light) */}
              <circle cx="100" cy="112" r="95" fill="url(#hyper-white-glow)" filter="url(#divine-glow)" opacity="0.75" />

              {/* 要素5: 上昇する光の粒子柱（紫の小さな六角形をアセンディング） */}
              <g>
                {/* Purple Hexagon Particle 1 */}
                <motion.polygon
                  animate={{ y: [-10, -160], opacity: [0, 0.9, 0], scale: [0.8, 1.2, 0.6], rotate: 360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  points="55,177.5 57.2,178.7 57.2,181.3 55,182.5 52.8,181.3 52.8,178.7"
                  fill="rgba(168, 85, 247, 0.25)"
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
                {/* Purple Hexagon Particle 2 */}
                <motion.polygon
                  animate={{ y: [0, -150], opacity: [0, 0.9, 0], scale: [0.7, 1.1, 0.5], rotate: -360 }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: 0.8 }}
                  points="145,167.5 147.2,168.7 147.2,171.3 145,172.5 142.8,171.3 142.8,168.7"
                  fill="rgba(168, 85, 247, 0.25)"
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
                {/* Purple Hexagon Particle 3 */}
                <motion.polygon
                  animate={{ y: [10, -170], opacity: [0, 0.8, 0], scale: [0.6, 1.0, 0.4], rotate: 180 }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "linear", delay: 1.5 }}
                  points="75,187.5 77.2,188.7 77.2,191.3 75,192.5 72.8,191.3 72.8,188.7"
                  fill="rgba(168, 85, 247, 0.25)"
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
                {/* Purple Hexagon Particle 4 */}
                <motion.polygon
                  animate={{ y: [-20, -180], opacity: [0, 0.9, 0], scale: [0.7, 1.2, 0.5], rotate: -180 }}
                  transition={{ duration: 3.1, repeat: Infinity, ease: "linear", delay: 2.2 }}
                  points="125,182.5 127.2,183.7 127.2,186.3 125,187.5 122.8,186.3 122.8,183.7"
                  fill="rgba(168, 85, 247, 0.25)"
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
              </g>

              {/* 1. Divine Aura / Radial Rays (後光 - 純白のオーラ) */}
              <g opacity="0.6" filter="url(#divine-glow)">
                {/* 16 radiating light rays emitting from the core */}
                {Array.from({ length: 16 }).map((_, idx) => {
                  const angle = (idx * 360) / 16;
                  return (
                    <line
                      key={idx}
                      x1="100"
                      y1="112"
                      x2="100"
                      y2="10"
                      stroke="url(#aura-ray-grad)"
                      strokeWidth="1.0"
                      transform={`rotate(${angle} 100 112)`}
                    />
                  );
                })}
              </g>

              {/* 10. Sacred Purple Hexagon Drum Ring (背中の紫ヘキサゴン太鼓の輪) */}
              {/* 翼のすぐ後ろに配置し、半径を94に広げて羽の外側を大きく囲みます（羽に重ならない位置） */}
              {/* 真下の太鼓（idx === 2）を1つだけ取り外し、各太鼓が不規則にゆっくりと点滅（フリッカー）するオーラを放ちます */}
              <g filter="url(#divine-glow)">
                {/* Connecting Ring Line */}
                <circle cx="100" cy="112" r="94" fill="none" stroke="url(#gold-grad)" strokeWidth="1.0" opacity="0.55" />
                
                {/* 8 Purple Hexagons arranged at regular intervals */}
                {Array.from({ length: 8 }).map((_, idx) => {
                  // 真下の太鼓（90度、idx === 2）はスキップして取り外す
                  if (idx === 2) return null;

                  const angle = (idx * 45) * (Math.PI / 180);
                  const cx = 100 + 94 * Math.cos(angle);
                  const cy = 112 + 94 * Math.sin(angle);
                  const r = 6.5; // Size of the drums

                  // 各太鼓が放つ個別のオーラカラー
                  const drumColors = [
                    '#c084fc', // 0: 右 (紫)
                    '#22d3ee', // 1: 右下 (シアン)
                    '#ffffff', // 2: 真下 (スキップ)
                    '#fb7185', // 3: 左下 (ローズ)
                    '#fbbf24', // 4: 左 (ゴールド)
                    '#f472b6', // 5: 左上 (ピンク)
                    '#34d399', // 6: 真上 (エメラルド)
                    '#60a5fa', // 7: 右上 (アジュール)
                  ];

                  // ゆっくりとした不規則な点滅アニメーション（周期を2倍に延長：3.5秒〜6.0秒）
                  const drumDelays = [0.2, 0.8, 0, 2.0, 1.2, 2.5, 0.5, 3.2];
                  const drumDurations = [4.5, 3.8, 0, 5.2, 4.0, 4.8, 3.5, 5.8];

                  return (
                    <g key={idx}>
                      {/* ゆっくり不規則に点滅する個別カラーオーラ */}
                      <motion.circle 
                        cx={cx} 
                        cy={cy} 
                        r="11" 
                        fill={drumColors[idx]} 
                        animate={{ 
                          opacity: [0.15, 0.65, 0.25, 0.8, 0.15, 0.7, 0.3, 0.6, 0.15] 
                        }}
                        transition={{
                          duration: drumDurations[idx],
                          repeat: Infinity,
                          delay: drumDelays[idx],
                          ease: "easeInOut"
                        }}
                      />

                      {/* 紫の太鼓本体 */}
                      <polygon
                        points={`${cx},${cy-r} ${cx+r*0.86},${cy-r*0.5} ${cx+r*0.86},${cy+r*0.5} ${cx},${cy+r} ${cx-r*0.86},${cy+r*0.5} ${cx-r*0.86},${cy-r*0.5}`}
                        fill="rgba(168, 85, 247, 0.45)"
                        stroke="#c084fc"
                        strokeWidth="1.2"
                      />
                      {/* 中心部の高輝度な白いコア */}
                      <circle cx={cx} cy={cy} r="1.5" fill="#ffffff" />
                    </g>
                  );
                })}
              </g>

              {/* 2. Nested Back-Rings (背中のリング・後背 - ピンク・白構成) */}
              <g opacity="0.5" filter="url(#divine-glow)">
                {/* Large elegant outer ring (Pink) */}
                <circle cx="100" cy="112" r="50" fill="none" stroke="#f43f5e" strokeWidth="0.8" />
                {/* Middle ring with fine ticks (White) */}
                <circle cx="100" cy="112" r="44" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1.5 4" />
                {/* Inner ring (Pink/Gold) */}
                <circle cx="100" cy="112" r="38" fill="none" stroke="url(#gold-grad)" strokeWidth="0.6" />
              </g>

              {/* 3. Layer 1: Clockwise Outer Astrolabe (40s - ピンク・白ベース) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                {/* 12-pointed star (Pink & White) */}
                <polygon points="100,24 143,33 176,66 185,110 176,154 143,187 100,196 57,187 24,154 15,110 24,66 57,33" fill="none" stroke="#f43f5e" strokeWidth="0.5" opacity="0.22" />
                <polygon points="100,24 176,66 176,154 100,196 24,154 24,66" fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.15" />
                
                {/* Outer micro-tick ring */}
                <circle cx="100" cy="112" r="80" fill="none" stroke="#f43f5e" strokeWidth="0.6" strokeDasharray="1 3" opacity="0.4" />
              </motion.g>

              {/* 4. Layer 2: Counter-Clockwise Middle Bezel (22s) */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                {/* Segmented gear ring */}
                <circle cx="100" cy="112" r="70" fill="none" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.3" />
                {/* Inner dotted ring */}
                <circle cx="100" cy="112" r="66" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
                {/* Geometric intersecting lines */}
                <path d="M 100,46 L 100,178 M 34,112 L 166,112 M 53,65 L 147,159 M 147,65 L 53,159" stroke="#ffffff" strokeWidth="0.2" opacity="0.2" />
              </motion.g>

              {/* 要素4: 3重アストロラーベ構造（Extra Outer Tick Ring - 12s 高速回転） */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                <circle cx="100" cy="112" r="86" fill="none" stroke="#f43f5e" strokeWidth="0.4" strokeDasharray="2 8" opacity="0.35" />
                <circle cx="100" cy="112" r="89" fill="none" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="1 15" opacity="0.5" />
              </motion.g>

              {/* 要素2: 浮遊するヘキサルーン軌道（Floating Hexa-Runes） */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                style={{ originX: '100px', originY: '112px' }}
                opacity="0.8"
              >
                {/* 6 tiny hexagons arranged in a circle of radius 45 */}
                {Array.from({ length: 6 }).map((_, idx) => {
                  const angle = (idx * 60) * (Math.PI / 180);
                  const cx = 100 + 44 * Math.cos(angle);
                  const cy = 112 + 44 * Math.sin(angle);
                  return (
                    <polygon
                      key={idx}
                      points={`${cx},${cy-2.5} ${cx+2.2},${cy-1.2} ${cx+2.2},${cy+1.2} ${cx},${cy+2.5} ${cx-2.2},${cy+1.2} ${cx-2.2},${cy-1.2}`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      filter="url(#divine-glow)"
                    />
                  );
                })}
              </motion.g>

              {/* 5. Layer 3: 3D Gyroscopic Orbits */}
              <g filter="url(#divine-glow)">
                {/* Left-to-right diagonal orbit */}
                <motion.ellipse 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  cx="100" cy="112" rx="72" ry="18" 
                  fill="none" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="5 10" opacity="0.35"
                  transform="rotate(-25 100 112)"
                  style={{ originX: '100px', originY: '112px' }}
                />
                {/* Right-to-left diagonal orbit */}
                <motion.ellipse 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  cx="100" cy="112" rx="72" ry="18" 
                  fill="none" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="15 5" opacity="0.3"
                  transform="rotate(25 100 112)"
                  style={{ originX: '100px', originY: '112px' }}
                />
              </g>

              {/* Triple Divine Halos (頭上のリングを多重逆回転させ、駆動しているように表現) */}
              <g filter="url(#divine-glow)">
                {/* Inner thick halo (時計回りにゆっくり回転する冠形状) */}
                <motion.circle
                  cx="100"
                  cy="52"
                  r="20"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.2"
                  strokeDasharray="30 8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ originX: '100px', originY: '52px' }}
                />
                {/* Middle dashed halo (反時計回りに中速回転) */}
                <motion.circle
                  cx="100"
                  cy="52"
                  r="25"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity="0.85"
                  strokeDasharray="4 3"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{ originX: '100px', originY: '52px' }}
                />
                {/* Outer micro-dotted halo (時計回りに高速回転する光の粒子の輪) */}
                <motion.circle
                  cx="100"
                  cy="52"
                  r="30"
                  fill="none"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.5"
                  opacity="0.6"
                  strokeDasharray="1 5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  style={{ originX: '100px', originY: '52px' }}
                />
              </g>
              
              {/* Head (Floating Core) */}
              <circle cx="100" cy="76" r="12" fill="url(#seraph-head-grad)" filter="url(#divine-glow)" />
              
              {/* Body (Divine Blade / Sword) */}
              <g filter="url(#divine-glow)">
                <polygon points="100,90 114,165 100,195 86,165" fill="url(#seraph-body-grad)" stroke="#f43f5e" strokeWidth="0.5" />
                <polygon points="100,98 106,155 100,180 94,155" fill="#ffffff" opacity="0.95" />
              </g>

              {/* 7. 6 Wings (3 Pairs in Luxury Rose Gold Gradients + 翼の骨格線) */}
              <motion.g
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: floatDuration * 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '100px', originY: '112px' }}
              >
                {/* Left Wings */}
                <g filter="url(#divine-glow)">
                  {/* Upper Left Wing */}
                  <path d="M 88,96 L 26,45 L 56,132 L 88,115 Z" fill="url(#rose-gold-left)" stroke="#ffffff" strokeWidth="0.5" opacity="0.95" />
                  {/* 翼の骨格線 */}
                  <line x1="88" y1="96" x2="38" y2="62" stroke="#ffffff" strokeWidth="0.7" opacity="0.8" />
                  <line x1="88" y1="105" x2="48" y2="92" stroke="#f43f5e" strokeWidth="0.6" opacity="0.7" />
                  <line x1="88" y1="112" x2="58" y2="122" stroke="#f43f5e" strokeWidth="0.5" opacity="0.5" />

                  {/* Middle Left Wing */}
                  <path d="M 88,112 L 15,102 L 48,160 L 88,132 Z" fill="url(#rose-gold-left)" opacity="0.8" />
                  <line x1="88" y1="112" x2="28" y2="110" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />
                  <line x1="88" y1="122" x2="38" y2="138" stroke="#f43f5e" strokeWidth="0.5" opacity="0.6" />

                  {/* Lower Left Wing */}
                  <path d="M 88,128 L 32,165 L 62,188 L 88,148 Z" fill="url(#rose-gold-left)" opacity="0.5" />
                  <line x1="88" y1="128" x2="42" y2="160" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
                </g>

                {/* Right Wings */}
                <g filter="url(#divine-glow)">
                  {/* Upper Right Wing */}
                  <path d="M 112,96 L 174,45 L 144,132 L 112,115 Z" fill="url(#rose-gold-right)" stroke="#ffffff" strokeWidth="0.5" opacity="0.95" />
                  {/* 翼の骨格線 */}
                  <line x1="112" y1="96" x2="162" y2="62" stroke="#ffffff" strokeWidth="0.7" opacity="0.8" />
                  <line x1="112" y1="105" x2="152" y2="92" stroke="#f43f5e" strokeWidth="0.6" opacity="0.7" />
                  <line x1="112" y1="112" x2="142" y2="122" stroke="#f43f5e" strokeWidth="0.5" opacity="0.5" />

                  {/* Middle Right Wing */}
                  <path d="M 112,112 L 185,102 L 152,160 L 112,132 Z" fill="url(#rose-gold-right)" opacity="0.8" />
                  <line x1="112" y1="112" x2="172" y2="110" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />
                  <line x1="112" y1="122" x2="162" y2="138" stroke="#f43f5e" strokeWidth="0.5" opacity="0.6" />

                  {/* Lower Right Wing */}
                  <path d="M 112,128 L 168,165 L 138,188 L 112,148 Z" fill="url(#rose-gold-right)" opacity="0.5" />
                  <line x1="112" y1="128" x2="158" y2="160" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
                </g>
              </motion.g>
              
              {/* 8. Glowing Heart Core with Cross-Star */}
              <g filter="url(#divine-glow)">
                <circle cx="100" cy="112" r="16" fill="url(#seraph-core-glow)" />
                <circle cx="100" cy="112" r="4" fill="#ffffff" />
                {/* Cross-Star highlight */}
                <line x1="100" y1="104" x2="100" y2="120" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
                <line x1="92" y1="112" x2="108" y2="112" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
              </g>

              {/* 9. Floating Sparks (紫の小さな六角形を散らす) */}
              <g opacity="0.8">
                {/* Purple Hexagon Sparkle 1 */}
                <motion.polygon 
                  animate={{ opacity: [0.3, 1.0, 0.3], scale: [0.8, 1.3, 0.8], rotate: 45 }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  points="50,42.5 52.2,43.7 52.2,46.3 50,47.5 47.8,46.3 47.8,43.7"
                  fill="rgba(168, 85, 247, 0.25)" 
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
                {/* Purple Hexagon Sparkle 2 */}
                <motion.polygon 
                  animate={{ opacity: [0.4, 1.0, 0.4], scale: [0.9, 1.4, 0.9], rotate: -45 }}
                  transition={{ duration: 2.1, repeat: Infinity, delay: 0.4 }}
                  points="150,52.5 152.2,53.7 152.2,56.3 150,57.5 147.8,56.3 147.8,53.7"
                  fill="rgba(168, 85, 247, 0.25)" 
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
                {/* Purple Hexagon Sparkle 3 */}
                <motion.polygon 
                  animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.7, 1.2, 0.7], rotate: 60 }}
                  transition={{ duration: 3.1, repeat: Infinity, delay: 0.8 }}
                  points="45,142.5 47.2,143.7 47.2,146.3 45,147.5 42.8,146.3 42.8,143.7"
                  fill="rgba(168, 85, 247, 0.25)" 
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
                {/* Purple Hexagon Sparkle 4 */}
                <motion.polygon 
                  animate={{ opacity: [0.3, 1.0, 0.3], scale: [0.8, 1.3, 0.8], rotate: -60 }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 0.2 }}
                  points="155,142.5 157.2,143.7 157.2,146.3 155,147.5 152.8,146.3 152.8,143.7"
                  fill="rgba(168, 85, 247, 0.25)" 
                  stroke="#c084fc"
                  strokeWidth="0.5"
                  filter="url(#divine-glow)"
                />
              </g>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
