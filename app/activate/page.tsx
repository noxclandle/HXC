"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ActivatePage() {
  const [step, setStep] = useState<"idle" | "scanning" | "verifying" | "success" | "error">("idle");
  const [error, setError] = useState("");
const handleStartScan = async () => {
  if (!("NDEFReader" in window)) {
    setError("お使いの端末ではカードとの同期ができません。");
    setStep("error");
    return;
  }

  try {
    setStep("scanning");
    const reader = new (window as any).NDEFReader();
    await reader.scan();

    reader.addEventListener("reading", ({ serialNumber }: any) => {
      setStep("verifying");
      // Ritual delay: 3.5s
      setTimeout(() => {
        setStep("success");
      }, 3500);
    });
  } catch (err) {
    setError("同期が遮断されました。");
    setStep("error");
  }
};
return (
  <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
    <AnimatePresence mode="wait">
      {step === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <AlertTriangle size={60} className="text-rose-500 mb-8" />
          <h2 className="text-xl tracking-[0.3em] uppercase mb-4 text-rose-500">Seal Failed</h2>
          <p className="text-xs tracking-widest opacity-60 mb-12">{error}</p>
          <button
            onClick={() => setStep("idle")}
            className="px-8 py-3 border border-rose-500/30 hover:bg-rose-500/10 transition-all text-[10px] uppercase tracking-widest text-rose-500"
          >
            Retry
          </button>
        </motion.div>
      )}
...
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <Hexagon size={120} className="text-moonlight/20 mb-12" />
            <h2 className="text-2xl tracking-[0.3em] uppercase mb-8">Ready to Sync</h2>
            <button
              onClick={handleStartScan}
              className="px-8 py-3 border border-moonlight/30 hover:border-moonlight transition-all bg-void/50 tracking-widest text-xs uppercase"
            >
              Start Activation
            </button>
          </motion.div>
        )}

        {step === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-12">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-moonlight blur-3xl rounded-full"
              />
              <Hexagon size={120} className="text-moonlight relative z-10 animate-pulse" />
            </div>
            <h2 className="text-2xl tracking-[0.3em] uppercase mb-4">Synchronizing...</h2>
            <p className="text-gothic-silver text-xs tracking-widest">お手元のカードをかざしてください</p>
          </motion.div>
        )}

        {step === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-12">
               <motion.div
                 initial={{ rotate: 0 }}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                 className="text-moonlight/40"
               >
                 <Hexagon size={160} strokeWidth={0.5} />
               </motion.div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="animate-spin text-moonlight" size={32} />
               </div>
            </div>
            <h2 className="text-2xl tracking-[0.3em] uppercase mb-4">Authenticating</h2>
            <p className="text-gothic-silver text-xs tracking-widest">聖域の記録と照合中...</p>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <CheckCircle2 size={80} className="text-moonlight mb-8" />
            <h2 className="text-3xl tracking-[0.4em] uppercase mb-4">Activated</h2>
            <p className="text-gothic-silver text-xs tracking-widest mb-12">
              あなたの存在は承認されました。<br />深淵へようこそ。
            </p>
            <button
              className="px-8 py-3 border border-moonlight/30 hover:border-moonlight transition-all bg-void/50 tracking-widest text-xs uppercase"
            >
              Enter Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
