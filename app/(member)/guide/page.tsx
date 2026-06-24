"use client";

import { motion } from "framer-motion";
import { Book, Sparkles, Palette, Camera, Smartphone, ArrowLeft, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { NfcDiagram } from "@/components/guide/NfcDiagram";
import { ResonanceDiagram } from "@/components/guide/ResonanceDiagram";
import { OcrDiagram } from "@/components/guide/OcrDiagram";
import { CustomizationDiagram } from "@/components/guide/CustomizationDiagram";

export default function MemberGuidePage() {
  const router = useRouter();

  const sections = [
    {
      title: "Daily Resonance / ログインボーナス",
      icon: <Sparkles className="text-azure-400" />,
      diagram: <ResonanceDiagram />,
      content: "1日に1回、アプリを開くだけでポイント(RT)がもらえます。夜の12時にリセットされるので、毎日忘れずにチェックしてポイントを貯めましょう。"
    },
    {
      title: "Asset Customization / カードのデザイン",
      icon: <Palette className="text-bronze-400" />,
      diagram: <CustomizationDiagram />,
      content: "貯まったポイントを使って、自分のカードを好きなデザインに着せ替えましょう。背景や枠を自由に選んで、あなただけの特別な1枚を作れます。"
    },
    {
      title: "OCR Scan / 紙の名刺を取り込む",
      icon: <Camera className="text-emerald-400" />,
      diagram: <OcrDiagram />,
      content: "もらった紙の名刺は、カメラでパシャッと撮るだけ。AIが名前や電話番号を自動で読み取って、あなたのスマホの名刺帳に保存してくれます。"
    },
    {
      title: "NFC Exchange / デジタル名刺を渡す",
      icon: <Smartphone className="text-purple-400" />,
      image: "/nfc_greeting_guide.jpg",
      diagram: <NfcDiagram />,
      content: (
        <div className="space-y-4 text-[10px] leading-relaxed tracking-wider">
          <p className="opacity-75">
            HXCカードは、スマートフォンのNFCリーダーにかざすだけでデジタルプロフィールを瞬時に共有します。相手がアプリを導入していなくても受け取ることができます。
          </p>
          
          <div className="border-l-2 border-azure-500/30 pl-3 space-y-1 bg-white/[0.01] p-3 border-r border-t border-b border-transparent hover:border-white/5 transition-all">
            <span className="text-[8px] tracking-[0.2em] font-bold text-azure-400 block uppercase">Protocol: Greeting & Gesture / 挨拶と作法</span>
            <p className="text-[9px] opacity-75 leading-relaxed">
              紙の名刺交換とは異なる新しいスマートな所作です。会話の中で相手へ敬意と配慮を込めながら、
              <span className="text-white font-bold font-sans">「デジタル名刺なのですが、スマートフォンにかざしてもよろしいでしょうか？」</span>
              と一言添えてタッチを提示すると、相手も安心して驚きと共鳴を受け取ることができます。
            </p>
          </div>

          <div className="border-l-2 border-azure-500/30 pl-3 space-y-1 bg-white/[0.01] p-3 border-r border-t border-b border-transparent hover:border-white/5 transition-all">
            <span className="text-[8px] tracking-[0.2em] font-bold text-azure-400 block uppercase">Observation: NFC Alignment / 読み取り位置</span>
            <p className="text-[9px] opacity-75 leading-relaxed">
              スマートフォンは機種によってNFCリーダーの位置が異なります。相手の端末に合わせてスマートに案内しましょう。
            </p>
            <div className="grid grid-cols-2 gap-4 text-[8px] mt-2 pt-2 border-t border-white/5">
              <div>
                <span className="text-white font-bold block mb-1">■ iPhone (iOS)</span>
                <span className="opacity-65">端末の<span className="text-azure-300 font-bold">最上部（インカメラ付近の背面または前面）</span>にカードの上部を近づけると即座に反応します。</span>
              </div>
              <div>
                <span className="text-white font-bold block mb-1">■ Android</span>
                <span className="opacity-65">多くの機種は<span className="text-azure-300 font-bold">背面中央（おサイフケータイマーク付近）</span>にアンテナがあります。真ん中に当てるよう促してください。</span>
              </div>
            </div>
          </div>

          <div className="border-l-2 border-azure-500/30 pl-3 space-y-2 bg-white/[0.01] p-3 border-r border-t border-b border-transparent hover:border-white/5 transition-all">
            <span className="text-[8px] tracking-[0.2em] font-bold text-azure-400 block uppercase">Features: Shared Identity / プロフィールの活用機能</span>
            <ul className="space-y-1.5 text-[9px] opacity-75 list-disc pl-4">
              <li>
                <strong className="text-white font-bold">vCard 直接保存:</strong> 
                プロフィールの右上にある「連絡先保存」ボタンを相手にタップしてもらうことで、相手のスマホの電話帳にあなたの情報（名前・電話番号・メールアドレス）を直接ワンタップで保存できます。
              </li>
              <li>
                <strong className="text-white font-bold">カードの「裏面」切り替え:</strong> 
                画面上のデジタル名刺をタップすると、カードがフリップして「裏面」が表示されます。SNSリンクや自己紹介文が美しく格納されています。
              </li>
              <li>
                <strong className="text-white font-bold">メールフォーム機能:</strong> 
                プロフィールの最下部にはメールフォームが備わっており、相手がそこからメッセージを送信すると、あなたへダイレクトに連絡が入るよう設計されています。
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-24 text-moonlight">
      <header className="mb-16">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8"
        >
          <ArrowLeft size={12} /> Back to Hub
        </button>
        <h1 className="text-3xl tracking-[0.4em] mb-2 font-extralight uppercase flex items-center gap-4">
          <Book className="text-azure-400" size={28} /> System Guide
        </h1>
        <p className="text-xs tracking-widest opacity-40 uppercase">How to utilize the Hexa Relation System / システム利用ガイド</p>
      </header>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((s, i) => (
          <motion.section 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group overflow-hidden"
          >
            {/* Visual Diagram or Image */}
            <div className="w-full animate-fade-in">
               {s.image ? (
                 <div className="w-full h-44 overflow-hidden relative bg-void border-b border-white/5 flex items-center justify-center">
                   <img 
                     src={s.image} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                     alt={s.title} 
                   />
                 </div>
               ) : (
                 s.diagram
               )}
            </div>
 
            <div className="p-8 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 border border-white/10">
                     {s.icon}
                  </div>
                  <h2 className="text-[10px] tracking-[0.3em] font-bold uppercase">{s.title}</h2>
               </div>
               <div className="text-[11px] leading-relaxed tracking-widest opacity-60 text-white/80">
                  {s.content}
               </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Support Section */}
      <section className="mt-16 pt-12 border-t border-white/5">
         <div className="flex items-start gap-6 p-8 bg-azure-500/5 border border-azure-500/10">
            <HelpCircle size={24} className="text-azure-400 shrink-0" />
            <div className="space-y-2">
               <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-azure-400">Need more assistance? / サポートが必要な場合</h3>
               <p className="text-[11px] leading-relaxed opacity-60 italic">
                 「もしシステムに不具合や表示の乱れ（UI Glitch）を感じた場合は、設定画面（Settings）の『環境報告』からフィードバックをお送りください。境界の守護者が迅速に対応いたします。」
               </p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center opacity-20">
         <p className="text-[7px] tracking-[0.5em] uppercase font-mono italic">Protocol: Knowledge Base Alpha / 2026 / Visualized for Clarity</p>
      </footer>
    </div>
  );
}
