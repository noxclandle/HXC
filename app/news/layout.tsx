import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "お知らせ 更新履歴と新機能の告知",
  description:
    "Hexa Cardの新機能、システム更新、カードの仕様変更、メンテナンス予定のお知らせを新しい順に掲載しています。",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "お知らせ 更新履歴と新機能の告知 | Hexa System",
    description:
      "Hexa Cardの新機能、システム更新、カードの仕様変更、メンテナンス予定のお知らせを新しい順に掲載しています。",
    url: "/news",
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
