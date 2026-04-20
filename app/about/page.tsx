"use client";

import { motion } from "framer-motion";
import { Camera, Shield, Zap, Hexagon } from "lucide-react";
import Link from "next/link";

export default function InvitationPage() {
  const features = [
    { 
      title: "Digital Rebirth", 
      desc: "紙の名刺を、一瞬であなたのシックなデジタル・フォーマットへ。OCRによる自動解析が「名刺のあり方」を書き換えます。", 
      icon: <Camera className="opacity-40" /> 
    },
    { 
      title: "Physical Link", 
      desc: "スマートフォンをかざすだけ。物理的なNFCチップとの同期が、電子名刺にかつてないセキュリティと「実体感」をもたらします。", 
      icon: <Shield className="opacity-40" /> 
    },
    { 
      title: "Silent Luxury", 
      desc: "漆黒と月光。哲学に基づく一切の無駄を省いたUIが、持ち主の品格を語ります。", 
      icon: <Zap className="opacity-40" /> 
    }
  ];

  return (
    <main className="min-h-screen bg-void text-moonlight px-6 py-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-24 flex flex-col items-center text-center max-w-2xl"
      >
        <img src="/logo.png" className="w-24 h-24 mb-16 opacity-40 animate-pulse" />
        <h1 className="text-4xl md:text-5xl tracking-[0.2em] uppercase font-extralight mb-8 italic">Hexa Card</h1>
        <p className="text-sm tracking-[0.3em] opacity-40 leading-relaxed uppercase">
          紙の呪縛を解き放ち、<br />
          あなたの存在を「聖域」へ同期せよ。
        </p>
      </motion.div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mb-32">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-8 border border-moonlight/5 bg-gothic-dark/10 group hover:border-moonlight/20 transition-all"
          >
            <div className="mb-8">{f.icon}</div>
            <h3 className="text-xs tracking-[0.4em] uppercase mb-4 opacity-80">{f.title}</h3>
            <p className="text-[10px] tracking-widest opacity-40 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center gap-12"
      >
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-[0.6em] uppercase opacity-40">Ready to Synchronize?</p>
          <p className="text-[8px] tracking-[0.2em] uppercase opacity-20 italic">あなたも、この美しき深淵の一員になりませんか。</p>
        </div>
        
        <Link 
          href="/activate" 
          className="px-24 py-5 border border-moonlight/30 hover:bg-white/5 transition-all text-[11px] tracking-[0.8em] font-bold uppercase"
        >
          Join the Void
        </Link>
      </motion.div>

      <footer className="mt-48 text-[9px] tracking-[0.5em] opacity-10 uppercase">
        Hexa Card. All rights reserved.
      </footer>
    </main>
  );
}
