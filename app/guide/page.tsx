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
            <div className="w-full h-28 flex items-center justify-center bg-void border border-white/5 rounded-sm relative overflow-hidden my-2">
              <svg className="w-full h-24 text-azure-400/80" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="azureGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Left Figure (Sender) */}
                <g transform="translate(10, 0)">
                  {/* Body Contour */}
                  <path d="M 20,75 C 20,58 35,54 50,54 C 65,54 80,58 80,75" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  {/* Head */}
                  <circle cx="50" cy="30" r="9" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
                  <circle cx="50" cy="30" r="5" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 1.5" className="opacity-60" />
                  {/* Arm & Hand holding card */}
                  <path d="M 60,55 Q 82,50 88,44" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" className="opacity-85" />
                  {/* Card */}
                  <rect x="90" y="34" width="20" height="12" rx="1" fill="url(#azureGlow)" stroke="#60a5fa" strokeWidth="0.8" transform="rotate(-15, 90, 34)" />
                  <line x1="93" y1="39" x2="102" y2="36" stroke="white" strokeWidth="0.6" strokeOpacity="0.4" transform="rotate(-15, 90, 34)" />
                  <circle cx="106" cy="42" r="1" fill="#60a5fa" transform="rotate(-15, 90, 34)" />
                </g>

                {/* Connection Wave Paths */}
                <path d="M 125,40 C 145,35 175,35 195,40" stroke="url(#lineGlow)" strokeWidth="1.2" strokeDasharray="3 3" />
                
                {/* NFC Icon in center */}
                <g transform="translate(148, 12)">
                  <circle cx="12" cy="12" r="10" stroke="rgba(96,165,250,0.15)" strokeWidth="0.8" />
                  <path d="M 8,12 A 4,4 0 0,1 16,12" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" className="opacity-80" />
                  <path d="M 6,12 A 6,6 0 0,1 18,12" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" className="opacity-50" />
                  <path d="M 4,12 A 8,8 0 0,1 20,12" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" className="opacity-20" />
                  <text x="12" y="27" textAnchor="middle" fill="#60a5fa" fontSize="4" fontWeight="bold" letterSpacing="0.05em" className="font-mono opacity-60">NFC TOUCH</text>
                </g>

                {/* Right Figure (Recipient) */}
                <g transform="translate(210, 0)">
                  {/* Body Contour */}
                  <path d="M 20,75 C 20,58 35,54 50,54 C 65,54 80,58 80,75" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  {/* Head */}
                  <circle cx="50" cy="30" r="9" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx="50" cy="30" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 1.5" />
                  {/* Arm & Hand holding phone */}
                  <path d="M 40,55 Q 18,50 12,44" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Smartphone */}
                  <rect x="-6" y="32" width="12" height="20" rx="1.5" fill="#121212" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" transform="rotate(15, -6, 32)" />
                  <rect x="-4.5" y="33.5" width="9" height="17" rx="1" fill="rgba(96,165,250,0.05)" stroke="#60a5fa" strokeWidth="0.4" strokeOpacity="0.3" transform="rotate(15, -6, 32)" />
                </g>
              </svg>
              {/* Subtle grid accent */}
              <div className="absolute inset-0 opacity-[0.01] bg-grid" />
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
                <svg className="w-12 h-16 text-azure-400" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Phone Frame */}
                  <rect x="6" y="6" width="28" height="48" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  {/* Inner Screen */}
                  <rect x="7.5" y="7.5" width="25" height="45" rx="3" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
                  {/* Dynamic Island */}
                  <rect x="15" y="9" width="10" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
                  {/* NFC Antenna at the top */}
                  <path d="M 14,6 L 26,6" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Ripples from top */}
                  <circle cx="20" cy="6" r="4" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="1.5 1.5" className="animate-ping" />
                  <circle cx="20" cy="6" r="8" stroke="rgba(96,165,250,0.4)" strokeWidth="0.5" />
                  {/* Touch point */}
                  <circle cx="20" cy="6" r="2" fill="#60a5fa" />
                </svg>
                <span className="text-[7px] text-white font-bold mt-2">iPhone: 最上部にタッチ</span>
              </div>
              {/* Android Spot */}
              <div className="flex flex-col items-center p-3 bg-void border border-white/5 rounded-sm">
                <svg className="w-12 h-16 text-azure-400" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Phone Frame (Back side view) */}
                  <rect x="6" y="6" width="28" height="48" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  {/* Camera Module */}
                  <rect x="9" y="9" width="5" height="10" rx="1" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                  <circle cx="11.5" cy="11.5" r="1" fill="rgba(255,255,255,0.3)" />
                  <circle cx="11.5" cy="16.5" r="1" fill="rgba(255,255,255,0.3)" />
                  {/* NFC Core Area */}
                  <rect x="15" y="25" width="10" height="10" rx="1" stroke="rgba(96,165,250,0.25)" strokeWidth="0.6" strokeDasharray="1.5 1" />
                  {/* Ripples from center */}
                  <circle cx="20" cy="30" r="4" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="1.5 1.5" className="animate-ping" />
                  <circle cx="20" cy="30" r="8" stroke="rgba(96,165,250,0.4)" strokeWidth="0.5" />
                  {/* Touch point */}
                  <circle cx="20" cy="30" r="2" fill="#60a5fa" />
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
                <svg className="w-8 h-8 text-azure-400/80 mb-1.5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="7" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="18" y1="11" x2="25" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                  <line x1="18" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                  <line x1="18" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                  <circle cx="25" cy="23" r="4.5" fill="#020202" stroke="#60a5fa" strokeWidth="0.8" />
                  <path d="M25 21v4M23 23l2 2 2-2" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[7px] font-bold text-white leading-tight">vCard 直接保存</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-void border border-white/5 rounded-sm text-center">
                <svg className="w-8 h-8 text-azure-400/80 mb-1.5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="5" width="18" height="12" rx="1" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" fill="rgba(255,255,255,0.01)" transform="skewX(-8)" />
                  <rect x="4" y="15" width="18" height="12" rx="1" stroke="#60a5fa" strokeWidth="0.8" fill="rgba(96,165,250,0.05)" transform="skewX(-8)" />
                  <line x1="8" y1="21" x2="18" y2="21" stroke="#60a5fa" strokeWidth="0.6" transform="skewX(-8)" opacity="0.7" />
                  <path d="M 23,13 C 25.5,15.5 25.5,18.5 23,21" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.5 1" />
                  <path d="M 21.5,20 L 23,21.5 L 24.5,20" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" />
                </svg>
                <span className="text-[7px] font-bold text-white leading-tight">カードの「裏面」</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-void border border-white/5 rounded-sm text-center">
                <svg className="w-8 h-8 text-azure-400/80 mb-1.5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M4 10 L16 17 L28 10" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="16" y1="17" x2="16" y2="23" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="1.5 1.5" className="animate-pulse" />
                  <circle cx="16" cy="24.5" r="1" fill="#60a5fa" />
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
