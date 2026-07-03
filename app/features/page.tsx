"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  CreditCard,
  Smartphone,
  Share2,
  ShieldCheck,
  Zap,
  Code
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  
  // 1. 実装している全機能の紹介（ベクターアート付き）
  const coreFeatures = [
    {
      title: "NFC 同調転送 / NFC Tap Transfer",
      subtitle: "NFC TAP TRANSFER",
      desc: "専用アプリは一切不要。カードを相手のスマートフォンにかざすだけで、ブラウザが起動し、あなたのデジタルプロフィールが一瞬で透過展開されます。名刺交換の瞬間を、シームレスなデジタル体験へと昇華します。 / No app required. Simply tap the card on a smartphone to instantly share your digital profile, transforming card exchanges into seamless digital experiences.",
      illustration: (
        <svg className="w-full h-32" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Card */}
          <rect x="25" y="28" width="65" height="42" rx="4" fill="#181824" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="31" y="34" width="12" height="12" rx="2" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="0.8" />
          <line x1="48" y1="38" x2="80" y2="38" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="48" y1="44" x2="70" y2="44" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" />
          
          {/* Phone */}
          <rect x="125" y="15" width="40" height="70" rx="5" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="135" y="19" width="20" height="1.5" rx="0.7" fill="#000" />
          
          {/* Concentric Signal Waves */}
          <circle cx="95" cy="49" r="8" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2 2" className="opacity-40" />
          <circle cx="95" cy="49" r="15" stroke="#3b82f6" strokeWidth="1" className="opacity-60 animate-pulse" />
          <circle cx="95" cy="49" r="22" stroke="#c084fc" strokeWidth="1" className="opacity-40" />
          
          {/* Connection Sparkle */}
          <path d="M 145,44 L 146,47.5 L 149.5,48.5 L 146,49.5 L 145,53 L 144,49.5 L 140.5,48.5 L 144,47.5 Z" fill="#38bdf8" />
        </svg>
      )
    },
    {
      title: "五感に共鳴するカスタムデザイン / Visual & Audio Customization",
      subtitle: "VISUAL & AUDIO CUSTOMIZATION",
      desc: "静的な名刺の限界を超えます。厳選されたビジュアルテーマ、流麗なアニメーションフレーム、背景音楽（BGM）まで自由にカスタマイズ。相手の視覚と聴覚に深い印象を刻み込みます。 / Transcend the limits of static paper cards. Customize visual themes, fluid frames, and background music (BGM) to leave a lasting impression on sight and sound.",
      illustration: (
        <svg className="w-full h-32" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(15, 2)">
            {/* Card Base Layer */}
            <path d="M 25,70 L 125,40 L 155,55 L 55,85 Z" fill="#111" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x="65" y="70" fill="rgba(255,255,255,0.2)" fontSize="4.5" transform="rotate(-16, 65, 70)" className="font-mono">BASE CARD</text>
            
            {/* Audio Wave / Particle Layer */}
            <path d="M 30,50 L 130,20 L 160,35 L 60,65 Z" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="3 2" className="opacity-50" />
            <path d="M 70,42 Q 85,35 100,45 T 130,32" stroke="#c084fc" strokeWidth="0.8" fill="none" transform="rotate(-16, 100, 40)" className="opacity-70" />
            <circle cx="80" cy="38" r="1" fill="#c084fc" />
            <circle cx="110" cy="32" r="1.5" fill="#818cf8" className="animate-ping" />
            <text x="70" y="50" fill="#a78bfa" fontSize="4.5" transform="rotate(-16, 70, 50)" className="font-mono">AUDIO WAVE</text>
            
            {/* Visual Frame Layer */}
            <path d="M 35,30 L 135,0 L 165,15 L 65,45 Z" fill="rgba(244,63,94,0.03)" stroke="#f43f5e" strokeWidth="1.2" />
            <text x="75" y="30" fill="#f43f5e" fontSize="4.5" transform="rotate(-16, 75, 30)" className="font-mono font-bold">VISUAL FRAME</text>
            
            {/* Connecting dashed vertical lines */}
            <line x1="25" y1="70" x2="35" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="155" y1="55" x2="165" y2="15" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>
        </svg>
      )
    },
    {
      title: "AI-OCR 紙名刺スキャナー / AI-OCR Card Scanner",
      subtitle: "AI-OCR ANALOG CARD SCANNER",
      desc: "受け取った紙の名刺も無駄にしません。スマートフォンのカメラで撮影するだけで、内蔵AIが文字情報を高精度で瞬時に解析。あなたの中央名刺ライブラリ（Library）にデジタルデータとして一元保存します。 / Never waste a paper card again. Snap a photo with your camera, and the built-in AI will instantly parse the text to save it directly into your digital Library.",
      illustration: (
        <svg className="w-full h-32" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paper Card */}
          <rect x="35" y="20" width="110" height="55" rx="2" fill="#fff" fillOpacity="0.02" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          
          {/* Scan Line */}
          <line x1="30" y1="45" x2="150" y2="45" stroke="#f43f5e" strokeWidth="1.2" className="animate-pulse" />
          <polygon points="30,45 150,45 150,42 30,42" fill="url(#scanGrad)" opacity="0.15" />
          
          {/* Highlighted Bounding Boxes (OCR) */}
          <rect x="45" y="28" width="50" height="7" stroke="#3b82f6" strokeWidth="0.8" fill="rgba(59,130,246,0.05)" />
          <rect x="45" y="38" width="35" height="5" stroke="#34d399" strokeWidth="0.8" fill="rgba(52,211,153,0.05)" />
          <rect x="45" y="55" width="80" height="10" stroke="#a78bfa" strokeWidth="0.8" fill="rgba(167,139,250,0.05)" />
          
          {/* Text representations inside boxes */}
          <text x="48" y="33" fill="#3b82f6" fontSize="3.5" fontWeight="bold" className="font-mono">NAME: NOX</text>
          <text x="48" y="42" fill="#34d399" fontSize="3" className="font-mono">TEL: OK</text>
          <text x="48" y="62" fill="#a78bfa" fontSize="4" className="font-mono">EMAIL: PARSED</text>
          
          <defs>
            <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "vCard 連絡先一括インポート / One-Click Contact Save",
      subtitle: "ONE-CLICK CONTACT SAVE",
      desc: "相手があなたのプロフィール画面から「連絡先を保存」を押すだけで、電話番号やメールアドレスはもちろん、アイコン画像や各種SNSリンク情報まで、スマートフォンの連絡先（アドレス帳）に直接保存されます。 / With a single tap, others can save your phone number, email, profile photo, and social links directly into their smartphone's native address book.",
      illustration: (
        <svg className="w-full h-32" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Smartphone */}
          <rect x="78" y="15" width="44" height="70" rx="5" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="82" y="22" width="36" height="56" rx="2" fill="#181824" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
          
          {/* Address Book Icon inside phone */}
          <g transform="translate(90, 34)" className="opacity-80">
            <rect x="0" y="0" width="18" height="22" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="9" cy="8" r="3" fill="#f59e0b" />
            <path d="M 3,17 C 3,14.5 5,13.5 9,13.5 C 13,13.5 15,14.5 15,17" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
            <line x1="-2" y1="4" x2="-0.5" y2="4" stroke="#f59e0b" strokeWidth="0.8" />
            <line x1="-2" y1="8" x2="-0.5" y2="8" stroke="#f59e0b" strokeWidth="0.8" />
            <line x1="-2" y1="12" x2="-0.5" y2="12" stroke="#f59e0b" strokeWidth="0.8" />
          </g>
          
          {/* Download Arrow / Sync */}
          <path d="M 100,5 L 100,18 M 97,15 L 100,18 L 103,15" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce" />
          
          {/* Success Check */}
          <circle cx="130" cy="35" r="7" fill="#34d399" />
          <path d="M 127.5,35 L 129.2,36.7 L 132.5,33.3" stroke="#void" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "二重のアイデンティティ（双子アバター） / Dual Alter Identity",
      subtitle: "DUAL ALTER IDENTITY",
      desc: "本名や物理的な所属を明かす必要はありません。クリエイター名、VTuber名、アバター名など、あなたの「もう一つの存在」として名刺を構築可能。プライバシーを守りながら、バーチャルとリアルを繋ぎます。 / No need to reveal your physical identity. Build your card under a creator alias, VTuber name, or avatar name, bridging virtual and real worlds while protecting your privacy.",
      illustration: (
        <svg className="w-full h-32" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 0)">
            {/* Left Profile: Physical (Minimal / Dashed) */}
            <circle cx="78" cy="45" r="18" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="2.5 2.5" />
            <path d="M 60,74 C 60,64 68,60 78,60 C 88,60 96,64 96,74" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="2.5 2.5" />
            <text x="78" y="20" fill="white" fillOpacity="0.25" fontSize="4.5" textAnchor="middle" className="font-mono">PHYSICAL</text>
            
            {/* Right Profile: Digital / Alter (Glowing / Solid Cyan) */}
            <circle cx="122" cy="45" r="18" stroke="#06b6d4" strokeWidth="1.2" />
            <circle cx="122" cy="45" r="8" fill="#06b6d4" fillOpacity="0.1" />
            <path d="M 104,74 C 104,64 112,60 122,60 C 132,60 140,64 140,74" stroke="#06b6d4" strokeWidth="1.2" />
            <text x="122" y="20" fill="#06b6d4" fontSize="5" fontWeight="bold" textAnchor="middle" className="font-mono">ALTER EGO</text>
            
            {/* Overlap / Resonance Spark */}
            <path d="M 100,40 L 100,50" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="1 1" />
            <circle cx="100" cy="45" r="2.5" fill="#22d3ee" className="animate-ping" />
            <circle cx="100" cy="45" r="1" fill="#fff" />
          </g>
        </svg>
      )
    }
  ];

  // 2. 紙名刺じゃできないこと
  const vsPaper = [
    {
      title: "印刷不要・情報の即時更新 / No Printing & Instant Updates",
      desc: "電話番号、メールアドレス、所属が変わるたびに名刺を再印刷する必要はありません。管理画面から書き換えるだけで、すでに配ったカードも含め、すべてのデータがリアルタイムで最新状態に更新されます。 / Never reprint cards. Simply update your details in the dashboard to instantly refresh your profile across all distributed cards in real time."
    },
    {
      title: "無限のリンクとポートフォリオの統合 / Infinite Links & Portfolios",
      desc: "紙名刺の限られたスペースには書ききれない、X、Instagram、ウェブサイト、ポートフォリオ、紹介動画など、すべての活動拠点を一つの画面に集約。相手をあなたのポートフォリオへダイレクトに招待します。 / Consolidate all your platforms—X, Instagram, websites, portfolios, and videos—into a single screen, inviting others directly to your creative showcase."
    },
    {
      title: "半永久的なエコロジーとコスト削減 / Permanent Ecology & Cost Savings",
      desc: "何百枚、何千枚もの紙名刺を持ち歩き、消費する時代は終わりました。たった一枚のHexa Cardが、あなたの生涯にわたるすべてのネットワーキングをカバーし、紙資源の無駄を完全に排除します。 / The era of carrying stacks of paper cards is over. A single Hexa Card covers all your networking needs for life, completely eliminating paper waste."
    }
  ];

  // 3. 同業にはない唯一無二の価値
  const vsCompetitors = [
    {
      title: "月額費用の完全排除（買い切りモデル） / No Monthly Fees (One-time Purchase)",
      subtitle: "NO MONTHLY SUBSCRIPTIONS",
      desc: "多くのデジタル名刺サービスが月額や年額のサブスクリプション契約を求める中、Hexa Cardは完全な『買い切りモデル』を採用。追加のランニングコストは一切発生せず、一生涯無料でシステムをお使いいただけます。 / While other services require monthly fees, Hexa Card is a one-time purchase with zero recurring costs. Enjoy lifetime access to the system for free."
    },
    {
      title: "クリエイター・個人のためのアイデンティティ設計 / Creator-First Identity",
      subtitle: "CREATOR-CENTRIC ARCHITECTURE",
      desc: "ビジネス用の実名利用を前提とした他社サービスとは異なり、私たちはハンドルネームや活動アバターでの登録を全面的にサポート。現実とバーチャルの多面的なアイデンティティを自由に表現できます。 / Unlike corporate-focused services, we fully support aliases, creator names, and avatars, allowing you to express your multi-dimensional identity."
    },
    {
      title: "所有感を満たすビジュアル演出 / Premium Visual Resonance",
      subtitle: "HIGH-END RESONANCE EFFECTS",
      desc: "ただ情報を渡すだけではない。カードを開いた瞬間のアニメーションや演出、サウンドなど、高級Webデザインの技術を駆使したエフェクトを標準搭載。圧倒的な体験価値で同業者と差別化します。 / Beyond sharing info. Deliver custom animations, frames, and sounds crafted with premium web design technology to stand out with an unforgettable experience."
    }
  ];

  return (
    <main className="min-h-screen bg-void text-moonlight overflow-x-hidden font-sans select-none pb-32">
      
      {/* GPU-optimized background gradient layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_35%,rgba(244,63,94,0.03)_0%,transparent_50%),radial-gradient(circle_at_40%_70%,rgba(6,182,212,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-24 pb-24 px-6 flex flex-col items-center text-center">
        
        {/* Vector Art 1: Floating Premium Card (Hero Accent) */}
        <div className="relative w-56 h-36 mx-auto mb-4 z-10">
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              rotateY: [0, 8, 0],
              rotateX: [0, 4, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-full"
          >
            <svg className="w-full h-full" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="15" width="130" height="70" rx="6" fill="#8b5cf6" fillOpacity="0.06" filter="blur(8px)" />
              <rect x="10" y="10" width="140" height="80" rx="6" fill="#0c0c14" stroke="url(#cardBorderGrad)" strokeWidth="1.2" />
              <rect x="15" y="15" width="130" height="70" rx="4" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <rect x="25" y="38" width="20" height="18" rx="2.5" fill="#1e1b4b" stroke="#818cf8" strokeWidth="0.8" />
              <path d="M 25,47 L 45,47 M 35,38 L 35,56" stroke="#818cf8" strokeWidth="0.8" />
              <polygon points="115,35 128,42.5 128,57.5 115,65 102,57.5 102,42.5" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.2" />
              <polygon points="115,40 123,45 123,55 115,60 107,55 107,45" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.1" />
              <text x="25" y="74" fill="white" fillOpacity="0.5" fontSize="5" fontWeight="bold" letterSpacing="0.15em" className="font-mono">HEXA CARD</text>
              <text x="25" y="80" fill="white" fillOpacity="0.2" fontSize="3.5" className="font-mono">SECURE IDENTITY SYSTEM</text>
              <defs>
                <linearGradient id="cardBorderGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
                  <stop offset="35%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/10 text-white/50 text-[10px] tracking-[0.2em] uppercase font-mono">
            <Sparkles size={10} className="text-azure-400" /> 次世代のデジタルアイデンティティ / Next-Gen Digital Identification
          </div>
          
          <h1 className="text-3xl md:text-6xl font-extralight tracking-[0.2em] leading-tight text-white uppercase pt-2">
            Hexa Card
            <span className="block text-xl md:text-2xl tracking-[0.3em] font-light text-white/40 mt-4 normal-case font-sans">
              物理とデジタルを繋ぐ、境界の透過 / Permeation of boundaries, connecting physical and digital.
            </span>
          </h1>
          
          <div className="h-[1px] w-12 bg-white/20 mx-auto my-8" />
          
          <div className="space-y-6">
            <p className="text-lg md:text-2xl tracking-[0.25em] font-extralight text-white border-y border-white/5 py-4 max-w-2xl mx-auto leading-relaxed">
              「このアイテムは新時代のデジタル名刺です」<br />
              <span className="text-sm tracking-widest block opacity-70 mt-1">&quot;This item is the digital business card of a new era.&quot;</span>
            </p>
            <p className="text-[10px] md:text-xs tracking-[0.15em] text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
              ビジネスカードの概念を再定義する。本名である必要も、印刷を繰り返す必要もありません。<br />
              あなたのすべての存在とポートフォリオを、たった一枚の重厚なカードに宿し、<br />
              タップひとつで相手のスマートフォンに美しく展開します。<br />
              <span className="text-[9px] opacity-60 mt-2 block">
                Redefining the concept of business cards. No real names or constant reprinting required.<br />
                Carry your entire presence and portfolio within a single premium card, expanding it elegantly on any smartphone with a single tap.
              </span>
            </p>
          </div>

          <div className="pt-8">
            <Link
              href="/purchase"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-void font-bold text-[10px] uppercase tracking-[0.25em] rounded-full hover:bg-zinc-200 hover:scale-105 transition-all"
            >
              購入する / Order Hexa Card <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ==================== スマート名刺の仕組み ==================== */}
      <section className="py-20 px-6 max-w-3xl mx-auto border-t border-white/5 text-center">
        <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase block mb-2">HOW IT WORKS</span>
        <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white mb-12">スマート名刺の仕組み / How it works</h2>
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 relative px-4 text-left">
          {/* Step 1: Card */}
          <div className="flex flex-col items-center md:items-start space-y-3 z-10 w-full md:w-48 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60 mx-auto md:mx-0">
              <CreditCard size={20} />
            </div>
            <span className="text-[10px] tracking-wider font-bold block">1. カードをかざす / Tap Card</span>
            <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">
              物理カードを相手のスマートフォン（iPhoneは背面カメラ横、Androidは背面中央）にかざします。
            </p>
          </div>

          {/* Step 2: Phone */}
          <div className="flex flex-col items-center md:items-start space-y-3 z-10 w-full md:w-48 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60 mx-auto md:mx-0">
              <Smartphone size={20} />
            </div>
            <span className="text-[10px] tracking-wider font-bold block">2. 瞬時の同期 / Instant Sync</span>
            <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">
              専用アプリは不要です。自動的に通知ポップアップが起動し、標準のブラウザが開きます。
            </p>
          </div>

          {/* Step 3: Server/Profile */}
          <div className="flex flex-col items-center md:items-start space-y-3 z-10 w-full md:w-48 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/60 mx-auto md:mx-0">
              <Share2 size={20} />
            </div>
            <span className="text-[10px] tracking-wider font-bold block">3. つながりの構築 / Connection</span>
            <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">
              ブラウザ上に展開される美しい自己紹介ページを通じて、ポートフォリオ確認や連絡先保存が行えます。
            </p>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 1: CORE FEATURES WITH VECTOR ART ==================== */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 space-y-2">
          <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase">SYSTEM CAPABILITIES</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">実装されている機能のすべて / Complete Feature Set</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="p-6 border border-white/5 bg-white/[0.01] rounded-2xl space-y-6 flex flex-col justify-between hover:border-white/10 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-full flex justify-center p-3 bg-void/40 border border-white/5 rounded-xl relative overflow-hidden">
                  {feat.illustration}
                  <div className="absolute inset-0 bg-grid opacity-[0.01] pointer-events-none" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[7.5px] text-white/30 tracking-widest font-mono font-bold uppercase block">{feat.subtitle}</span>
                  <h3 className="text-sm font-bold text-white tracking-wider">{feat.title}</h3>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-light">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== SECTION 2: VS PAPER CARD WITH VECTOR ART ==================== */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-[8px] tracking-[0.3em] text-pink-400 font-mono font-bold uppercase">EVOLUTION FROM ANALOG</span>
                <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white leading-snug">
                  紙名刺には、決してできないこと / What Paper Cards Can Never Do
                </h2>
              </div>
              
              <div className="w-full py-4 bg-void/30 border border-white/5 rounded-2xl">
                <svg className="w-full h-36 max-w-xs mx-auto" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g className="opacity-30">
                    <rect x="15" y="25" width="65" height="40" rx="2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="23" y1="35" x2="50" y2="35" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
                    <line x1="23" y1="43" x2="40" y2="43" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" />
                    <circle cx="85" cy="20" r="0.8" fill="white" />
                    <circle cx="95" cy="30" r="1.2" fill="white" />
                    <circle cx="90" cy="45" r="0.8" fill="white" />
                  </g>
                  
                  <path d="M 75,45 C 100,45 95,75 120,75" stroke="url(#streamGrad)" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M 68,32 C 92,32 87,62 112,62" stroke="url(#streamGrad)" strokeWidth="1" />
                  <path d="M 60,55 C 110,55 95,85 130,85" stroke="url(#streamGrad)" strokeWidth="0.8" strokeDasharray="1.5 1" />
                  
                  <g>
                    <rect x="120" y="45" width="65" height="40" rx="3" fill="#f43f5e" fillOpacity="0.03" filter="blur(4px)" />
                    <rect x="120" y="45" width="65" height="40" rx="3" fill="#0c0c14" stroke="#f43f5e" strokeWidth="1" />
                    <rect x="126" y="51" width="10" height="10" rx="1.5" fill="none" stroke="#fb7185" strokeWidth="0.6" />
                    <path d="M 165,60 L 166.2,62.5 L 169,63.2 L 166.2,63.9 L 165,66.4 L 163.8,63.9 L 161,63.2 L 163.8,62.5 Z" fill="#38bdf8" />
                  </g>
                  
                  <defs>
                    <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                      <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider font-light">
                100年以上変わらない紙名刺の制約から解放され、デジタルならではの機動力と表現力を手に入れましょう。 / Break free from the century-old constraints of paper cards and embrace the speed and expressiveness of digital networking.
              </p>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              {vsPaper.map((item, idx) => (
                <div key={idx} className="p-6 border border-white/5 bg-void rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-white/50 leading-relaxed pl-3.5 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: VS COMPETITORS ==================== */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-[8px] tracking-[0.3em] text-purple-400 font-mono font-bold uppercase">THE HEXA ADVANTAGE</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">同業他社にはない、唯一無二の価値 / The Unique Value of Hexa Card</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vsCompetitors.map((comp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="space-y-4 text-center md:text-left"
            >
              <span className="text-[14px] font-mono text-purple-400/80 font-bold block">0{idx + 1}</span>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wider">{comp.title}</h3>
                <span className="text-[7.5px] text-white/30 tracking-widest font-mono font-bold uppercase block mt-1">{comp.subtitle}</span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed font-light">{comp.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== SECTION 4: LIFELONG VALUE ==================== */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5 text-center space-y-8">
        <div className="relative w-36 h-36 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <circle cx="60" cy="60" r="42" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 5" className="opacity-50" />
            <polygon points="60,25 88,39 88,71 60,89 32,71 32,39" fill="rgba(6,182,212,0.02)" stroke="#06b6d4" strokeWidth="1" />
            <path d="M 49,60 C 49,55 54,52 60,60 C 66,68 71,65 71,60 C 71,55 66,52 60,60 C 54,68 49,65 49,60 Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" className="opacity-75" />
            <circle cx="60" cy="60" r="5" fill="#22d3ee" className="animate-ping opacity-30" />
            <circle cx="60" cy="60" r="1.5" fill="#fff" />
          </svg>
        </div>

        <div className="space-y-3">
          <span className="text-[8px] tracking-[0.3em] text-cyan-400 font-mono font-bold uppercase">LIFELONG PARTNERSHIP</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">これから一生、使っていけるということ / A Lifelong Companion</h2>
        </div>

        <p className="text-[10px] md:text-xs text-white/60 leading-relaxed max-w-2xl mx-auto font-light tracking-widest">
          物理カードは、傷や摩耗に強い最高峰の耐久素材を使用。何万回ものタップに耐えうる頑丈な設計です。<br />
          そして、カードの裏側で稼働するデジタルシステムはクラウド上で動き続け、<br />
          今後も最新のスマートフォンOSへの対応や機能追加など、半永久的に無償で進化し続けます。<br />
          使い捨てる名刺から、一生共に歩む「デジタルな相棒」へ。<br />
          <span className="text-[9px] opacity-60 mt-2 block font-sans">
            Crafted with highly durable materials resistant to wear and scratches, built to withstand tens of thousands of taps.<br />
            The digital system running behind the card will continue to evolve on the cloud, providing free updates and OS compatibility for life.<br />
            Transition from disposable paper to a lifelong digital partner.
          </span>
        </p>
      </section>

      {/* ==================== カード初期登録の詳細手順 ==================== */}
      <section className="py-20 px-6 max-w-3xl mx-auto border-t border-white/5 text-left font-sans">
        <div className="text-center mb-12">
          <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase block mb-2">ACTIVATION PROCESS</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">カード初期登録の詳細手順 / Activation Protocol</h2>
        </div>
        
        <div className="p-8 border border-white/5 bg-white/[0.01] space-y-6">
          <p className="text-[10px] text-white/40 leading-relaxed tracking-wider">
            Hexa Cardがお手元に届いた後、以下の手順に従ってあなたのアカウントと物理カードを紐付けます。この手順は最初の1回のみ必要で、暗号化通信により安全に保護されています。
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-[9px] font-mono text-azure-400 font-bold shrink-0">STEP 01</span>
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase">カードの検知 / NFC Tap & Detection</h4>
                <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">スマホのNFC読み取りエリア（iPhoneは本体上部の背面、Androidは中央付近）にカードを数秒間近づけます。自動的にブラウザ通知ポップアップが起動します。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] font-mono text-azure-400 font-bold shrink-0">STEP 02</span>
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase">所有権の認証 / Secure Claim Page</h4>
                <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">通知をタップすると、カード固有のセキュアなクレーム（登録）画面にアクセスします。ここでアカウント登録（または既存アカウントへのログイン）を行います。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] font-mono text-azure-400 font-bold shrink-0">STEP 03</span>
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase">アイデンティティの透過同期 / Resonance Sync</h4>
                <p className="text-[9px] text-white/40 tracking-wider leading-relaxed">登録完了後、カードの固有UIDとあなたのアカウントデータが同期されます。以降、カードを誰かにタップするだけで、あなたの最新のプロフィールが表示されます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 技術仕様と対応規格 ==================== */}
      <section className="py-20 px-6 max-w-3xl mx-auto border-t border-white/5 text-left">
        <div className="text-center mb-12">
          <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase block mb-2">TECHNICAL SPECIFICATIONS</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">技術仕様と対応規格 / Technical Specifications</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          <div className="p-6 border border-white/5 bg-white/[0.01]">
            <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">ハードウェア規格 / Hardware Standard</h3>
            <ul className="text-[9px] text-white/40 space-y-2 tracking-wider leading-relaxed list-disc pl-4">
              <li>通信チップ: NTAG213 / NTAG215 高感度NFC ICチップ搭載</li>
              <li>動作周波数: 13.56 MHz (近接型無線通信プロトコル準拠)</li>
              <li>データフォーマット: NDEF (NFC Data Exchange Format) 規格</li>
              <li>物理仕様: 高耐久マットブラックPVC素材 / ISO/IEC 7810準拠 (85.6mm × 53.98mm)</li>
            </ul>
          </div>

          <div className="p-6 border border-white/5 bg-white/[0.01]">
            <h3 className="text-[10px] tracking-[0.2em] font-bold text-white mb-2 uppercase">システム互換性 / System Compatibility</h3>
            <ul className="text-[9px] text-white/40 space-y-2 tracking-wider leading-relaxed list-disc pl-4">
              <li>対応デバイス: NFCリーダー搭載のすべてのスマートフォン</li>
              <li>iOS環境: iPhone XS以降 (iOS 13以上の標準カメラ/NFCリーダー)</li>
              <li>Android環境: OS 6.0以降のNFCオン設定端末</li>
              <li>ブラウザ仕様: WebKit (Safari), Blink (Chrome/Edge) に完全最適化</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== セキュリティと整合性 ==================== */}
      <section className="py-20 px-6 max-w-3xl mx-auto border-t border-white/5 text-left font-sans">
        <div className="text-center mb-12">
          <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase block mb-2">SECURITY & DATA INTEGRITY</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">セキュリティと整合性 / Security & Data Integrity</h2>
        </div>
        <div className="p-6 border border-white/5 bg-white/[0.01]">
          <p className="text-[9px] text-white/40 leading-relaxed tracking-wider">
            Hexa Cardシステムは、ユーザーのプライバシーとデータの整合性を第一に設計されています。物理カードに書き込まれるUID（固有識別子）は、サーバー上の暗号化されたプロフィールと紐付いており、カード自体にあなたの個人情報（電話番号やメールアドレスなど）が直接書き込まれることはありません。紛失時には管理画面から瞬時にカードのリンク解除や無効化（Void）を実行でき、不正アクセスを確実に防ぎます。
          </p>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-20 px-6 max-w-3xl mx-auto border-t border-white/5 text-left">
        <div className="text-center mb-12">
          <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase block mb-2">FAQ</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">よくある質問 / System FAQ</h2>
        </div>
        
        <div className="space-y-8 font-sans">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. Hexa Cardとはどのようなサービスですか？</h3>
            <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
              A. 物理的なNFCスマートカードと、Web上のデジタルプロフィールをシームレスに同期させるビジネスツールです。カードをスマートフォンにかざすだけで、インストール不要で即座にあなたのポートフォリオや連絡先を共有できます。<br />
              <span className="text-[8px] opacity-60 mt-1 block">Hexa Card is a professional tool that synchronizes physical NFC cards with digital profiles. Simply tap the card on a smartphone to share your portfolio and contact info instantly.</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. 会員同士の「共鳴接続」とは何ですか？</h3>
            <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
              A. Hexa Cardユーザー同士が出会った際、お互いのアイデンティティを共鳴させ、非同期に安全な連絡先交換を行う機能です。共鳴が完了すると、名刺帳への登録と同時にシステム内での活動を拡張するためのRelation Token (RT) が付与されます。<br />
              <span className="text-[8px] opacity-60 mt-1 block">Resonance Connection is a feature for Hexa Card members to securely exchange contact details asynchronously. Establishing resonance also grants Relation Tokens (RT).</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. セキュリティや個人情報の保護はどのようになっていますか？</h3>
            <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
              A. 本システムはプライバシーの保護を最優先に設計されています。公開するエイリアス情報と、厳重に暗号化された個人情報を明確に分離し、あなたが「共鳴」を承認した信頼できるパートナーにのみ、選択した連絡先が開示される仕組みを採用しています。<br />
              <span className="text-[8px] opacity-60 mt-1 block">Security and privacy are our highest priorities. Public aliases and encrypted personal details are separated, revealing contacts only to trusted partners you resonate with.</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">Q. どのような端末に対応していますか？</h3>
            <p className="text-[9px] text-white/40 leading-relaxed tracking-wider pl-4">
              A. Safari（WebKit）を含むiOS、およびAndroid端末の標準ブラウザに完全対応しています。特別なアプリケーションのダウンロードは一切不要で、NFCのタップまたはQRコードの読み取りによって瞬時にプロフィールが透過的に展開されます。<br />
              <span className="text-[8px] opacity-60 mt-1 block">Fully compatible with standard browsers on iOS (Safari/WebKit) and Android. No app installation required; profiles load via NFC tap or QR code scan.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <div className="h-[1px] w-12 bg-white/25 mx-auto" />
          <h2 className="text-2xl md:text-4xl font-extralight tracking-[0.2em] text-white leading-snug">
            境界を超え、アイデンティティを同調する / Transcending boundaries, synchronizing identities.
          </h2>
          <p className="text-[8px] tracking-[0.4em] text-white/40 uppercase font-mono">
            NO RUNNING COSTS / PERMANENT IDENTITY
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link 
              href="/purchase" 
              className="w-full sm:w-auto px-12 py-5 bg-white text-void text-[10px] font-bold tracking-[0.2em] rounded-full hover:bg-zinc-200 hover:scale-105 transition-all"
            >
              購入する / Order Hexa Card
            </Link>
            <Link 
              href="/guide" 
              className="w-full sm:w-auto px-10 py-5 border border-white/10 text-[10px] text-white/70 font-bold tracking-[0.15em] rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              使い方を見る / System Guide <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
