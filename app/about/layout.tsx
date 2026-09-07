import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "Hexa Cardとは 名刺を作り直した理由",
  description:
    "Hexa Cardは、渡したあとに書き換えられる名刺です。紙の名刺は渡した瞬間がいちばん新しく、あとは古くなる一方でした。その前提を変えるために作りました。設計の考え方と、目指しているものをまとめています。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Hexa Cardとは 名刺を作り直した理由 | Hexa System",
    description:
      "Hexa Cardは、渡したあとに書き換えられる名刺です。紙の名刺は渡した瞬間がいちばん新しく、あとは古くなる一方でした。その前提を変えるために作りました。設計の考え方と、目指しているものをまとめています。",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
