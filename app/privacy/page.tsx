"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 個人情報の定義と取得範囲 / Definition & Scope of Personal Information",
      content: "当組織は、本サービスにおいて以下の個人情報およびデータを適正かつ公正な手段によって取得します。(1) 氏名、メールアドレス、電話番号、パスワード。(2) 物理カード配送時の宛先情報（郵便番号、住所、受取人氏名）。(3) 決済取引データ（クレジットカード情報はStripeを介してトークン化され、当組織のサーバーには直接保存されません）。(4) 公開プロフィール用データ（役職、会社名、SNSリンク、ポートフォリオ、肖像写真データ）。 / We collect identifiers, contact details, shipping addresses, payment details (tokenized via Stripe), and profile details including portraits and SNS links."
    },
    {
      title: "2. 利用目的の特定 / Specific Purposes of Data Use",
      content: "取得した個人情報は、以下の目的でのみ利用します。目的外での利用は行いません。(1) 物理カードの配送および管理、アフターサービス。(2) ユーザーアカウントの識別、およびNFCタップ時のプロフィール表示制御。(3) お問い合わせへの対応、本人確認。(4) Relation Token（RT）の管理、ゲーム・カスタマイズ機能の処理。(5) システム障害対応やセキュリティ強化のためのシステムログ解析。 / Used only for card shipping, identity sync, customer support, token/assets management, and system security analysis."
    },
    {
      title: "3. 第三者委託と共同利用の管理 / Third-Party Delegation & Joint Usage",
      content: "当組織は、法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供・開示することはありません。ただし、配送業務委託会社（ヤマト運輸・郵便局等）への発送先開示、および決済代行会社（Stripe）への情報共有など、サービスの履行に必要な範囲において、十分なセキュリティ基準を満たす委託先に対して最小限のデータを預託する場合があります。 / No third-party disclosure except as required by law or necessary for operations such as card logistics and payment processing under strict NDA."
    },
    {
      title: "4. 安全管理措置（データベースとセキュリティ） / Data Security Measures",
      content: "当組織は、個人情報の漏洩、滅失、または毀損の防止のため、以下の安全管理措置を講じます。(1) データベース（Neon/Vercel Postgres）へのアクセス権限の最小化制限。(2) 通信の暗号化（SSL/TLS）。(3) クライアント写真データの自動縮小・最適化処理による容量制限と過負荷防止。(4) セキュリティパッチの定期適用と監査ログの記録。 / Implements databases access restrictions, SSL/TLS, image resizing policies to prevent data overload, and regular system audits."
    },
    {
      title: "5. 自己データの開示・訂正・削除（退会と物理カードの処理） / User Rights & Account Purge",
      content: "ユーザーは、アカウントの管理画面から自己のプロフィール情報をいつでも開示・訂正・削除できます。また、個人情報保護法に基づく退会（アカウント削除）を請求した場合、当組織は個人特定情報を完全にデータベースから物理的消去します。この際、セキュリティと悪用防止の観点から、紐付けられていた物理カードのUIDは永久に無効化（Dead）処理され、再利用は不可能となります。 / Users have full rights to access, edit, or purge their data. Account deletion destroys all personal records, while permanently invalidating the associated physical card."
    },
    {
      title: "6. お問い合わせ窓口 / Privacy Inquiries",
      content: "個人情報の取り扱いに関する開示請求、ご意見、または苦情は、本ウェブサイトのコンタクトフォーム（または support@hexa-relation.com）よりご連絡ください。本人確認の上、合理的な期間内に適切に対応いたします。 / Contact us via our support email or contact form for any data inquiries or deletion requests."
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
