"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  RefreshCw, 
  User, 
  Share2, 
  Smartphone, 
  ArrowRight, 
  Palette, 
  Infinity as InfinityIcon, 
  CheckCircle,
  HelpCircle,
  QrCode
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturesPage() {
  const features = [
    {
      title: "本名は不要。活動名やVTuber名でも大歓迎！",
      subtitle: "REAL NAME NOT REQUIRED",
      desc: "ビジネス名刺の常識を覆します。本名である必要は一切ありません。ハンドルネーム、アーティスト名、VTuber名、オリジナルキャラクター名など、あなたの「活動アイデンティティ」をそのまま名刺にできます。フリーランスやクリエイターの活動用として、どんな使い方でもOK！",
      color: "from-purple-500 to-indigo-500",
      accent: "text-purple-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="160" height="80" rx="6" fill="#181824" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx="55" cy="60" r="20" fill="#2e2e48" stroke="#a78bfa" strokeWidth="1" />
          {/* Persona symbol: game/star avatar */}
          <path d="M55 52 L57 57 L62 57 L58 60 L60 65 L55 62 L50 65 L52 60 L48 57 L53 57 Z" fill="#c084fc" />
          {/* Dynamic Name Labels switching */}
          <rect x="90" y="42" width="70" height="12" rx="3" fill="#a78bfa" fillOpacity="0.1" />
          <text x="95" y="51" fill="#c084fc" fontSize="7" fontWeight="bold" letterSpacing="0.1em" className="font-mono">@Nox_Creator</text>
          
          <rect x="90" y="60" width="55" height="10" rx="3" fill="#ffffff" fillOpacity="0.05" />
          <text x="95" y="67" fill="#ffffff" fillOpacity="0.5" fontSize="5" fontWeight="bold" letterSpacing="0.05em">Freelance Designer</text>
          
          {/* Dynamic tag badges */}
          <rect x="90" y="76" width="30" height="8" rx="2" fill="#818cf8" fillOpacity="0.2" />
          <text x="93" y="82" fill="#818cf8" fontSize="4.5" fontWeight="black">CREATOR</text>
          
          <rect x="125" y="76" width="25" height="8" rx="2" fill="#34d399" fillOpacity="0.2" />
          <text x="128" y="82" fill="#34d399" fontSize="4.5" fontWeight="black">VTUBER</text>
        </svg>
      )
    },
    {
      title: "組み合わせ「31億通り以上」の無限カスタム！",
      subtitle: "3.1 BILLION+ COMBINATIONS",
      desc: "アセットの組み合わせは天文学的。フレーム（28種）、背景（28種）、動的エフェクト（31種）、オーラ（15種）、タッチ演出（15種）、共鳴音響（15種）、称号（19種）、カード方向（2種）を装備可能。アライメント微調整を含めると、なんと1.6千兆通り！誰とも被らない、あなただけの絶対的個性を表現できます。",
      color: "from-pink-500 to-rose-500",
      accent: "text-pink-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Layered Exploded View Diagram */}
          <g transform="translate(10, 0)">
            {/* Base Card */}
            <path d="M 30,85 L 130,55 L 160,70 L 60,100 Z" fill="#111" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x="75" y="85" fill="white" fillOpacity="0.1" fontSize="6" transform="rotate(-16, 75, 85)" className="font-mono font-bold">BACKGROUND LAYER</text>
            
            {/* Aura Effect Layer */}
            <path d="M 35,65 L 135,35 L 165,50 L 65,80 Z" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2" className="opacity-70 animate-pulse" />
            <text x="80" y="65" fill="#f43f5e" fillOpacity="0.4" fontSize="6" transform="rotate(-16, 80, 65)" className="font-mono font-bold">AURA LAYER</text>
            
            {/* Frame Layer */}
            <path d="M 40,45 L 140,15 L 170,30 L 70,60 Z" fill="rgba(244,63,94,0.05)" stroke="#fb7185" strokeWidth="1.5" />
            <text x="85" y="45" fill="#fb7185" fillOpacity="0.8" fontSize="6" transform="rotate(-16, 85, 45)" className="font-mono font-bold">FOREGROUND FRAME</text>
            
            {/* Connecting Rays */}
            <line x1="30" y1="85" x2="40" y2="45" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="130" y1="55" x2="140" y2="15" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="160" y1="70" x2="170" y2="30" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="60" y1="100" x2="70" y2="60" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>
        </svg>
      )
    },
    {
      title: "書き換えはデータ更新だけ。二度と刷り直さない！",
      subtitle: "ZERO REPRINTING COST",
      desc: "住所や電話番号、SNSのアカウントが変わるたびに名刺を刷り直して、古い名刺をゴミ箱に捨てる必要はもうありません。Web上のマイページから編集して保存ボタンを押すだけで、すでに相手に渡した名刺の情報も瞬時にアップデートされます。エコで、スマートで、無駄な印刷コストは一切ゼロです。",
      color: "from-emerald-500 to-teal-500",
      accent: "text-emerald-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Comparison diagram: old vs new */}
          {/* Trash can with old cards */}
          <g transform="translate(10, 10)">
            <rect x="20" y="55" width="25" height="35" rx="2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="25" y1="62" x2="25" y2="83" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="32.5" y1="62" x2="32.5" y2="83" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="40" y1="62" x2="40" y2="83" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <path d="M 18,55 L 47,55" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            {/* Trash icons / cards inside */}
            <rect x="25" y="42" width="12" height="7" rx="0.5" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="0.5" transform="rotate(25, 25, 42)" />
            <rect x="33" y="45" width="12" height="7" rx="0.5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" transform="rotate(-15, 33, 45)" />
            <text x="32" y="98" fill="#ef4444" fontSize="5" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">OLD: WASTED PAPER</text>
          </g>

          {/* Connected arrow */}
          <path d="M 85,55 L 105,55" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 101,51 L 105,55 L 101,59" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Cloud Sync Card */}
          <g transform="translate(110, 10)">
            <rect x="15" y="35" width="55" height="35" rx="3" fill="#10b981" fillOpacity="0.1" stroke="#34d399" strokeWidth="1.5" />
            {/* Sync circular arrows */}
            <path d="M 42.5,45 A 5,5 0 0,1 47.5,50" stroke="#34d399" strokeWidth="1" strokeLinecap="round" />
            <path d="M 42.5,55 A 5,5 0 0,1 37.5,50" stroke="#34d399" strokeWidth="1" strokeLinecap="round" />
            <path d="M 46.5,43 L 48.5,45 L 45.5,47" stroke="#34d399" strokeWidth="0.8" strokeLinejoin="round" />
            <path d="M 38.5,57 L 36.5,55 L 39.5,53" stroke="#34d399" strokeWidth="0.8" strokeLinejoin="round" />
            <rect x="22" y="76" width="41" height="7" rx="1.5" fill="#10b981" fillOpacity="0.2" />
            <text x="42.5" y="81" fill="#34d399" fontSize="4.5" fontWeight="black" textAnchor="middle" letterSpacing="0.05em">NEW: INSTANT CLOUD SYNC</text>
          </g>
        </svg>
      )
    },
    {
      title: "顔写真やイラスト対応。誰から貰ったか忘れない！",
      subtitle: "ICONIC IDENTITY PRESERVATION",
      desc: "「紙の名刺をたくさん貰ったけれど、誰が誰だかさっぱり思い出せない…」そんな問題は過去のもの。Hexa Cardでは、あなた自身の顔写真やオリジナルキャラクターのイラストを画像として設定できます。もらった相手のスマホ名刺帳に美しいグラフィックとして記録されるため、あなたの顔と名前がしっかりと結びついた状態で記憶に残ります。",
      color: "from-amber-500 to-orange-500",
      accent: "text-amber-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Smartphone Contact List mockup */}
          <g transform="translate(60, 10)">
            <rect x="0" y="0" width="80" height="100" rx="6" fill="#1c1917" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {/* Phone notch */}
            <rect x="25" y="0" width="30" height="4" rx="1" fill="#000" />
            
            {/* Contact Card Area */}
            <circle cx="40" cy="35" r="16" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1" />
            {/* Avatar drawing (smiling face vector representation) */}
            <circle cx="40" cy="31" r="5" stroke="#f59e0b" strokeWidth="1" />
            <path d="M 33,45 C 33,39 47,39 47,45" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
            <path d="M 38,32 C 39,33 41,33 42,32" stroke="#f59e0b" strokeWidth="0.6" strokeLinecap="round" />
            
            {/* Verified badge */}
            <circle cx="52" cy="45" r="4.5" fill="#f59e0b" />
            <path d="M 50.5,45 L 51.5,46 L 53.5,44" stroke="#1c1917" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Name text */}
            <rect x="15" y="60" width="50" height="8" rx="2" fill="rgba(255,255,255,0.05)" />
            <text x="40" y="66" fill="white" fontSize="6" fontWeight="black" textAnchor="middle" letterSpacing="0.1em">S. Sasaki / ササキ</text>
            
            <rect x="20" y="73" width="40" height="6" rx="1.5" fill="rgba(245,158,11,0.05)" />
            <text x="40" y="78" fill="#f59e0b" fontSize="4" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">Verified resonance</text>

            <circle cx="40" cy="90" r="3" fill="#10b981" />
            <circle cx="40" cy="90" r="5" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1.5 1" className="animate-pulse" />
          </g>
        </svg>
      )
    },
    {
      title: "名刺カード画像をそのままSNSで公開・シェア！",
      subtitle: "SNS INTEGRATION READY",
      desc: "物理名刺としてスマホにタップさせるだけが使い方ではありません。マイページで作成したお気に入りのカスタマイズ名刺カードプレビューを画像としてキャプチャし、そのままX（旧Twitter）やInstagram、ポートフォリオサイトに掲載できます。ネット上の「デジタルプロフィールカード」として広くアピールすることが可能です。",
      color: "from-cyan-500 to-azure-500",
      accent: "text-cyan-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* SNS Feed grid mock */}
          <g transform="translate(10, 10)">
            {/* SNS Post Frame */}
            <rect x="10" y="5" width="160" height="85" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Post Header */}
            <circle cx="24" cy="20" r="6" fill="#1e293b" />
            <rect x="36" y="15" width="45" height="5" rx="1" fill="rgba(255,255,255,0.3)" />
            <rect x="36" y="22" width="25" height="3" rx="0.5" fill="rgba(255,255,255,0.15)" />
            
            {/* Embedded Hexa Card Preview image */}
            <rect x="24" y="34" width="70" height="44" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1" />
            <rect x="25" y="35" width="68" height="42" rx="1.5" fill="#22d3ee" fillOpacity="0.05" />
            <circle cx="40" cy="56" r="8" fill="rgba(255,255,255,0.1)" />
            <line x1="52" y1="52" x2="80" y2="52" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="52" y1="57" x2="70" y2="57" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="52" y1="62" x2="75" y2="62" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.7" />

            {/* Sharing arrows / Retweet icon vector representation */}
            <g transform="translate(115, 45)">
              <circle cx="16" cy="16" r="14" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="1" />
              <path d="M 11,18 L 15,14 L 11,10" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 21,14 L 17,18 L 21,22" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 15,14 L 19,14" stroke="#22d3ee" strokeWidth="1.2" />
              <path d="M 17,18 L 13,18" stroke="#22d3ee" strokeWidth="1.2" />
              <text x="16" y="-6" fill="#22d3ee" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">DIRECT SHARE</text>
            </g>
          </g>
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-void text-moonlight overflow-x-hidden font-sans select-none pb-24">
      {/* Dynamic colorful bg gradient circles */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[400px] right-1/4 w-[550px] h-[550px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[300px] left-1/3 w-[500px] h-[500px] bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <Sparkles size={12} className="text-pink-400 animate-spin" /> Unveiling Smart Cards / 新時代の名刺体験
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 pt-4">
            名刺を、オシャレに<br className="hidden md:inline" />使い倒せ。
          </h1>
          
          <p className="text-xs md:text-lg tracking-widest text-white/70 max-w-2xl mx-auto leading-relaxed font-medium pt-4">
            ビジネスマンだけの時代は終わった。<br className="md:hidden" />クリエイター、フリーランス、すべての活動者のためのデジタルスマート名刺「Hexa Card」。
          </p>

          <div className="pt-6">
            <Link
              href="/purchase"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105 transition-all"
            >
              Get Your Card / カードを作る <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Grid of friendly illustration cards */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="space-y-16">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12 p-8 md:p-12 border border-white/10 bg-white/[0.02] rounded-3xl backdrop-blur-md relative overflow-hidden group`}
            >
              {/* Vibrant accent gradient backgrounds inside card */}
              <div className={`absolute -right-24 -bottom-24 w-64 h-64 bg-gradient-to-r ${feat.color} opacity-[0.02] group-hover:opacity-[0.08] blur-[40px] rounded-full transition-opacity duration-500`} />

              {/* Left/Right illustration container */}
              <div className="w-full md:w-[40%] flex justify-center shrink-0 p-4 bg-void/50 border border-white/5 rounded-2xl relative overflow-hidden">
                {feat.illustration}
                <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
              </div>

              {/* Text Description container */}
              <div className="w-full md:w-[60%] space-y-4">
                <span className={`text-[10px] tracking-[0.3em] font-black uppercase ${feat.accent} block`}>
                  {feat.subtitle}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
                  {feat.title}
                </h2>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed tracking-wider font-medium">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Protocol / How NFC tap exchange works (visual layout) */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5 mt-16 relative">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-wide">
              スマホをかざすだけ、3ステップの魔法。
            </h2>
            <p className="text-xs md:text-sm text-white/40 tracking-widest uppercase">
              EASY 3-STEP OPERATION / 導入と共有手順
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-white/5 bg-void text-center space-y-4 rounded-2xl group hover:border-purple-500/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 font-black text-lg">1</div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">スマホの近くにかざす</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                iPhoneなら本体の上端、Androidなら背面の中央あたりに物理カードをそっとかざすだけ。
              </p>
            </div>

            <div className="p-8 border border-white/5 bg-void text-center space-y-4 rounded-2xl group hover:border-pink-500/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400 font-black text-lg">2</div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">自動でブラウザが起動</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                専用の追加アプリなどは一切不要。自動的にURLポップアップが出現し、タップするだけで相手のスマホに読み込まれます。
              </p>
            </div>

            <div className="p-8 border border-white/5 bg-void text-center space-y-4 rounded-2xl group hover:border-cyan-500/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 font-black text-lg">3</div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">名刺が美しく展開！</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                あなたがオンラインで編集したお気に入りのアセットや演出を纏ったカスタム名刺が、滑らかな演出と共にロードされます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            さあ、常識を壊し、<br />
            オシャレに使い倒そう。
          </h2>
          <p className="text-[11px] tracking-[0.4em] text-white/40 uppercase">
            NO MORE PLAIN CARD / 誰もがクリエイティブな世界へ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link 
              href="/purchase" 
              className="w-full sm:w-auto px-12 py-5 bg-white text-void text-xs font-bold tracking-[0.2em] rounded-full hover:bg-zinc-200 hover:scale-105 transition-all"
            >
              Order Hexa Card / 購入する
            </Link>
            <Link 
              href="/guide" 
              className="w-full sm:w-auto px-10 py-5 border border-white/10 text-xs text-white/70 font-bold tracking-[0.15em] rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              View System Guide / 使い方を見る <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
