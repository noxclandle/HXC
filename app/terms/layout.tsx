import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "利用規約 会員規約と禁止事項",
  description:
    "Hexa Cardシステムの利用規約です。アカウントの登録と管理、カードの所有権、禁止事項、システム利用権の範囲、免責事項について定めています。",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "利用規約 会員規約と禁止事項 | Hexa System",
    description:
      "Hexa Cardシステムの利用規約です。アカウントの登録と管理、カードの所有権、禁止事項、システム利用権の範囲、免責事項について定めています。",
    url: "/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
