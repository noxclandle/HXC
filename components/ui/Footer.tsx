"use client";

import Link from "next/link";
import { Shield, FileText } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-void/50 backdrop-blur-md pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
        {/* Branding */}
        <div className="flex flex-col text-center md:text-left">
          <span className="text-xl tracking-[0.8em] uppercase font-light text-moonlight">HEXA CARD</span>
          <span className="text-[9px] tracking-[0.4em] uppercase opacity-30 mt-2">by Hexa Relation</span>
        </div>

        {/* Legal Links */}
        <div className="flex gap-8">
          <Link href="/about" className="text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 uppercase">
            <FileText size={12} /> Terms
          </Link>
          <Link href="/about" className="text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 uppercase">
            <Shield size={12} /> Privacy
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[9px] tracking-[0.5em] uppercase opacity-20">
          &copy; {currentYear} Hexa Relation. All Rights Reserved.
        </span>
        <div className="flex gap-4 opacity-20">
           <div className="w-1 h-1 bg-white rounded-full" />
           <div className="w-1 h-1 bg-white rounded-full" />
           <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>
    </footer>
  );
}
