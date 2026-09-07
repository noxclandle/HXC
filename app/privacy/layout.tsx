import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "取得する個人情報の項目、利用目的、第三者提供の有無、保管と安全管理、開示・訂正・削除の請求方法を記載しています。名刺データの取り扱いについても定めています。",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "プライバシーポリシー | Hexa System",
    description:
      "取得する個人情報の項目、利用目的、第三者提供の有無、保管と安全管理、開示・訂正・削除の請求方法を記載しています。名刺データの取り扱いについても定めています。",
    url: "/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
