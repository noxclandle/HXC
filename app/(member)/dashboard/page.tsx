"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Book, Share2, ShieldCheck, Trophy, LayoutGrid, Zap, UserCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import ConstellationView from "@/components/ui/ConstellationView";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [realStats, setRealStatus] = useState({
    rt_balance: "0",
    rank: "Initiate",
    titles: [] as string[],
    uid: "UNSYNCED",
    handle: "",
    slug: "",
    equipped: {
      frame: "Obsidian",
      title: "ASSOCIATE",
      sound: "Resonance",
      pointer: "Pure White Hex",
      angel: "Sentinel",
      orientation: "horizontal" as "horizontal" | "vertical"
    }
  });

  const [contacts, setContacts] = useState<any[]>([]);

  const fetchLatestStats = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setRealStatus(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts/list", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // 星座表示用に座標をランダム生成 (実データがない場合のフォールバック)
        const mapped = data.map((c: any) => ({
          ...c,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }));
        setContacts(mapped);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (session) {
      fetchLatestStats();
      fetchContacts();
    }
  }, [session]);

  if (status === "loading") return null;

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
      <header className="mb-12 flex justify-between items-start">
        <div className="space-y-4">
          <h1 className="text-3xl tracking-[0.4em] uppercase font-extralight mb-2">Member Hub</h1>
          <div className="flex items-center gap-4 text-azure-400">
             <div className="px-3 py-1 border border-azure-500/30 bg-azure-500/5 text-[9px] tracking-[0.3em] font-bold uppercase italic flex items-center gap-2">
                <ShieldCheck size={12} /> {realStats.equipped.title}
             </div>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Credit Balance</p>
           <p className="text-2xl font-extralight tracking-[0.1em]">{Number(realStats.rt_balance).toLocaleString()} <span className="text-xs opacity-20">CP</span></p>
        </div>
      </header>

      {/* Core Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
         <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] transition-all flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
            <div>
               <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1">Scan Card</h2>
               <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400/60">名刺スキャン</p>
            </div>
            <Camera size={32} className="opacity-20 group-hover:opacity-60 transition-all" />
         </Link>
         <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] transition-all flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
            <div>
               <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1">My Archive</h2>
               <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-bronze-400/60">名刺帳・人脈管理</p>
            </div>
            <Book size={32} className="opacity-20 group-hover:opacity-60 transition-all" />
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          {/* Identity Constellation */}
          <section className="space-y-6">
             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Network Constellation / 人脈の星図</h2>
                <Link href="/library" className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity">Expand Universe</Link>
             </div>
             <ConstellationView contacts={contacts} />
          </section>

          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Identity Reflection / 名刺プレビュー</h2>
               <Link href={`/p/${realStats.slug}`} className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2">Public View <Share2 size={10}/></Link>
            </div>
            
            <div className="flex flex-col items-center">
              <HexaCardPreview 
                name={session?.user?.name || "ARCHITECT"} 
                reading={realStats.handle}
                title={realStats.equipped.title} 
                frame={realStats.equipped.frame}
                orientation={realStats.equipped.orientation}
              />
              
              <div className="mt-12 flex gap-4 w-full">
                 <Link href="/profile/edit" className="flex-1 py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                    <span className="text-[9px] tracking-[0.4em] uppercase">Tune Identity</span>
                    <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">プロフィールの調律</span>
                 </Link>
                 <Link href="/inventory" className="flex-1 py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                    <span className="text-[9px] tracking-[0.4em] uppercase">Treasury</span>
                    <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">宝物庫・装備</span>
                 </Link>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-12">
           <div className="p-1 bg-gradient-to-b from-white/5 to-transparent">
              <div className="mb-6 opacity-30 px-4">
                 <p className="text-[9px] tracking-[0.4em] uppercase font-bold">Monthly Insight</p>
                 <p className="text-[7px] tracking-[0.2em] uppercase mt-1">分析レポート</p>
              </div>
              <MonthlyReport />
           </div>
        </aside>
      </div>
    </div>
  );
}
