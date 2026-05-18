"use client";

import { motion } from "framer-motion";
import { Shield, User, ArrowRight, Hexagon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ADMIN_ROLES } from "@/lib/constants";

/**
 * ゲートウェイ画面
 * 管理者と一般ユーザーの入り口を分ける
 */
export default function GatePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return redirect("/login");

  const isAdmin = ADMIN_ROLES.includes(session.user.role);

  return (
    <main className="min-h-screen bg-void flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} 
      />

      <div className="max-w-2xl w-full">
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 border border-white/10 bg-white/[0.02] flex items-center justify-center mx-auto rotate-45 mb-8"
          >
            <Hexagon size={24} className="text-white opacity-20 -rotate-45" />
          </motion.div>
          <h1 className="text-2xl tracking-[0.8em] uppercase font-extralight text-white">System Gateway</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold text-azure-400">システム・ゲートウェイ</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Home */}
          <Link href="/hub" className="group p-10 border border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-8 text-white opacity-20 group-hover:opacity-100 transition-opacity">
                <User size={32} strokeWidth={1} />
              </div>
              <h2 className="text-sm tracking-[0.5em] uppercase font-bold mb-2">Home</h2>
              <p className="text-[9px] opacity-20 uppercase tracking-widest leading-relaxed">マイページ・人脈管理</p>
            </div>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
               <ArrowRight size={16} className="text-azure-400" />
            </div>
          </Link>

          {/* Admin Panel (Only visible/active for admins) */}
          {isAdmin ? (
            <Link href="/admin" className="group p-10 border border-azure-500/10 bg-azure-500/[0.02] hover:border-azure-500/40 hover:bg-azure-500/[0.04] transition-all relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-8 text-azure-400 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Shield size={32} strokeWidth={1} />
                </div>
                <h2 className="text-sm tracking-[0.5em] uppercase font-bold mb-2 text-white">Admin Panel</h2>
                <p className="text-[9px] opacity-20 uppercase tracking-widest leading-relaxed">台帳管理・システム設定</p>
              </div>
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                 <ArrowRight size={16} className="text-azure-400" />
              </div>
            </Link>
          ) : (
            <div className="p-10 border border-white/5 bg-white/[0.01] opacity-20 cursor-not-allowed">
              <div className="mb-8 text-white opacity-20">
                <Shield size={32} strokeWidth={1} />
              </div>
              <h2 className="text-sm tracking-[0.5em] uppercase font-bold mb-2">Restricted</h2>
              <p className="text-[9px] uppercase tracking-widest">管理者権限が必要です</p>
            </div>
          )}
        </div>

        <footer className="mt-20 text-center">
           <p className="text-[8px] tracking-[0.8em] opacity-10 uppercase font-bold">System Gate / Access Secure</p>
        </footer>
      </div>
    </main>
  );
}
