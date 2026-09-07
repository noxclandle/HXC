import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "お問い合わせ 法人カスタムのご相談",
  description:
    "Hexa Cardについてのご質問、法人向けオリジナルデザインカード（100枚から）のご相談、ゲーム風LP制作のお見積りはこちらのフォームから承ります。",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "お問い合わせ 法人カスタムのご相談 | Hexa System",
    description:
      "Hexa Cardについてのご質問、法人向けオリジナルデザインカード（100枚から）のご相談、ゲーム風LP制作のお見積りはこちらのフォームから承ります。",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
