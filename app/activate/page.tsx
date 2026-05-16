"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Loader2, CheckCircle2, AlertTriangle, Smartphone } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * アクティベート（登録待機）画面
 * 物理スキャンボタンはiPhone非対応のため削除し、
 * 単に「カードをかざしてください」という案内に特化させる。
 */
function ActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const uid = searchParams.get("uid");
  const serial = searchParams.get("serial");

  const [step, setStep] = useState<"idle" | "verifying">("idle");

  // URLにUIDが含まれている場合（カードタップからのアクセス）
  useEffect(() => {
    if (uid) {
      setStep("verifying");
      const timer = setTimeout(() => {
        router.push(`/activate/register?uid=${uid}&serial=${serial}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uid, serial, router]);

  return (
    <AnimatePresence mode="wait">
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
            <h2 className="text-2xl tracking-[0.4em] uppercase font-extralight text-white">Awaiting Resonance</h2>
            <p className="text-[10px] tracking-widest opacity-30 uppercase text-center max-w-xs mx-auto leading-relaxed">
              物理鍵（カード）をスマートフォンにかざしてください。<br />
              通知が表示されたら、それをタップして同期を完了させます。
            </p>
          </div>
          <div className="mt-8 py-6 px-10 border border-white/5 bg-white/[0.02] rounded-sm flex flex-col items-center gap-4">
             <Smartphone size={24} className="opacity-20 animate-bounce" />
             <p className="text-[8px] tracking-[0.3em] uppercase opacity-40 font-bold">Scanning for Proximity...</p>
          </div>
        </motion.div>
      )}

      {step === "verifying" && (
        <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
          <div className="relative mb-16">
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-[-40px] bg-azure-500 blur-[80px] rounded-full" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <Loader2 className="animate-spin text-white opacity-40" size={60} strokeWidth={1} />
              <span className="text-[8px] tracking-[1em] uppercase text-white opacity-40 animate-pulse font-bold ml-[1em]">
                Observation Detected
              </span>
            </div>
          </div>
          <h2 className="text-2xl tracking-[0.5em] uppercase font-light text-white">Resonance Observed</h2>
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mt-4">
             物理鍵を検知しました。情報を透過中...
          </p>
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
