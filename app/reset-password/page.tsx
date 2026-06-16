"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Invalid token.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-rose-500 mb-4" size={48} />
        <h1 className="text-xl tracking-widest uppercase mb-2">Invalid Link</h1>
        <p className="opacity-40 text-xs mb-8">無効なリンクです。再度再設定を依頼してください。</p>
        <button onClick={() => router.push("/login")} className="text-[10px] tracking-widest uppercase underline opacity-60">Return to Login</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-16 text-center">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="opacity-40 mb-10 object-contain" 
          />
          <h1 className="text-2xl tracking-[0.8em] uppercase font-extralight mb-2">パスワードの再設定</h1>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form
              key="reset-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <div className="p-4 border border-rose-500/30 bg-rose-500/5 text-rose-400 text-center flex items-center justify-center gap-2">
                  <AlertCircle size={12} />
                  <p className="text-[9px] tracking-[0.2em] font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
                  <input
                    type="password"
                    placeholder="新しいパスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gothic-dark/30 border border-moonlight/10 p-5 pl-14 text-xs tracking-[0.2em] focus:border-moonlight focus:bg-white/[0.05] outline-none transition-all"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
                  <input
                    type="password"
                    placeholder="新しいパスワード (確認)"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-gothic-dark/30 border border-moonlight/10 p-5 pl-14 text-xs tracking-[0.2em] focus:border-moonlight focus:bg-white/[0.05] outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                disabled={isLoading}
                className={`w-full py-5 bg-white text-void text-[10px] font-bold tracking-[0.8em] uppercase hover:bg-emerald-50 transition-all shadow-2xl relative overflow-hidden ${isLoading && 'opacity-50'}`}
              >
                {isLoading ? "設定中..." : "パスワードを更新"}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success-msg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center">
                <CheckCircle className="text-emerald-500" size={48} strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h2 className="text-sm tracking-[0.4em] uppercase">更新完了</h2>
                <p className="text-[9px] tracking-[0.2em] opacity-40 leading-relaxed">
                  パスワードが更新されました。<br/>
                  新しいパスワードでログインしてください。
                </p>
              </div>
              <button 
                onClick={() => router.push("/login")}
                className="w-full py-5 bg-white text-void text-[10px] font-bold tracking-[0.8em] uppercase hover:bg-emerald-50 transition-all"
              >
                ログイン画面へ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="animate-spin text-moonlight/20" />
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
