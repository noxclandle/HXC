"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full"
      >
        <h1 className="text-3xl md:text-4xl tracking-[0.4em] uppercase font-light mb-16 text-center">
          Privacy Policy
          <span className="block text-[10px] tracking-[0.2em] opacity-40 mt-4">プライバシーポリシー</span>
        </h1>

        <div className="space-y-16 text-xs md:text-sm tracking-widest leading-loose opacity-70">
          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              1. Information / 収集する情報
            </h2>
            <p className="mb-4">
              Hexa Relation（以下「当方」）は、本サービスの提供にあたり、以下の情報を収集する場合があります。
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>プロフィール情報（氏名、連絡先、SNSリンク等）</li>
              <li>接続ログおよびデバイス情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              2. Purpose / 利用目的
            </h2>
            <p className="mb-4">
              収集した情報は、以下の目的で利用いたします。
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>アイデンティティ・プロフィールの表示と管理</li>
              <li>サービスの維持、保護、および利便性の向上</li>
              <li>ユーザー認証とセキュリティの確保</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              3. Disclosure / 第三者提供
            </h2>
            <p className="mb-4">
              当方は、法令に基づく場合を除き、同意なく第三者に個人情報を提供することはありません。
              なお、ユーザーが公開設定にした情報は、NFCまたはURLを通じて第三者が閲覧可能となります。
            </p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              4. Security / セキュリティ
            </h2>
            <p className="mb-4">
              当方は、情報の不正アクセスや紛失を防止するため、適切な管理体制の整備と必要な措置を講じます。
            </p>
          </section>
        </div>

        <div className="mt-24 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-30">
            Last Updated: 2026.05.01 / 最終更新日
          </p>
        </div>
      </motion.div>
    </main>
  );
}
