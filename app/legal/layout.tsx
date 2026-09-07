import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description:
    "特定商取引法に基づく表記です。販売事業者名、所在地、連絡先、販売価格、支払方法と時期、商品の引渡し時期、返品・交換の条件を記載しています。",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "特定商取引法に基づく表記 | Hexa System",
    description:
      "特定商取引法に基づく表記です。販売事業者名、所在地、連絡先、販売価格、支払方法と時期、商品の引渡し時期、返品・交換の条件を記載しています。",
    url: "/legal",
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
