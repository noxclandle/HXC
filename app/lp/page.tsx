"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ArrowRight, ShieldCheck, Zap, UserCheck, Smartphone, Check, X, Sparkles } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export default function DigitalCardLP() {
  const comparisonData = [
    {
      feature: "情報の更新性 / Updates",
      paper: "不可（役職変更やオフィスの移転で「ゴミ」となり、刷り直しが必要）",
      hexa: "無限・即時（アトリエ画面から一瞬で書き換え可能。物理カードは一生不変）",
      isHighlight: true
    },
    {
      feature: "顔写真・ポートフォリオ / Media",
      paper: "掲載不可、または極めて限定的（もらった相手が「誰だっけ？」と忘れる原因）",
      hexa: "顔写真付きvCardを直接電話帳に保存。ポートフォリオやPDF資料も即座に共有可能"
    },
    {
      feature: "完全圏外での名刺交換 / Offline Connection",
      paper: "物理的な受け渡しのみ（デジタルでの保存は後から手動入力する手間が発生）",
      hexa: "オフライン専用vCard-QRコードにより、飛行機や地下深く（電波0）でも瞬時に連絡先登録可能",
      isHighlight: true
    },
    {
      feature: "プライバシー保護 / Privacy",
      paper: "本名のみ（VTuberや匿名クリエイターが活動用に使用するのは不可能）",
      hexa: "「カード刻印名（活動名）」と「決済・配送先名（本名）」を完全分離。匿名性を100%保護"
    },
    {
      feature: "デバイス・アプリの要件 / Device & App Requirements",
      paper: "なし（ただし保存や整理にスキャナーや名刺管理アプリの導入が必要）",
      hexa: "相手の専用アプリインストール不要。iPhone/Androidの標準カメラとSafariで即時動作",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-void text-moonlight font-sans selection:bg-white/10">
      <main className="flex-grow flex flex-col items-center px-6 relative max-w-5xl mx-auto w-full pt-32 pb-32">
        
        {/* Navigation Top Header */}
        <div className="w-full flex items-center justify-between mb-24 z-10">
          <Link href="/" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">
            <ArrowLeft size={12} /> Return to Gateway / ゲートウェイへ戻る
          </Link>
          <span className="text-[8px] tracking-[0.5em] text-azure-400 font-bold uppercase">Specification: LP-V2</span>
        </div>

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] tracking-[1.2em] uppercase text-azure-400 font-bold block ml-[1.2em]">Beyond the Paper Dimension</span>
            <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.2em] uppercase text-white leading-tight">
              EVOLUTION OF <br className="md:hidden" />PRESENCE<br />
              <span className="text-[11px] tracking-[0.4em] opacity-30 mt-6 block leading-relaxed lowercase">紙を置き換え、存在を同期する「スマートアイデンティティ」</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[11px] md:text-xs tracking-[0.25em] text-white/40 leading-relaxed uppercase max-w-xl mx-auto"
          >
            なぜ、私たちは未だに「紙の束」を持ち歩き、古くなれば捨てる無駄を繰り返すのか？<br />
            Hexa Cardは、物理カードの永続性と、デジタルプロファイルの拡張性を融合させた究極のデバイスです。
          </motion.p>
        </section>

        {/* Dynamic vs Static Visual Showcase */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-left p-8 border border-white/5 bg-white/[0.01]"
          >
            <span className="text-[9px] tracking-[0.4em] text-emerald-400 font-bold uppercase border-l-2 border-emerald-500/50 pl-3">The Paradigm Shift</span>
            <h2 className="text-2xl font-light tracking-widest text-white uppercase">
              紙の名刺が「ゴミ」になる瞬間を防ぐ
            </h2>
            <p className="text-[11px] text-white/40 leading-relaxed tracking-wider">
              所属が変わるたび、役職が上がるたび、SNSのIDが変わるたびに名刺を刷り直す時代は終わりました。<br /><br />
              Hexa Cardなら、アトリエ（管理画面）でプロフィールを変更した瞬間に、お手元の物理カードが指し示すデータも自動的に最新版へとアップデートされます。<br />
              カードそのものが「使い捨て」になることは、もうありません。
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video border border-white/10 bg-zinc-950 flex items-center justify-center group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-azure-900/10 to-transparent" />
            <div className="relative z-10 text-center space-y-4 p-8">
              <div className="w-12 h-12 border border-white/20 mx-auto flex items-center justify-center rounded-full bg-white/[0.02]">
                <CreditCard size={18} className="text-white/60 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-[9px] tracking-[0.6em] text-white/20 uppercase font-mono block">DEVICE COMPONENT: NTAG213</span>
              <p className="text-[10px] tracking-widest text-azure-400 uppercase font-bold">1 Tap / Real-time Resonance</p>
            </div>
          </motion.div>
        </section>

        {/* Detailed Comparison Table */}
        <section className="w-full mb-32">
          <header className="mb-16 text-center">
            <h2 className="text-xs tracking-[0.6em] uppercase opacity-35 mb-4">The Comparison Table / 対比マトリクス</h2>
            <p className="text-xl font-extralight tracking-widest uppercase">Traditional vs. Hexa Card</p>
          </header>

          <div className="border border-white/10 overflow-hidden bg-white/[0.01]">
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10 bg-white/[0.02] text-[10px] tracking-[0.3em] uppercase font-bold py-6 text-center">
              <div className="py-2">比較項目 / Feature</div>
              <div className="py-2 border-t md:border-t-0 md:border-x border-white/5 opacity-50">従来のアナログ名刺</div>
              <div className="py-2 text-azure-400 border-t md:border-t-0 border-white/5">Hexa Card</div>
            </div>

            {comparisonData.map((row, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-1 md:grid-cols-3 border-b last:border-0 border-white/5 text-[11px] tracking-wider leading-relaxed py-8 px-6 md:px-0 text-left md:text-center ${
                  row.isHighlight ? 'bg-azure-950/5' : ''
                }`}
              >
                <div className="font-bold text-white md:py-2 text-left md:pl-8 text-[10px] tracking-[0.2em] uppercase flex items-center gap-3">
                  <div className={`w-1 h-1 rounded-full ${row.isHighlight ? 'bg-azure-400' : 'bg-white/20'}`} />
                  {row.feature}
                </div>
                <div className="text-white/40 md:py-2 border-y md:border-y-0 md:border-x border-white/5 px-4 text-left text-[10px] leading-loose uppercase mt-4 md:mt-0">
                  <div className="md:hidden text-[8px] text-white/20 tracking-widest mb-1">従来の名刺:</div>
                  <div className="flex items-start md:justify-center gap-2">
                    <X size={12} className="text-rose-500/50 mt-1 flex-shrink-0" />
                    <span>{row.paper}</span>
                  </div>
                </div>
                <div className={`md:py-2 px-4 text-left text-[10px] leading-loose uppercase mt-4 md:mt-0 ${row.isHighlight ? 'text-azure-300 font-bold' : 'text-white/80'}`}>
                  <div className="md:hidden text-[8px] text-azure-400/40 tracking-widest mb-1">Hexa Card:</div>
                  <div className="flex items-start md:justify-center gap-2">
                    <Check size={12} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>{row.hexa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Unique Selling Points (Specific to Hexa Card) */}
        <section className="w-full mb-32 space-y-16">
          <header className="text-left max-w-xl">
            <span className="text-[9px] tracking-[0.5em] uppercase text-azure-400 font-bold ml-1">Hexa Card Exclusives</span>
            <h2 className="text-3xl font-light tracking-widest text-white uppercase mt-2">
              当システムならではの「4つの特権」
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-azure-400">
                <ShieldCheck size={14} />
              </div>
              <h3 className="text-sm tracking-[0.3em] font-bold text-white uppercase">1. 活動名と本名の完全分離 (Privacy)</h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                VTuberや匿名で活動する開発者・クリエイターのために設計されています。決済・配送に必要な「本名」と、カードに印字される「活動名」を完全に分離管理。プライバシーの漏洩を防ぎます。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-emerald-400">
                <Sparkles size={14} />
              </div>
              <h3 className="text-sm tracking-[0.3em] font-bold text-white uppercase">2. 顔写真付きvCard同期 (Photo Import)</h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                「名刺をもらっても顔が思い出せない」を解消。相手がダウンロードする連絡先ファイル（vCard）に、あなたの顔写真を美しく埋め込んで保存させます。iOS/Androidの標準仕様に完全準拠。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-rose-400">
                <Zap size={14} />
              </div>
              <h3 className="text-sm tracking-[0.3em] font-bold text-white uppercase">3. 電波0でも動くオフライン共有</h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                ブラウザキャッシュ機能により、お互いが完全オフライン（地下鉄や飛行機）の状態であっても、ローカルから連絡先同期用QRコードを呼び出し、その場で相手の電話帳に登録させることができます。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white">
                <UserCheck size={14} />
              </div>
              <h3 className="text-sm tracking-[0.3em] font-bold text-white uppercase">4. 署名不要のミニマル印字デザイン</h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider uppercase">
                カード表面には名前を刻印せず、ブランドロゴとシステム固有の「シリアルナンバー」のみを刻印するオプションを選択可能。将来活動名や肩書を変更しても、物理カードを捨てることなく永続的に使い続けられます。
              </p>
            </div>

          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section className="w-full max-w-3xl mb-32 border-t border-white/5 pt-20">
          <header className="mb-16 text-center">
            <h2 className="text-xs tracking-[0.5em] uppercase opacity-35 mb-2">Frequently Asked Questions</h2>
            <p className="text-lg font-light tracking-widest uppercase">よくある質問</p>
          </header>

          <div className="space-y-8 text-left">
            <div className="space-y-2 border-b border-white/5 pb-6">
              <h3 className="text-xs tracking-[0.2em] font-bold text-white uppercase flex gap-3">
                <span className="text-azure-400 font-mono">Q.</span> 相手が専用アプリを入れていなくても使えますか？
              </h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider pl-6 uppercase">
                はい。相手のスマートフォンに標準搭載されている「カメラ（QR読み込み）」や「NFC（かざす）」機能だけでブラウザが自動起動し、連絡先保存画面に遷移します。相手側のアプリ取得や会員登録は一切不要です。
              </p>
            </div>

            <div className="space-y-2 border-b border-white/5 pb-6">
              <h3 className="text-xs tracking-[0.2em] font-bold text-white uppercase flex gap-3">
                <span className="text-azure-400 font-mono">Q.</span> 物理カードの「ロック」とは何ですか？安全ですか？
              </h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider pl-6 uppercase">
                当システムは、出荷時にすべてのカードのNFC書き込み権限を永久に「ロック（読み取り専用化）」して発送します。これにより、第三者がスマホを近づけてカード内のURLを書き換える等の不正行為（NFC乗っ取り）を防ぐため、セキュリティは万全です。
              </p>
            </div>

            <div className="space-y-2 pb-6">
              <h3 className="text-xs tracking-[0.2em] font-bold text-white uppercase flex gap-3">
                <span className="text-azure-400 font-mono">Q.</span> オンライン時とオフライン時で名刺交換データは異なりますか？
              </h3>
              <p className="text-[10px] text-white/40 leading-relaxed tracking-wider pl-6 uppercase">
                オンライン時は、あなたがアトリエでカスタマイズした「背景アニメーション・音楽・ポートフォリオ・アセット装飾」を含むフルスペック의 Web名刺が相手に表示されます。オフライン時は、OS標準の連絡先保存機能（文字＋写真のみ）が直接起動するシームレスな体験となります。
              </p>
            </div>
          </div>
        </section>

        {/* Global Call to Action */}
        <section className="w-full text-center py-24 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto space-y-10"
          >
            <h2 className="text-3xl font-light tracking-[0.3em] uppercase text-white leading-snug">
              Begin the <br className="md:hidden" />Resonance
            </h2>
            <p className="text-[9px] tracking-[0.4em] opacity-35 uppercase leading-relaxed">
              スマートな同期体験で、あなたの存在（アイデンティティ）を解き放つ。
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
                Showcase / 機能一覧 <ArrowRight size={10} className="inline ml-1" />
              </Link>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
