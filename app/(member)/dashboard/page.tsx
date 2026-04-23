"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Book, Share2, ShieldCheck, Trophy, Settings, LayoutGrid, Zap, UserCircle } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import DigitalIdentityOverlay from "@/components/ui/DigitalIdentityOverlay";

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
      angel: "Sentinel"
    }
  });

  const fetchLatestStats = async () => {
    try {
      const res = await fetch("/api/user/status", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setRealStatus(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (session) fetchLatestStats();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="text-center">
          <div className="text-[10px] tracking-[1.2em] uppercase opacity-40 font-extralight mb-4">Synchronizing...</div>
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
      {/* 1. Header: Professional Status */}
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-3xl tracking-[0.4em] uppercase font-extralight mb-2">Member Hub</h1>
          <div className="flex items-center gap-4 text-azure-400">
             <div className="px-3 py-1 border border-azure-500/30 bg-azure-500/5 text-[9px] tracking-[0.3em] font-bold uppercase italic flex items-center gap-2">
                <ShieldCheck size={12} /> {realStats.equipped.title}
             </div>
             <p className="text-[8px] tracking-[0.4em] opacity-30 uppercase">Authorized Entity</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Credit Balance</p>
           <p className="text-2xl font-extralight tracking-[0.1em]">{Number(realStats.rt_balance).toLocaleString()} <span className="text-xs opacity-20">CP</span></p>
        </div>
      </header>

      {/* 2. Core Actions: Primary Business Functions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
         <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] hover:border-azure-500/40 transition-all flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
            <div>
               <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1">Scan Card</h2>
               <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase">名刺スキャン・データ化</p>
            </div>
            <Camera size={32} className="opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all" />
         </Link>
         <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] hover:border-bronze-500/40 transition-all flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
            <div>
               <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1">My Archive</h2>
               <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase">名刺帳・人脈管理</p>
            </div>
            <Book size={32} className="opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all" />
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* 3. Identity Preview & Tuning */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Identity Display</h2>
               <Link href={`/p/${realStats.slug}`} className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2">View Sanctum <Share2 size={10}/></Link>
            </div>
            
            <div className="relative group">
              <HexaCardPreview 
                name={session.user?.name || "ARCHITECT"} 
                reading={realStats.handle}
                uid={realStats.uid} 
                rt={Number(realStats.rt_balance).toLocaleString()} 
                title={realStats.equipped.title} 
                aura={85}
                frame={realStats.equipped.frame}
              />
              
              <div className="mt-8 flex gap-4">
                 <Link href="/profile/edit" className="flex-1 py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                    <span className="text-[9px] tracking-[0.4em] uppercase">Tune Identity</span>
                    <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">情報の調律</span>
                 </Link>
                 <Link href="/inventory" className="flex-1 py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                    <span className="text-[9px] tracking-[0.4em] uppercase">Treasury</span>
                    <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">宝物庫</span>
                 </Link>
              </div>
            </div>
          </section>

          {/* 4. Assets Status */}
          <section className="space-y-6">
            <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Active Components</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: "Frame", value: realStats.equipped.frame, icon: <LayoutGrid size={14}/>, sub: "外枠" },
                 { label: "Title", value: realStats.equipped.title, icon: <Trophy size={14}/>, sub: "称号" },
                 { label: "Pointer", value: realStats.equipped.pointer, icon: <Zap size={14}/>, sub: "軌跡" },
                 { label: "Concierge", value: realStats.equipped.angel, icon: <UserCircle size={14}/>, sub: "案内役" },
               ].map((asset) => (
                 <div key={asset.label} className="p-5 border border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-3 mb-3 opacity-20">
                       {asset.icon}
                       <span className="text-[8px] uppercase tracking-widest">{asset.label}</span>
                    </div>
                    <p className="text-[9px] tracking-widest uppercase font-bold text-white/70 mb-1">{asset.value}</p>
                    <p className="text-[7px] opacity-20 uppercase">{asset.sub}</p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* 5. Aside: Analytics */}
        <aside className="lg:col-span-4 space-y-12">
           <div>
              <div className="mb-6 opacity-30">
                 <p className="text-[9px] tracking-[0.4em] uppercase font-bold">Insight Archive</p>
                 <p className="text-[7px] tracking-[0.2em] uppercase mt-1">分析レポート</p>
              </div>
              <MonthlyReport />
           </div>
        </aside>
      </div>
    </div>
  );
}
