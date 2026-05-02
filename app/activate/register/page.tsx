"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, UserCheck, ShieldCheck, Mail, Lock, Briefcase } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const serial = searchParams.get("serial") || "";

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    password: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      setError("必須項目を入力してください。");
      return;
    }
    setError("");
    setStep(1);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          uid,
          role: formData.title || "MEMBER"
        })
      });

      if (res.ok) {
        setTimeout(() => {
          router.push("/hub");
        }, 2500);
      } else {
        const data = await res.json();
        setError(data.error || "登録に失敗しました。");
        setStep(0);
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full space-y-10 py-12"
          >
            <header className="space-y-4">
              <div className="w-12 h-12 border border-azure-500/30 bg-azure-500/5 flex items-center justify-center mx-auto rotate-45 mb-6">
                 <Hexagon size={20} className="text-azure-400 -rotate-45" />
              </div>
              <h2 className="text-2xl tracking-[0.4em] uppercase font-light text-white">Establish Identity</h2>
              <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase font-bold text-azure-400">アイデンティティの新規確立</p>
            </header>

            <div className="p-5 border border-white/5 bg-white/[0.02] text-left space-y-3">
               <div className="flex justify-between items-center text-[8px] uppercase tracking-widest opacity-30">
                  <span>Hardware UID</span>
                  <span className="text-azure-400 font-mono select-all">{uid || "AUTO-DETECTED"}</span>
               </div>
               <div className="flex justify-between items-center text-[8px] uppercase tracking-widest opacity-30">
                  <span>Assigned Serial</span>
                  <span className="text-white font-mono">{serial || "HXC-PENDING"}</span>
               </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] tracking-widest uppercase">
                 {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {[
                { label: "Real Name / 氏名", key: "name", icon: <UserCheck size={14}/>, placeholder: "福井 豪" },
                { label: "Public Handle / ハンドル", key: "handle", icon: <ShieldCheck size={14}/>, placeholder: "architect" },
                { label: "Login Email / メールアドレス", key: "email", icon: <Mail size={14}/>, placeholder: "your@email.com", type: "email" },
                { label: "Password / パスワード", key: "password", icon: <Lock size={14}/>, placeholder: "••••••••", type: "password" },
                { label: "Job Title / 役職・肩書き", key: "title", icon: <Briefcase size={14}/>, placeholder: "Architect" },
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] opacity-30 flex items-center gap-2 font-bold">{f.icon} {f.label}</label>
                  <input
                    type={f.type || "text"}
                    required={f.key !== "title" && f.key !== "handle"}
                    value={(formData as any)[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 tracking-widest focus:border-azure-500 outline-none transition-all text-white text-xs placeholder:opacity-20"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-6 bg-white text-void font-bold text-[11px] tracking-[0.8em] uppercase shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:bg-azure-50 transition-all mt-8 active:scale-[0.98]"
              >
                Confirm Identity
              </button>
            </form>

            <p className="text-[8px] tracking-[0.3em] opacity-20 uppercase leading-relaxed">
               ボタンを押すことで、聖域の規約に同意したものとみなされます。<br />
               一度刻まれた情報は物理鍵と不可分となります。
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="sync" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-16">
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute inset-0 bg-azure-500 blur-[120px] rounded-full"
               />
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="text-azure-500/20">
                 <Hexagon size={280} strokeWidth={0.2} />
               </motion.div>
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                 <div className="w-16 h-16 border-t-2 border-azure-400 rounded-full animate-spin" />
                 <span className="text-[10px] tracking-[1em] uppercase text-azure-400 font-bold ml-[1em] animate-pulse">Synchronizing</span>
               </div>
            </div>
            <h2 className="text-2xl tracking-[0.5em] uppercase font-light text-white">Writing Archive</h2>
            <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase max-w-xs leading-relaxed mt-4">
               あなたの意志と、物理の鍵を聖域へ刻んでいます。<br />
               接続を切断しないでください。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
  );
}

export default function IdentityRegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-void text-moonlight overflow-x-hidden">
      <Suspense fallback={<div className="text-white opacity-10 uppercase tracking-[1em] text-[10px]">Accessing Vault...</div>}>
        <RegisterContent />
      </Suspense>
    </main>
  );
}
