"use client";

import { Layers, Shield, Mail, Fingerprint, Lock, CheckCircle2, CreditCard, ExternalLink, Zap, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OnboardingGuidePage() {
  const protocols = [
    {
      step: "01",
      title: "注文の確認 (Order Check)",
      desc: "Registry画面の「Pending Shipments（発送待ち）」セクションを確認します。これから誰のカードを作成するかを確定させます。",
      icon: <Package size={20} />,
    },
    {
      step: "02",
      title: "物理チップの識別 (Registry)",
      desc: "【最重要】新品カードをスマホで読み取り、14桁のUID（Serial Number）を確認します。Registry画面の「Card UID」欄に入力し、[Register]を押して登録してください。",
      icon: <Fingerprint size={20} />,
      link: "/admin/registry",
      linkText: "台帳を開いて登録する"
    },
    {
      step: "03",
      title: "注文への紐付け (Assignment)",
      desc: "発送待ちの注文の横にある[Assign Card]ボタンを押し、今登録したばかりのUIDを選択します。これで「誰が使うカードか」が確定し、ステータスがSHIPPEDに変わります。",
      icon: <Layers size={20} />,
    },
    {
      step: "04",
      title: "個別URLの書き込み (Provisioning)",
      desc: "【要注意】台帳一覧から該当のUIDを探し、[Copy Provisioning URL]を押します。コピーされたURLをNFC Toolsアプリでカードに書き込みます。一律のURLではなく、必ずこのボタンで個別のURLを取得してください。",
      icon: <Zap size={20} />,
    },
    {
      step: "05",
      title: "封印とロック (Locking)",
      desc: "【必須】書き込み後、必ずNFC Toolsの[Other] → [Lock tag]を実行し、カードにかざしてください。これを忘れると第三者に中身を書き換えられるリスクが生じます。",
      icon: <Lock size={20} />,
    },
    {
      step: "06",
      title: "発送 (Delivery)",
      desc: "完成したカードを封筒に入れ、発送してください。ユーザーがタップすると、自動的に安全な登録フローが開始されます。",
      icon: <Mail size={20} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-white/5 pb-8">
        <Link href="/admin" className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-8 block">← Back to Oversight</Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 text-white">Shipment Protocol</h1>
        <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400 italic">物理資産の生成と安全な譲渡に関する公式手順書</p>
      </header>

      <section className="mb-16 p-8 border border-rose-500/20 bg-rose-500/5">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-rose-500 font-bold mb-4 flex items-center gap-3">
          <Shield size={16} /> 警告: セキュリティ原則
        </h2>
        <ul className="text-[10px] tracking-widest space-y-3 opacity-80 list-disc ml-4 leading-relaxed uppercase">
          <li>全てのカードは「個別」のURLを持ちます。共通のURLを使い回すことは厳禁です。</li>
          <li>ロック（Lock tag）されていないカードは「未完成品」です。絶対に発送しないでください。</li>
          <li>台帳（Registry）にUIDを入力する際は、スマホの画面と照らし合わせ、一文字のミスもないようにしてください。</li>
        </ul>
      </section>

      <div className="space-y-12">
        {protocols.map((p, i) => (
          <motion.div 
            key={i} 
            whileHover={{ x: 10 }}
            className="flex gap-8 relative group border border-white/5 bg-white/[0.01] p-8"
          >
            <div className="flex flex-col items-center">
               <div className="w-12 h-12 border border-white/10 bg-white/[0.02] flex items-center justify-center text-[12px] font-mono text-azure-400 font-bold">
                  {p.step}
               </div>
            </div>

            <div className="flex-1">
               <div className="flex items-center gap-4 mb-3 text-azure-400">
                  {p.icon}
                  <h3 className="text-[13px] tracking-[0.3em] uppercase font-bold text-white">{p.title}</h3>
               </div>
               <p className="text-[11px] tracking-widest leading-loose opacity-60 uppercase max-w-2xl mb-6">
                  {p.desc}
               </p>
               {p.link && (
                 <Link href={p.link} className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-azure-400 border-b border-azure-400/20 pb-1 hover:border-azure-400 transition-all">
                    {p.linkText} <ArrowRight size={12} />
                 </Link>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-20 p-12 border border-white/5 bg-white/[0.01] text-center">
         <div className="flex justify-center gap-2 mb-4 text-emerald-500">
            <CheckCircle2 size={16} />
            <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Security Handshake Enabled</span>
         </div>
         <p className="text-[9px] tracking-widest opacity-20 uppercase leading-relaxed">
            このガイドに従うことで、物理的な盗難やコピーに対して論理的な絶対防御が成立します。<br/>
            運用上のミスが発生した場合は、Registryから即座にカードを無効化してください。
         </p>
      </footer>
    </div>
  );
}
