"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, UserCheck, ShieldCheck, Mail, Lock, Briefcase } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function IdentityRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "AUTO-DETECTED";

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: ""
  });
  const [step, setStep] = useState(0);

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-void text-moonlight">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="reg" className="max-w-md w-full space-y-12">
            <header className="space-y-2">
              <h2 className="text-2xl tracking-[0.5em] uppercase font-light">New Identity Setup</h2>
              <p className="text-[10px] tracking-widest opacity-40 uppercase italic">物理カードをアカウントへ同期します</p>
            </header>

            <div className="p-4 border border-white/5 bg-white/5 flex justify-between items-center mb-8">
               <span className="text-[8px] uppercase tracking-widest opacity-40">Verified Hardware UID</span>
               <span className="text-[10px] font-mono text-emerald-400">{uid}</span>
            </div>
            
            <div className="space-y-6 text-left">
              {[
                { label: "Real Name (氏名)", key: "name", icon: <UserCheck size={14}/> },
                { label: "Public Handle (ハンドル)", key: "handle", icon: <ShieldCheck size={14}/> },
                { label: "Login Email (メールアドレス)", key: "email", icon: <Mail size={14}/> },
                { label: "Password (パスワード)", key: "password", icon: <Lock size={14}/>, type: "password" },
                { label: "Job Title (役職/肩書き)", key: "role", icon: <Briefcase size={14}/> },
              ].map((f) => (
                <div key={f.key} className="relative group space-y-2">
                  <label className="text-[9px] uppercase tracking-widest opacity-30 flex items-center gap-2">{f.icon} {f.label}</label>
                  <input
                    type={f.type || "text"}
                    value={(formData as any)[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full bg-gothic-dark/30 border border-moonlight/10 p-3 tracking-widest focus:border-moonlight outline-none transition-all uppercase text-xs"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-5 bg-moonlight text-void font-bold text-[11px] tracking-[0.6em] uppercase shadow-2xl hover:bg-white transition-all"
            >
              Confirm Identity
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="sync" className="flex flex-col items-center">
            <div className="relative mb-16">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="text-moonlight/10">
                <Hexagon size={240} strokeWidth={0.5} />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={40} className="text-emerald-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl tracking-[0.5em] uppercase mb-4 font-bold">Synchronizing...</h2>
            <p className="text-[10px] tracking-widest opacity-40 uppercase max-w-xs leading-relaxed">
               あなたの意志と、物理の鍵をシステムへ刻んでいます。<br />この操作は一度しか行えません。
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleComplete}
              className="mt-16 px-16 py-5 bg-white text-void font-bold text-[11px] tracking-[0.8em] uppercase shadow-2xl"
            >
              Seal Account
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
