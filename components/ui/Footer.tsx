"use client";

import Link from "next/link";
import { Shield, FileText } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-void/50 backdrop-blur-md pt-16 pb-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
        {/* Branding */}
        <Link href="/" className="flex flex-col items-center text-center group">
          <span className="text-2xl tracking-[1em] uppercase font-light text-moonlight ml-[1em] group-hover:opacity-70 transition-opacity">HEXA CARD</span>
          <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 mt-4">by Hexa Relation</span>
        </Link>

        {/* Navigation/Legal Links */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          <Link href="/contact" className="text-[10px] tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity uppercase">
            Contact
          </Link>
          <Link href="/terms" className="text-[10px] tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 uppercase">
            <FileText size={12} /> Terms
          </Link>
          <Link href="/privacy" className="text-[10px] tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 uppercase">
            <Shield size={12} /> Privacy
          </Link>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-white/5 pt-12 flex flex-col items-center gap-6">
          <span className="text-[9px] tracking-[0.6em] uppercase opacity-20 text-center">
            &copy; {currentYear} Hexa Relation. All Rights Reserved.
          </span>
          <div className="flex gap-4 opacity-20">
             <div className="w-1 h-1 bg-white rounded-full" />
             <div className="w-1 h-1 bg-white rounded-full" />
             <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
