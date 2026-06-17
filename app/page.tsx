"use client";

import { ShieldCheck, Zap, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * 究極の Safari 最適化 (Pure Static Edition):
 * Vercel Build Trigger: 2026-05-31-02
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center relative bg-void">
      <div className="relative mb-12">
        <div className="relative z-10 w-[180px] h-[180px] md:w-[240px] md:h-[240px]">
           <Image 
             src="/logo.png" 
             alt="Hexa Relation Logo" 
             width={240}
             height={240}
             priority
             className="object-contain" 
           />
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.25em] uppercase mb-4 text-white">
        Hexa Card
        <span className="block text-[9px] md:text-[10px] tracking-[0.8em] opacity-30 mt-6 ml-[0.8em]">アイデンティティの透過</span>
      </h1>

      <p className="text-white/40 max-w-sm mb-16 tracking-[0.2em] text-[10px] md:text-[11px] leading-relaxed uppercase">
        Connecting physical and digital identities.<br />
        Redefining business networking.
      </p>

      <div className="flex flex-col gap-10 items-center z-10">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Link
            href="/purchase"
            className="px-16 py-5 bg-white text-void tracking-[0.6em] uppercase text-[10px] font-bold flex items-center gap-2"
          >
            <CreditCard size={12} /> Order Card
          </Link>

          <Link
            href="/activate"
            className="px-12 py-5 border border-white/10 tracking-[0.5em] uppercase text-[9px] font-bold text-white/40"
          >
            Activate
          </Link>
        </div>

        <Link 
          href="/login" 
          className="mt-4 text-[8px] tracking-[0.4em] uppercase text-white/20 hover:text-azure-400 font-bold"
        >
          — Identity Access (Sign In) —
        </Link>

        {/* SEO Contextual Section */}
        <section className="max-w-xs mt-12 opacity-[0.15] group-hover:opacity-30 transition-opacity">
           <h2 className="text-[8px] tracking-[0.4em] uppercase font-bold mb-3">NFC Digital Identity System</h2>
           <p className="text-[7px] leading-relaxed tracking-[0.2em] uppercase">
             The Hexa Card is a next-generation smart business card. 
             Utilizing secure NFC technology to bridge your physical presence with a sophisticated digital identity. 
             Designed for professionals who demand excellence in every connection.
           </p>
        </section>

        <div className="flex flex-col items-center gap-5 mt-4">
           <div className="flex gap-10 justify-center opacity-10">
              <Zap size={12} className="text-white" />
              <ShieldCheck size={12} className="text-white" />
           </div>
           <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-[7px] uppercase tracking-[0.5em] opacity-20 font-bold">System Online / Secure Server Connected</span>
           </div>
        </div>
      </div>
    </main>
  );
}
