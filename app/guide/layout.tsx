import type { Metadata } from "next";

/**
 * このページは "use client" のため、page.tsx 側では metadata を持てない。
 * title / description / canonical をここで宣言する。
 *
 * 以前は全ページが layout.tsx（ルート）の既定値をそのまま名乗っていたため、
 * Google からは全ページがトップの複製に見え、1ページしかインデックスされなかった。
 */
export const metadata: Metadata = {
  title: "使い方ガイド NFCで渡す手順とスキャン",
  description:
    "Hexa Cardの使い方をまとめました。NFCでの渡し方、カードのデザイン変更、紙の名刺をカメラで取り込むOCRスキャン、ログインボーナスの受け取り方まで、画面に沿って順に説明します。",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "使い方ガイド NFCで渡す手順とスキャン | Hexa System",
    description:
      "Hexa Cardの使い方をまとめました。NFCでの渡し方、カードのデザイン変更、紙の名刺をカメラで取り込むOCRスキャン、ログインボーナスの受け取り方まで、画面に沿って順に説明します。",
    url: "/guide",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
