import { ArrowLeft, Layers, ExternalLink, Globe, Shield, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLpsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
    redirect("/hub");
  }

  const lps = [
    {
      title: "Digital Card LP / 電子名刺対比LP",
      path: "/lp",
      description: "紙名刺とデジタル名刺の対比をコンセプトとした汎用LP。匿名性保護、オフライン機能、写真付きvCard同期などを網羅。",
      status: "Active / 公開中",
      target: "一般・クリエイター・VTuber向け",
      lastUpdated: "2026/06/21",
    },
    {
      title: "Core Showcase / 機能紹介",
      path: "/features",
      description: "アセットの着せ替え、AI-OCR名刺スキャン、NFC連携、連絡先書き出しなどシステムコア機能を技術的・視覚的に紹介するページ。",
      status: "Active / 公開中",
      target: "一般・ビジネスユーザー向け",
      lastUpdated: "2026/06/20",
    },
    {
      title: "Philosophy Page / コンセプト・哲学",
      path: "/about",
      description: "「存在と共鳴」をテーマとしたブランド哲学解説ページ。ミニマルな文脈でシステムの価値観を伝える。",
      status: "Active / 公開中",
      target: "ブランド選好ユーザー向け",
      lastUpdated: "2026/06/21",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-16">
        <Link href="/admin" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity mb-8">
          <ArrowLeft size={12} /> Back to Hub / 管理ハブに戻る
        </Link>
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light mb-2 flex items-center gap-4">
          <Layers className="text-azure-400 opacity-50" size={24} /> LP Registry / 告知・LP管理簿
        </h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-40 uppercase italic font-bold">Marketing Landing Pages & Portals</p>
      </header>

      <div className="space-y-6">
        {lps.map((lp, index) => (
          <div key={index} className="p-8 border border-white/10 bg-white/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="text-sm tracking-[0.2em] font-bold text-white uppercase">{lp.title}</h3>
                <span className="text-[8px] px-2 py-0.5 border border-emerald-500/20 text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                  <CheckCircle size={8} /> {lp.status}
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-white/40 leading-relaxed uppercase">{lp.description}</p>
              <div className="flex gap-6 text-[8px] tracking-widest text-white/20 uppercase font-mono">
                <span>Target: {lp.target}</span>
                <span>Last Updated: {lp.lastUpdated}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <a 
                href={lp.path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto px-6 py-3 border border-white/10 text-[9px] tracking-[0.3em] uppercase hover:bg-white/5 transition-all text-white/60 flex items-center justify-center gap-2"
              >
                <Globe size={10} /> View Page
              </a>
              <a 
                href={`https://search.google.com/search-console/inspect?resource_id=sc-domain%3Ahexa-relation.com&id=inspect%3A${encodeURIComponent(`https://virtual-business-card.hexa-relation.com${lp.path}`)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto px-6 py-3 border border-azure-500/10 text-[9px] tracking-[0.3em] uppercase hover:bg-azure-500/5 transition-all text-azure-400 flex items-center justify-center gap-2"
              >
                <ExternalLink size={10} /> Inspect in GSC
              </a>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-24 pt-12 border-t border-white/5 opacity-10 text-[8px] tracking-[0.4em] uppercase text-center italic">
        Keep pages optimized and monitor indexing regularly.
      </footer>
    </div>
  );
}
