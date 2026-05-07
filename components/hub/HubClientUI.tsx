"use client";

import { useState, useEffect } from "react";
import { Camera, Book, ShieldCheck, ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import MonthlyReport from "@/components/ui/MonthlyReport";
import ConstellationView from "@/components/ui/ConstellationView";
import IdentityReflection from "@/components/ui/IdentityReflection";

export default function HubClientUI({ 
  initialStats, 
  initialContacts, 
  initialNews 
}: { 
  initialStats: any, 
  initialContacts: any[], 
  initialNews: any 
}) {
  const { data: session } = useSession();
  const [realStats, setRealStatus] = useState(initialStats);
  const [contacts, setContacts] = useState(initialContacts);
  const [latestNews, setLatestNews] = useState(initialNews);

  const fetchData = async () => {
    try {
      const [statusRes, contactsRes, newsRes] = await Promise.all([
        fetch("/api/user/status", { cache: "no-store" }),
        fetch("/api/contacts/list", { cache: "no-store" }),
        fetch("/api/news", { cache: "no-store" })
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
      if (newsRes.ok) {
        const nData = await newsRes.json();
        if (nData.length > 0) setLatestNews(nData[0]);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    // 装備変更などのイベントを購読してデータを再取得する
    const handleUpdate = () => fetchData();
    window.addEventListener("hxc-assets-updated", handleUpdate);
    return () => window.removeEventListener("hxc-assets-updated", handleUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.4em] uppercase font-extralight mb-2 text-white">Member Hub</h1>
          <p className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-40">System Dashboard</p>
        </div>
        <div className="flex items-start gap-8 w-full md:w-auto justify-between md:justify-end">
           <div className="text-left md:text-right flex flex-col items-start md:items-end w-full">
              <div className="mb-4 px-3 py-1.5 border border-azure-500/30 bg-azure-500/[0.05] text-azure-400 text-[8px] tracking-[0.4em] font-bold uppercase flex items-center gap-2">
                 <ShieldCheck size={10} /> {realStats?.equipped?.title || "ASSOCIATE"}
              </div>
              
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Relation Token</p>
              <p className="text-2xl font-extralight tracking-[0.1em] text-white">{Number(realStats?.rt_balance || 0).toLocaleString()} <span className="text-xs opacity-20">RT</span></p>
              <div className="mt-2 flex justify-start md:justify-end items-center gap-2 opacity-40">
                 <span className="text-[7px] uppercase tracking-widest font-bold">Total EXP</span>
                 <span className="text-[10px] font-mono tracking-tighter text-white">{Number(realStats?.exp || 0).toLocaleString()}</span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <IdentityReflection user={{
            name: realStats?.name || session?.user?.name || "ARCHITECT",
            reading: realStats?.handle,
            slug: realStats?.slug,
            logo_url: realStats?.logo_url,
            photo_url: realStats?.photo_url,
            profile: realStats?.profile,
            equipped: realStats?.equipped,
            link_x: realStats?.profile?.link_x,
            link_instagram: realStats?.profile?.link_instagram,
            link_line: realStats?.profile?.link_line,
            link_facebook: realStats?.profile?.link_facebook,
            bio: realStats?.profile?.bio
          }} />

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

           {latestNews && (
             <section className="px-4 mt-12 border-t border-white/5 pt-8">
               <h2 className="text-[8px] tracking-[0.5em] uppercase opacity-30 font-bold flex items-center gap-2 mb-4 text-white">
                  <Newspaper size={10} />
                  System Broadcast
               </h2>
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <span className={`w-1 h-1 rounded-full ${
                        latestNews.type === 'alert' ? 'bg-rose-500' : 
                        latestNews.type === 'event' ? 'bg-amber-500' : 
                        'bg-azure-500'
                     }`} />
                     <p className="text-xs font-light tracking-widest text-white/80">{latestNews.title}</p>
                    </div>
                    <p className="text-[10px] tracking-wider opacity-40 line-clamp-2 leading-relaxed text-white">
                       {latestNews.content}
                    </p>
                    <p className="text-[8px] tracking-widest opacity-20 font-mono mt-2 text-white">
                       {new Date(latestNews.created_at).toLocaleDateString()}
                    </p>
                 </div>
               </section>
             )}
          </aside>
        </div>
    </div>
  );
}
