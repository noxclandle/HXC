"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Book, Camera, Zap, UserPlus, Info, Sparkles, Trophy, Music2, Volume2, VolumeX, Send } from "lucide-react";
import Link from "next/link";
import { ambientManager } from "@/lib/audio/ambient";
import { useToast } from "@/components/ui/ResonanceToast";

export default function ResidentAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "chat">("menu");
  const [activeMessage, setActiveMessage] = useState("ご用件はありますか？聖域の各機能についてご案内いたします。");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [hasDaily, setHasDaily] = useState(false);
  const [ambientMode, setAmbientMode] = useState<"off" | "space" | "rain">("off");
  const [userExp, setUserExp] = useState(0);
  const { showToast } = useToast();
  
  const level = Math.floor(Math.sqrt(userExp / 10)) + 1; // 10, 40, 90, 160... でレベルアップ

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/user/status");
      if (res.ok) {
        const data = await res.json();
        setUserExp(Number(data.exp));
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
      setActiveMessage("【沈黙】聖域が静寂に包まれました。");
    } else {
      ambientManager.init();
      if (type === "space") ambientManager.playSpaceHum();
      else ambientManager.playRain();
      ambientManager.setVolume(0.12);
      setAmbientMode(type);
      setActiveMessage(`【共鳴】${type === 'space' ? '宇宙の鳴動' : '浄化の雨'}が聖域を満たします。`);
    }
  };

  const collectDaily = async () => {
    try {
      const res = await fetch("/api/user/daily-bonus", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActiveMessage(`【聖域の光】${data.amount} RT を授かりました。大切にお使いください。`);
        setHasDaily(true);
        showToast(`Grace Received / 聖域の恩寵を受信 (+${data.amount} RT)`);
        window.dispatchEvent(new CustomEvent("rt-grace-received"));
      } else {
        setActiveMessage(data.message);
      }
    } catch (e) { console.error(e); }
  };

  const handleSendChat = () => {
    if (!inputText.trim()) return;
    const newMsg = { role: "user", text: inputText };
    setMessages([...messages, newMsg]);
    setInputText("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "agent", text: "主（あるじ）よ、その言葉は聖域の深淵へと刻まれました。解析には時間を要します。" }]);
    }, 1000);
  };

  const getEvolvedMessage = (baseMsg: string, level: number) => {
    if (level >= 30) return `${baseMsg} 究極の魂を持つ主よ、あなたの望むままに。`;
    if (level >= 20) return `${baseMsg} 主よ、次なる一手をお導きいたします。`;
    if (level >= 10) return `${baseMsg} 聖域の住民として、あなたの歩みをお助けいたしましょう。`;
    return baseMsg;
  };

  const helpMenu = [
    { label: "Daily Light", icon: <Sparkles size={14}/>, action: collectDaily, condition: !hasDaily },
    { label: "Treasury", icon: <Trophy size={14}/>, link: "/inventory", sub: "宝物庫" },
    { label: "How to Use", icon: <Info size={14}/>, action: () => setMode("chat"), sub: "使いかた" },
  ];

  const supportFaqs = [
    { q: "名刺の作り方は？", a: "左上のメニューから「Profile Edit」を選んでください。名前、ロゴ、顔写真などを設定して「Commit」を押せば完成です。" },
    { q: "RTを貯めるには？", a: "毎日天使に話しかけて「Daily Light」を受け取るか、新しい名刺交換（スキャン）を行うことで貯めることができます。" },
    { q: "縦型と横型はどう変える？", a: "編集画面や宝物庫のプレビュー右上にあるアイコンで、いつでも切り替えが可能です。" },
    { q: "管理者に問い合わせたい", a: "不具合やご要望は、公式サポート（support@hexa-card.io）までお気軽にご連絡ください。" },
  ];

  const handleFaqClick = (faq: { q: string, a: string }) => {
    setMessages(prev => [
      ...prev, 
      { role: "user", text: faq.q },
      { role: "agent", text: faq.a }
    ]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="mb-4 w-80 bg-void/95 border border-yellow-500/20 shadow-2xl backdrop-blur-xl overflow-hidden p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center opacity-40">
                  <span className="text-[10px] tracking-[0.4em] uppercase italic flex items-center gap-2 text-yellow-400"><Info size={12}/> Concierge / Help</span>
                  <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors"><X size={14}/></button>
               </div>

               {/* Sacred Evolution Progress */}
               <div className="p-3 bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex justify-between items-end">
                     <span className={`text-[8px] uppercase tracking-widest font-bold ${stage.color}`}>{stage.name} <span className="opacity-40 text-white">/ Stage {level}</span></span>
                     <span className="text-[7px] opacity-30 font-mono">{userExp} EXP</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (userExp % 100) / 100 * 100)}%` }}
                        className={`h-full bg-gradient-to-r from-transparent to-white/40`}
                     />
                  </div>
               </div>
            </div>
            <div className="h-80 overflow-y-auto space-y-4 text-[11px] tracking-widest leading-relaxed text-moonlight pr-2 custom-scrollbar">
              {mode === "menu" ? (
                <div className="space-y-6">
                  <p className="italic">&quot;{activeMessage}&quot;</p>
                  <div className="p-4 border border-yellow-500/10 bg-white/[0.02] space-y-4">
                     <div className="flex justify-between items-center opacity-40">
                        <span className="text-[8px] uppercase tracking-[0.4em] flex items-center gap-2 text-yellow-500">
                           <Music2 size={12}/> Sanctuary Atmosphere
                        </span>
                        <div className="flex gap-4">
                           <button onClick={() => toggleAmbient("space")} className={`transition-all ${ambientMode === 'space' ? 'text-yellow-400 opacity-100' : 'opacity-20 hover:opacity-100'}`}><Zap size={14}/></button>
                           <button onClick={() => toggleAmbient("rain")} className={`transition-all ${ambientMode === 'rain' ? 'text-yellow-400 opacity-100' : 'opacity-20 hover:opacity-100'}`}><Volume2 size={14}/></button>
                           <button onClick={() => { ambientManager.setVolume(0); setAmbientMode("off"); }} className="opacity-20 hover:opacity-100 transition-opacity"><VolumeX size={14}/></button>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {helpMenu.filter(item => item.condition !== false).map((item) => (
                      item.link ? (
                        <Link key={item.label} href={item.link} onClick={() => setIsOpen(false)} className="w-full p-4 bg-gothic-dark border border-moonlight/5 text-[9px] tracking-[0.3em] uppercase text-left hover:border-yellow-500/30 hover:bg-white/5 transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-4"><span className="opacity-20 group-hover:opacity-100 transition-opacity text-yellow-400">{item.icon}</span>{item.label}</div>
                          <span className="text-[7px] opacity-20 uppercase">{item.sub}</span>
                        </Link>
                      ) : (
                        <button key={item.label} onClick={() => item.action && item.action()} className="w-full p-4 bg-gothic-dark border border-moonlight/5 text-[9px] tracking-[0.3em] uppercase text-left hover:border-yellow-500/30 hover:bg-white/5 transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-4"><span className="opacity-20 group-hover:opacity-100 transition-opacity text-yellow-400">{item.icon}</span>{item.label}</div>
                          <span className="text-[7px] opacity-20 uppercase">{item.sub}</span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full space-y-6">
                   <div className="space-y-2">
                     <p className="opacity-40 text-[9px] uppercase tracking-[0.2em] mb-4">FAQ / よくある質問</p>
                     {supportFaqs.map((faq, i) => (
                       <button key={i} onClick={() => handleFaqClick(faq)} className="w-full p-3 bg-white/[0.02] border border-white/5 text-left text-[9px] hover:border-yellow-500/40 transition-all">
                         Q: {faq.q}
                       </button>
                     ))}
                   </div>

                   <div className="flex-1 space-y-4 min-h-[100px] border-t border-white/5 pt-4">
                     {messages.map((m, i) => (
                       <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                         <div className={`max-w-[85%] p-3 ${m.role === "user" ? "bg-yellow-500 text-void font-bold" : "bg-white/[0.05] border border-white/5"}`}>{m.text}</div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="pt-4 border-t border-white/5">
                     <button onClick={() => setMode("menu")} className="w-full p-2 text-[8px] opacity-40 uppercase tracking-widest hover:opacity-100">Back to Menu</button>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="relative group w-16 h-16 flex items-center justify-center">
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
          {/* 天使の輝き: 進化段階に応じた光 */}
          <motion.div animate={{ rotate: [-10, 10, -10], scale: [1.2, 1.5, 1.2], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className={`absolute -inset-10 bg-white rounded-full blur-2xl pointer-events-none ${stage.glow}`} />
          <motion.div animate={{ rotate: [10, -10, 10], scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-6 border-2 border-white rounded-full blur-lg pointer-events-none" />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className={`absolute -inset-12 rounded-full blur-3xl pointer-events-none ${level >= 20 ? 'bg-orange-400' : level >= 10 ? 'bg-azure-400' : 'bg-yellow-400'}`} />
          
          <div className={`w-8 h-8 bg-gradient-to-b ${level >= 30 ? 'from-rose-200 via-rose-400 to-rose-600' : level >= 20 ? 'from-orange-200 via-orange-400 to-orange-600' : level >= 10 ? 'from-azure-200 via-azure-400 to-azure-600' : 'from-yellow-200 via-yellow-400 to-yellow-600'} rounded-full border border-white/50 flex items-center justify-center backdrop-blur-md relative z-10`}>
             <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white] animate-pulse" />
          </div>
          
          {/* 進化に応じた追加パーツ */}
          {level >= 10 && <motion.div animate={{ opacity: [0.6, 1, 0.6], y: [-20, -25, -20], scaleX: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white shadow-[0_0_15px_white,0_0_30px_white]" />}
          {level >= 20 && <motion.div animate={{ opacity: [0.4, 0.8, 0.4], rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border border-white/20 rounded-full border-dashed" />}
          {level >= 30 && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-20 bg-rose-500/20 rounded-full blur-3xl" />}
        </motion.div>
      </button>
    </div>
  );
}
