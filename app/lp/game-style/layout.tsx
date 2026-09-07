import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "ゲーム風LP・ポートフォリオ制作 18万円〜",
  description:
    "ステータス画面やクエストログを模した、ゲーム風のポートフォリオ・LPを制作します。プランは18万円のStandard Quest、35万円のExpansion Pack、60万円〜のCustom DLCの3種類。独自ドメインの取得とサーバー設置も代行します。",
  alternates: { canonical: "/lp/game-style" },
  openGraph: {
    title: "ゲーム風LP・ポートフォリオ制作 18万円〜 | Hexa System",
    description:
      "ステータス画面やクエストログを模した、ゲーム風のポートフォリオ・LPを制作します。プランは18万円のStandard Quest、35万円のExpansion Pack、60万円〜のCustom DLCの3種類。独自ドメインの取得とサーバー設置も代行します。",
    url: "/lp/game-style",
  },
};

export default function LpGameStyleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
