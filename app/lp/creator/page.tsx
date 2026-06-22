"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ArrowRight, ShieldCheck, Zap, Sparkles, Smartphone, Check, UserCheck, Heart, User, Layers, Share2, ChevronRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export default function CreatorLP() {
  const targetCards = [
    {
      role: "For VTuber / Streamer",
      title: "活動名を、あなたの顔に。",
      desc: "本名は完全秘匿。アバター名や活動用ハンドルネームだけで名刺を作成・印字できます。相手の電話帳には「あなたの活動名 ＋ アイコン画像」をそのまま保存可能。",
      badge: "プライバシー保護100%",
      color: "border-rose-500/20 text-rose-400 bg-rose-500/5"
    },
    {
      role: "For Freelancer",
      title: "進化し続けるポートフォリオ。",
      desc: "役職やサービス内容、連絡先、ポートフォリオへのリンクが変わっても刷り直す必要はありません。管理画面から書き換えた瞬間に、手元にある物理カードの中身もリアルタイム同期します。",
      badge: "維持コスト0円",
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
    },
    {
      role: "For Multi-Creator",
      title: "あらゆるリンクを1タップに集約。",
      desc: "X、Instagram、YouTube、ポートフォリオサイト、LINEなど、散らばりがちなすべてのリンクをカードをかざすだけで一括共有。相手に検索させる手間を与えません。",
      badge: "SNS一括同期",
      color: "border-azure-500/20 text-azure-400 bg-azure-500/5"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-void text-moonlight font-sans selection:bg-white/10 overflow-x-hidden">
      <main className="flex-grow flex flex-col items-center px-6 relative max-w-5xl mx-auto w-full pt-32 pb-32">
        
        {/* Navigation Top Header */}
        <div className="w-full flex items-center justify-between mb-24 z-10">
          <Link href="/" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">
            <ArrowLeft size={12} /> Return to Gateway / ゲートウェイへ戻る
          </Link>
          <span className="text-[8px] tracking-[0.5em] text-azure-400 font-bold uppercase">Specification: LP-CREATOR-V1</span>
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-azure-500/30 bg-azure-500/5 rounded-full">
              <Sparkles size={10} className="text-azure-400 animate-pulse" />
              <span className="text-[8px] tracking-[0.3em] uppercase text-azure-300 font-bold">Next-Gen Digital Smart Card</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight uppercase">
              TAP AND <br className="md:hidden" />
              <span className="bg-gradient-to-r from-azure-400 via-emerald-400 to-rose-400 bg-clip-text text-transparent">RESONATE.</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-[0.15em] text-white/90">
              本名でも、活動名でも。<br />
              スマホにかざすだけの「次世代スマート名刺」
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs tracking-[0.2em] text-white/40 leading-relaxed uppercase max-w-xl mx-auto"
          >
            フリーランス、クリエイター、配信者、VTuberのためのデジタルカード。<br />
            紙の枠を飛び越え、あなたという唯一無二の存在をダイナミックに同期する。
          </motion.p>
        </section>

        {/* Interactive Step-by-Step Scenario */}
        <section className="w-full mb-32 space-y-16">
          <header className="text-center">
            <span className="text-[9px] tracking-[0.5em] uppercase text-azure-400 font-bold">How to Use</span>
            <h2 className="text-2xl font-light tracking-widest text-white uppercase mt-2">
              名刺交換の瞬間を、もっとスマートに
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] flex flex-col justify-between h-72">
              <div className="space-y-4">
                <span className="text-2xl font-mono font-bold text-azure-500/50">01</span>
                <h3 className="text-sm tracking-[0.2em] font-bold text-white uppercase">相手のスマホに「かざす」</h3>
                <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                  物理カードを相手のスマートフォンの上部（NFC読み取り部分）にかざします。アプリの起動や事前ダウンロードは一切不要です。
                </p>
              </div>
              <div className="flex gap-2 text-azure-400 items-center justify-end">
                <Smartphone size={16} />
                <span className="text-[8px] font-mono tracking-widest">NFC TRANSMIT</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] flex flex-col justify-between h-72">
              <div className="space-y-4">
                <span className="text-2xl font-mono font-bold text-emerald-500/50">02</span>
                <h3 className="text-sm tracking-[0.2em] font-bold text-white uppercase">アバター画面が「起動」</h3>
                <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                  相手のブラウザが自動的に立ち上がり、あなたが解禁・装着したエフェクトや音、アニメーションとともにあなたのゲームステータス風のプロフィールが表示されます。
                </p>
              </div>
              <div className="flex gap-2 text-emerald-400 items-center justify-end">
                <Share2 size={16} />
                <span className="text-[8px] font-mono tracking-widest">HTML5 RESISTANCE</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] flex flex-col justify-between h-72">
              <div className="space-y-4">
                <span className="text-2xl font-mono font-bold text-rose-500/50">03</span>
                <h3 className="text-sm tracking-[0.2em] font-bold text-white uppercase">その場で「電話帳保存」</h3>
                <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                  相手は画面の「連絡先保存」ボタンを1タップするだけで、あなたの活動名、顔写真、SNSリンクが埋め込まれた連絡先データをスマホに直接追加できます。
                </p>
              </div>
              <div className="flex gap-2 text-rose-400 items-center justify-end">
                <UserCheck size={16} />
                <span className="text-[8px] font-mono tracking-widest">vCARD DOWNLOAD</span>
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Card Styles Indicator */}
        <section className="w-full mb-32 p-10 border border-white/10 bg-zinc-950/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1)_0%,transparent_60%)] pointer-events-none" />
          <div className="space-y-6 max-w-xl text-left relative z-10">
            <span className="text-[9px] tracking-[0.5em] uppercase text-emerald-400 font-bold pl-2 border-l-2 border-emerald-500">
              Asset Customization
            </span>
            <h2 className="text-2xl font-light tracking-widest text-white uppercase">
              36,000通り以上のデザイン。<br />
              あなただけの「装備」を纏う。
            </h2>
            <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
              カードのアートワークは飾りではありません。20種類以上のフレーム、15種類の背景、10種類のオーラ、そして12種類のエフェクトをアトリエで自由に「装備（着せ替え）」可能。<br />
              Relation Token（RT）を使用して新たなアセットを解放し、あなたのアイデンティティを無限に演出できます。
            </p>
          </div>

          <div className="shrink-0 p-8 border border-white/10 bg-black flex flex-col justify-center items-center text-center space-y-4 w-64 h-64 shadow-2xl">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center rotate-45 mb-4">
              <Layers size={18} className="text-white/60 rotate-[-45deg]" />
            </div>
            <div className="text-3xl font-mono font-bold text-white tracking-tighter">36,000+</div>
            <span className="text-[8px] tracking-[0.4em] uppercase text-white/30 block">Combinations</span>
          </div>
        </section>

        {/* Creator Target Types */}
        <section className="w-full mb-32 space-y-16">
          <header className="text-center">
            <span className="text-[9px] tracking-[0.5em] uppercase text-azure-400 font-bold">Target Audiences</span>
            <h2 className="text-2xl font-light tracking-widest text-white uppercase mt-2">
              あらゆる活動形態に対応
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {targetCards.map((card, i) => (
              <div key={i} className="p-8 border border-white/5 bg-white/[0.01] flex flex-col justify-between h-96 hover:border-white/20 transition-all">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">{card.role}</span>
                    <span className={`text-[8px] px-2 py-0.5 border font-mono tracking-widest uppercase ${card.color}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-md tracking-[0.2em] font-light text-white uppercase">{card.title}</h3>
                  <p className="text-[10px] text-white/40 leading-loose tracking-wider uppercase">
                    {card.desc}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10">
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Absolute Security (Privacy Protect) */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
          <div className="space-y-6 text-left p-8 border border-white/5 bg-white/[0.01]">
            <span className="text-[9px] tracking-[0.4em] text-rose-400 font-bold uppercase border-l-2 border-rose-500/50 pl-3">Operational Security</span>
            <h2 className="text-xl font-light tracking-widest text-white uppercase">
              本名と活動名の完全分離システム
            </h2>
            <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
              カードのご注文・配送の際に入力いただく「本名・ご住所」の情報は、暗号化されて配送処理の管理にのみ使用されます。<br /><br />
              物理名刺カードに刻印される名前や、かざした時に相手のスマホに表示されるプロフィール情報には、あなたの「活動名（ハンドルネーム）」や「アバター名」のみを表示させ、両者をデータベース上で完全に分離隔離しています。ストーカーやプライバシー情報の流出リスクをゼロに抑えます。
            </p>
          </div>

          <div className="relative aspect-video border border-white/10 bg-zinc-950 flex flex-col justify-center items-center p-8 text-center space-y-4">
            <div className="w-12 h-12 border border-rose-500/20 bg-rose-500/5 rounded-full flex items-center justify-center text-rose-400 mb-2">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[8px] tracking-[0.4em] text-rose-400/60 uppercase font-mono block">PRIVACY STATUS: SECURED</span>
            <p className="text-[10px] tracking-widest text-white uppercase font-bold">100% STEALTH IDENTIFICATION</p>
          </div>
        </section>

        {/* Global Call to Action */}
        <section className="w-full text-center py-24 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-xl mx-auto space-y-10">
            <h2 className="text-3xl font-light tracking-[0.3em] uppercase text-white leading-snug">
              Equip the <br className="md:hidden" />Next-Gen Card
            </h2>
            <p className="text-[9px] tracking-[0.4em] opacity-35 uppercase leading-relaxed">
              活動をもっと自由に、名刺交換を最高の演出へ。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Link 
                href="/purchase" 
                className="px-12 py-5 bg-white text-void text-[10px] font-bold tracking-[0.6em] uppercase hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <CreditCard size={12} /> Get Hexa Card
              </Link>
              <Link 
                href="/features" 
                className="px-10 py-5 border border-white/10 text-[9px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all text-white/60"
              >
                Show Options / 仕様をみる
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
