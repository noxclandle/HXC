"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Book, Camera, Zap, UserPlus, Info, Sparkles } from "lucide-react";

export default function ResidentAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "chat">("menu");
  const [activeMessage, setActiveMessage] = useState("ご用件はありますか？聖域の各機能についてご案内いたします。");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasDaily, setHasDaily] = useState(false);
  
  const userLevel = 12;

  const collectDaily = async () => {
    try {
      const res = await fetch("/api/user/daily-bonus", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActiveMessage(`【聖域の光】${data.amount} RT を授かりました。大切にお使いください。`);
        setHasDaily(true);
        window.dispatchEvent(new CustomEvent("rt-grace-received"));
      } else {
        setActiveMessage(data.message);
      }
    } catch (e) { console.error(e); }
  };

  const getEvolvedMessage = (baseMsg: string, level: number) => {
    if (level >= 30) return `${baseMsg} 究極の魂を持つ主よ、あなたの望むままに。`;
    if (level >= 20) return `${baseMsg} 主よ、次なる一手をお導きいたします。`;
    if (level >= 10) return `${baseMsg} 聖域の住民として、あなたの歩みをお助けいたしましょう。`;
    return baseMsg;
  };

  const helpMenu = [
    { label: "Daily Light", icon: <Sparkles size={14}/>, action: collectDaily, condition: !hasDaily },
    { label: "Scan Card", icon: <Camera size={14}/>, text: getEvolvedMessage("【スキャン】紙の名刺をデジタル化し、ビジネス価値を解析します。", userLevel) },
    { label: "My Archive", icon: <Book size={14}/>, text: getEvolvedMessage("【名刺帳】繋がった人脈は「座標」として記録されます。", userLevel) },
    { label: "About RT", icon: <Zap size={14}/>, text: getEvolvedMessage("【トークン】交流のエネルギーです。活動により蓄積されます。", userLevel) },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="mb-4 w-80 bg-void/95 border border-moonlight/20 shadow-2xl backdrop-blur-xl overflow-hidden p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[10px] tracking-[0.4em] uppercase italic flex items-center gap-2"><Info size={12}/> Concierge</span>
              <button onClick={() => { setMode("menu"); setIsOpen(false); }} className="hover:opacity-100 transition-opacity"><X size={14} /></button>
            </div>
            <div className="h-80 overflow-y-auto space-y-4 text-[11px] tracking-widest leading-relaxed text-moonlight">
              {mode === "menu" ? (
                <div className="space-y-6">
                  <p className="italic">&quot;{activeMessage}&quot;</p>
                  <div className="grid grid-cols-1 gap-2">
                    {helpMenu.filter(item => item.condition !== false).map((item) => (
                      <button 
                        key={item.label} 
                        onClick={() => item.action ? item.action() : setActiveMessage(item.text || "")} 
                        className="w-full p-4 bg-gothic-dark border border-moonlight/5 text-[9px] tracking-[0.3em] uppercase text-left hover:border-moonlight/30 hover:bg-white/5 transition-all flex items-center gap-4 group"
                      >
                        <span className="opacity-20 group-hover:opacity-100 transition-opacity">{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <button onClick={() => setMode("chat")} className="w-full p-2 text-[8px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity text-center mt-4">Advanced Inquiry (AI)</button>
                  </div>
                </div>
              ) : (
                /* ... Advanced Chat UI ... */
                <div className="flex flex-col h-full">
                   <div className="flex-1 space-y-4 mb-4">
                     {messages.map((m, i) => (
                       <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                         <div className={`max-w-[85%] p-3 ${m.role === "user" ? "bg-moonlight text-void font-bold" : "bg-gothic-dark border border-moonlight/5"}`}>{m.text}</div>
                       </div>
                     ))}
                   </div>
                   <div className="flex gap-2">
                     <input type="text" placeholder="Ask..." className="flex-1 bg-transparent border-b border-moonlight/10 p-2 text-[10px] tracking-widest outline-none uppercase" />
                     <button onClick={() => setMode("menu")} className="text-[8px] opacity-20 uppercase">Back</button>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="relative group w-16 h-16 flex items-center justify-center">
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
          {userLevel >= 10 && <motion.div animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -inset-6 border border-moonlight/10 rounded-full opacity-20 blur-sm" />}
          {userLevel >= 20 && <motion.div animate={{ rotate: [10, -10, 10], scale: [1.1, 1.2, 1.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -inset-8 border border-moonlight/5 rounded-full opacity-10 blur-md" />}
          <div className="w-8 h-8 bg-gradient-to-b from-moonlight/40 to-transparent rounded-full border border-moonlight/30 flex items-center justify-center backdrop-blur-md relative z-10">
             <div className={`w-2 h-2 bg-moonlight rounded-full shadow-[0_0_10px_white] ${userLevel >= 30 ? 'animate-ping' : userLevel >= 20 ? 'animate-pulse' : ''}`} />
          </div>
          <motion.div animate={{ opacity: userLevel >= 15 ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1], y: userLevel >= 15 ? [-18, -20, -18] : [-14, -16, -14] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-moonlight shadow-[0_0_8px_white]" />
        </motion.div>
      </button>
    </div>
  );
}
