"use client";

import { motion } from "framer-motion";
import { Hexagon, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 animate-slow-spin opacity-20 blur-3xl">
           <img src="/logo.png" alt="Company Logo" className="w-[320px] h-[320px] object-contain" />
        </div>
        <img src="/logo.png" alt="Hexa Card Logo" className="w-[240px] h-[240px] object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,100,255,0.2)]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-4"
      >
        Hexa Card
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-gothic-silver max-w-lg mb-12 tracking-widest text-sm leading-relaxed"
      >
        物理と仮想の境界、漆黒の深淵で響き合う。<br />
        HEXA CARDをかざし、あなたの存在を定義せよ。
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="flex flex-col gap-6 items-center"
      >
        <Link
          href="/activate"
          className="group relative px-16 py-5 overflow-hidden transition-all duration-700"
        >
          <div className="absolute inset-0 border border-moonlight/20 group-hover:border-moonlight group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 bg-moonlight/0 group-hover:bg-moonlight/5 transition-all duration-700" />
          <span className="relative z-10 tracking-[0.6em] uppercase text-[10px] font-bold">
            Activate Card
          </span>
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-moonlight w-0 group-hover:w-full transition-all duration-700"
          />
        </Link>
        <div className="flex gap-12 justify-center opacity-20 mt-8">
           <Zap size={14} className="hover:opacity-100 transition-opacity cursor-help" />
           <ShieldCheck size={14} className="hover:opacity-100 transition-opacity cursor-help" />
        </div>
      </motion.div>

      {/* Decorative lines */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-moonlight/50 to-transparent" />
    </main>
  );
}
