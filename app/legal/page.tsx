"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
  const sections = [
    { title: "販売業者 / Vendor", content: "Hexa Relation" },
    { title: "代表責任者 / Representative", content: "請求により遅滞なく開示いたします / Disclosed upon request" },
    { title: "所在地 / Location", content: "請求により遅滞なく開示いたします / Disclosed upon request" },
    { title: "電話番号 / Phone Number", content: "請求により遅滞なく開示いたします / Disclosed upon request" },
    { title: "メールアドレス / Email", content: "support@hexa-relation.com" },
    { title: "販売価格 / Price", content: "各商品ページに記載の金額（税込） / Amount as listed on product pages (incl. tax)" },
    { title: "商品代金以外の必要料金 / Additional Fees", content: "配送料（日本国内一律無料）、決済手数料 / Shipping (Free within Japan), Payment fees" },
    { title: "支払方法 / Payment Methods", content: "クレジットカード決済（Stripe） / Credit Card (Stripe)" },
    { title: "支払時期 / Payment Timing", content: "商品注文確定時にお支払いが確定します。 / Payment is processed at the time of order confirmation." },
    { title: "商品の引渡時期 / Delivery Timing", content: "決済完了確認後、3〜7営業日以内に発送いたします。 / Shipped within 3-7 business days after payment verification." },
    { title: "返品・交換・キャンセルについて / Returns & Cancellations", content: "商品の性質（オーダーメイド・特注品）上、決済完了後のキャンセルは受け付けておりません。製品に初期不良がある場合は、商品到着後7日以内にご連絡ください。良品と交換させていただきます。 / Due to the custom nature of the product, cancellations are not accepted after payment. Contact us within 7 days if the product is defective for a replacement." },
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
