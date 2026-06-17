"use client";

import { motion } from "framer-motion";
import { Book, Sparkles, Zap, Smartphone, Camera, Grid, Palette, Music, Cpu, ArrowLeft, Info, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MemberGuidePage() {
  const router = useRouter();

  const sections = [
    {
      title: "Daily Resonance / デイリーボーナス",
      icon: <Sparkles className="text-azure-400" />,
      content: "アトリエ（Hub）にログインすると、毎日 50 RT（Resonance Token）を受け取ることができます。リセットは毎日深夜 0:00 です。境界との同期を絶やさないようにしましょう。"
    },
    {
      title: "Asset Customization / カードの装飾",
      icon: <Palette className="text-bronze-400" />,
      content: "貯まった RT を使用して、ショップ（Inventory）から新しいフレーム、背景、オーラなどをアンロックできます。組み合わせは1万通り以上。あなただけのアイデンティティを構築してください。"
    },
    {
      title: "OCR Scan / 名刺スキャン",
      icon: <Camera className="text-emerald-400" />,
      content: "相手から貰った紙の名刺は、スマホのカメラでスキャンしましょう。AIが自動的に文字を解析し、あなたのデジタル名刺帳（Contacts）に保存します。同期が完了すると、AIによるシナジー解析も行われます。"
    },
    {
      title: "NFC Exchange / デジタル交換",
      icon: <Smartphone className="text-purple-400" />,
      content: "相手のスマホにあなたの Hexa Card をかざすだけで、インストール不要でプロフィールが表示されます。そのまま連絡先を保存してもらうことが可能です。常に最新の情報が相手の名刺帳に同期されます。"
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
        <p className="text-xs tracking-widest opacity-40 uppercase">How to utilize the Hexa Relation System</p>
      </header>

      <div className="space-y-12">
        {sections.map((s, i) => (
          <motion.section 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group"
          >
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-white/5 border border-white/10">
                  {s.icon}
               </div>
               <h2 className="text-sm tracking-[0.3em] font-bold uppercase">{s.title}</h2>
            </div>
            <p className="text-xs leading-loose tracking-widest opacity-60 text-white/80">
               {s.content}
            </p>
          </motion.section>
        ))}

        {/* Support Section */}
        <section className="pt-12 border-t border-white/5">
           <div className="flex items-start gap-6 p-8 bg-azure-500/5 border border-azure-500/10">
              <HelpCircle size={24} className="text-azure-400 shrink-0" />
              <div className="space-y-2">
                 <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-azure-400">Need more assistance?</h3>
                 <p className="text-[11px] leading-relaxed opacity-60 italic">
                   「もしシステムに不具合や表示の乱れ（UI Glitch）を感じた場合は、設定画面（Settings）の『環境報告』からフィードバックをお送りください。境界の守護者が迅速に対応いたします。」
                 </p>
              </div>
           </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-24 text-center opacity-20">
         <p className="text-[7px] tracking-[0.5em] uppercase font-mono italic">Protocol: Knowledge Base Alpha / 2026</p>
      </footer>
    </div>
  );
}
