"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Loader2, CheckCircle2, AlertTriangle, UserPlus, Link as LinkIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function ActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const uid = searchParams.get("uid");
  const serial = searchParams.get("serial");

  const [step, setStep] = useState<"idle" | "scanning" | "verifying" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (uid) {
      setStep("verifying");
      const timer = setTimeout(() => {
        setStep("success");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uid]);

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
    <AnimatePresence mode="wait">
      {step === "error" && (
        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <AlertTriangle size={60} className="text-rose-500 mb-8" />
          <h2 className="text-xl tracking-[0.3em] uppercase mb-4 text-rose-500">Seal Failed</h2>
          <p className="text-xs tracking-widest opacity-60 mb-12">{error}</p>
          <button onClick={() => setStep("idle")} className="px-8 py-3 border border-rose-500/30 hover:bg-rose-500/10 transition-all text-[10px] uppercase tracking-widest text-rose-500">Retry</button>
        </motion.div>
      )}

      {step === "idle" && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
          <Hexagon size={120} className="text-moonlight/20 mb-12" />
          <h2 className="text-2xl tracking-[0.3em] uppercase mb-8">Ready to Sync</h2>
          <button onClick={handleStartScan} className="px-8 py-3 border border-moonlight/30 hover:border-moonlight transition-all bg-void/50 tracking-widest text-xs uppercase">Start Activation</button>
        </motion.div>
      )}

      {step === "scanning" && (
        <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
          <div className="relative mb-12">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-moonlight blur-3xl rounded-full" />
            <Hexagon size={120} className="text-moonlight relative z-10 animate-pulse" />
          </div>
          <h2 className="text-2xl tracking-[0.3em] uppercase mb-4">Synchronizing...</h2>
          <p className="text-gothic-silver text-xs tracking-widest">お手元のカードをかざしてください</p>
        </motion.div>
      )}

      {step === "verifying" && (
        <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
          <div className="relative mb-12">
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} className="text-moonlight/40">
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
        <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center max-w-sm w-full">
          <CheckCircle2 size={80} className="text-moonlight mb-8" />
          <h2 className="text-3xl tracking-[0.4em] uppercase mb-4 text-white">Detected</h2>
          <p className="text-gothic-silver text-[10px] tracking-widest mb-12 leading-relaxed">
             物理デバイスの識別子を確認しました。<br />
             このカードにあなたのアイデンティティを刻みますか？
          </p>
          <div className="flex flex-col gap-4 w-full px-6">
            <Link href={`/activate/register?uid=${uid}&serial=${serial}`} className="w-full py-4 bg-white text-void font-bold text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:bg-azure-50 transition-all shadow-xl">
              <UserPlus size={14} /> Create New Identity
            </Link>
            {session ? (
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/user/equip-card", {
                      method: "POST",
                      body: JSON.stringify({ uid })
                    });
                    if (res.ok) {
                      router.push("/hub");
                    } else {
                      const data = await res.json();
                      alert(data.error || "Sync failed");
                    }
                  } catch (e) { console.error(e); }
                }}
                className="w-full py-4 border border-white/20 text-white/60 font-bold text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:border-white hover:text-white transition-all"
              >
                <LinkIcon size={14} /> Sync with My Account
              </button>
            ) : (
              <Link href="/login" className="w-full py-4 border border-white/10 text-white/40 text-[9px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:border-white/20 transition-all">
                Login to Sync
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ActivatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <Suspense fallback={<div className="text-moonlight opacity-20 uppercase tracking-widest text-[10px]">Loading Interface...</div>}>
        <ActivateContent />
      </Suspense>
    </main>
  );
}
