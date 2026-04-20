"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";

export default function InvalidAccessPage() {
  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border border-rose-500/20 bg-rose-500/5 p-16 relative overflow-hidden"
      >
        <div className="flex justify-center mb-12">
          <ShieldAlert size={64} className="text-rose-500/40" />
        </div>

        <h2 className="text-2xl tracking-[0.4em] uppercase mb-4 text-rose-500">Access Denied</h2>
        <p className="text-[10px] tracking-widest opacity-40 uppercase mb-12">
          台帳に記録されていない魂、または物理的リンクが断絶した存在です。
        </p>
        
        <button 
          onClick={() => window.location.href = "/"}
          className="px-8 py-3 border border-rose-500/30 text-[10px] tracking-[0.5em] uppercase text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          Return to Void
        </button>
      </motion.div>
    </main>
  );
}
