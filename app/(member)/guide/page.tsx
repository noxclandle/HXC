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
      diagram: <NfcDiagram />,
      content: (
        <div className="space-y-6 text-[10px] leading-relaxed tracking-wider">
          <p className="opacity-75">
            HXCカードは、スマートフォンのNFCリーダーにかざすだけでデジタルプロフィールを瞬時に共有します。相手がアプリを導入していなくても受け取ることができます。
          </p>
          
          {/* Section 1: Greeting & Gesture */}
          <div className="border-l-2 border-azure-500/30 pl-4 space-y-3 bg-white/[0.01] p-4 border-r border-t border-b border-transparent hover:border-white/5 transition-all">
            <span className="text-[8px] tracking-[0.2em] font-bold text-azure-400 block uppercase">Protocol: Greeting & Gesture / 挨拶と作法</span>
            
            {/* Inline Vector: People Greeting */}
            <div className="w-full h-16 flex items-center justify-center bg-void border border-white/5 rounded-sm relative overflow-hidden my-2">
              <svg className="w-40 h-12 text-azure-400/30" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Person (Sender) */}
                <circle cx="20" cy="12" r="3" stroke="currentColor" strokeWidth="0.8" className="text-azure-400/50" />
                <path d="M12 35 C12 25, 28 25, 28 35" stroke="currentColor" strokeWidth="0.8" className="text-azure-400/30" />
                <path d="M22 18 L32 20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" className="text-azure-400/80" />
                
                {/* Exchanging Card (Glow) */}
                <rect x="36" y="17" width="10" height="6" rx="1" transform="rotate(10 36 17)" fill="rgba(96,165,250,0.1)" stroke="#60a5fa" strokeWidth="0.6" />
                <circle cx="41" cy="20" r="3" fill="#60a5fa" className="animate-ping opacity-40" />

                {/* Right Person (Recipient) */}
                <circle cx="100" cy="12" r="3" stroke="currentColor" strokeWidth="0.8" className="text-azure-400/50" />
                <path d="M92 35 C92 25, 108 25, 108 35" stroke="currentColor" strokeWidth="0.8" className="text-azure-400/30" />
                <path d="M98 18 L88 19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" className="text-azure-400/80" />
                {/* Phone */}
                <rect x="84" y="15" width="4" height="8" rx="0.5" fill="currentColor" className="text-white/20" stroke="currentColor" strokeWidth="0.6" />
              </svg>
              {/* Subtle grid accent */}
              <div className="absolute inset-0 opacity-[0.02] bg-grid" />
            </div>

            <p className="text-[9px] opacity-75 leading-relaxed">
              紙の名刺交換とは異なる新しいスマートな所作です。会話の中で相手へ敬意と配慮を込めながら、
              <span className="text-white font-bold font-sans">「デジタル名刺なのですが、スマートフォンにかざしてもよろしいでしょうか？」</span>
              と一言添えてタッチを提示すると、相手も安心して共鳴を受け取ることができます。
            </p>
          </div>

          {/* Section 2: NFC Alignment */}
          <div className="border-l-2 border-azure-500/30 pl-4 space-y-3 bg-white/[0.01] p-4 border-r border-t border-b border-transparent hover:border-white/5 transition-all">
            <span className="text-[8px] tracking-[0.2em] font-bold text-azure-400 block uppercase">Observation: NFC Alignment / 読み取り位置</span>
            
            {/* Inline Vector: Device Target Zones */}
            <div className="grid grid-cols-2 gap-4 my-2">
              {/* iPhone Spot */}
              <div className="flex flex-col items-center p-3 bg-void border border-white/5 rounded-sm">
                <svg className="w-10 h-14 text-azure-400/40" viewBox="0 0 30 50" fill="none">
                  <rect x="5" y="5" width="20" height="40" rx="3" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="12" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="15" cy="8" r="4" fill="rgba(96,165,250,0.1)" stroke="#60a5fa" strokeWidth="0.6" className="animate-pulse" />
                </svg>
                <span className="text-[7px] text-white font-bold mt-2">iPhone: 最上部にタッチ</span>
              </div>
              {/* Android Spot */}
              <div className="flex flex-col items-center p-3 bg-void border border-white/5 rounded-sm">
                <svg className="w-10 h-14 text-azure-400/40" viewBox="0 0 30 50" fill="none">
                  <rect x="5" y="5" width="20" height="40" rx="3" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="15" cy="25" r="4" fill="rgba(96,165,250,0.1)" stroke="#60a5fa" strokeWidth="0.6" className="animate-pulse" />
                </svg>
                <span className="text-[7px] text-white font-bold mt-2">Android: 背面中央にタッチ</span>
              </div>
            </div>

            <p className="text-[9px] opacity-75 leading-relaxed">
              スマートフォンは機種によってNFCリーダーの位置が異なります。相手の端末に合わせてスマートに案内しましょう。
            </p>
          </div>

          {/* Section 3: Shared Identity Features */}
          <div className="border-l-2 border-azure-500/30 pl-4 space-y-3 bg-white/[0.01] p-4 border-r border-t border-b border-transparent hover:border-white/5 transition-all">
            <span className="text-[8px] tracking-[0.2em] font-bold text-azure-400 block uppercase">Features: Shared Identity / プロフィールの活用機能</span>
            
            {/* Inline Vector: Feature Icons */}
            <div className="grid grid-cols-3 gap-2 my-2">
              <div className="flex flex-col items-center p-2 bg-void border border-white/5 rounded-sm text-center">
                <svg className="w-5 h-5 text-azure-400/80 mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                <span className="text-[7px] font-bold text-white leading-tight">vCard 直接保存</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-void border border-white/5 rounded-sm text-center">
                <svg className="w-5 h-5 text-azure-400/80 mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M3 10h18M8 15h2" />
                </svg>
                <span className="text-[7px] font-bold text-white leading-tight">カードの「裏面」</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-void border border-white/5 rounded-sm text-center">
                <svg className="w-5 h-5 text-azure-400/80 mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-[7px] font-bold text-white leading-tight">連絡フォーム</span>
              </div>
            </div>

            <ul className="space-y-2 text-[9px] opacity-75 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-azure-400">■</span>
                <span><strong className="text-white">vCard 直接保存:</strong> プロフィール右上にある「連絡先保存」を相手がタップすると、あなたの情報がスマホの連絡先に即座に保存されます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-azure-400">■</span>
                <span><strong className="text-white">カードの「裏面」切り替え:</strong> 画面上の名刺カードをタップするとフリップし、裏面のSNS情報や詳細な自己紹介が現れます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-azure-400">■</span>
                <span><strong className="text-white">メールフォーム機能:</strong> プロフィール最下部から、相手が直接あなたへコンタクトメッセージを送信できます。</span>
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
            {/* Visual Diagram */}
            <div className="w-full">
               {s.diagram}
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
