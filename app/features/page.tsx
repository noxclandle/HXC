"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Smartphone, Camera, Grid, Palette, Music, Cpu, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturesPage() {
  const customCategories = [
    { name: "Frames", count: 20, desc: "From Obsidian to Heritage Gold." },
    { name: "Backgrounds", count: 15, desc: "Nebula, Void, or Pure Hex." },
    { name: "Auras", count: 10, desc: "Harmonize your environment." },
    { name: "Effects", count: 12, desc: "Dynamic particles and motion." }
  ];

  const combinations = 20 * 15 * 10 * 12; // Simple math for 36,000 combinations

  return (
    <main className="min-h-screen bg-void text-moonlight overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl"
        >
          <span className="text-[10px] tracking-[0.8em] uppercase text-azure-400 font-bold mb-8 block">Next-Gen Identity / 次世代の証明</span>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-[0.15em] uppercase mb-8 leading-tight">
            Infinite Identity<br />
            <span className="font-bold opacity-20">10,000+ Combinations</span>
          </h1>
          <p className="text-sm md:text-base tracking-[0.2em] opacity-40 max-w-2xl mx-auto leading-relaxed uppercase">
            フレーム、背景、オーラ、エフェクト。
            あなたのアイデンティティは、1万通り以上の組み合わせから唯一無二の姿へと昇華される。
            <br />
            <span className="text-[10px]">Customize your essence through over 10,000 aesthetic combinations.</span>
          </p>
        </motion.div>

        {/* Floating Card Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 relative w-full max-w-[500px] aspect-[1.58/1] mx-auto group"
        >
          <div className="absolute inset-0 border border-white/10 bg-white/[0.02] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-azure-900/20 to-transparent" />
             <div className="relative z-10 text-center space-y-4 p-12 w-full">
                <div className="w-16 h-16 border border-white/10 mx-auto mb-8 flex items-center justify-center">
                   <Image src="/logo.png" alt="HXC" width={32} height={32} className="opacity-40" />
                </div>
                <div className="h-px w-24 bg-azure-500/30 mx-auto" />
                <h2 className="text-2xl tracking-[0.4em] uppercase font-light">Your Name</h2>
                <p className="text-[8px] tracking-[0.6em] opacity-20 uppercase">Digital Architect</p>
             </div>
          </div>
          {/* Decorative floating elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-azure-500/10 blur-[60px] rounded-full animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-bronze-500/5 blur-[80px] rounded-full" />
        </motion.div>
      </section>

      {/* Customization Grid */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <header className="mb-20 text-left">
            <h2 className="text-xs tracking-[0.5em] uppercase opacity-30 mb-4 flex items-center gap-4">
              <Grid size={16} /> Asset Categories / アセット・カテゴリー
            </h2>
            <p className="text-2xl font-extralight tracking-widest uppercase">The components of your existence.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customCategories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 border border-white/5 bg-void hover:border-azure-500/30 transition-all group"
              >
                <div className="mb-6 opacity-20 group-hover:opacity-100 group-hover:text-azure-400 transition-all">
                  {i === 0 && <Shield size={24} />}
                  {i === 1 && <Palette size={24} />}
                  {i === 2 && <Zap size={24} />}
                  {i === 3 && <Sparkles size={24} />}
                </div>
                <h3 className="text-sm tracking-[0.4em] uppercase mb-2">{cat.name}</h3>
                <p className="text-[18px] font-mono text-azure-400 mb-4">{cat.count}+</p>
                <p className="text-[10px] tracking-widest opacity-30 uppercase">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-32">
          
          {/* Feature 1: NFC Sync */}
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2 space-y-8">
                <span className="text-[9px] tracking-[0.5em] uppercase text-emerald-400 font-bold border-l-2 border-emerald-500/50 pl-4">Physical-Digital Sync</span>
                <h3 className="text-3xl tracking-widest uppercase font-extralight leading-relaxed">
                  Instant Connection via <br />Secure NFC Technology
                </h3>
                <p className="text-xs tracking-widest opacity-40 leading-loose uppercase">
                  物理カードを相手のスマートフォンにかざすだけ。
                  ブラウザ上であなたの最新のアイデンティティが即座に同期されます。
                  アプリのインストールは不要、Safari 100%対応。
                  <br /><br />
                  <span className="text-[10px] italic">Simply tap your Hexa Card. Your latest identity synchronizes instantly on any smartphone browser. No app required.</span>
                </p>
                <div className="flex gap-4 opacity-20">
                  <Smartphone size={20} />
                  <Cpu size={20} />
                </div>
             </div>
             <div className="lg:w-1/2 relative aspect-video bg-white/[0.02] border border-white/5 flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Smartphone size={64} className="opacity-10 group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-4 right-4 text-[8px] tracking-widest opacity-20 uppercase font-mono italic">Protocol: NFC-V2 / ISO14443A</div>
             </div>
          </div>

          {/* Feature 2: AI OCR Scan */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
             <div className="lg:w-1/2 space-y-8 text-right">
                <span className="text-[9px] tracking-[0.5em] uppercase text-azure-400 font-bold border-r-2 border-azure-500/50 pr-4">Bridge to Reality</span>
                <h3 className="text-3xl tracking-widest uppercase font-extralight leading-relaxed">
                  Archive Physical Cards <br />with AI Recognition
                </h3>
                <p className="text-xs tracking-widest opacity-40 leading-loose uppercase">
                  まだ「紙の名刺」を使っている相手の情報も逃しません。
                  カメラで撮影するだけで、AIが情報を自動解析し、あなたのデジタル名刺帳へ永続的に記録します。
                  <br /><br />
                  <span className="text-[10px] italic">Never lose a connection. Capture physical cards with your camera and let our AI archive them perfectly into your digital library.</span>
                </p>
                <div className="flex gap-4 justify-end opacity-20">
                  <Camera size={20} />
                  <Grid size={20} />
                </div>
             </div>
             <div className="lg:w-1/2 relative aspect-video bg-white/[0.02] border border-white/5 flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-azure-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Camera size={64} className="opacity-10 group-hover:scale-110 transition-transform" />
                <div className="absolute top-4 left-4 text-[8px] tracking-widest opacity-20 uppercase font-mono italic">OCR Engine: Advanced Neural</div>
             </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 text-center bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.1)_0%,transparent_50%)]">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-2xl mx-auto space-y-12"
        >
          <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em] uppercase leading-tight">
            Transcending <br />the Boundary
          </h2>
          <p className="text-[10px] tracking-[0.5em] opacity-30 uppercase">境界を越え、新たな繋がりを。 / A New Dimension Awaits.</p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center pt-8">
            <Link 
              href="/purchase" 
              className="px-16 py-6 bg-white text-void text-[11px] font-bold tracking-[0.8em] uppercase shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center gap-4"
            >
              <CreditCard size={14} /> Get Hexa Card
            </Link>
            <Link 
              href="/about" 
              className="px-12 py-6 border border-white/10 text-[10px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all flex items-center gap-3"
            >
              Learn Philosophy <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Technical Footnote */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-20">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[7px] uppercase tracking-[0.4em] font-mono">System: Stable / 2026-06-18</span>
           </div>
           <p className="text-[7px] tracking-widest uppercase font-mono">© 2026 HEXA RELATION SYSTEM OVERWATCH</p>
        </div>
      </footer>
    </main>
  );
}
