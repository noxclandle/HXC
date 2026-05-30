"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Loader2, Smartphone } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function ActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        // トークンを維持したまま登録画面へ
        router.push(`/activate/register?token=${token}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [token, router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="relative mb-16">
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-[-40px] bg-azure-500 blur-[80px] rounded-full" />
          <div className="relative z-10 flex flex-col items-center gap-8">
            <Loader2 className="animate-spin text-white opacity-40" size={60} strokeWidth={1} />
            <span className="text-[8px] tracking-[1em] uppercase text-white opacity-40 animate-pulse font-bold ml-[1em]">
              Security Handshake
            </span>
          </div>
        </div>
        <h2 className="text-2xl tracking-[0.5em] uppercase font-light text-white">Authenticating...</h2>
        <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mt-4">
           一時的なアクセス権を生成しました。登録画面へ移動します。
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ActivatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-void">
      <Suspense fallback={null}>
        <ActivateContent />
      </Suspense>
    </main>
  );
}
