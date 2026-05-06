"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Book, Sparkles, Trophy, Music2, Volume2, VolumeX, Shield, Bell, HelpCircle, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { ambientManager } from "@/lib/audio/ambient";
import { useToast } from "@/components/ui/ResonanceToast";

export default function ResidentAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"portal" | "notices" | "help">("portal");
  const [hasDaily, setHasDaily] = useState(false);
  const [ambientMode, setAmbientMode] = useState<"off" | "space" | "rain">("off");
  const [userExp, setUserExp] = useState(0);
  const [rtBalance, setRtBalance] = useState("0");
  const { showToast } = useToast();
  
  const level = Math.min(30, Math.floor(Math.sqrt(userExp / 10)) + 1);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/user/status");
      if (res.ok) {
        const data = await res.json();
        setUserExp(Number(data.exp));
        setRtBalance(data.rt_balance);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    ambientManager.init();
    fetchStatus();
    window.addEventListener("rt-grace-received", fetchStatus);
    window.addEventListener("hxc-assets-updated", fetchStatus);
    return () => {
      window.removeEventListener("rt-grace-received", fetchStatus);
      window.removeEventListener("hxc-assets-updated", fetchStatus);
    };
  }, []);

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
      const res = await fetch("/api/user/daily-bonus", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setHasDaily(true);
        showToast(`Grace Received / 聖域の恩寵を受信 (+${data.amount} RT)`, "success");
        window.dispatchEvent(new CustomEvent("rt-grace-received"));
      }
    } catch (e) { console.error(e); }
  };

  const helpItems = [
    { q: "名刺の作り方は？", a: "左上のメニューから「Profile Edit」を選んでください。名前、ロゴ、顔写真などを設定して「Commit」を押せば完成です。" },
    { q: "RTを貯めるには？", a: "毎日天使に話しかけて「Daily Light」を受け取るか、新しい名刺交換（スキャン）を行うことで貯めることができます。" },
    { q: "縦型と横型はどう変える？", a: "編集画面や宝物庫のプレビュー右上にあるアイコンで、いつでも切り替えが可能です。" },
    { q: "公式サポート", a: "不具合やご要望は、公式サポート（support@hexa-card.io）までご連絡ください。" },
  ];

  const notices = [
    { date: "2024.05.07", title: "Identity Synchronization Logic Updated", tag: "System" },
    { date: "2024.05.01", title: "New Asset: Imperial Gold Frame Released", tag: "Asset" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[500]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
            className="mb-6 w-[360px] bg-void/90 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col h-[520px] rounded-sm"
          >
            {/* Header: Angel Identity */}
            <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[11px] tracking-[0.5em] uppercase text-white mb-1">Concierge Angel</h3>
                    <p className="text-[8px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400">聖域の案内人 / {stage.name}</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="opacity-20 hover:opacity-100 transition-opacity"><X size={18}/></button>
               </div>
               
               {/* Evolution Bar */}
               <div className="space-y-2">
                  <div className="flex justify-between text-[7px] tracking-widest uppercase opacity-40">
                    <span>Resonance Level {level}</span>
                    <span>{userExp} EXP</span>
                  </div>
                  <div className="h-[1px] w-full bg-white/10">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(100, (userExp % 100))}%` }} 
                      className="h-full bg-azure-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    />
                  </div>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/5 bg-black/20">
               {[
                 { id: "portal", label: "Portal", icon: Shield },
                 { id: "notices", label: "Annals", icon: Bell },
                 { id: "help", label: "Scripture", icon: HelpCircle },
               ].map((tab) => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all border-b ${activeTab === tab.id ? "border-azure-500 bg-azure-500/5 opacity-100" : "border-transparent opacity-20 hover:opacity-50"}`}
                 >
                   <tab.icon size={14} className={activeTab === tab.id ? "text-azure-400" : ""} />
                   <span className="text-[7px] tracking-[0.3em] uppercase font-bold">{tab.label}</span>
                 </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              <AnimatePresence mode="wait">
                {activeTab === "portal" && (
                  <motion.div key="portal" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] tracking-widest leading-relaxed opacity-60 italic">
                        &quot;主（あるじ）よ、本日の聖域の状態をお伝えします。深淵との接続は安定しており、あなたの存在は確実に刻まれています。&quot;
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                            <p className="text-[7px] opacity-40 uppercase tracking-widest mb-1">Energy Balance</p>
                            <p className="text-sm font-light tracking-widest text-white">{Number(rtBalance).toLocaleString()} <span className="text-[8px] opacity-20">RT</span></p>
                         </div>
                         <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                            <p className="text-[7px] opacity-40 uppercase tracking-widest mb-1">Identity Rank</p>
                            <p className="text-sm font-light tracking-widest text-azure-400 uppercase italic">Initiate</p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2">Sacred Actions</p>
                      {!hasDaily && (
                        <button onClick={collectDaily} className="w-full p-4 bg-white text-void flex items-center justify-between group transition-all hover:bg-azure-50">
                           <div className="flex items-center gap-3">
                              <Sparkles size={14}/>
                              <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Daily Light / 恩寵を受け取る</span>
                           </div>
                           <ChevronRight size={14}/>
                        </button>
                      )}
                      <Link href="/inventory" onClick={() => setIsOpen(false)} className="w-full p-4 bg-white/5 border border-white/10 flex items-center justify-between group transition-all hover:border-white/30">
                         <div className="flex items-center gap-3">
                            <Trophy size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] tracking-[0.2em] uppercase">Treasury / 宝物庫を覗く</span>
                         </div>
                         <ChevronRight size={14} className="opacity-20"/>
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2">Atmosphere Control</p>
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
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2">Archives / お知らせ</p>
                    {notices.map((n, i) => (
                      <div key={i} className="p-4 border border-white/5 bg-white/[0.01] space-y-2 group hover:border-white/20 transition-all cursor-default">
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] font-mono opacity-30">{n.date}</span>
                          <span className="text-[6px] px-1.5 py-0.5 border border-azure-500/30 text-azure-400 uppercase tracking-widest">{n.tag}</span>
                        </div>
                        <p className="text-[10px] tracking-widest text-white leading-relaxed group-hover:text-azure-400 transition-colors">{n.title}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "help" && (
                  <motion.div key="help" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 font-bold border-b border-white/5 pb-2">Sacred FAQ / ヘルプ</p>
                    {helpItems.map((item, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-[9px] font-bold tracking-widest text-white flex items-center gap-2 uppercase">
                          <span className="w-1 h-1 bg-azure-500 rounded-full" /> {item.q}
                        </p>
                        <p className="text-[9px] tracking-widest leading-relaxed opacity-50 pl-3 border-l border-white/10 uppercase italic">
                          {item.a}
                        </p>
                      </div>
                    ))}
                    <div className="pt-4 mt-8 border-t border-white/5">
                       <p className="text-[7px] tracking-[0.2em] opacity-30 uppercase text-center">
                          Further questions? Reach out to the architects.<br/>
                          (support@hexa-card.io)
                       </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Trigger Button (The Angel) */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative group w-16 h-16 flex items-center justify-center">
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
          
          {/* 1. Base Glow: Scaled back for Minimal/Chic */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.05, 0.15, 0.05] 
            }} 
            transition={{ duration: 5, repeat: Infinity }} 
            className={`absolute -inset-8 rounded-full blur-2xl pointer-events-none ${level >= 20 ? 'bg-orange-400' : level >= 10 ? 'bg-azure-400' : 'bg-white'}`} 
          />

          {/* 2. Visual Evolution: Orbital Rings */}
          {/* Stage 1+ (Guardian): Single Thin Ring */}
          {level >= 10 && (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
              className="absolute -inset-4 border border-white/10 rounded-full border-dashed" 
            />
          )}

          {/* Stage 2+ (Archangel): Double Ring & Subtle Pulse */}
          {level >= 20 && (
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
              className="absolute -inset-6 border border-white/5 rounded-full" 
            />
          )}

          {/* Stage 3 (Seraph): Sacred Geometry Fragment */}
          {level >= 30 && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }} 
              transition={{ duration: 3, repeat: Infinity }} 
              className="absolute -inset-10 border-[0.5px] border-azure-400/20 rounded-full"
            />
          )}
          
          {/* The Core Orb: More solid, less blurry */}
          <div className={`w-6 h-6 bg-gradient-to-b ${level >= 30 ? 'from-rose-100 to-rose-500' : level >= 20 ? 'from-orange-100 to-orange-500' : level >= 10 ? 'from-azure-100 to-azure-500' : 'from-white to-zinc-400'} rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md relative z-10 shadow-sm`}>
             <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          </div>
          
          {/* Halo part: Subtle and sharp */}
          <motion.div 
            animate={{ 
              opacity: level >= 10 ? [0.4, 0.8, 0.4] : 0, 
              y: level >= 20 ? [-18, -20, -18] : -16 
            }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-[0.5px] bg-white shadow-[0_0_5px_white]" 
          />
        </motion.div>
      </button>
    </div>
  );
}

