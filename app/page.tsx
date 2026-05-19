"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-void">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-azure-500/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-12"
      >
        <div className="relative z-10 w-[180px] h-[180px] md:w-[240px] md:h-[240px]">
           <Image 
             src="/logo.png" 
             alt="Hexa Relation Logo" 
             width={240}
             height={240}
             priority
             fetchPriority="high"
             className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
           />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-4xl md:text-6xl font-extralight tracking-[0.25em] uppercase mb-4 text-white"
      >
        Hexa Card
        <span className="block text-[9px] md:text-[10px] tracking-[0.8em] opacity-30 mt-6 ml-[0.8em]">アイデンティティの透過</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-white/40 max-w-sm mb-16 tracking-[0.2em] text-[10px] md:text-[11px] leading-relaxed uppercase"
      >
        Connecting physical and digital identities.<br />
        Redefining business networking.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="flex flex-col gap-10 items-center z-10"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link
            href="/purchase"
            className="group relative px-16 py-5 overflow-hidden transition-all duration-500 bg-white text-void hover:bg-azure-50 transition-colors shadow-2xl"
          >
            <span className="relative z-10 tracking-[0.6em] uppercase text-[10px] font-bold flex items-center gap-2">
              <CreditCard size={12} /> Order Card
            </span>
          </Link>

          <Link
            href="/activate"
            className="group relative px-12 py-5 overflow-hidden transition-all duration-500"
          >
            <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-all" />
            <span className="relative z-10 tracking-[0.5em] uppercase text-[9px] font-bold text-white/40 group-hover:text-white transition-colors">
              Activate
            </span>
          </Link>
        </div>

        <Link 
          href="/login" 
          className="mt-4 text-[8px] tracking-[0.4em] uppercase text-white/20 hover:text-azure-400 transition-colors font-bold"
        >
          — Identity Access (Sign In) —
        </Link>

        <div className="flex flex-col items-center gap-5 mt-4">
           <div className="flex gap-10 justify-center opacity-10">
              <Zap size={12} className="text-white" />
              <ShieldCheck size={12} className="text-white" />
           </div>
           <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] uppercase tracking-[0.5em] opacity-20 font-bold">System Online / Secure Server Connected</span>
           </div>
        </div>
      </motion.div>
    </main>
  );
}
