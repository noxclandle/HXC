"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 個人情報の取得",
      content: "当組織は、本サービスの提供にあたり、氏名、メールアドレス、配送先住所、決済情報等の個人情報を適正な手段により取得します。"
    },
    {
      title: "2. 利用目的",
      content: "取得した個人情報は、商品の発送、お問い合わせ対応、本人確認、および本サービスの維持・改善の目的で利用します。"
    },
    {
      title: "3. 第三者提供の禁止",
      content: "当組織は、法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供することはありません。ただし、配送や決済等の業務委託先を除きます。"
    },
    {
      title: "4. 安全管理措置",
      content: "当組織は、個人情報の漏洩、滅失の防止のため、適切なセキュリティ対策を講じ、個人情報を厳重に管理します。"
    },
    {
      title: "5. 開示・訂正・削除",
      content: "利用者は、自己の個人情報の開示、訂正、削除を請求することができます。請求があった場合は、本人確認の上、速やかに対応いたします。"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight min-h-screen">
      <header className="mb-20">
        <Link href="/" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Gateway
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <Lock className="text-azure-400 opacity-50" size={24} /> Privacy Policy
        </h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">プライバシーポリシー</p>
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
