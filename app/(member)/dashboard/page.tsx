"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Book, Share2, ShieldCheck, Trophy, LayoutGrid, Zap, UserCircle, Sparkles, ChevronRight, Smartphone, Layout, Edit3 } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import ConstellationView from "@/components/ui/ConstellationView";
import { useToast } from "@/components/ui/ResonanceToast";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [realStats, setRealStatus] = useState({
    name: "",
    rt_balance: "0",
    rank: "Initiate",
    titles: [] as string[],
    uid: "UNSYNCED",
    handle: "",
    slug: "",
    logo_url: "",
    photo_url: "",
    profile: { title: "", bio: "", company: "", website: "" },
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

  const updateOrientation = async (orient: "horizontal" | "vertical") => {
    if (realStats.equipped.orientation === orient) return;
    setIsUpdating(true);
    try {
      const newEquipped = { ...realStats.equipped, orientation: orient };
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: newEquipped })
      });
      if (res.ok) {
        setRealStatus({ ...realStats, equipped: newEquipped });
        showToast(`Layout Saved / 形式を保存しました (${orient})`, "success");
      }
    } catch (e) { console.error(e); }
    finally { setIsUpdating(false); }
  };

  if (status === "loading") return null;

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Core Identity & Network */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* 【重要】名刺プレビュー (Identity Reflection) - 最上部に配置 */}
          <section className="p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
             <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
                <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Identity Reflection / あなたの証</h2>
                <div className="flex items-center gap-6">
                  <div className="flex gap-2 p-1 bg-white/5 border border-white/5">
                     <button onClick={() => updateOrientation('horizontal')} className={`p-1.5 transition-all ${realStats.equipped.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`} title="Horizontal">
                        <Layout size={12}/>
                     </button>
                     <button onClick={() => updateOrientation('vertical')} className={`p-1.5 transition-all ${realStats.equipped.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`} title="Vertical">
                        <Smartphone size={12}/>
                     </button>
                  </div>
                  <Link href={`/p/${realStats.slug}`} className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 border-l border-white/10 pl-6">Public View <Share2 size={10}/></Link>
                </div>
             </div>
             
             <div className="flex flex-col items-center">
                <div className={`relative ${isUpdating ? 'opacity-20' : ''} transition-all duration-700 min-h-[250px] flex items-center justify-center w-full`}>
                   <HexaCardPreview 
                     name={realStats.name || session?.user?.name || "ARCHITECT"} 
                     reading={realStats.handle}
                     company={realStats.profile?.company}
                     title={realStats.equipped.title} 
                     logoUrl={realStats.logo_url}
                     faceUrl={realStats.photo_url}
                     frame={realStats.equipped.frame}
                     orientation={realStats.equipped.orientation}
                   />                   {isUpdating && <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="animate-spin text-azure-400" /></div>}
                </div>
                
                <div className="mt-12 grid grid-cols-2 gap-4 w-full">
                   <Link href="/profile/edit" className="py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                      <Edit3 size={14} className="mb-1 opacity-40 group-hover:opacity-100" />
                      <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Tune Identity</span>
                      <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">プロフィールの調律</span>
                   </Link>
                   <Link href="/inventory" className="py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                      <Trophy size={14} className="mb-1 opacity-40 group-hover:opacity-100" />
                      <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Treasury</span>
                      <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">宝物庫・装備</span>
                   </Link>
                </div>
             </div>
          </section>

          {/* Primary Actions: SCAN & ARCHIVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1">Scan Card</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400/60">名刺スキャン</p>
                </div>
                <Camera size={32} className="opacity-20 group-hover:opacity-60 transition-all" />
             </Link>
             <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1">My Archive</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-bronze-400/60">名刺帳・人脈管理</p>
                </div>
                <Book size={32} className="opacity-20 group-hover:opacity-60 transition-all" />
             </Link>
          </div>

          {/* Constellation: Network Visualization */}
          <section className="space-y-6">
             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Network Constellation / 人脈の星図</h2>
                <Link href="/library" className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity">Open Archive</Link>
             </div>
             <ConstellationView contacts={contacts} />
          </section>
        </div>

        {/* Right Column: Analytics & Quick Status */}
        <div className="lg:col-span-4 space-y-12">
           <div className="p-1 bg-gradient-to-b from-white/5 to-transparent">
              <div className="mb-6 opacity-30 px-4">
                 <p className="text-[9px] tracking-[0.4em] uppercase font-bold">Monthly Insight</p>
                 <p className="text-[7px] tracking-[0.2em] uppercase mt-1">分析レポート</p>
              </div>
              <MonthlyReport />
           </div>

           <section className="space-y-6 px-4">
             <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Recent Connections</h2>
             <div className="space-y-3">
                {contacts.slice(0, 5).map((c) => (
                   <div key={c.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01]">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 border border-white/10 rounded-full flex items-center justify-center text-[8px] opacity-40">{c.name[0]}</div>
                         <p className="text-[10px] tracking-widest uppercase opacity-60">{c.name}</p>
                      </div>
                      <ChevronRight size={12} className="opacity-20" />
                   </div>
                ))}
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
