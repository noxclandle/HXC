"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  Palette, 
  CheckCircle,
  QrCode,
  Layers,
  Infinity as InfinityIcon,
  Zap,
  ShieldCheck,
  Music,
  Camera,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  
  // 1. 実装している全機能の紹介
  const coreFeatures = [
    {
      title: "NFC 同調転送",
      subtitle: "NFC TAP TRANSFER",
      desc: "専用アプリは一切不要。カードを相手のスマートフォンにかざすだけで、ブラウザが起動し、あなたのデジタルプロフィールが一瞬で透過展開されます。名刺交換の瞬間を、シームレスなデジタル体験へと昇華します。",
      icon: <Smartphone className="text-azure-400" size={24} />
    },
    {
      title: "五感に共鳴するカスタムデザイン",
      subtitle: "VISUAL & AUDIO CUSTOMIZATION",
      desc: "静的な名刺の限界を超えます。厳選されたビジュアルテーマ、流麗なアニメーションフレーム、そして背景に流れる環境音楽（BGM）まで自由にカスタマイズ。相手の視覚と聴覚に深い印象を刻み込みます。",
      icon: <Music className="text-purple-400" size={24} />
    },
    {
      title: "AI-OCR 紙名刺スキャナー",
      subtitle: "AI-OCR ANALOG CARD SCANNER",
      desc: "受け取った紙の名刺も無駄にしません。スマートフォンのカメラで撮影するだけで、内蔵AIが文字情報を高精度で瞬時に解析。あなたの中央名刺ライブラリ（Library）にデジタルデータとして一元保存します。",
      icon: <Camera className="text-pink-400" size={24} />
    },
    {
      title: "vCard 連絡先一括インポート",
      subtitle: "ONE-CLICK CONTACT SAVE",
      desc: "相手があなたのプロフィール画面から「連絡先を保存」を押すだけで、電話番号やメールアドレスはもちろん、アイコン画像や各種SNSリンク情報まで、スマートフォンの連絡先（アドレス帳）に直接保存されます。",
      icon: <QrCode className="text-amber-400" size={24} />
    },
    {
      title: "二重のアイデンティティ（双子アバター）",
      subtitle: "DUAL ALTER IDENTITY",
      desc: "本名や物理的な所属を明かす必要はありません。クリエイター名、VTuber名、アバター名など、あなたの「もう一つの存在」として名刺を構築可能。プライバシーを守りながら、バーチャルとリアルを繋ぎます。",
      icon: <Layers className="text-cyan-400" size={24} />
    }
  ];

  // 2. 紙名刺じゃできないこと
  const vsPaper = [
    {
      title: "印刷不要・情報の即時更新",
      desc: "電話番号、メールアドレス、所属が変わるたびに名刺を再印刷する必要はありません。管理画面から書き換えるだけで、すでに配ったカードも含め、すべてのデータがリアルタイムで最新状態に更新されます。"
    },
    {
      title: "無限のリンクとポートフォリオの統合",
      desc: "紙名刺の限られたスペースには書ききれない、X、Instagram、ウェブサイト、ポートフォリオ、紹介動画など、すべての活動拠点を一つの画面に集約。相手をあなたのポートフォリオへダイレクトに誘います。"
    },
    {
      title: "半永久的なエコロジーとコスト削減",
      desc: "何百枚、何千枚もの紙名刺を持ち歩き、消費する時代は終わりました。たった一枚のHexa Cardが、あなたの生涯にわたるすべてのネットワーキングをカバーし、紙資源の無駄を完全に排除します。"
    }
  ];

  // 3. 同業にはない唯一無二の価値
  const vsCompetitors = [
    {
      title: "月額費用の完全排除（買い切りモデル）",
      subtitle: "NO MONTHLY SUBSCRIPTIONS",
      desc: "多くのデジタル名刺サービスが月額や年額のサブスクリプション契約を求める中、Hexa Cardは完全な『買い切りモデル』を採用。追加のランニングコストは一切発生せず、一生涯無料でシステムをお使いいただけます。"
    },
    {
      title: "クリエイター・個人のためのアイデンティティ設計",
      subtitle: "CREATOR-CENTRIC ARCHITECTURE",
      desc: "ビジネス用の実名利用を前提とした他社サービスとは異なり、私たちはハンドルネームや活動アバターでの登録を全面的にサポート。現実とバーチャルの多面的なアイデンティティを自由に表現できます。"
    },
    {
      title: "所有感を満たすビジュアル演出",
      subtitle: "HIGH-END RESONANCE EFFECTS",
      desc: "ただ情報を渡すだけではない。カードを開いた瞬間のアニメーションや演出、サウンドなど、高級Webデザインの技術を駆使したエフェクトを標準搭載。圧倒的な体験価値で同業者と差別化します。"
    }
  ];

  return (
    <main className="min-h-screen bg-void text-moonlight overflow-x-hidden font-sans select-none pb-32">
      
      {/* GPU-optimized background gradient layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_35%,rgba(244,63,94,0.03)_0%,transparent_50%),radial-gradient(circle_at_40%_70%,rgba(6,182,212,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/10 text-white/50 text-[10px] tracking-[0.2em] uppercase font-mono">
            <Sparkles size={10} className="text-azure-400" /> PERMEATION AND EXPANSION OF IDENTITY
          </div>
          
          <h1 className="text-3xl md:text-6xl font-extralight tracking-[0.2em] leading-tight text-white uppercase pt-2">
            Hexa Card
            <span className="block text-xl md:text-2xl tracking-[0.3em] font-light text-white/40 mt-4 normal-case font-sans">
              物理とデジタルを繋ぐ、境界の透過。
            </span>
          </h1>
          
          <div className="h-[1px] w-12 bg-white/20 mx-auto my-8" />
          
          <p className="text-[11px] md:text-sm tracking-[0.15em] text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
            ビジネスカードの概念を再定義する。本名である必要も、印刷を繰り返す必要もありません。<br />
            あなたのすべての存在とポートフォリオを、たった一枚の重厚なカードに宿し、<br />
            タップひとつで相手のスマートフォンに美しく展開します。
          </p>

          <div className="pt-8">
            <Link
              href="/purchase"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-void font-bold text-[10px] uppercase tracking-[0.25em] rounded-full hover:bg-zinc-200 hover:scale-105 transition-all"
            >
              Order Hexa Card / 購入する <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ==================== SECTION 1: CORE FEATURES ==================== */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 space-y-2">
          <span className="text-[8px] tracking-[0.3em] text-azure-400 font-mono font-bold uppercase">SYSTEM CAPABILITIES</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">実装されている機能のすべて</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl space-y-4 flex flex-col justify-between hover:border-white/10 transition-all"
            >
              <div className="space-y-4">
                <div className="p-2 border border-white/10 w-fit rounded-xl bg-void">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider">{feat.title}</h3>
                  <span className="text-[7.5px] text-white/30 tracking-widest font-mono font-bold uppercase block mt-1">{feat.subtitle}</span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-light">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== SECTION 2: VS PAPER CARD ==================== */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[8px] tracking-[0.3em] text-pink-400 font-mono font-bold uppercase">EVOLUTION FROM ANALOG</span>
              <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white leading-snug">
                紙の名刺には、<br className="hidden lg:block" />決してできないこと。
              </h2>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider font-light">
                100年以上変わらない紙名刺の制約から解放され、デジタルならではの機動力と表現力を手に入れましょう。
              </p>
            </div>
            
            <div className="lg:col-span-8 space-y-6">
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
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">同業他社にはない、唯一無二の価値</h2>
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

      {/* ==================== SECTION 4: LIFETIME VALUE ==================== */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5 text-center space-y-8">
        <div className="space-y-3">
          <div className="p-2 border border-white/10 w-fit rounded-full bg-void mx-auto text-cyan-400">
            <ShieldCheck size={20} />
          </div>
          <span className="text-[8px] tracking-[0.3em] text-cyan-400 font-mono font-bold uppercase">LIFELONG PARTNERSHIP</span>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white">これから一生、使っていけるということ</h2>
        </div>

        <p className="text-[10px] md:text-xs text-white/60 leading-relaxed max-w-2xl mx-auto font-light tracking-widest">
          物理カードは、傷や摩耗に強い最高峰の耐久素材を使用。何万回ものタップに耐えうる頑丈な設計です。<br />
          そして、カードの裏側で稼働するデジタルシステムはクラウド上で動き続け、<br />
          今後も最新のスマートフォンOSへの対応や機能追加など、半永久的に無償で進化し続けます。<br />
          使い捨てる名刺から、一生共に歩む「デジタルな相棒」へ。
        </p>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <div className="h-[1px] w-12 bg-white/25 mx-auto" />
          <h2 className="text-2xl md:text-4xl font-extralight tracking-[0.2em] text-white leading-snug">
            境界を超え、<br />
            アイデンティティを同調する。
          </h2>
          <p className="text-[8px] tracking-[0.4em] text-white/40 uppercase font-mono">
            NO RUNNING COSTS / PERMANENT IDENTITY
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link 
              href="/purchase" 
              className="w-full sm:w-auto px-12 py-5 bg-white text-void text-[10px] font-bold tracking-[0.2em] rounded-full hover:bg-zinc-200 hover:scale-105 transition-all"
            >
              Order Hexa Card / 購入する
            </Link>
            <Link 
              href="/guide" 
              className="w-full sm:w-auto px-10 py-5 border border-white/10 text-[10px] text-white/70 font-bold tracking-[0.15em] rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              System Guide / 使い方を見る <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
