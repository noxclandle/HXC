"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, Book, ShieldCheck, ChevronRight, Newspaper, Sparkles, Smartphone } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import MonthlyReport from "@/components/ui/MonthlyReport";
import IdentityReflection from "@/components/ui/IdentityReflection";
import GeometricAngel from "@/components/ui/GeometricAngel";
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
  const [greeting, setGreeting] = useState("");

  const isBonusAvailable = !realStats?.last_daily_at || new Date(realStats.last_daily_at).toDateString() !== new Date().toDateString();

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, newsRes] = await Promise.all([
        fetch("/api/user/status", { cache: "no-store" }),
        fetch("/api/news", { cache: "no-store" })
      ]);
      if (statusRes.ok) {
        const data = await statusRes.json();
        
        // 画像が巨大な場合の非同期取得
        if (data.photo_url === "IMAGE_LARGE") {
          fetch("/api/user/resource?type=photo").then(res => res.json()).then(res => {
            if (res.data) setRealStatus((prev: any) => ({ ...prev, photo_url: res.data }));
          });
        }
        if (data.logo_url === "IMAGE_LARGE") {
          fetch("/api/user/resource?type=logo").then(res => res.json()).then(res => {
            if (res.data) setRealStatus((prev: any) => ({ ...prev, logo_url: res.data }));
          });
        }
        
        setRealStatus((prev: any) => ({ ...prev, ...data, 
          photo_url: data.photo_url === "IMAGE_LARGE" ? prev?.photo_url : data.photo_url,
          logo_url: data.logo_url === "IMAGE_LARGE" ? prev?.logo_url : data.logo_url
        }));
      }
      if (newsRes.ok) {
        const nData = await newsRes.json();
        if (nData.length > 0) setLatestNews(nData[0]);
      }
    } catch (err) { 
      console.error(err);
      showToast("Sync Failed / 同期エラー", "error");
    }
  }, [showToast]);

  // 初回読み込み時の画像処理
  useEffect(() => {
    if (initialStats.photo_url === "IMAGE_LARGE") {
      fetch("/api/user/resource?type=photo").then(res => res.json()).then(res => {
        if (res.data) setRealStatus((prev: any) => ({ ...prev, photo_url: res.data }));
      });
    }
    if (initialStats.logo_url === "IMAGE_LARGE") {
      fetch("/api/user/resource?type=logo").then(res => res.json()).then(res => {
        if (res.data) setRealStatus((prev: any) => ({ ...prev, logo_url: res.data }));
      });
    }
  }, [initialStats.logo_url, initialStats.photo_url]);

  const handleConnection = async () => {
    setIsResonating(true);
    setMood('excited');
    
    try {
      const res = await fetch("/api/user/daily-resonance", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        await fetchData();
        showToast("Bonus Received / 報酬受取完了", "success");
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([15]); // 高級感のある短い振動
        }
        setTimeout(() => {
          setMood('stable');
          setIsResonating(false);
        }, 3000);
      } else {
        if (data.error === "Already resonated today.") {
          showToast("Already Received / 本日は受取済みです", "info");
        } else {
          showToast("Bonus Failed / 受取失敗", "error");
        }
        setMood('unstable');
        setTimeout(() => {
          setMood('stable');
          setIsResonating(false);
        }, 3000);
      }
    } catch (e) {
      setMood('unstable');
      setIsResonating(false);
      showToast("Bonus Failed / 受取失敗", "error");
    }
  };

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hxc-guide-seen");
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    const handleUpdate = () => fetchData();
    window.addEventListener("hxc-assets-updated", handleUpdate);
    return () => window.removeEventListener("hxc-assets-updated", handleUpdate);
  }, [fetchData]);

  useEffect(() => {
    if (isBonusAvailable) {
      setGreeting("Awaiting daily bonus");
    } else {
      const hour = new Date().getHours();
      if (hour < 5) setGreeting("静かな夜ですね。");
      else if (hour < 11) setGreeting("おはようございます。");
      else if (hour < 17) setGreeting("こんにちは。");
      else setGreeting("こんばんは。");
    }
  }, [isBonusAvailable]);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hxc-guide-seen", "true");
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative text-moonlight">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.4em] uppercase font-extralight mb-2 text-white">Home</h1>
          <p className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-40">My Page</p>
        </div>
        <div className="flex items-start gap-8 w-full md:w-auto justify-between md:justify-end">
           <div className="text-left md:text-right flex flex-col items-start md:items-end w-full">
              <div className="mb-4 px-3 py-1.5 border border-azure-500/30 bg-azure-500/[0.05] text-azure-400 text-[8px] tracking-[0.4em] font-bold uppercase flex items-center gap-2">
                 <ShieldCheck size={10} /> {realStats?.equipped?.title || "ASSOCIATE"}
              </div>
              
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 mb-1">Relation Token</p>
              <div className="flex items-center justify-start md:justify-end gap-4">
                 <p className="text-2xl font-extralight tracking-[0.1em] text-white">{Number(realStats?.rt_balance || 0).toLocaleString()} <span className="text-xs opacity-20">RT</span></p>
                 <Link href="/charge" className="px-2 py-1 border border-azure-500/30 bg-azure-500/5 text-azure-400 text-[7px] tracking-[0.2em] font-bold uppercase hover:bg-azure-500/10 transition-all">
                    Charge / RT購入
                 </Link>
              </div>
              <div className="mt-2 flex justify-start md:justify-end items-center gap-2 opacity-40">
                 <span className="text-[7px] uppercase tracking-widest font-bold">Total EXP</span>
                 <span className="text-[10px] font-mono tracking-tighter text-white">
                   {Number(realStats?.exp || 0).toLocaleString()} / {Number(realStats?.exp_max || 1000).toLocaleString()}
                 </span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
             <Link href="/scan" className="group p-8 border border-azure-500/20 bg-azure-500/[0.03] hover:bg-azure-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white opacity-90 group-hover:opacity-100">Scan Card</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-bold text-azure-300 group-hover:opacity-100">紙名刺をスキャンする</p>
                </div>
                <Camera size={32} className="opacity-30 group-hover:opacity-80 transition-all text-white" />
             </Link>
             <Link href="/library" className="group p-8 border border-bronze-500/20 bg-bronze-500/[0.03] hover:bg-bronze-500/[0.06] transition-all flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-bronze-500/40" />
                <div>
                   <h2 className="text-xl tracking-[0.4em] uppercase font-light mb-1 text-white opacity-90 group-hover:opacity-100">Contacts</h2>
                   <p className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-bold text-bronze-300 group-hover:opacity-100">名刺帳・ライブラリ</p>
                </div>
                < Book size={32} className="opacity-30 group-hover:opacity-80 transition-all text-white" />
             </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-12">
           {/* Geometric Angel & Connection Section */}
           <div className="p-8 border border-white/5 bg-white/[0.02] flex flex-col items-center text-center space-y-6 relative overflow-hidden group min-h-[400px] justify-center">
              <div className="absolute inset-0 bg-azure-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <AnimatePresence mode="wait">
                {showGuide ? (
                  <motion.div 
                    key="guide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 relative z-20"
                  >
                    <div className="text-[10px] tracking-[0.4em] text-azure-400 font-bold uppercase mb-4">Initial Guidance</div>
                    <p className="text-[11px] leading-relaxed tracking-widest text-white/70 uppercase">
                      ようこそ、Hexa Relationへ。<br />
                      貴方のページが作成されました。<br />
                      「Daily Bonus」で報酬を受け取り、<br />
                      「Scan Card」で人脈を広げましょう。
                    </p>
                    <button 
                      onClick={closeGuide}
                      className="px-8 py-2 border border-white/20 text-[9px] tracking-[0.3em] uppercase hover:bg-white/10 transition-all"
                    >
                      Understood
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="angel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center space-y-6 w-full"
                  >
                    <div className="opacity-30 text-[8px] tracking-[0.5em] uppercase font-bold mb-2 relative z-10 flex items-center gap-2">
                       Concierge
                       {latestNews && (
                         <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                       )}
                    </div>
                    <div className="relative z-10 py-4">
                      <GeometricAngel level={Math.floor(Math.sqrt(Number(realStats?.exp || 0) / 10)) + 1} mood={mood} size={180} />
                      
                      {/* Speech Bubble for News/Alerts */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute -top-4 -right-12 bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-tr-xl rounded-bl-xl max-w-[140px] shadow-2xl pointer-events-none"
                      >
                         <p className="text-[7px] uppercase tracking-widest text-azure-400 font-bold mb-1 italic">Notice</p>
                         <p className="text-[9px] leading-tight text-white/80 line-clamp-2">
                           {latestNews ? latestNews.title : greeting}
                         </p>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2 relative z-10 w-full min-h-[80px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {isBonusAvailable ? (
                          <motion.div
                            key="bonus-active"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                          >
                            <p className="text-[10px] tracking-widest opacity-40 uppercase">
                              {mood === 'excited' ? 'Bonus active' : mood === 'unstable' ? 'Connection weak' : 'Awaiting daily bonus'}
                            </p>

                            <motion.button 
                              onClick={handleConnection}
                              disabled={isResonating}
                              className={`mt-2 px-10 py-3 border text-[9px] tracking-[0.4em] uppercase transition-all flex items-center gap-3 mx-auto ${
                                isResonating 
                                  ? 'border-white/10 text-white/20' 
                                  : 'border-white/20 text-white hover:bg-white/5 hover:border-white shadow-lg'
                              }`}
                            >
                              <Sparkles size={12} className={isResonating ? 'animate-spin' : ''} />
                              {isResonating ? 'Loading...' : 'Daily Bonus'}
                            </motion.button>
                          </motion.div>
                        ) : (
                           <motion.div
                             key="bonus-claimed"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="space-y-1"
                           >
                             <p className="text-[8px] tracking-[0.5em] uppercase font-bold opacity-20">
                               Connection Stable
                             </p>
                             <p className="text-[7px] tracking-[0.3em] uppercase opacity-10 font-medium">
                               Bonus already claimed
                             </p>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <div className="p-1 bg-gradient-to-b from-white/5 to-transparent">
              <div className="mb-6 opacity-30 px-4 text-[9px] tracking-[0.4em] uppercase font-bold text-white">
                 <p>Monthly Insight</p>
                 <p className="text-[7px] tracking-[0.2em] mt-1 text-white">分析レポート</p>
              </div>
              <MonthlyReport stats={realStats} />
           </div>
          </aside>
        </div>
    </div>
  );
}
