"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
  const sections = [
    { title: "販売業者 / Vendor", content: "Hexa Relation" },
    { title: "代表責任者 / Representative", content: "請求がございましたら、個人情報保護の観点から本人確認を行った上で遅滞なく開示いたします。 / Disclosed upon request after identity verification." },
    { title: "所在地 / Location", content: "請求がございましたら、当組織のセキュリティポリシーに基づき遅滞なく開示いたします。 / Disclosed upon request under our organizational security policy." },
    { title: "電話番号 / Phone Number", content: "請求がございましたら、お取引に必要な範囲において遅滞なく開示いたします。 / Disclosed upon request for transaction purposes." },
    { title: "メールアドレス / Email", content: "support@hexa-relation.com" },
    { title: "販売価格 / Price", content: "各カードタイプおよびアセット購入画面に表示される金額（消費税込みの総額表示）。 / Prices are as shown on each product and asset catalog page (inclusive of tax)." },
    { title: "商品代金以外の必要料金 / Additional Fees", content: "配送料（日本国内一律無料）。銀行振込またはクレジットカード決済における決済代行手数料はお客様負担となる場合があります。 / Shipping: Free within Japan. Additional transaction or payment processing fees may apply." },
    { title: "お支払い方法 / Payment Methods", content: "クレジットカード決済（Stripe）、Apple Pay、Google Pay。 / Credit Card (Stripe), Apple Pay, Google Pay." },
    { title: "お支払い時期 / Payment Timing", content: "クレジットカード決済の場合、商品注文確定時に即時お支払いが確定します。 / Credit Card payments are processed immediately upon order placement." },
    { title: "役務・商品の引渡時期 / Delivery Timing", content: "決済完了確認後、原則として3〜7営業日以内に物理カードを発送いたします。デジタルアセットおよびポイント（RT）については、決済完了後即時にアカウントに付与されます。 / Physical cards ship within 3-7 business days post payment verification. Digital assets and tokens (RT) are credited immediately." },
    { title: "返品・交換・キャンセルについて / Returns & Cancellations", content: "物理カードはその性質（ICチップおよび固有のシリアル・UIDの書き込み・カスタム仕様）上、決済完了後の自己都合による注文キャンセルや返品はお受けできません。万が一、製品に破損、チップ不良等の初期不良があった場合は、商品到着後7日以内にお問い合わせフォームまたはメールよりご連絡ください。速やかに良品と交換いたします。デジタルアセット及びRTの消費後は返品・返金は一切お受けできません。 / Due to the customized NFC/serial nature of physical cards, cancellations/refunds are not accepted. Defective items can be replaced within 7 days of arrival. All digital token (RT) consumption is final." },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight min-h-screen">
      <header className="mb-20">
        <Link href="/" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Gateway
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <Scale className="text-azure-400 opacity-50" size={24} /> Specified Commercial Transactions
        </h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase font-bold italic">特定商取引法に基づく表記</p>
      </header>

      <div className="space-y-12 border-t border-white/5 pt-12">
        {sections.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-40">{s.title}</h3>
            <p className="md:col-span-2 text-sm tracking-widest leading-loose font-light">{s.content}</p>
          </motion.div>
        ))}
      </div>

      <footer className="mt-24 pt-12 border-t border-white/5 opacity-20 text-[8px] tracking-[0.4em] uppercase text-center italic">
        Building trust through transparency and resonance.
      </footer>
    </div>
  );
}
