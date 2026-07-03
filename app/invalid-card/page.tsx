"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InvalidCardContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center">
      <ShieldAlert size={80} className="text-rose-500 mb-8" />
      <h1 className="text-2xl tracking-[0.4em] mb-4 text-white">無効なカード / Invalid Card</h1>
      <p className="text-[10px] tracking-widest text-rose-500/60 uppercase font-bold mb-12">
        {error === "voided" 
          ? "このカードは永久無効化されています / Card is permanently voided" 
          : error === "invalid_secret" 
            ? "認証情報が一致しないか、書き換えが検知されました / Credentials Mismatch or Tampering Detected" 
            : "未登録または無効なデバイスです / Unregistered or Invalid Device"}
      </p>
      
      <div className="p-8 border border-white/5 bg-white/[0.04] mb-12 max-w-sm">
         <p className="text-[10px] tracking-widest opacity-40 leading-relaxed">
            読み取られた物理識別子 (UID) / Scanned Device UID:<br />
            <span className="font-mono text-white mt-2 block select-all">{uid || "UNKNOWN"}</span>
         </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/purchase" className="py-4 bg-white text-void font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-azure-50 transition-all flex items-center justify-center gap-3">
           新しいカードを注文する / Order New Card
        </Link>
        <Link href="/" className="py-4 border border-white/10 text-white/40 text-[9px] tracking-[0.4em] uppercase hover:border-white/20 transition-all flex items-center justify-center gap-2">
           <ArrowLeft size={12} /> トップページに戻る / Return to Top
        </Link>
      </div>
    </div>
  );
}

export default function InvalidCardPage() {
  return (
    <main className="min-h-screen bg-void flex items-center justify-center p-6 text-center">
      <Suspense fallback={<div className="text-white opacity-10 uppercase tracking-[1em] text-[10px]">Verifying...</div>}>
        <InvalidCardContent />
      </Suspense>
    </main>
  );
}
