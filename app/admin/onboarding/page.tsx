"use client";

import { motion } from "framer-motion";
import { Layers, ShieldCheck, Mail, Smartphone, Fingerprint, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Finalized Protocol
export default function OnboardingGuidePage() {
  const protocols = [
    {
      step: "01",
      title: "物理デバイスの特定 (UID Extraction)",
      desc: "手元の新しい物理カードをNFCアプリ（NFC Tools等）でスキャンし、UID（例: 04:2F:3B...）を確認します。",
      icon: <Fingerprint size={20} />,
      link: "/admin/ledger",
      linkText: "台帳を開く"
    },
    {
      step: "02",
      title: "中央台帳への登録 (Ledger Inscription)",
      desc: "カード中央台帳（Ledger）にて「Add New Card」を行い、抽出したUIDと管理用のシリアル番号（例: HXC-101）を登録します。状態は「未発行 (unissued)」になります。",
      icon: <Layers size={20} />,
    },
    {
      step: "03",
      title: "デバイスの浄化 (Card Clearing)",
      desc: "カードの中身が空であることを確認します。URLなどが書き込まれている場合は削除し、真っ新な状態にします。これにより登録時の干渉を防ぎます。",
      icon: <Lock size={20} />,
    },
    {
      step: "04",
      title: "ユニットの発送 (Logistics)",
      desc: "物理カードを客（ユーザー）へ発送します。カードにはまだ何の個人情報も含まれていません。",
      icon: <Mail size={20} />,
    },
    {
      step: "05",
      title: "ユーザーによる同調 (Activation)",
      desc: "ユーザーがカードを受け取り、サイトの /activate からスキャンします。台帳のUIDと照合され、ユーザー自身の情報（氏名、メアド等）を入力します。",
      icon: <Smartphone size={20} />,
    },
    {
      step: "06",
      title: "最終刻印とロック (The Eternal Inscription)",
      desc: "登録の最後に、システムが自動生成した名刺URLを物理チップに書き込み、同時に「読み取り専用」ロックをかけます。これで唯一無二の名刺が完成します。",
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-white/5 pb-8">
        <Link href="/admin" className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-8 block">← Back to Oversight</Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 text-white">Onboarding Protocol</h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">新規ユーザー・物理カード発行手順</p>
      </header>

      <div className="space-y-12">
        {protocols.map((p, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="flex gap-8 relative group"
          >
            {/* Step Number */}
            <div className="flex flex-col items-center">
               <div className="w-10 h-10 border border-white/10 bg-white/[0.02] flex items-center justify-center text-[10px] font-mono text-azure-400 font-bold mb-4">
                  {p.step}
               </div>
               {i < protocols.length - 1 && <div className="w-px h-full bg-white/5" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-12">
               <div className="flex items-center gap-4 mb-3 text-azure-400 opacity-60 group-hover:opacity-100 transition-opacity">
                  {p.icon}
                  <h3 className="text-[13px] tracking-[0.3em] uppercase font-bold text-white">{p.title}</h3>
               </div>
               <p className="text-[11px] tracking-widest leading-loose opacity-40 uppercase max-w-2xl mb-6">
                  {p.desc}
               </p>
               {p.link && (
                 <Link href={p.link} className="inline-flex items-center gap-2 px-4 py-2 border border-azure-500/20 bg-azure-500/5 text-azure-400 text-[9px] uppercase tracking-widest hover:bg-azure-500/10 transition-all">
                    {p.linkText}
                 </Link>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-20 p-8 border border-white/5 bg-white/[0.01] text-center">
         <div className="flex justify-center gap-2 mb-4 text-emerald-500">
            <CheckCircle2 size={16} />
            <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Standard Protocol Validated</span>
         </div>
         <p className="text-[9px] tracking-[0.2em] opacity-20 uppercase leading-relaxed">
            上記の手順により、偽造不可能なアイデンティティと物理の鍵を安全に紐付けることができます。<br/>
            不明点は Fixer (福井 豪) まで問い合わせてください。
         </p>
      </footer>
    </div>
  );
}
