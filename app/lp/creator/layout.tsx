import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "本名を出さない名刺 VTuber・配信者向け",
  description:
    "本名は伏せたまま、活動名とアイコンだけで名刺を作れます。デザインは36,000通り以上。リンクや肩書が変わっても管理画面で直すだけで、カードの刷り直しはいりません。VTuber・配信者・フリーランス向け。",
  alternates: { canonical: "/lp/creator" },
  openGraph: {
    title: "本名を出さない名刺 VTuber・配信者向け | Hexa System",
    description:
      "本名は伏せたまま、活動名とアイコンだけで名刺を作れます。デザインは36,000通り以上。リンクや肩書が変わっても管理画面で直すだけで、カードの刷り直しはいりません。VTuber・配信者・フリーランス向け。",
    url: "/lp/creator",
  },
};

export default function LpCreatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
