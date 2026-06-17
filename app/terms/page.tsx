"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "第1条（適用） / Article 1 (Application)",
      content: "本規約は、Hexa Relation（以下「当組織」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に従って本サービスを利用するものとします。 / These terms define the conditions for using the services provided by Hexa Relation. Users must comply with these terms when using our services."
    },
    {
      title: "第2条（利用登録） / Article 2 (Registration)",
      content: "本サービスの利用には、当組織が指定する方法による登録が必要です. 登録にあたっては、真実かつ正確な情報を提供する必要があります。 / Registration via our designated method is required to use the service. You must provide true and accurate information during registration."
    },
    {
      title: "第3条（物理カードの取り扱い） / Article 3 (Physical Card Usage)",
      content: "本サービスに関連して発行される物理カードは、登録された利用者本人のみが使用できるものとします。カードの紛失、盗難による損害について当組織は一切の責任を負いません。 / Physical cards issued for the service are for the exclusive use of the registered individual. We are not liable for any damages resulting from lost or stolen cards."
    },
    {
      title: "第4条（禁止事項） / Article 4 (Prohibited Acts)",
      content: "利用者は、本サービスの利用にあたり、法令または公序良俗に違反する行為、本サービスの運営を妨害する行為、他者へのなりすまし行為等を行ってはなりません。 / Users must not engage in illegal acts, disrupt service operations, or impersonate others while using the service."
    },
    {
      title: "第5条（サービスの停止・変更） / Article 5 (Service Suspension/Change)",
      content: "当組織は、保守作業、システム障害、その他不可抗力により、利用者に事前通知することなく本サービスの提供を停止または中断することができるものとします。 / We may suspend or interrupt services without prior notice due to maintenance, system failure, or other force majeure events."
    },
    {
      title: "第6条（免責事項） / Article 6 (Disclaimer)",
      content: "当組織は、本サービスに起因して利用者に生じた損害について、当組織の故意または重過失による場合を除き、一切の責任を負いません。 / We are not liable for any damages arising from the service, except in cases of intentional misconduct or gross negligence."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight min-h-screen">
      <header className="mb-20">
        <Link href="/" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Gateway
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <ShieldCheck className="text-azure-400 opacity-50" size={24} /> Terms of Service
        </h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">利用規約</p>
      </header>

      <div className="space-y-12 border-t border-white/5 pt-12">
        {sections.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-40 mb-4">{s.title}</h3>
            <p className="text-sm tracking-widest leading-loose font-light opacity-80">{s.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
