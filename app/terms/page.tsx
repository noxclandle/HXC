"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full"
      >
        <h1 className="text-3xl md:text-4xl tracking-[0.4em] uppercase font-light mb-16 text-center">
          Terms of Service
          <span className="block text-[10px] tracking-[0.2em] opacity-40 mt-4">利用規約</span>
        </h1>

        <div className="space-y-16 text-xs md:text-sm tracking-widest leading-loose opacity-70">
          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              1. Scope / 適用範囲
            </h2>
            <p className="mb-4">
              本規約は、Hexa Relation（以下「当方」）が提供するHexa Cardおよび関連サービス（以下「本サービス」）の利用条件を定めるものです。
              本サービスをご利用になる方（以下「ユーザー」）は、本規約に同意の上、利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              2. Registration / アカウント管理
            </h2>
            <p className="mb-4">
              ユーザーは、真実かつ正確な情報を用いてアカウント登録を行うものとします。
              また、物理的なデバイス（Hexa Card）およびデジタルアカウントの管理責任はユーザー自身にあり、第三者への譲渡、貸与を禁じます。
            </p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              3. Prohibited Acts / 禁止事項
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスのシステムへの不正アクセス</li>
              <li>第三者または当方の知的財産権、プライバシーを侵害する行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 font-light text-moonlight">
              4. Disclaimer / 免責事項
            </h2>
            <p className="mb-4">
              当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、有効性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを保証しておりません。
            </p>
            <p>
              本サービスに起因してユーザーに生じたあらゆる損害について、当方は一切の責任を負いません。
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
