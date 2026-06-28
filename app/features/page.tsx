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
  QrCode,
  Trophy,
  Coins
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "本名は不要。二次元と三次元の境界を繋ぐアバターカード",
      subtitle: "UNLEASH YOUR ALTER IDENTITY",
      desc: "ビジネス名刺の常識を覆します。本名である必要は一切ありません。ハンドルネーム、アーティスト名、VTuber名、オリジナルキャラクター名など、あなたの「もう一つのアイデンティティ」をそのまま名刺化。現実世界にいながら、バーチャルの存在として相手と繋がることができます。",
      color: "from-purple-500 to-indigo-500",
      accent: "text-purple-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="160" height="80" rx="6" fill="#181824" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx="55" cy="60" r="20" fill="#2e2e48" stroke="#a78bfa" strokeWidth="1" />
          <path d="M55 52 L57 57 L62 57 L58 60 L60 65 L55 62 L50 65 L52 60 L48 57 L53 57 Z" fill="#c084fc" />
          <rect x="90" y="42" width="70" height="12" rx="3" fill="#a78bfa" fillOpacity="0.1" />
          <text x="95" y="51" fill="#c084fc" fontSize="7" fontWeight="bold" letterSpacing="0.1em" className="font-mono">@Nox_Creator</text>
          
          <rect x="90" y="60" width="55" height="10" rx="3" fill="#ffffff" fillOpacity="0.05" />
          <text x="95" y="67" fill="#ffffff" fillOpacity="0.5" fontSize="5" fontWeight="bold" letterSpacing="0.05em">Freelance Designer</text>
          
          <rect x="90" y="76" width="30" height="8" rx="2" fill="#818cf8" fillOpacity="0.2" />
          <text x="93" y="82" fill="#818cf8" fontSize="4.5" fontWeight="black">CREATOR</text>
          
          <rect x="125" y="76" width="25" height="8" rx="2" fill="#34d399" fillOpacity="0.2" />
          <text x="128" y="82" fill="#34d399" fontSize="4.5" fontWeight="black">VTUBER</text>
        </svg>
      )
    },
    {
      title: "限定アセットを蒐集せよ。ガチャ（共鳴）がもたらす所有欲",
      subtitle: "COLLECT EXCLUSIVE ARTIFACTS",
      desc: "あなたのカードデザインを飾るのは、Commonから超激レアのMythicまで、5つの階級に分かれた『仮想遺物（アセット）』。Relation Token（RT）を消費して引く【共鳴ガチャ】で、超低確率のレジェンダリーフレームや、怪しく揺らめくアニメーションオーラを引き当てろ。他人と被る余地のない、圧倒的な希少性を手に入れましょう。",
      color: "from-pink-500 to-rose-500",
      accent: "text-pink-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 0)">
            {/* Exploded View of Rarity Layers */}
            <path d="M 30,85 L 130,55 L 160,70 L 60,100 Z" fill="#111" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x="75" y="85" fill="#a855f7" fillOpacity="0.8" fontSize="6" transform="rotate(-16, 75, 85)" className="font-mono font-bold">MYTHIC: BACKGROUND</text>
            
            <path d="M 35,65 L 135,35 L 165,50 L 65,80 Z" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2" className="opacity-70 animate-pulse" />
            <text x="80" y="65" fill="#f43f5e" fillOpacity="0.9" fontSize="6" transform="rotate(-16, 80, 65)" className="font-mono font-bold">LEGENDARY: AURA EFFECT</text>
            
            <path d="M 40,45 L 140,15 L 170,30 L 70,60 Z" fill="rgba(244,63,94,0.05)" stroke="#fb7185" strokeWidth="1.5" />
            <text x="85" y="45" fill="#fb7185" fillOpacity="0.8" fontSize="6" transform="rotate(-16, 85, 45)" className="font-mono font-bold">EPIC: FRAME</text>
            
            <line x1="30" y1="85" x2="40" y2="45" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="130" y1="55" x2="140" y2="15" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="160" y1="70" x2="170" y2="30" stroke="rgba(251,113,133,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>
        </svg>
      )
    },
    {
      title: "毎日チャンスが訪れる。元手ゼロから最強カードを育成",
      subtitle: "DAILY RESONANCE MINING",
      desc: "カードを育てるのに、必ずしも多額の費用は必要ありません。毎日システムにログインし「デイリー共鳴」を行うことで、無料のトークン（RT）をマイニング。運が良ければトークンが大幅に増量するジャックポットが発生します。手に入れたトークンで再びガチャを回し、さらなる高みへとカードを強化する、病みつきのサイクルが始まります。",
      color: "from-amber-500 to-yellow-500",
      accent: "text-amber-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 10)">
            {/* Mining representation */}
            <circle cx="50" cy="50" r="25" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 50,35 L 50,65 M 35,50 L 65,50" stroke="#f59e0b" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="12" fill="#f59e0b" fillOpacity="0.2" className="animate-ping" />
            <circle cx="50" cy="50" r="6" fill="#f59e0b" />
            <text x="50" y="88" fill="#f59e0b" fontSize="6.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em" className="font-mono">DAILY RT MINING</text>
            
            {/* Arrow */}
            <path d="M 95,50 L 115,50" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 111,46 L 115,50 L 111,54" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Token bag / reward */}
            <g transform="translate(125, 30)">
              <rect x="0" y="10" width="30" height="20" rx="3" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="15" y="23" fill="#f59e0b" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">RT+</text>
            </g>
          </g>
        </svg>
      )
    },
    {
      title: "ステータスを誇示せよ。限定称号による圧倒的な優越感",
      subtitle: "DOMINATE WITH PRESTIGIOUS TITLES",
      desc: "「APEX」「Fixer」「Strategist」……特定の条件やガチャによってのみ開放される数々の『称号』。獲得した称号は、相手があなたの名刺をスマホで開いた瞬間に最も目立つ特等席に刻まれます。自己の功績とステータスを相手の脳裏に焼き付け、ネットワーキングにおける支配的地位（マウンティング）を確立せよ。",
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-300",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(40, 10)">
            <rect x="0" y="10" width="120" height="80" rx="6" fill="#181824" stroke="#f43f5e" strokeWidth="1.5" />
            
            {/* Title badge area */}
            <rect x="25" y="25" width="70" height="18" rx="9" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" strokeWidth="1" />
            <text x="60" y="37" fill="#f43f5e" fontSize="7" fontWeight="black" textAnchor="middle" letterSpacing="0.2em" className="font-mono">★ APEX PIONEER</text>
            
            {/* User Details */}
            <rect x="35" y="55" width="50" height="5" rx="1" fill="rgba(255,255,255,0.2)" />
            <rect x="45" y="66" width="30" height="4" rx="1" fill="rgba(255,255,255,0.1)" />
          </g>
        </svg>
      )
    },
    {
      title: "もらった紙の名刺も、スマホで撮るだけで一元管理！",
      subtitle: "INTEGRATED CARD MANAGEMENT",
      desc: "自らの極上カスタムを配るだけではありません。受け取った従来の紙名刺も、スマホで撮影するだけでAIが文字情報を1秒で解析し、デジタルデータとしてあなたの名刺帳（Library）に一括保存します。これ一つで「配る」「集める」「育てる」が完全に集約されます。",
      color: "from-blue-500 to-cyan-500",
      accent: "text-blue-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(45, 10)">
            <rect x="0" y="0" width="110" height="100" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <rect x="35" y="0" width="40" height="4" rx="1" fill="#000" />
            
            <rect x="15" y="15" width="80" height="40" rx="3" fill="rgba(59,130,246,0.05)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="10" y1="35" x2="100" y2="35" stroke="#3b82f6" strokeWidth="1.5" />
            
            <g transform="translate(15, 62)">
              <rect x="0" y="0" width="50" height="6" rx="1.5" fill="#3b82f6" fillOpacity="0.2" />
              <rect x="0" y="10" width="80" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
              <rect x="0" y="18" width="65" height="4" rx="1" fill="rgba(255,255,255,0.1)" />
            </g>
          </g>
        </svg>
      )
    },
    {
      title: "自慢の激レアカードをSNSで晒し、羨望の的となれ",
      subtitle: "FLEX ON SOCIAL MEDIA",
      desc: "手に入れたレジェンダリーアセットや超激レア称号を装備した自慢のマイカードを画像としてキャプチャし、X（旧Twitter）やInstagramでそのまま晒しましょう。ネット上のデジタルプロフィールカードとして圧倒的な存在感を放ち、フォロワーや競合に「ガチャ運」と「ステータス」を見せつけることができます。",
      color: "from-cyan-500 to-azure-500",
      accent: "text-cyan-400",
      illustration: (
        <svg className="w-full h-36" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10, 10)">
            <rect x="10" y="5" width="160" height="85" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            <circle cx="24" cy="20" r="6" fill="#1e293b" />
            <rect x="36" y="15" width="45" height="5" rx="1" fill="rgba(255,255,255,0.3)" />
            
            <rect x="24" y="34" width="70" height="44" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1" />
            <rect x="25" y="35" width="68" height="42" rx="1.5" fill="#22d3ee" fillOpacity="0.05" />
            <circle cx="40" cy="56" r="8" fill="rgba(255,255,255,0.1)" />
            <line x1="52" y1="52" x2="80" y2="52" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="52" y1="62" x2="75" y2="62" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.7" />
 
            <g transform="translate(115, 45)">
              <circle cx="16" cy="16" r="14" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="1" />
              <path d="M 11,18 L 15,14 L 11,10" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 21,14 L 17,18 L 21,22" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="16" y="-6" fill="#22d3ee" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">FLEX SHARE</text>
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
            <Sparkles size={12} className="text-pink-400 animate-spin" /> Unveil the Matrix / 境界の覚醒
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 pt-4">
            極上のレアリティを、<br className="md:hidden" />その胸元に。
          </h1>
          
          <p className="text-xs md:text-lg tracking-widest text-white/70 max-w-3xl mx-auto leading-relaxed font-medium pt-4 text-center">
            ただの名刺交換を、激レアアイテムの「コレクションバトル」に変貌させる。<br />
            NFCをタップして渡す【限定称号と動的エフェクト】、もらった名刺を吸収する【AI名刺帳】。<br />
            すべての活動者のためのプレミアム・デジタルスマート名刺「Hexa Card」。
          </p>

          <div className="pt-6">
            <Link
              href="/purchase"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105 transition-all"
            >
              Get Your Card / 限定カードを注文する <ArrowRight size={14} />
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

      {/* Protocol / How NFC tap works */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5 mt-16 relative">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-wide">
              タップ一発で、相手のスマホをジャック。
            </h2>
            <p className="text-xs md:text-sm text-white/40 tracking-widest uppercase">
              EASY 3-STEP OPERATION / 導入と同期手順
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-white/5 bg-void text-center space-y-4 rounded-2xl group hover:border-purple-500/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 font-black text-lg">1</div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">カードをかざす</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                相手のiPhoneまたはAndroidのNFC読み取り部分に、重厚なHexa Cardを軽く当てます。
              </p>
            </div>

            <div className="p-8 border border-white/5 bg-void text-center space-y-4 rounded-2xl group hover:border-pink-500/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400 font-black text-lg">2</div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">リンクを開く</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                アプリ不要。一瞬でブラウザの通知ポップアップが表示され、タップすればすぐに同期が始まります。
              </p>
            </div>

            <div className="p-8 border border-white/5 bg-void text-center space-y-4 rounded-2xl group hover:border-cyan-500/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 font-black text-lg">3</div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">激レア演出を展開</h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                あなたがガチャで手に入れた限定背景、フレーム、サウンド、そして称号が相手の画面に派手にロードされます。
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
            レアリティで支配せよ。
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
