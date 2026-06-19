"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, Book, ShieldCheck, ChevronRight, Newspaper, Sparkles, Smartphone, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import MonthlyReport from "@/components/ui/MonthlyReport";
import IdentityReflection from "@/components/ui/IdentityReflection";
import { useToast } from "@/components/ui/ConnectionToast";

export default function HubClientUI({ 
  initialStats, 
  initialNews 
}: { 
  initialStats: any, 
  initialNews: any 
}) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [realStats, setRealStatus] = useState(initialStats);
  const [latestNews, setLatestNews] = useState(initialNews);
  const [mood, setMood] = useState<'stable' | 'excited' | 'unstable'>('stable');
  const [isResonating, setIsResonating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBonusAvailable = !realStats?.last_daily_at || new Date(realStats.last_daily_at).toDateString() !== new Date().toDateString();

  const isNewMessage = latestNews && (!realStats?.last_read_news_at || new Date(latestNews.created_at) > new Date(realStats.last_read_news_at));

  const fetchData = useCallback(async () => {
    // 初回読み込み時はサーバーからのデータを既に使用しているためスキップ
    try {
      const [statusRes, newsRes] = await Promise.all([
        fetch("/api/user/status", { cache: "no-store" }),
        fetch("/api/news", { cache: "no-store" })
      ]);
      if (statusRes.ok) {
        const data = await statusRes.json();
        setRealStatus((prev: any) => ({ ...prev, ...data }));
      }
      if (newsRes.ok) {
        const nData = await newsRes.json();
        if (nData.length > 0) setLatestNews(nData[0]);
      }
    } catch (err) { 
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => fetchData();
    window.addEventListener("hxc-assets-updated", handleUpdate);
    return () => window.removeEventListener("hxc-assets-updated", handleUpdate);
  }, [fetchData]);

  const handleConnection = async () => {
    setIsResonating(true);
    setMood('excited');
    
    try {
      const res = await fetch("/api/user/daily-resonance", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        await fetchData();
        window.dispatchEvent(new CustomEvent("rt-grace-received"));
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
        
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([15]);
        }
        
        setMood('stable');
        setIsResonating(false);
      } else {
        if (data.error === "Already resonated today.") {
          await fetchData();
          setMood('stable');
        } else {
          // 詳細なエラーを表示するように変更
          const errorMsg = data.error || "Sync Failed / 境界との同期に失敗しました";
          const errorDetail = data.details ? ` / ${data.details}` : "";
          showToast(errorMsg + errorDetail, "error");
          setMood('unstable');
          // 一応データを再取得してみる
          await fetchData();
        }
        setIsResonating(false);
      }
    } catch (e: any) {
      setMood('unstable');
      setIsResonating(false);
      showToast(e.message || "Sync Failed / 境界との同期に失敗しました", "error");
      await fetchData();
    }
  };

  useEffect(() => {
    if (isBonusAvailable) {
      setGreeting("Awaiting daily bonus");
    } else if (realStats?.unread_messages > 0) {
      setGreeting(`観測局より報告：未読のメッセージが ${realStats.unread_messages} 件届いています。`);
    } else {
      const hour = new Date().getHours();
      if (hour < 5) setGreeting("静かな夜ですね。");
      else if (hour < 11) setGreeting("おはようございます。");
      else if (hour < 17) setGreeting("こんにちは。");
      else setGreeting("こんばんは。");
    }
  }, [isBonusAvailable, realStats?.unread_messages]);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hxc-guide-seen", "true");
  };

  const markAsRead = async () => {
    if (!latestNews) return;
    setBubbleDismissed(true);
    
    try {
      await fetch("/api/user/read-news", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsId: latestNews.id })
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto pt-24 px-6 opacity-0">
         <div className="h-10 w-64 bg-white/5 rounded-sm mb-12" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.4em] uppercase font-extralight mb-2 text-white">Atelier / アトリエ</h1>
          <p className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-40">Identity Control Hub / ホーム</p>
        </div>
        <div className="flex items-start gap-8 w-full md:w-auto justify-between md:justify-end">
           <div className="text-left md:text-right flex flex-col items-start md:items-end w-full">
              <div className="mb-4 px-3 py-1.5 border border-azure-500/30 bg-azure-500/[0.05] text-azure-400 text-[8px] tracking-[0.4em] font-bold uppercase flex items-center gap-2">
                 <ShieldCheck size={10} /> {realStats?.equipped?.title || "ASSOCIATE"}
              </div>
              
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Frequency Points / 所持ポイント</p>
              <div className="flex items-center justify-start md:justify-end gap-4">
                 <p className="text-2xl font-extralight tracking-[0.1em] text-white">
                   {mounted ? Number(realStats?.rt_balance || 0).toLocaleString() : realStats?.rt_balance || 0} <span className="text-xs opacity-20">RT</span>
                 </p>
                 <Link href="/charge" className="px-2 py-1 border border-azure-500/30 bg-azure-500/5 text-azure-400 text-[7px] tracking-[0.2em] font-bold uppercase hover:bg-azure-500/10 transition-all">
                    Purchase / 購入
                 </Link>
                 <Link href="/guide" className="p-1.5 border border-white/10 bg-white/5 text-white/40 hover:text-white transition-all ml-2" title="System Guide">
                    <Book size={12} />
                 </Link>
              </div>
              <div className="mt-2 flex justify-start md:justify-end items-center gap-2 opacity-40">
                 <span className="text-[7px] uppercase tracking-widest font-bold">Total EXP / 累計経験値</span>
                 <span className="text-[10px] font-mono tracking-tighter text-white">
                   {mounted ? Number(realStats?.exp || 0).toLocaleString() : realStats?.exp || 0} / {mounted ? Number(realStats?.exp_max || 1000).toLocaleString() : realStats?.exp_max || 1000}
                 </span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <IdentityReflection user={{
            name: realStats?.name || session?.user?.name || "MEMBER",
            reading: realStats?.handle,
            slug: realStats?.slug,
            logo_url: realStats?.logo_url,
            photo_url: realStats?.photo_url,
            profile: {
              ...realStats?.profile,
              website: realStats?.profile?.website || realStats?.link_website,
              link_x: realStats?.profile?.link_x || realStats?.link_x,
              link_instagram: realStats?.profile?.link_instagram || realStats?.link_instagram,
              link_line: realStats?.profile?.link_line || realStats?.link_line,
              link_facebook: realStats?.profile?.link_facebook || realStats?.link_facebook,
            },
            equipped: realStats?.equipped,
            bio: realStats?.profile?.bio
          }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
             <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white opacity-90 group-hover:opacity-100">Scan Card</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-bold text-azure-300 group-hover:opacity-100">名刺スキャン / OCR Scan</p>
                </div>
                <Camera size={32} className="opacity-30 group-hover:opacity-80 transition-all text-white" />
             </Link>
             <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white opacity-90 group-hover:opacity-100">Contacts</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-bold text-bronze-300 group-hover:opacity-100">名刺帳 / Library</p>
                </div>
                <Book size={32} className="opacity-30 group-hover:opacity-80 transition-all text-white" />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
             <Link href="/hub/background" className="group p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/20" />
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5">
                      <Smartphone size={24} className="opacity-40" />
                   </div>
                   <div>
                      <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white opacity-90 group-hover:opacity-100">Virtual Background</h2>
                      <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-white group-hover:opacity-100">商談用背景生成 / For Zoom & Meet</p>
                   </div>
                </div>
                <ChevronRight size={24} className="opacity-10 group-hover:opacity-40 transition-all" />
             </Link>

             <Link href="/documents" className="group p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5">
                      <Book size={24} className="opacity-40" />
                   </div>
                   <div>
                      <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white opacity-90 group-hover:opacity-100">Documents</h2>
                      <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase font-bold text-white group-hover:opacity-100">商談資料・実績管理 / Portfolio</p>
                   </div>
                </div>
                <ChevronRight size={24} className="opacity-10 group-hover:opacity-40 transition-all" />
             </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-12">
           <div className="p-1 bg-gradient-to-b from-white/5 to-transparent">
              <div className="mb-6 opacity-30 px-4 text-[9px] tracking-[0.4em] uppercase font-bold text-white">
                 <p>Monthly Report / 解析レポート</p>
                 <p className="text-[7px] tracking-[0.2em] mt-1 text-white">Access Analytics</p>
              </div>
              <MonthlyReport stats={realStats} />
           </div>

           <Link href="/guide" className="group flex items-center justify-between p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="flex items-center gap-4">
                 <HelpCircle size={20} className="opacity-20 group-hover:opacity-100 group-hover:text-azure-400 transition-all" />
                 <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/80">System Guide</p>
                    <p className="text-[7px] tracking-[0.1em] uppercase opacity-30 mt-0.5">How to utilize Hexa Relation</p>
                 </div>
              </div>
              <ChevronRight size={14} className="opacity-10 group-hover:opacity-100 transition-all" />
           </Link>
          </aside>
        </div>

        {/* Floating Daily Bonus Prompt */}
        <AnimatePresence>
          {isBonusAvailable && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed bottom-[92px] right-6 z-50 max-w-[220px]"
            >
              <div className="bg-void/95 backdrop-blur-md border border-azure-500/30 shadow-[0_8px_32px_rgba(59,130,246,0.2)] p-3.5 rounded-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-azure-500/5 animate-pulse pointer-events-none" />
                 <button onClick={async () => {
                   try {
                     const res = await fetch("/api/user/daily-bonus", { method: "POST" });
                     if (res.ok) {
                       showToast("デイリーボーナスを受け取りました / Received Daily Bonus", "success");
                       fetchData(); // Reload to update status and hide prompt
                     }
                   } catch(e) { console.error(e); }
                 }} className="relative z-10 text-left w-full">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles size={11} className="text-azure-400" />
                      <span className="text-[8px] tracking-[0.2em] font-bold uppercase text-azure-400">Daily Resonance</span>
                    </div>
                    <p className="text-[7.5px] tracking-wider opacity-60 uppercase mb-3 leading-relaxed font-sans">境界が安定しています。<br/>本日の共鳴（ボーナス）を受け取りますか？</p>
                    <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-white bg-white/10 text-center py-1.5 hover:bg-white/20 transition-colors rounded-full border border-white/5">
                      Receive 50 RT
                    </div>
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Announcement Detail Modal */}
        <AnimatePresence>
          {selectedNews && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNews(null)}
                className="absolute inset-0 bg-void/90 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-gothic-dark border border-white/10 p-8 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent" />
                
                <header className="mb-8">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-azure-400 bg-azure-500/10 px-2 py-1 border border-azure-500/20">
                         {selectedNews.category || "Announcement / お知らせ"}
                      </span>
                      <button onClick={() => setSelectedNews(null)} className="opacity-40 hover:opacity-100 transition-opacity">
                         <ChevronRight size={20} className="rotate-90" />
                      </button>
                   </div>
                   <h2 className="text-xl tracking-widest uppercase font-light text-white leading-relaxed">
                      {selectedNews.title}
                   </h2>
                   <div className="mt-2 text-[8px] tracking-widest opacity-20 uppercase font-mono">
                      Published: {new Date(selectedNews.created_at).toLocaleDateString()}
                   </div>
                </header>

                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                   <p className="text-xs leading-relaxed tracking-widest text-white/70 whitespace-pre-wrap">
                      {selectedNews.content}
                   </p>
                </div>

                <div className="mt-12 flex justify-end">
                   <button 
                     onClick={() => setSelectedNews(null)}
                     className="px-8 py-3 border border-white/10 text-[9px] tracking-[0.4em] hover:bg-white/5 transition-all text-white/40 hover:text-white"
                   >
                      Close / 閉じる
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
