"use client";

import { Layers, ShieldCheck, Mail, Smartphone, Fingerprint, Lock, CheckCircle2, CreditCard, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";

export default function OnboardingGuidePage() {
  const protocols = [
    {
      step: "01",
      title: "注文の確認 (Order Check)",
      desc: "カード台帳の「Pending Shipments」セクションで、発送待ちの注文を確認します。誰に届けるべきかを特定する最初のステップです。",
      icon: <Package size={20} />,
    },
    {
      step: "02",
      title: "物理チップの識別 (Registry)",
      desc: "新品カードをスマホで読み取り、14桁のUID(シリアル番号)を確認します。Registryの「Asset Provisioning」欄にそのUIDを入力して登録してください。",
      icon: <Fingerprint size={20} />,
      link: "/admin/registry",
      linkText: "台帳を開いて登録する"
    },
    {
      step: "03",
      title: "注文への紐付け (Assignment)",
      desc: "確認した注文の「Assign Card」ボタンを押し、登録したUIDを選択します。これでシステム上で『誰のカードか』が確定し、発送準備状態になります。",
      icon: <Layers size={20} />,
    },
    {
      step: "04",
      title: "書き込みと封印 (Provisioning & Lock)",
      desc: "台帳から「Copy Provisioning URL」でURLを取得し、NFC Toolsアプリでカードに書き込みます。最後に必ず「Lock tag」を実行し、物理的に書き換えを不可能にします。",
      icon: <Lock size={20} />,
    },
    {
      step: "05",
      title: "発送と監視 (Delivery)",
      desc: "完成したカードを発送します。ユーザーがタップすると、自動的に安全な登録フローが開始され、完了と同時に『世界に一つだけの装備品』として固定されます。",
      icon: <Mail size={20} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-white/5 pb-8">
        <Link href="/admin" className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-8 block">← Back to Oversight</Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 text-white">Security Protocol</h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">絶対防御 (Absolute Defense) システム運用ガイド</p>
      </header>

      <div className="bg-azure-500/5 border border-azure-500/20 p-8 mb-16 space-y-4">
         <div className="flex items-center gap-4 text-azure-400">
            <CreditCard size={24} />
            <h2 className="text-[12px] tracking-[0.4em] uppercase font-bold">発送準備の3ステップ</h2>
         </div>
         <p className="text-[11px] tracking-widest leading-relaxed opacity-60 uppercase">
            1. **台帳登録**: UIDを登録し、生成されたシリアルコード(s)を控える。<br/>
            2. **URL作成**: https://hxc.hexa-relation.com/api/card/[UID]?s=[s] を作成。<br/>
            3. **書き込み & ロック**: NFC Toolsで上記URLを焼き、[Lock]を実行して完成。
         </p>
         <Link href="https://apps.apple.com/jp/app/nfc-tools/id1252962749" target="_blank" className="inline-flex items-center gap-2 text-[8px] uppercase tracking-widest text-azure-400 opacity-60 hover:opacity-100 underline underline-offset-4">
            Get NFC Tools for iOS <ExternalLink size={10} />
         </Link>
      </div>

      <div className="space-y-12">
        {protocols.map((p, i) => (
          <div 
            key={i} 
            className="flex gap-8 relative group"
          >
            <div className="flex flex-col items-center">
               <div className="w-10 h-10 border border-white/10 bg-white/[0.02] flex items-center justify-center text-[10px] font-mono text-azure-400 font-bold mb-4">
                  {p.step}
               </div>
               {i < protocols.length - 1 && <div className="w-px h-full bg-white/5" />}
            </div>

            <div className="flex-1 pb-12">
               <div className="flex items-center gap-4 mb-3 text-azure-400 opacity-60">
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
          </div>
        ))}
      </div>

      <footer className="mt-20 p-8 border border-white/5 bg-white/[0.01] text-center">
         <div className="flex justify-center gap-2 mb-4 text-emerald-500">
            <CheckCircle2 size={16} />
            <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Security Handshake Enabled</span>
         </div>
         <p className="text-[9px] tracking-[0.2em] opacity-20 uppercase leading-relaxed">
            このガイドに従うことで、物理的な盗難やコピーに対して論理的な絶対防御が成立します。<br/>
            運用上のミス（シリアルの漏洩等）が発生した場合は、Registryから即座に無効化してください。
         </p>
      </footer>
    </div>
  );
}
