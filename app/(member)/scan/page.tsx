"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, Loader2, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { playResonanceSound } from "@/lib/audio/resonance";

export default function ScanPage() {
  const [status, setStatus] = useState<"idle" | "scanning" | "processing" | "confirm">("idle");
  const [scannedData, setScannedData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const router = useRouter();

  const handleScan = () => {
    setStatus("scanning");
    setTimeout(() => {
      setStatus("processing");
      setTimeout(() => {
        setScannedData({ 
          name: "Kenta Tanaka", 
          role: "CEO / Visionary", 
          email: "kenta@hexa-hq.com", 
          phone: "03-XXXX-XXXX" 
        });
        
        // 五感へのフィードバック
        playResonanceSound("silver");
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([20, 50, 20]); // 漆黒の共鳴
        }
        
        setStatus("confirm");
      }, 2500);
    }, 2000);
  };

  const handleArchive = async () => {
    setAiInsight("Analyzing potential business synergy...");
    
    const isOnline = navigator.onLine;

    setTimeout(async () => {
      if (!isOnline) {
        setAiInsight("Connection Lost: Archive sequestered in local device cache.");
      } else {
        setAiInsight("Synergy Unlocked: This soul possesses 84% resonance with your mission.");
      }

      setTimeout(() => router.push("/library"), 3500);
    }, 2000);
  };

  return (
    <main className="fixed inset-0 bg-void z-[300] flex flex-col items-center justify-center p-0 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] animate-pulse" />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" className="flex flex-col items-center p-12 w-full max-w-sm">
            <header className="text-center mb-16 space-y-2">
              <h2 className="text-xl tracking-[0.6em] uppercase font-light">Resonance Ritual</h2>
              <p className="text-[9px] tracking-[0.4em] opacity-30 uppercase italic">共鳴の儀式を開始します</p>
            </header>

            {/* Visual Guide (儀式の図解) */}
            <div className="relative w-full aspect-[3/4] mb-16 flex items-center justify-center">
              {/* Phone Silhouette */}
              <div className="absolute w-48 h-80 border border-moonlight/10 bg-gothic-dark/40 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center pt-8">
                 <div className="w-12 h-1 bg-moonlight/5 rounded-full mb-12" />
                 <div className="w-32 h-48 border border-white/5 bg-white/5 rounded-xl flex items-center justify-center">
                    <ScanLine size={32} className="opacity-10 animate-pulse" />
                 </div>
              </div>

              {/* Card Silhouette (Floating) */}
              <motion.div 
                animate={{ 
                  y: [-20, -50, -20],
                  rotateX: [0, 15, 0],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -right-4 w-40 h-24 bg-moonlight/20 backdrop-blur-md border border-moonlight/40 shadow-2xl z-10 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full border border-white/40 animate-ping" />
              </motion.div>

              {/* Labels */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 space-y-24">
                 <div className="text-[8px] tracking-widest opacity-30 uppercase vertical-text">Device Core</div>
              </div>
            </div>

            <div className="space-y-6 text-center w-full">
              <p className="text-[10px] tracking-widest opacity-40 leading-relaxed">
                スマホの背面に、相手のカードを<br />
                ゆっくりと近づけてください。
              </p>
              <button 
                onClick={handleScan} 
                className="w-full py-5 bg-white text-void text-[11px] font-bold tracking-[0.8em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all active:scale-95"
              >
                Synchronize
              </button>
              <button onClick={() => router.back()} className="text-[9px] opacity-20 uppercase tracking-[0.4em] hover:opacity-50 transition-opacity">Return to Sanctum</button>
            </div>
          </motion.div>
        )}

        {status === "scanning" && (
          <motion.div key="scanning" className="fixed inset-0 bg-black overflow-hidden flex flex-col items-center justify-center">
             {/* Simulated Camera Feed */}
             <div className="absolute inset-0 bg-white/5 animate-pulse" />
             <motion.div 
               animate={{ y: ["-10vh", "110vh"] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-full h-px bg-moonlight shadow-[0_0_20px_white] absolute z-10"
             />
             <div className="relative z-20 text-center">
                <p className="text-[10px] tracking-[0.5em] uppercase opacity-60">Synchronizing Identity...</p>
             </div>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.div key="processing" className="flex flex-col items-center">
            <Loader2 className="animate-spin mb-8 opacity-20" size={32} />
            <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-40">Extracting Metadata</h2>
          </motion.div>
        )}

        {status === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 flex flex-col items-center h-full overflow-y-auto pt-24">
            <h3 className="text-[10px] tracking-[0.5em] uppercase opacity-30 mb-12 text-center">Identity Verified</h3>
            
            <div className="w-full aspect-[1.6/1] bg-gothic-dark border border-moonlight/20 p-8 relative mb-12 shadow-2xl">
               <header className="flex justify-between items-start">
                  <h2 className="text-xl tracking-[0.2em] uppercase">{scannedData.name}</h2>
                  <img src="/logo.png" className="w-8 h-8 opacity-20" />
               </header>
               <footer className="mt-12 space-y-1">
                  <p className="text-[11px] tracking-widest opacity-60">{scannedData.email}</p>
                  <p className="text-[9px] tracking-widest opacity-30 uppercase">{scannedData.role}</p>
               </footer>
            </div>

            <div className="w-full space-y-6 mb-12">
               <input type="text" placeholder="Meeting Location" className="w-full bg-void border border-moonlight/10 p-4 text-[11px] tracking-widest focus:border-moonlight outline-none transition-all uppercase" />
               <textarea placeholder="Private Memo" rows={3} className="w-full bg-void border border-moonlight/10 p-4 text-[11px] tracking-widest focus:border-moonlight outline-none transition-all uppercase resize-none" />
            </div>

            <AnimatePresence>
              {aiInsight && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full p-6 border border-moonlight/10 bg-white/5 mb-8 text-center">
                  <p className="text-[7px] uppercase tracking-[0.4em] opacity-40 mb-2 italic">Concierge Insight</p>
                  <p className="text-[10px] tracking-[0.2em] italic text-moonlight">&quot;{aiInsight}&quot;</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 w-full pb-12">
               <button onClick={() => setStatus("idle")} className="flex-1 py-4 border border-moonlight/10 text-[9px] uppercase tracking-widest">Discard</button>
               <button onClick={handleArchive} className="flex-1 py-4 bg-moonlight text-void font-bold text-[10px] uppercase tracking-[0.4em]">Save Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
