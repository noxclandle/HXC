"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, UserCheck, Mail, Lock, CheckCircle2, Fingerprint } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name || !formData.handle) {
      setError("必須項目をすべて入力してください。");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          uid,
          role: "member"
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStep(1);
        // 自動ログインを試行
        const signInRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          // デバイスの紐付けをバックグラウンドで試行
          fetch("/api/auth/bind-device", { method: "POST" })
            .then(res => res.json())
            .then(d => {
              if (d.deviceToken) localStorage.setItem("hxc_soul_fragment", d.deviceToken);
            })
            .catch(e => console.warn("Background binding failed"));

          setTimeout(() => {
            router.push("/hub");
          }, 2000);
        } else {
          router.push("/login");
        }
      } else {
        setError(data.error || "登録に失敗しました。");
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div 
            key="form"
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
                  <span className="text-azure-400 font-mono">{uid || "DETECTED"}</span>
               </div>
               <div className="flex justify-between items-center text-[8px] uppercase tracking-widest opacity-30">
                  <span>Protocol Status</span>
                  <span className="text-emerald-500 font-bold tracking-widest">READY TO SYNC</span>
               </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] tracking-widest uppercase text-center">
                 {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] opacity-30 flex items-center gap-2 font-bold"><UserCheck size={14}/> Name / 氏名</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="福井 豪"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 tracking-widest focus:border-azure-500 outline-none transition-all text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] opacity-30 flex items-center gap-2 font-bold"><Fingerprint size={14}/> Reading / フリガナ</label>
                  <input
                    type="text" required value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    placeholder="フクイ ゴウ"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 tracking-widest focus:border-azure-500 outline-none transition-all text-white text-xs"
                  />
                </div>
              </div>

              {[
                { label: "Login Email", key: "email", icon: <Mail size={14}/>, placeholder: "your@email.com", type: "email" },
                { label: "Password", key: "password", icon: <Lock size={14}/>, placeholder: "••••••••", type: "password" },
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] opacity-30 flex items-center gap-2 font-bold">{f.icon} {f.label}</label>
                  <input
                    type={f.type || "text"} required
                    value={(formData as any)[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 tracking-widest focus:border-azure-500 outline-none transition-all text-white text-xs"
                  />
                </div>
              ))}

              <button
                type="submit" disabled={loading}
                className="w-full py-6 bg-white text-void font-bold text-[11px] tracking-[0.8em] uppercase shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:bg-azure-50 transition-all mt-8 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Synchronizing..." : "Confirm Identity"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-16">
               <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-white blur-[100px] rounded-full" />
               <CheckCircle2 size={120} className="text-white relative z-10" />
            </div>
            <h2 className="text-3xl tracking-[0.6em] uppercase font-extralight text-white">Identity Established</h2>
            <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase mt-4">
               情報の刻印が完了しました。境界へ遷移します。
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
