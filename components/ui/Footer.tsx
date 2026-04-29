"use client";

import Link from "next/link";
import { Mail, Shield, FileText, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-void/50 backdrop-blur-md pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Branding */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex flex-col">
            <span className="text-xl tracking-[0.8em] uppercase font-light text-moonlight">HEXA CARD</span>
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-30 mt-1">by Hexa Relation</span>
          </div>
          <p className="text-[11px] tracking-widest leading-relaxed opacity-40 max-w-sm">
            物理カードとデジタル・アイデンティティの融合。
            聖域の美学に基づいた、次世代のビジネスネットワーキング・プラットフォーム。
          </p>
        </div>

        {/* Links */}
        <div className="space-y-6">
          <h4 className="text-[10px] tracking-[0.4em] uppercase opacity-60">Legal & Privacy</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/about" className="text-[11px] tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                <FileText size={12} /> Terms of Ritual
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-[11px] tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                <Shield size={12} /> Data Sanctuary
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-6">
          <h4 className="text-[10px] tracking-[0.4em] uppercase opacity-60">Communication</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/report" className="text-[11px] tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                <Mail size={12} /> Inquiry / Support
              </Link>
            </li>
            <li>
              <a href="#" className="text-[11px] tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                <Globe size={12} /> Official Portal
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[9px] tracking-[0.5em] uppercase opacity-20">
          &copy; {currentYear} Hexa Relation. All Rights Reserved.
        </span>
        <div className="flex gap-8">
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           <div className="w-1 h-1 bg-white/10 rounded-full" />
        </div>
      </div>
    </footer>
  );
}
