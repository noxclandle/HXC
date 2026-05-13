"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Loader2, CheckCircle2, AlertTriangle, UserPlus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function ActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const uid = searchParams.get("uid");
  const serial = searchParams.get("serial");

  const [step, setStep] = useState<"idle" | "scanning" | "verifying" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // もしURLに既にUIDが含まれている場合（QRコードからのアクセスなど）
  useEffect(() => {
    if (uid) {
      setStep("verifying");
      const timer = setTimeout(() => {
        setStep("success");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [uid]);

  const handleStartScan = async () => {
    if (!("NDEFReader" in window)) {
      setError("お使いの端末は物理鍵の同期に対応していません。別のブラウザでお試しください。");
      setStep("error");
      return;
    }

    try {
      setStep("scanning");
      const reader = new (window as any).NDEFReader();
      await reader.scan();

      reader.addEventListener("reading", ({ serialNumber }: any) => {
        const formattedUid = serialNumber.toUpperCase();
        setStep("verifying");
        setTimeout(() => {
          router.push(`/activate/register?uid=${formattedUid}`);
        }, 2000);
      });
    } catch (err) {
      setError("同期プロセスが中断されました。");
      setStep("error");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === "error" && (
        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <AlertTriangle size={60} className="text-rose-500 mb-8" />
          <h2 className="text-xl tracking-[0.3em] uppercase mb-4 text-rose-500">Sync Interrupted</h2>
          <p className="text-[10px] tracking-widest opacity-60 mb-12 max-w-xs">{error}</p>
          <button onClick={() => setStep("idle")} className="px-12 py-4 border border-rose-500/30 hover:bg-rose-500/10 transition-all text-[10px] uppercase tracking-widest text-rose-500 font-bold">Retry Synchronization</button>
        </motion.div>
      )}

      {step === "idle" && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center space-y-12">
          <div className="relative">
            <Hexagon size={120} className="text-moonlight/10" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] border border-dashed border-white/5 rounded-full"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl tracking-[0.4em] uppercase font-extralight text-white">Identity Activation</h2>
            <p className="text-[10px] tracking-widest opacity-30 uppercase">お手元のカードを同期して、アイデンティティを確立してください</p>
          </div>
          <button onClick={handleStartScan} className="px-16 py-5 border border-white/20 hover:border-white transition-all bg-white/5 tracking-[0.4em] text-[10px] font-bold uppercase shadow-2xl">
            Start Synchronization
          </button>
        </motion.div>
      )}

      {(step === "scanning" || step === "verifying") && (
        <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
          <div className="relative mb-16">
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-[-40px] bg-azure-500 blur-[80px] rounded-full" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <Loader2 className="animate-spin text-white opacity-40" size={60} strokeWidth={1} />
              <span className="text-[8px] tracking-[1em] uppercase text-white opacity-40 animate-pulse font-bold ml-[1em]">
                {step === "scanning" ? "Awaiting Card" : "Establishing Link"}
              </span>
            </div>
          </div>
          <h2 className="text-2xl tracking-[0.5em] uppercase font-light text-white">
            {step === "scanning" ? "Syncing..." : "Protocol Active"}
          </h2>
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mt-4">
             {step === "scanning" ? "カードをスマートフォンにかざしてください" : "物理と仮想の境界線を透過中..."}
          </p>
        </motion.div>
      )}

      {step === "success" && (
        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center max-w-sm w-full relative">
          <CheckCircle2 size={80} className="text-azure-400 mb-8" />
          <h2 className="text-3xl tracking-[0.4em] uppercase mb-4 text-white">Established</h2>
          <p className="text-gothic-silver text-[10px] tracking-widest mb-12 leading-relaxed uppercase">
             物理鍵の同期に成功しました。<br />
             アイデンティティの新規確立を開始します。
          </p>
          <Link href={`/activate/register?uid=${uid}&serial=${serial}`} className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.5em] uppercase flex items-center justify-center gap-3 hover:bg-azure-50 transition-all shadow-xl">
            Next: Identity Registry
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ActivatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-void">
      <Suspense fallback={<div className="text-moonlight opacity-20 uppercase tracking-widest text-[10px]">Loading Interface...</div>}>
        <ActivateContent />
      </Suspense>
    </main>
  );
}
