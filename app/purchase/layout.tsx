import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "NFC名刺の購入 買い切り3,000円から",
  description:
    "Standardは3,000円、メタリックのExecutiveは20,000円、法人向けCorporateは1枚5,800円（100枚から）。すべて買い切りで月額料金はありません。決済後およそ2週間で発行し、検品のうえお届けします。",
  alternates: { canonical: "/purchase" },
  openGraph: {
    title: "NFC名刺の購入 買い切り3,000円から | Hexa System",
    description:
      "Standardは3,000円、メタリックのExecutiveは20,000円、法人向けCorporateは1枚5,800円（100枚から）。すべて買い切りで月額料金はありません。決済後およそ2週間で発行し、検品のうえお届けします。",
    url: "/purchase",
  },
};

export default function PurchaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
