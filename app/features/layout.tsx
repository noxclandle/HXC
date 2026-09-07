import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "NFC名刺の機能一覧 紙の名刺との違い",
  description:
    "Hexa Cardでできることをすべて掲載しています。NFCタップ転送、vCardでの連絡先一括保存、紙名刺のAI-OCRスキャナー、本名と活動名を分ける二重アイデンティティ、会員同士の双方向ネットワーク。紙の名刺との違いも表で比較しています。",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "NFC名刺の機能一覧 紙の名刺との違い | Hexa System",
    description:
      "Hexa Cardでできることをすべて掲載しています。NFCタップ転送、vCardでの連絡先一括保存、紙名刺のAI-OCRスキャナー、本名と活動名を分ける二重アイデンティティ、会員同士の双方向ネットワーク。紙の名刺との違いも表で比較しています。",
    url: "/features",
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
