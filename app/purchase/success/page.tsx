"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="max-w-md w-full space-y-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center"
      >
        <div className="w-24 h-24 rounded-full border border-azure-500/30 flex items-center justify-center bg-azure-500/5 relative">
          <ShieldCheck size={40} className="text-azure-400" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-azure-500 blur-2xl rounded-full -z-10" 
          />
        </div>
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-2xl tracking-[0.5em] uppercase font-light text-white">Order Complete</h1>
        <p className="text-[10px] tracking-widest text-azure-400 opacity-60 uppercase">決済が正常に完了しました</p>
      </div>

      <div className="p-8 border border-white/5 bg-white/[0.02] text-left space-y-6">
         <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest opacity-30">Transaction ID</span>
            <p className="font-mono text-[10px] text-white/60 truncate">{sessionId || "PROTOCOL_MOCK_SUCCESS"}</p>
         </div>
         <p className="text-[11px] leading-relaxed tracking-widest text-white/40 uppercase">
            貴方のアイデンティティ（物理カード）は現在、製造および初期化プロセスに入りました。<br />
            発送完了まで、今暫くお待ちください。<br />
            カードがお手元に届きましたら、スマートフォンにかざして初期登録（アカウント作成）を行ってください。
         </p>
      </div>

      <div className="flex flex-col gap-4">
         <Link 
           href="/"
           className="w-full py-5 bg-white text-void text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-azure-50 transition-all shadow-xl flex items-center justify-center gap-4"
         >
           Return to Home <ArrowRight size={14} />
         </Link>
         <Link 
           href="/contact"
           className="w-full py-5 border border-white/10 text-white/60 text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-4"
         >
           Contact Support / お問い合わせ <ArrowRight size={14} />
         </Link>
         <p className="text-[7px] tracking-widest opacity-20 uppercase">Authorized by Hexa Relation</p>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center p-6 text-center">
      <Suspense fallback={<div className="text-white opacity-20 uppercase tracking-widest text-[10px]">Processing finality...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
