"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Book, Sparkles, Trophy, Music2, Volume2, VolumeX, Shield, Bell, HelpCircle, ChevronRight, Zap, Smartphone } from "lucide-react";
import Link from "next/link";
import { ambientManager } from "@/lib/audio/ambient";
import { useToast } from "@/components/ui/ConnectionToast";
import GeometricAngel from "@/components/ui/GeometricAngel";

export default function ResidentAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"portal" | "notices" | "help">("portal");
  const [hasDaily, setHasDaily] = useState(false);
  const [ambientMode, setAmbientMode] = useState<"off" | "space" | "rain">("off");
  const [userExp, setUserExp] = useState(0);
  const [rtBalance, setRtBalance] = useState("0");
  const [userRank, setUserRank] = useState("Member");
  const [userRole, setUserRole] = useState("member");
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);
  const [isSoulLinked, setIsSoulLinked] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const { showToast } = useToast();

  const [allNews, setAllNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  const fetchNews = async () => {
    setIsNewsLoading(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setAllNews(data);
      }
    } catch (e) { console.error(e); }
    finally { setIsNewsLoading(false); }
  };

  useEffect(() => {
    fetchNews();
  }, []);
  
  const latestNews = allNews && allNews.length > 0 ? allNews[0] : null;
  const isNewMessage = latestNews && (!lastReadAt || new Date(latestNews.created_at || 0) > new Date(lastReadAt));

  const markAsRead = async () => {
    if (!latestNews) return;
    setBubbleDismissed(true);
    try {
      await fetch("/api/user/read-news", { method: "POST" });
      fetchStatus();
    } catch (e) { console.error(e); }
  };

  const level = Math.min(30, Math.floor(Math.sqrt(userExp / 10)) + 1);

  const checkSoulLink = () => {
    if (typeof window !== "undefined") {
      setIsSoulLinked(!!localStorage.getItem("hxc_soul_fragment"));
    }
  };

  const bindDevice = async () => {
    try {
      const res = await fetch("/api/auth/bind-device", { method: "POST" });
      if (res.ok) {
        const { deviceToken } = await res.json();
        localStorage.setItem("hxc_soul_fragment", deviceToken);
        setIsSoulLinked(true);
        showToast("Soul-Link Established / 魂の同調を完了しました", "success");
      }
    } catch (e) { console.error(e); }
  };

  const checkDailyStatus = (lastDailyAt: string | null) => {
    if (!lastDailyAt) return false;
    const now = new Date();
    const lastDaily = new Date(lastDailyAt);
    return lastDaily.toDateString() === now.toDateString();
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/user/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUserExp(Number(data.exp));
        setRtBalance(data.rt_balance);
        setUserRank(data.rank || "Member");
        setUserRole(data.role || "member");
        setHasDaily(checkDailyStatus(data.last_daily_at));
        setLastReadAt(data.last_read_news_at);
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    ambientManager.init();
    fetchStatus();
    checkSoulLink();
    
    const handleStatusSync = () => fetchStatus();
    window.addEventListener("rt-grace-received", handleStatusSync);
    window.addEventListener("hxc-assets-updated", handleStatusSync);
    return () => {
      window.removeEventListener("rt-grace-received", handleStatusSync);
      window.removeEventListener("hxc-assets-updated", handleStatusSync);
    };
  }, [fetchStatus]);

  const getEvolutionStage = (lv: number) => {
    if (lv >= 30) return { name: "Seraph", color: "text-rose-400", glow: "shadow-[0_0_50px_rgba(255,255,255,0.8)]" };
    if (lv >= 20) return { name: "Archangel", color: "text-orange-400", glow: "shadow-[0_0_35px_rgba(255,255,255,0.6)]" };
    if (lv >= 10) return { name: "Guardian", color: "text-azure-400", glow: "shadow-[0_0_25px_rgba(255,255,255,0.4)]" };
    return { name: "Sentinel", color: "text-yellow-400", glow: "shadow-[0_0_15px_rgba(255,255,255,0.3)]" };
  };

  const stage = getEvolutionStage(level);

  const toggleAmbient = (type: "space" | "rain") => {
    if (ambientMode === type) {
      ambientManager.setVolume(0);
      setAmbientMode("off");
    } else {
      ambientManager.init();
      if (type === "space") ambientManager.playSpaceHum();
      else ambientManager.playRain();
      ambientManager.setVolume(0.12);
      setAmbientMode(type);
    }
  };

  const collectDaily = async () => {
    try {
      const res = await fetch("/api/user/daily-resonance", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        setHasDaily(true);
        setRtBalance(data.new_balance);
        showToast(`Resonance Success / 共鳴に成功 (+${data.added_rt} RT)`, "success");
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([20, 10, 20]);
        }
        window.dispatchEvent(new CustomEvent("rt-grace-received"));
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        if (data.error === "Already resonated today.") {
          setHasDaily(true);
        } else {
          showToast("Sync Failed / 境界との同期に失敗しました", "error");
        }
      }
    } catch (e) { 
      console.error(e);
      showToast("Network Error / 通信が不安定です", "error");
    }
  };

  const helpItems = [
    { q: "RT（Relation Token）とは？", a: "あなたの活動エネルギーであり、通貨です。アイテムの解禁や、高度な機能（AI分析等）の維持に使用されます。毎日ログインするか、名刺交換（スキャン）を成功させることで増加します。" },
    { q: "EXPとランクの関係は？", a: "RTを獲得するたびにEXP（経験値）が蓄積され、あなたの天使が進化します。ランクが上がると、解禁できるアイテムや権限が増えていきます。" },
    { q: "名刺の保存が反映されない", a: "編集画面で「Commit」を押さなくても自動保存されますが、確実に保存したい場合は、右上のSyncing表示が完了するまでお待ちください。電波が悪い場合はオフラインキャッシュ機能をご利用ください。" },
    { q: "物理カードの再発行・紛失", a: "管理者に問い合わせを行うか、設定画面からSoul-Linkを一時停止してください。" },
    { q: "管理パネルに入れない", a: "管理者権限が必要です。権限をお持ちの場合は、一度サインアウトしてから再度サインインし、Gate（入口）からアクセスしてください。" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[500]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
            className="mb-6 w-[360px] bg-void/90 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col h-[600px] rounded-sm text-left"
          >
            <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 relative flex flex-col items-center">
               <div className="flex justify-between items-start w-full mb-4">
                  <div>
                    <h3 className="text-[11px] tracking-[0.5em] uppercase text-white mb-1">Concierge</h3>
                    <p className="text-[8px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400">常駐コンシェルジュ</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="opacity-20 hover:opacity-100 transition-opacity"><X size={18}/></button>
               </div>
               
               <div className="py-4">
                  <GeometricAngel level={level} size={160} mood={activeTab === 'portal' ? 'stable' : 'excited'} />
               </div>

               <div className="space-y-2 w-full">
                  <div className="flex justify-between text-[7px] tracking-widest uppercase opacity-40">
                    <span>Rank Level {level}</span>
                    <span>{userExp.toLocaleString()} / {Math.max(1000, level * 200)} EXP</span>
                  </div>
                  <div className="h-[1px] w-full bg-white/10">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(100, (userExp / (level * 2)))}%` }} 
                      className="h-full bg-azure-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    />
                  </div>
               </div>
            </div>

            <div className="flex border-b border-white/5 bg-black/20">
               {[
                 { id: "portal", label: "Menu", icon: Shield },
                 { id: "notices", label: "News", icon: Bell },
                 { id: "help", label: "Support", icon: HelpCircle },
               ].map((tab) => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all border-b ${activeTab === tab.id ? "border-azure-500 bg-azure-500/5 opacity-100" : "border-transparent opacity-20 hover:opacity-50"}`}
                 >
                   <div className="relative">
                     <tab.icon size={14} className={activeTab === tab.id ? "text-azure-400" : ""} />
                     {tab.id === 'notices' && isNewMessage && (
                       <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                     )}
                   </div>
                   <span className="text-[7px] tracking-[0.3em] uppercase font-bold">{tab.label}</span>
                 </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              <AnimatePresence mode="wait">
                {activeTab === "portal" && (
                  <motion.div key="portal" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] tracking-widest leading-relaxed opacity-60">
                        &quot;ようこそ、主。こちらは貴方の活動をサポートする窓口です。何かお手伝いしましょうか？&quot;
                      </p>

                      {!isSoulLinked && (
                        <button onClick={bindDevice} className="w-full p-4 border border-azure-500/30 bg-azure-500/5 text-azure-400 flex flex-col items-center gap-2 group hover:bg-azure-500/10 transition-all">
                           <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Link This Device / この端末を紐付ける</span>
                           <span className="text-[7px] opacity-50 uppercase text-center">このiPhoneを貴方の正当な証として刻みます</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                         <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                            <p className="text-[7px] opacity-40 uppercase tracking-widest mb-1">Holding RT / 所持RT</p>
                            <p className="text-sm font-light tracking-widest text-white">{Number(rtBalance).toLocaleString()} <span className="text-[8px] opacity-20">RT</span></p>
                         </div>
                         <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                            <p className="text-[7px] opacity-40 uppercase tracking-widest mb-1">Rank</p>
                            <p className="text-sm font-light tracking-widest text-azure-400 uppercase italic">{userRank}</p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2">Menu</p>
                      
                      <AnimatePresence mode="wait">
                        {!hasDaily && (
                          <motion.button 
                            key="bonus-btn"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={collectDaily} 
                            className="w-full p-4 bg-white text-void flex items-center justify-between group transition-all hover:bg-azure-50 overflow-hidden"
                          >
                             <div className="flex items-center gap-3">
                                <Sparkles size={14}/>
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Daily Bonus / 報酬を受け取る</span>
                             </div>
                             <ChevronRight size={14}/>
                          </motion.button>
                        )}
                      </AnimatePresence>

                      <Link href="/inventory" onClick={() => setIsOpen(false)} className="w-full p-4 bg-white/5 border border-white/10 flex items-center justify-between group transition-all hover:border-white/30">
                         <div className="flex items-center gap-3">
                            <Trophy size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] tracking-[0.2em] uppercase">Shop & Items / アイテム・装備</span>
                         </div>
                         <ChevronRight size={14} className="opacity-20"/>
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2">BGM Control</p>
                      <div className="flex gap-2">
                        {[
                          { id: "space", icon: Zap, label: "Space" },
                          { id: "rain", icon: Volume2, label: "Rain" },
                        ].map((btn) => (
                          <button 
                            key={btn.id}
                            onClick={() => toggleAmbient(btn.id as any)}
                            className={`flex-1 p-3 border text-[8px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${ambientMode === btn.id ? "bg-azure-500/20 border-azure-500 text-azure-400" : "bg-white/5 border-white/5 opacity-40 hover:opacity-100"}`}
                          >
                            <btn.icon size={12}/> {btn.label}
                          </button>
                        ))}
                        <button onClick={() => { ambientManager.setVolume(0); setAmbientMode("off"); }} className="p-3 bg-white/5 border border-white/5 opacity-40 hover:opacity-100 transition-all">
                          <VolumeX size={12}/>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "notices" && (
                  <motion.div key="notices" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2 text-center">News Log / 更新記録</p>
                    
                    {isNewsLoading ? (
                      <div className="py-12 text-center text-[8px] uppercase tracking-widest opacity-20 animate-pulse">Synchronizing Records...</div>
                    ) : (allNews || []).length > 0 ? (
                      (allNews || []).map((n) => (
                        <button 
                          key={n.id} 
                          onClick={() => {
                            setSelectedNews(n);
                            if (n === latestNews) markAsRead();
                          }}
                          className="w-full p-4 border border-white/5 bg-white/[0.01] space-y-2 group hover:border-white/20 transition-all text-left block"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] font-mono opacity-30">{new Date(n.created_at || 0).toLocaleDateString()}</span>
                            <span className="text-[6px] px-1.5 py-0.5 border border-azure-500/30 text-azure-400 uppercase tracking-widest">{n.type || "System"}</span>
                          </div>
                          <p className="text-[10px] tracking-widest text-white leading-relaxed group-hover:text-azure-400 transition-colors truncate">{n.title}</p>
                        </button>
                      ))
                    ) : (
                      <div className="py-12 text-center text-[8px] uppercase tracking-widest opacity-20">No archives found.</div>
                    )}
                  </motion.div>
                )}

                {activeTab === "help" && (
                  <motion.div key="help" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2 text-center">Support / ヘルプ</p>
                    {helpItems.map((item, i) => (
                      <div key={i} className="space-y-2 text-left">
                        <p className="text-[9px] font-bold tracking-widest text-white flex items-center gap-2 uppercase">
                          <span className="w-1 h-1 bg-azure-500 rounded-full" /> {item.q}
                        </p>
                        <p className="text-[9px] tracking-widest leading-relaxed opacity-50 pl-3 border-l border-white/10 uppercase italic">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button onClick={() => setIsOpen(!isOpen)} className="relative group w-16 h-16 flex items-center justify-center">
        {isNewMessage && !bubbleDismissed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="absolute bottom-full right-0 mb-4 bg-void/90 backdrop-blur-md border border-white/10 p-3 rounded-tr-xl rounded-bl-xl max-w-[140px] shadow-2xl text-left pointer-events-none"
          >
             <p className="text-[7px] uppercase tracking-[0.2em] text-azure-400 font-bold mb-1 italic">Message Received</p>
             <p className="text-[9px] leading-tight text-white/80 line-clamp-2 font-medium">
               {latestNews.title}
             </p>
          </motion.div>
        )}

        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.05, 0.15, 0.05] 
            }} 
            transition={{ duration: 5, repeat: Infinity }} 
            className={`absolute -inset-8 rounded-full blur-2xl pointer-events-none ${level >= 20 ? 'bg-orange-400' : level >= 10 ? 'bg-azure-400' : 'bg-white'}`} 
          />
          
          <div className={`w-6 h-6 bg-gradient-to-b ${level >= 30 ? 'from-rose-100 to-rose-500' : level >= 20 ? 'from-orange-100 to-orange-500' : level >= 10 ? 'from-azure-100 to-azure-500' : 'from-white to-zinc-400'} rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md relative z-10 shadow-sm`}>
             <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
             {isNewMessage && (
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-void" />
             )}
          </div>
        </motion.div>
      </button>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNews(null)} className="absolute inset-0 bg-void/90 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl overflow-hidden rounded-sm"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent" />
              <header className="mb-6">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[7px] tracking-[0.4em] uppercase font-bold text-azure-400 bg-azure-500/10 px-2 py-1 border border-azure-500/20">{selectedNews.type || "Update"}</span>
                    <button onClick={() => setSelectedNews(null)} className="opacity-20 hover:opacity-100 transition-opacity"><X size={16}/></button>
                 </div>
                 <h2 className="text-sm tracking-widest uppercase font-light text-white leading-relaxed">{selectedNews.title}</h2>
                 <div className="mt-2 text-[7px] tracking-widest opacity-20 uppercase font-mono">{new Date(selectedNews.created_at).toLocaleDateString()}</div>
              </header>
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2 mb-8">
                 <p className="text-[10px] leading-relaxed tracking-widest text-white/70 whitespace-pre-wrap">{selectedNews.content}</p>
              </div>
              <div className="flex justify-end">
                 <button onClick={() => setSelectedNews(null)} className="px-6 py-2 border border-white/10 text-[8px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all text-white/40 hover:text-white">Close / 閉じる</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
