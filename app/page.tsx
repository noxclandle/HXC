import { CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://virtual-business-card.hexa-relation.com/",
  },
};

/**
 * 究極の Safari 最適化 (Pure Static Edition)
 * Minimal / Chic Homepage
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-void text-moonlight">
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center relative max-w-4xl mx-auto w-full pb-32">
        
        {/* Logo Section */}
        <div className="relative mb-12 mt-20">
          <div className="relative z-10 w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
             <Image 
                src="/logo.png" 
                alt="Hexa Relation Logo" 
                width={200}
                height={200}
                priority
                className="object-contain" 
             />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.25em] uppercase mb-4 text-white">
          Hexa Card
          <span className="block text-[9px] tracking-[0.4em] opacity-30 mt-6 leading-relaxed">
            アイデンティティの透過 / Permeation of Identity
          </span>
        </h1>

        <p className="text-white/40 max-w-sm mb-12 tracking-[0.2em] text-[10px] md:text-[11px] leading-relaxed uppercase px-4">
          物理とデジタルのアイデンティティを繋ぐ / Connecting physical and digital identities<br />
          ビジネスネットワーキングの再定義 / Redefining business networking
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full max-w-2xl px-4 mb-16 z-10">
          <Link
            href="/purchase"
            className="w-full md:w-auto px-6 md:px-8 h-[56px] bg-white text-void tracking-[0.4em] uppercase text-[10px] font-bold flex items-center justify-center gap-2 rounded-full hover:bg-zinc-200 transition-all"
          >
            <CreditCard size={12} /> カードの購入 / Order Card
          </Link>

          <Link
            href="/features"
            className="w-full md:w-auto px-6 md:px-8 h-[56px] border border-white/10 tracking-[0.3em] uppercase text-[10px] font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center rounded-full"
          >
            機能紹介 / Showcase
          </Link>

          <Link
            href="/login"
            className="w-full md:w-auto px-6 md:px-8 h-[56px] border border-white/10 tracking-[0.3em] uppercase text-[10px] font-bold text-azure-400/80 hover:bg-white/5 hover:text-azure-400 transition-all flex items-center justify-center rounded-full"
          >
            ログイン / Member Login
          </Link>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 opacity-30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] uppercase tracking-[0.4em] font-mono">システム稼働中 / System Online</span>
        </div>

      </main>
      <Footer />
    </div>
  );
}
