"use client";

import { Layers, ShieldCheck, Mail, Smartphone, Fingerprint, Lock, CheckCircle2, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function OnboardingGuidePage() {
  const protocols = [
    {
      step: "01",
      title: "物理チップの識別 (Identity Scrutiny)",
      desc: "手元の新品カード(NTAG215)のシリアル番号(UID)を確認します。iPhoneの方は無料アプリ「NFC Tools」を使い、[Read] → [Serial Number] をコピーしてください。",
      icon: <Fingerprint size={20} />,
    },
    {
      step: "02",
      title: "台帳登録と書き込み (Provisioning)",
      desc: "管理者ページの「カード中央台帳(Registry)」を開きます。[Provisioning Mode]をONにしてカードをスキャンするか、UIDを手入力して枠を作成してください。この時、カードには名刺URLが書き込まれます。",
      icon: <Layers size={20} />,
      link: "/admin/registry",
      linkText: "台帳を開いて実行する"
    },
    {
      step: "03",
      title: "物理的な凍結 (Eternal Lock)",
      desc: "書き込み済みのカードを、アプリ(NFC Tools等)を使用して「Read-Only (読み取り専用)」にロックします。これにより、第三者による上書きを永久に防ぎます。※一度行うと元に戻せません。",
      icon: <Lock size={20} />,
    },
    {
      step: "04",
      title: "ユニットの発送 (Delivery)",
      desc: "セットアップ済みのカードをユーザーへ届けます。封筒等にシリアル番号を控えておくと管理がスムーズです。",
      icon: <Mail size={20} />,
    },
    {
      step: "05",
      title: "タップ・アクティベート (User Sync)",
      desc: "ユーザーがカードをスマホでタップすると、自動的に登録画面が開きます。ユーザーは氏名等を入力するだけで、瞬時に名刺が有効化されます。",
      icon: <Smartphone size={20} />,
    },
    {
      step: "06",
      title: "運用の開始 (Protocol Active)",
      desc: "登録完了後、同じカードをタップすれば、所有者本人なら管理画面、それ以外ならデジタル名刺がスマートに表示されます。名刺交換の準備は完了です。",
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16 border-b border-white/5 pb-8">
        <Link href="/admin" className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-8 block">← Back to Oversight</Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 text-white">Issue Protocol</h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">カード発行・配布ガイドライン (iOS/Android対応)</p>
      </header>

      <div className="bg-azure-500/5 border border-azure-500/20 p-8 mb-16 space-y-4">
         <div className="flex items-center gap-4 text-azure-400">
            <CreditCard size={24} />
            <h2 className="text-[12px] tracking-[0.4em] uppercase font-bold">最もシンプルな発行手順</h2>
         </div>
         <p className="text-[11px] tracking-widest leading-relaxed opacity-60 uppercase">
            1. **iPhone**の「NFC Tools」アプリで新品カードを読み、UIDをコピーする。<br/>
            2. **台帳**ページでUIDを貼り付け、枠を作成する。<br/>
            3. アプリでURL `https://hxc.hexa-relation.com/api/card/[UID]` をカードに書き込む。<br/>
            4. アプリでカードを「ロック(読み取り専用)」する。<br/>
            5. 完成。ユーザーへ発送。
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
