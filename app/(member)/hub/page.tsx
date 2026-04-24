"use client";

import { useState, useEffect } from "react";
import { Camera, Book, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import ConstellationView from "@/components/ui/ConstellationView";
import IdentityReflection from "@/components/ui/IdentityReflection";

export const dynamic = "force-dynamic";

export default function MemberHubPage() {
  const { data: session, status } = useSession();
  const [realStats, setRealStatus] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [statusRes, contactsRes] = await Promise.all([
        fetch("/api/user/status", { cache: "no-store" }),
        fetch("/api/contacts/list", { cache: "no-store" })
      ]);
      if (statusRes.ok) setRealStatus(await statusRes.json());
      if (contactsRes.ok) {
        const cData = await contactsRes.json();
        setContacts(cData.map((c: any) => ({
          ...c,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        })));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  // 単一のreturn文の中で三項演算子を使用し、解析エラーを物理的に回避
  return (
    status === "loading" || !realStats ? (
      <div className="min-h-screen bg-void flex items-center justify-center">
         <div className="text-[10px] tracking-[1em] uppercase opacity-20 animate-pulse text-white">Synchronizing</div>
      </div>
    ) : (
      <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
        <header className="mb-12 flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-3xl tracking-[0.4em] uppercase font-extralight mb-2 text-white">Member Hub</h1>
            <div className="flex items-center gap-4 text-azure-400 text-[9px] tracking-[0.3em] font-bold uppercase italic">
              <ShieldCheck size={12} /> {realStats.equipped?.title || "ASSOCIATE"}
            </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Credit Balance</p>
             <p className="text-2xl font-extralight tracking-[0.1em] text-white">{Number(realStats.rt_balance).toLocaleString()} <span className="text-xs opacity-20">CP</span></p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <IdentityReflection user={{
              name: realStats.name || session?.user?.name || "ARCHITECT",
              reading: realStats.handle,
              slug: realStats.slug,
              logo_url: realStats.logo_url,
              photo_url: realStats.photo_url,
              profile: realStats.profile,
              equipped: realStats.equipped
            }} onUpdate={fetchData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
                  <div>
                     <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white">Scan Card</h2>
                     <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400/60">名刺スキャン</p>
                  </div>
                  <Camera size={32} className="opacity-20 group-hover:opacity-60 transition-all text-white" />
               </Link>
               <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
                  <div>
                     <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white">My Archive</h2>
                     <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-bronze-400/60">名刺帳・人脈管理</p>
                  </div>
                  <Book size={32} className="opacity-20 group-hover:opacity-60 transition-all text-white" />
               </Link>
            </div>

            <section className="space-y-6">
               <div className="flex justify-between items-end border-b border-white/5 pb-4 text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic text-white">
                  <h2>Network Constellation / 人脈の星図</h2>
                  <Link href="/library" className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 text-white">Open Archive</Link>
               </div>
               <ConstellationView contacts={contacts} />
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-12">
             <div className="p-1 bg-gradient-to-b from-white/5 to-transparent">
                <div className="mb-6 opacity-30 px-4 text-[9px] tracking-[0.4em] uppercase font-bold text-white">
                   <p>Monthly Insight</p>
                   <p className="text-[7px] tracking-[0.2em] mt-1 text-white">分析レポート</p>
                </div>
                <MonthlyReport />
             </div>
             <section className="space-y-6 px-4">
               <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic text-white">Recent Connections</h2>
               <div className="space-y-3">
                  {contacts.slice(0, 5).map((c) => (
                     <div key={c.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 border border-white/10 rounded-full flex items-center justify-center text-[8px] opacity-40 uppercase text-white">{c.name[0]}</div>
                           <p className="text-[10px] tracking-widest uppercase opacity-60 truncate max-w-[150px] text-white">{c.name}</p>
                        </div>
                        <ChevronRight size={12} className="opacity-20 text-white" />
                     </div>
                  ))}
               </div>
             </section>
          </aside>
        </div>
      </div>
    )
  );
}
