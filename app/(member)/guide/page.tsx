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
      content: "あなたのカードを相手のスマホにポンと当てるだけで、あなたの情報が相手の画面にパッと表示されます。相手がアプリを入れていなくても大丈夫です。"
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
               <p className="text-[11px] leading-relaxed tracking-widest opacity-60 text-white/80">
                  {s.content}
               </p>
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
