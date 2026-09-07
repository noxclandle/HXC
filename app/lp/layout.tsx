import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "刷り直し不要のNFC名刺 紙との比較表",
  description:
    "所属や役職が変わっても刷り直しは不要です。管理画面で書き換えれば、すでに渡したカードが指す先も最新になります。紙の名刺との違いを一覧の表で比較し、よくある質問もまとめています。",
  alternates: { canonical: "/lp" },
  openGraph: {
    title: "刷り直し不要のNFC名刺 紙との比較表 | Hexa System",
    description:
      "所属や役職が変わっても刷り直しは不要です。管理画面で書き換えれば、すでに渡したカードが指す先も最新になります。紙の名刺との違いを一覧の表で比較し、よくある質問もまとめています。",
    url: "/lp",
  },
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
