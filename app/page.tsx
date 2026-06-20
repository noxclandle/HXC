"use client";

import { ShieldCheck, Zap, CreditCard, Smartphone, Share2, Code, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/Footer";

/**
 * 究極の Safari 最適化 (Pure Static Edition)
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-void text-moonlight">
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center relative max-w-4xl mx-auto w-full pb-32">
        
        {/* Logo Section */}
        <div className="relative mb-12 mt-20">
          <div className="relative z-10 w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
             <Image 
               src="/logo.png" 
               alt="Hexa Relation Logo" 
               width={200}
               height={200}
               priority
               className="object-contain" 
             />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.25em] uppercase mb-4 text-white">
          Hexa Card
          <span className="block text-[9px] tracking-[0.4em] opacity-30 mt-6 leading-relaxed">アイデンティティの透過 / Permeation of Identity</span>
        </h1>

        <p className="text-white/40 max-w-sm mb-12 tracking-[0.2em] text-[10px] md:text-[11px] leading-relaxed uppercase px-4">
          Connecting physical and digital identities.<br />
          Redefining business networking.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-md px-4 mb-16 z-10">
          <Link
            href="/purchase"
            className="w-full md:w-auto px-8 md:px-12 h-[56px] bg-white text-void tracking-[0.4em] uppercase text-[10px] font-bold flex items-center justify-center gap-2 rounded-full hover:bg-zinc-200 transition-all"
          >
            <CreditCard size={12} /> Order Card / 購入
          </Link>

          <Link
            href="/features"
            className="w-full md:w-auto px-8 md:px-12 h-[56px] border border-white/10 tracking-[0.3em] uppercase text-[10px] font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center rounded-full"
          >
            Showcase / 機能紹介
          </Link>
        </div>

        {/* Easy visual Flow Diagram */}
        <section className="w-full max-w-xl border border-white/5 bg-white/[0.01] p-8 rounded-2xl mb-16">
          <h2 className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/50 mb-8">
            How it works / スマート名刺の仕組み
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative px-4">
            
            {/* Step 1: Card */}
            <div className="flex flex-col items-center space-y-3 z-10 w-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60">
                <CreditCard size={20} />
              </div>
              <span className="text-[9px] tracking-wider font-bold">1. Tap Card</span>
              <p className="text-[7px] text-white/30 tracking-widest leading-relaxed">物理カードを相手のスマートフォンにかざすだけ</p>
            </div>

            {/* Connection Arrow/Ripple 1 */}
            <div className="hidden md:flex flex-col items-center flex-grow opacity-20">
              <span className="text-[8px] tracking-[0.2em] font-mono animate-pulse">NFC WAVE</span>
              <div className="w-full h-px border-t border-dashed border-white/30 my-2" />
              <Zap size={10} className="text-azure-400" />
            </div>

            {/* Step 2: Phone */}
            <div className="flex flex-col items-center space-y-3 z-10 w-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60">
                <Smartphone size={20} />
              </div>
              <span className="text-[9px] tracking-wider font-bold">2. Instant Sync</span>
              <p className="text-[7px] text-white/30 tracking-widest leading-relaxed">専用アプリ不要。ブラウザが自動起動し接続</p>
            </div>

            {/* Connection Arrow/Ripple 2 */}
            <div className="hidden md:flex flex-col items-center flex-grow opacity-20">
              <span className="text-[8px] tracking-[0.2em] font-mono animate-pulse">RESONANCE</span>
              <div className="w-full h-px border-t border-dashed border-white/30 my-2" />
              <Sparkles size={10} className="text-azure-400" />
            </div>

            {/* Step 3: Server/Profile */}
            <div className="flex flex-col items-center space-y-3 z-10 w-24">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60">
                <Share2 size={20} />
              </div>
              <span className="text-[9px] tracking-wider font-bold">3. Connection</span>
              <p className="text-[7px] text-white/30 tracking-widest leading-relaxed">あなたのアイデンティティを美しく展開・保存</p>
            </div>

          </div>
        </section>

        {/* Core Capabilities Section */}
        <section className="w-full max-w-2xl mb-16 text-left px-4">
          <h2 className="text-[9px] tracking-[0.5em] uppercase font-bold text-azure-400 mb-8 border-l border-azure-500 pl-4">
            System Capabilities / 主な実装機能
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Physical-Digital Resonance / 物理とデジタルの同期</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                NFC (近距離無線通信) 技術を用いて、カードをタップするだけで最新のプロフィールデータを相手のスマートフォンに即座に透過展開します。
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Infinite Customize / 豊富なアセット機能</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                Relation Token（RT）を使用し、フレーム、背景、エフェクト、さらには共鳴サウンドなどを自由に解禁・装着し、独自の世界観を構築可能。
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">AI-OCR Document Scan / アナログ名刺のOCR解析</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                カメラで撮影した従来の紙名刺から、AI（OCR）が文字情報を自動解析し、システム内のデジタル名刺ライブラリへと一括保存します。
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">Strict iOS Alignment / 完全なSafari・iPhone対応</h3>
              <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
                iOSでの動作安定に特化したCSSアニメーション設計と、iPhone連絡先に画像付きで一発登録可能な独自規格vCard出力を実現。
              </p>
            </div>
          </div>
        </section>

        {/* Developer Showcase Section */}
        <section className="w-full max-w-xl border-t border-white/5 pt-12 mb-16 text-center px-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-azure-400">
              <Code size={14} />
            </div>
            <h3 className="text-[10px] tracking-[0.3em] font-bold text-white uppercase">System Architect / 開発者紹介</h3>
            <p className="text-[9px] text-white/40 leading-relaxed max-w-md tracking-wider">
              本デジタル名刺システム「Hexa Card」は、次世代ビジネスネットワーキングを支援するため、**[nox]**によって設計・開発されています。
            </p>
            <div className="flex gap-6 items-center justify-center pt-2">
              <Link 
                href="/activate"
                className="text-[9px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors font-bold"
              >
                Activate / カードの有効化
              </Link>
              <span className="text-white/10">|</span>
              <a 
                href="https://www.hexa-relation.com/nox" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[9px] tracking-[0.3em] uppercase text-azure-400 hover:text-azure-300 transition-colors font-bold flex items-center gap-1"
              >
                View Portfolio / nox ポートフォリオ <ArrowRight size={10} className="inline" />
              </a>
            </div>
          </div>
        </section>

        {/* Identity Access Area */}
        <div className="flex justify-center gap-8 items-center z-10 w-full mb-12">
          <Link 
            href="/login" 
            className="text-[9px] tracking-[0.4em] uppercase text-white/20 hover:text-azure-400 font-bold transition-colors"
          >
            Identity Access / ログイン
          </Link>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 opacity-30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] uppercase tracking-[0.4em] font-mono">System Online / Secure Connected</span>
        </div>

      </main>
      <Footer />
    </div>
  );
}
