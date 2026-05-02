"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center"
      >
        <h1 className="text-3xl md:text-4xl tracking-[0.4em] uppercase font-light mb-16">
          Contact
          <span className="block text-[10px] tracking-[0.2em] opacity-40 mt-4">お問い合わせ</span>
        </h1>

        <p className="text-xs md:text-sm tracking-[0.2em] opacity-40 leading-loose uppercase mb-16">
          存在の交差、あるいは提携のご提案。<br />
          <span className="text-[9px] opacity-60">Interaction of existence, or proposals for collaboration.</span>
        </p>

        <div className="flex justify-center w-full max-w-md mx-auto">
          <div className="w-full p-12 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
            <Send className="mx-auto mb-6 opacity-20 group-hover:opacity-100 transition-opacity" size={24} />
            <h2 className="text-[10px] tracking-[0.4em] uppercase mb-8 opacity-40 italic">Direct Message / 連絡窓口</h2>
            <div className="flex flex-col items-center gap-6 text-sm tracking-widest">
              <a 
                href="https://x.com/HexaRelation" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white opacity-40 hover:opacity-100 transition-all uppercase flex flex-col items-center gap-1"
              >
                <span>X (Twitter)</span>
                <span className="text-[9px] opacity-50 font-light">@HexaRelation</span>
              </a>
              <a 
                href="#" 
                className="hover:text-white opacity-20 hover:opacity-100 transition-all uppercase flex flex-col items-center gap-1"
              >
                <span>Instagram</span>
                <span className="text-[9px] opacity-50 font-light italic">Coming soon</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
