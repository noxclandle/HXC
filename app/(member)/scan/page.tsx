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
        setScannedData({ name: "Kenta Tanaka", role: "CEO", email: "kenta@example.com", phone: "03-XXXX-XXXX" });
        playResonanceSound("silver");
        setStatus("confirm");
      }, 2500);
    }, 2000);
  };

  const handleArchive = async () => {
    setAiInsight("Analyzing potential business synergy...");
    
    const isOnline = navigator.onLine;

    setTimeout(async () => {
      if (!isOnline) {
        // オフライン時の保存（LocalStorage）
        const pending = JSON.parse(localStorage.getItem("pending_scans") || "[]");
        localStorage.setItem("pending_scans", JSON.stringify([...pending, scannedData]));
        setAiInsight("接続がありません。聖域への記録は一時的にデバイスへ保管されました（オフライン同期予約）。");
      } else {
        setAiInsight("Strategy: High synergy detected. Identity is now bound to the Network.");
      }

      setTimeout(() => router.push("/library"), 3000);
    }, 2000);
  };

  return (
    <main className="fixed inset-0 bg-void z-[300] flex flex-col items-center justify-center p-0">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" className="flex flex-col items-center p-8">
            <div className="w-64 h-96 border border-moonlight/10 bg-gothic-dark/20 flex flex-col items-center justify-center mb-12 relative">
               <Camera size={40} className="opacity-10 mb-4" />
               <p className="text-[9px] tracking-[0.4em] uppercase opacity-20">Align Business Card</p>
            </div>
            <button onClick={handleScan} className="px-16 py-5 bg-moonlight text-void text-[11px] font-bold tracking-[0.6em] uppercase shadow-2xl">
              Initiate Scan
            </button>
            <button onClick={() => router.back()} className="mt-8 text-[9px] opacity-20 uppercase tracking-widest">Cancel</button>
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
