import type { Metadata } from "next";
import PitchClient from "./PitchClient";

export const metadata: Metadata = {
  title: "Hexa Card 提案資料 / Sales Deck",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PitchPage() {
  return <PitchClient />;
}
