"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { logger } from "@/lib/logger";

export default function CheckoutPage() {
  const [aliasUnlocked, setAliasUnlocked] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setAliasUnlocked(!!data.is_alias_unlocked))
      .catch((error) => logger.error("Failed to fetch alias status", { error }));
  }, []);

  const handleAliasCheckout = async () => {
    setSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/stripe/alias-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStatusMessage(data.error || "決済の開始に失敗しました。");
      }
    } catch (error) {
      logger.error("Failed to start alias checkout", { error });
      setStatusMessage("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16 border-b border-moonlight/10 pb-8 text-center">
        <h1 className="text-xl tracking-[0.6em] uppercase flex items-center justify-center gap-4">
          <Lock className="text-moonlight opacity-40" size={20} />
          境界 / Threshold
        </h1>
        <p className="text-[9px] tracking-widest opacity-20 uppercase mt-4">現在の存在を拡張する。 / Expand your current existence.</p>
      </header>

      {statusMessage && (
        <p className="mb-8 text-[10px] tracking-widest uppercase text-azure-400 border border-azure-500/20 bg-azure-500/5 p-4">
          {statusMessage}
        </p>
      )}

      <div className="space-y-4">
        <motion.div className="p-8 border border-moonlight/5 bg-gothic-dark/20 flex justify-between items-center group relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm tracking-[0.4em] uppercase mb-2">別名プロフィール機能の解放 / Alias Profile Activation</h3>
            <p className="text-[10px] tracking-widest opacity-40">偽名の結界（別名名刺機能）の解放 / Alias Barrier (Unlock alternative profile/alias feature)</p>
          </div>

          <div className="flex flex-col items-end relative z-10">
            <span className="text-xl font-extralight italic mb-4">¥2,000</span>
            {aliasUnlocked ? (
              <span className="px-8 py-3 text-[9px] font-bold uppercase tracking-widest opacity-60">解放済み / Unlocked</span>
            ) : (
              <button
                onClick={handleAliasCheckout}
                disabled={submitting || aliasUnlocked === null}
                className="px-8 py-3 bg-moonlight text-void text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-40"
              >
                {submitting ? "処理中..." : "解放する / Unlock"}
              </button>
            )}
          </div>
        </motion.div>

        <Link
          href="/purchase"
          className="p-8 border border-moonlight/5 bg-gothic-dark/20 flex justify-between items-center group relative overflow-hidden hover:border-moonlight/20 transition-all"
        >
          <div className="relative z-10">
            <h3 className="text-sm tracking-[0.4em] uppercase mb-2">ブラック会員へのアップグレード / Black Tier Upgrade</h3>
            <p className="text-[10px] tracking-widest opacity-40">Apexティア（限定物理カード）の購入ページへ / Go to the Apex tier physical card purchase page</p>
          </div>
          <div className="flex items-center gap-3 relative z-10 text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            ¥1,000,000 <ArrowRight size={16} />
          </div>
        </Link>
      </div>

      <footer className="mt-24 text-center opacity-10 text-[8px] tracking-[0.5em] uppercase leading-relaxed">
        Black Tier is fulfilled through the Apex physical card purchase flow.
      </footer>
    </div>
  );
}
