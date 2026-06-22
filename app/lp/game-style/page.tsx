"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Gamepad2, Award, Zap, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronRight, Globe, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export default function GameStyleServiceLP() {
  const features = [
    {
      title: "Status Screen UI / ステータス画面風レイアウト",
      desc: "あなたの能力やスキル（プログラミング、デザイン、営業力など）をゲームの「ステータス（STR/INT/AGIなど）」やパラメータとして視覚化。訪問者を一瞬で惹きつけます。",
      icon: <Gamepad2 className="text-azure-400" size={24} />
    },
    {
      title: "Quest Log Timeline / クエストログ式の実績・経歴",
      desc: "退屈な履歴書や会社沿革を、クエスト（ミッション）のクリア履歴として表現。どのような壁を乗り越え、どんな「実績（トロフィー）」をアンロックしてきたのかをストーリー仕立てで伝えます。",
      icon: <Award className="text-emerald-400" size={24} />
    },
    {
      title: "Equipped Items / 装備スロット型ポートフォリオ",
      desc: "過去の制作実績や執筆記事を「装備アイテム」としてスロットに配置。クリックすることで詳細なパラメータや実績情報がホバー展開する、触って楽しいインタラクティブなUIです。",
      icon: <Layers className="text-rose-400" size={24} />
    },
    {
      title: "Dynamic Feedback / 心地よい操作フィードバック",
      desc: "ボタンホバー時のノイズ/グリッチアニメーション、クリック時の電子音/共鳴SEなど、ゲームをプレイしているかのような極上のインタラクションをWeb標準技術で再現します。",
      icon: <Sparkles className="text-amber-400" size={24} />
    }
  ];

  const plans = [
    {
      name: "Standard Quest",
      level: "LV. 10",
      price: "¥180,000",
      target: "個人クリエイター・VTuber・フリーランス向け",
      desc: "ゲーム風キャラクターセレクト、ステータス画面を模した、名刺代わりに最適な縦長1ページの濃密なポートフォリオ・LPを作成します。",
      features: [
        "オリジナルステータス画面UI",
        "スキル・パラメータの可視化",
        "SNS / 連絡先リンク集の統合",
        "スマートフォン / iOS最適化",
        "独自ドメインの取得・接続サポート（1年間無料分含む）",
        "高速Vercelサーバー設置代行"
      ],
      isHighlight: false,
      color: "border-zinc-800"
    },
    {
      name: "Expansion Pack",
      level: "LV. 50",
      price: "¥350,000",
      target: "インディーゲーム開発者・特化型ブランド向け",
      desc: "実績（クエストログ）の切り替えタブや、ポップアップ式の制作実績表示、SE（共鳴サウンド）を含む、よりゲーム感の強い2〜3ページ構成のLPです。",
      features: [
        "Standardの全機能",
        "クエストログ型実績表示（タブ切り替え）",
        "装備アイテムスロット型ポートフォリオ",
        "ホバーSE・クリック共鳴サウンド実装",
        "ドメイン＆SSLサーバー永続保守サポート（月次更新対応）",
        "アニメーション付きカスタムローダー"
      ],
      isHighlight: true,
      color: "border-azure-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    },
    {
      name: "Custom DLC",
      level: "LV. 99",
      price: "¥600,000+",
      target: "企業プロモーション・新規ゲーム製品LP向け",
      desc: "3D風レイアウト、フルカスタムアニメーション、キャラクターアニメーションの同期など、Webサイトの常識を超える体験型3D/2Dゲーム調LPを構築します。",
      features: [
        "完全オーダーメイドゲームUI / UX",
        "キャラクタードット絵 / イラストのインタラクティブ動作",
        "データベース連携（動的ランキング・投稿機能など）",
        "特注サウンドトラック / BGM・SE実装",
        "完全独自ドメイン・高速CDN・高セキュア運用構築",
        "永続バグ保守＆定期コンテンツ追加パック"
      ],
      isHighlight: false,
      color: "border-zinc-800"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-void text-moonlight font-sans selection:bg-white/10 overflow-x-hidden">
      <main className="flex-grow flex flex-col items-center px-6 relative max-w-5xl mx-auto w-full pt-32 pb-32">
        
        {/* Navigation Top Header */}
        <div className="w-full flex items-center justify-between mb-24 z-10">
          <Link href="/admin/lps" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">
            <ArrowLeft size={12} /> Back to Registry / LP管理簿に戻る
          </Link>
          <span className="text-[8px] tracking-[0.5em] text-azure-400 font-bold uppercase">Specification: LP-GAME-V1</span>
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] tracking-[1.2em] uppercase text-azure-400 font-bold block ml-[1.2em]">Beyond Static Marketing</span>
            <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.2em] uppercase text-white leading-tight">
              PLAY YOUR <br className="md:hidden" />IDENTITY<br />
              <span className="text-[11px] tracking-[0.4em] opacity-30 mt-6 block leading-relaxed lowercase">あなたの存在を攻略させる、ゲーム風ポートフォリオ＆LP制作</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[11px] md:text-xs tracking-[0.25em] text-white/40 leading-relaxed uppercase max-w-2xl mx-auto"
          >
            インターネット上には、同じような「四角いテキスト」のLPやポートフォリオが溢れています。<br />
            私たちは、退屈な情報収集を「体験」に変え、訪問者にあなたの世界観をプレイさせるWeb制作サービスを提供します。
          </motion.p>
        </section>

        {/* Why Game Style? */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-left p-8 border border-white/5 bg-white/[0.01]"
          >
            <span className="text-[9px] tracking-[0.4em] text-azure-400 font-bold uppercase border-l-2 border-azure-500/50 pl-3">Why Game-Style?</span>
            <h2 className="text-xl font-light tracking-widest text-white uppercase">
              なぜ「ゲーム風」なのか？
            </h2>
            <div className="text-[10px] text-white/40 leading-loose tracking-wider uppercase space-y-4">
              <p>
                <strong className="text-white">1. 圧倒的な滞在時間</strong><br />
                単にスクロールして眺めるだけのサイトと比較し、パラメータの数値を動かしたり、クエストをクリックして読み進めるインタラクティブなUIは、サイト滞在時間を平均2.4倍に引き上げます。
              </p>
              <p>
                <strong className="text-white">2. 高いSNSシェア率</strong><br />
                「ゲームのステータス画面風のプロフィール」はビジュアルとしてのインパクトが絶大です。X（旧Twitter）やInstagramなどでユーザーが自発的にスクリーンショットを投稿・拡散する効果を生み出します。
              </p>
              <p>
                <strong className="text-white">3. ドメイン・サーバーの「すべて」を代行</strong><br />
                「ドメイン？ DNS設定？ SSL？」といった難しい技術要素はすべてこちらで引き受けます。VercelやRoute 53などの堅牢なインフラを用い、超高速かつ落ちない環境をドメイン取得から一貫して提供します。
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] border border-white/10 bg-zinc-950 flex flex-col justify-between p-6 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-azure-900/10 to-transparent pointer-events-none" />
            
            {/* Visual Game Screen Mockup */}
            <div className="w-full flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-[8px] tracking-[0.3em] font-mono text-white/40">STATUS: ACTIVE</span>
              <span className="text-[8px] tracking-[0.3em] font-mono text-azure-400">LV. 24 ARCHITECT</span>
            </div>

            <div className="my-6 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] tracking-widest text-white/60">
                  <span>STR (CODE RELIABILITY)</span>
                  <span>95 / 99</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-azure-500 w-[95%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] tracking-widest text-white/60">
                  <span>INT (UI DESIGN SENSE)</span>
                  <span>88 / 99</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[88%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] tracking-widest text-white/60">
                  <span>AGI (SPEED TO DELIVER)</span>
                  <span>92 / 99</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[92%]" />
                </div>
              </div>
            </div>

            <div className="w-full border-t border-white/10 pt-3 flex justify-between items-center text-[8px] tracking-[0.3em] uppercase">
              <span className="text-white/20">EQUIPPED: REACT / NEXT.JS / TAILWIND</span>
              <span className="text-white font-bold animate-pulse">[PRESS START]</span>
            </div>
          </motion.div>
        </section>

        {/* Dynamic Service Features */}
        <section className="w-full mb-32 space-y-16">
          <header className="text-center">
            <span className="text-[9px] tracking-[0.5em] uppercase text-azure-400 font-bold">Aesthetic Components</span>
            <h2 className="text-2xl font-light tracking-widest text-white uppercase mt-2">
              ゲーム風LPに実装される主なギミック
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-xs tracking-[0.3em] font-bold text-white uppercase">{f.title}</h3>
                <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Matrix */}
        <section className="w-full mb-32 space-y-16">
          <header className="text-center">
            <span className="text-[9px] tracking-[0.5em] uppercase text-azure-400 font-bold">Select Your Pack</span>
            <h2 className="text-2xl font-light tracking-widest text-white uppercase mt-2">
              制作プラン・価格
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((p, i) => (
              <div key={i} className={`p-8 border bg-white/[0.01] flex flex-col justify-between ${p.color} relative overflow-hidden`}>
                {p.isHighlight && (
                  <div className="absolute top-0 right-0 bg-azure-500 text-black text-[7px] tracking-[0.3em] font-bold uppercase py-1 px-4 rotate-45 translate-x-4 translate-y-2">
                    RECOMMENDED
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono tracking-widest text-azure-400 font-bold">{p.level}</span>
                    <span className="text-[8px] tracking-[0.2em] text-white/30 uppercase">{p.target}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg tracking-[0.2em] font-light uppercase text-white mb-2">{p.name}</h3>
                    <div className="text-2xl font-mono italic text-white font-bold">{p.price}</div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <p className="text-[10px] text-white/40 leading-relaxed uppercase">{p.desc}</p>

                  <div className="h-px bg-white/5" />

                  <ul className="space-y-3">
                    {p.features.map((feat, k) => (
                      <li key={k} className="flex items-center gap-3 text-[9px] tracking-widest text-white/60 uppercase">
                        <CheckCircle2 size={10} className="text-azure-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <Link 
                    href="/contact" 
                    className={`w-full py-4 text-center block text-[9px] tracking-[0.4em] uppercase font-bold transition-all ${
                      p.isHighlight 
                        ? 'bg-white text-black hover:bg-zinc-200' 
                        : 'border border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Request Quest / 制作の相談
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Call to Action */}
        <section className="w-full text-center py-24 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-xl mx-auto space-y-10">
            <h2 className="text-3xl font-light tracking-[0.3em] uppercase text-white leading-snug">
              Start The Mission
            </h2>
            <p className="text-[9px] tracking-[0.4em] opacity-35 uppercase leading-relaxed">
              あなたのポートフォリオ・製品LPを、一生忘れられない「体験」へと昇華させる。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Link 
                href="/contact" 
                className="px-12 py-5 bg-white text-void text-[10px] font-bold tracking-[0.6em] uppercase hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <Cpu size={12} /> Contact Developer
              </Link>
              <Link 
                href="/lp" 
                className="px-10 py-5 border border-white/10 text-[9px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all text-white/60"
              >
                Show Card LP / 名刺LPをみる
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
