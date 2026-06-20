"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "第1条（適用および目的） / Article 1 (Purpose & Application)",
      content: "本利用規約（以下「本規約」）は、Hexa Relation（以下「当組織」）が運営・提供するデジタル名刺システム「Hexa Card」およびそれに関連するウェブサービス、アセットストア、Relation Token経済圏（以下総称して「本サービス」）の利用条件を定めるものです。本サービスの利用者（以下「ユーザー」）は、本サービスに登録または利用した時点で、本規約のすべての条項に同意したものとみなされます。 / These terms govern the use of the \"Hexa Card\" digital identity system, assets store, and related services. By accessing or using the services, users agree to be bound by all these terms."
    },
    {
      title: "第2条（定義） / Article 2 (Definitions)",
      content: "本規約において使用する用語の定義は以下の通りとします。(1)「物理カード（Hexa Card）」：当組織が発行するNFCチップ内蔵の物理的カード。(2)「公開プロフィール」：ユーザーが設定し、物理カードのタップまたはQRコードを通じて第三者に公開する自己紹介情報。(3)「Relation Token（RT）」：サービス内でカスタマイズ用アセットの解禁等に使用できるポイント。(4)「アセット」：フレーム、背景、オーラ、エフェクト、サウンド等のデジタル装飾データ。 / Defines key terms including Physical Card, Public Profile, Relation Token (RT), and Digital Assets (frames, background, sound, etc.) within the system."
    },
    {
      title: "第3条（アカウント登録とアイデンティティの紐付け） / Article 3 (Account & Identity Sync)",
      content: "利用登録は、物理カードのUIDと当組織が発行した正規のシリアルコードを所持する本人のみが申請できるものとします。登録情報は常に真実、正確、最新のものでなければなりません。1つの物理カードに対して登録できるアカウントは1つのみとし、第三者へのアカウント売買、譲渡、または不正な紐付けを禁止します。 / Registration requires a valid card UID and serial. Only one account can be bound to each card. Transfer or sale of accounts is strictly prohibited."
    },
    {
      title: "第4条（物理カードの管理と自己責任） / Article 4 (Physical Card Management)",
      content: "ユーザーは自己の責任において物理カードおよびログイン情報を厳重に管理するものとします。カードの紛失、盗難、または第三者による不正使用（NFCタップによるなりすましアクセス等）によってユーザーに生じた損害について、当組織は一切の責任を負いません。紛失時は直ちにアカウントの無効化処理、または再発行（有償）の手続きを行ってください。 / Users are solely responsible for managing their physical card and login credentials. We assume no liability for unauthorized access or usage due to lost or stolen cards."
    },
    {
      title: "第5条（Relation Token（RT）および有料決済） / Article 5 (Relation Tokens & Payments)",
      content: "Relation Token（RT）は、本サービス内でのみ使用できるポイントであり、換金、返金、またはユーザー間での譲渡はできません。決済システムはStripe等を通じて処理され、購入が確定した決済および消費されたRTについて、当組織の重大な過失がある場合を除き、いかなる場合もキャンセルや払い戻しは行わないものとします。 / RT points are non-refundable and non-transferable. Financial transactions are processed via Stripe and cannot be cancelled or refunded once confirmed."
    },
    {
      title: "第6条（アセットの利用許諾と知的財産権） / Article 6 (Assets & Intellectual Property)",
      content: "本サービス内のすべてのアセット、画像、デザイン、音楽、ソースコードに関する知的財産権は、当組織またはライセンス提供者に帰属します。ユーザーに対し、本サービス内でのデジタル名刺の装飾目的においてのみ非独占的な利用を許諾するものとし、二次配布、改変、リバースエンジニアリング、または商標登録などの行為を固く禁じます。 / All property rights of assets, code, and graphics belong to Hexa Relation. Users are granted a non-exclusive license to decorate their card profiles within the system."
    },
    {
      title: "第7条（禁止事項） / Article 7 (Prohibited Activities)",
      content: "ユーザーは本サービスにおいて、以下の行為を行ってはなりません。(1) 法令または公序良俗に違反する情報の公開。(2) 他のユーザー、または当組織の活動を妨害・誹謗中傷する行為。(3) 物理カードの不正なクローン複製や、APIへの不正リクエスト。(4) なりすまし行為、および虚偽情報の登録。(5) その他、当組織が不適切と判断する行為。 / Prohibits unlawful acts, system abuse (cloning cards, calling APIs directly), registration of false information, and harassment."
    },
    {
      title: "第8条（アカウントの削除・退会およびカードの無効化） / Article 8 (Deletion & Card Revocation)",
      content: "ユーザーが本サービスの退会（アカウント削除）を申請した場合、当組織は個人情報保護の観点からアカウントを完全に消去します。これに伴い、紐付けられていた物理カードは「永久無効化（Dead）」ステータスとなり、以後いかなるアカウントにも再登録・再使用することはできなくなります。 / Account deletion completely purges personal records. The bound card will be permanently invalidated (Dead) and cannot be reused or rebound."
    },
    {
      title: "第9条（免責事項・サービスの停止） / Article 9 (Disclaimer & Suspensions)",
      content: "当組織は、定期保守、サーバー障害、通信環境の悪化、天災地変等の不可抗力により、ユーザーに通知することなく本サービスの全部または一部を停止・中断できるものとします。本サービスの利用、または利用不能によってユーザーに生じた不利益・損害に対し、当組織は一切の責任を負いません。 / We reserve the right to suspend operations for maintenance or due to server issues without notice. We are not liable for any losses incurred during such downtime."
    },
    {
      title: "第10条（規約の改定および準拠法） / Article 10 (Amendments & Jurisdiction)",
      content: "当組織は必要と判断した際、ユーザーの事前承諾なしに本規約を改定できるものとします。規約改定後にユーザーが本サービスを利用した時点で、改定後の規約に同意したものとみなします。本規約は日本法を準拠法とし、本サービスに関する紛争については、当組織の本拠所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。 / These terms may be revised without prior consent. Revised terms take effect upon usage. Any legal disputes shall be governed by Japanese law under our local court jurisdiction."
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
