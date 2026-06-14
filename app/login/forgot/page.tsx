"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to process request.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl tracking-[0.8em] uppercase font-extralight mb-2">Reset</h1>
          <p className="text-[8px] tracking-[0.4em] opacity-20 uppercase font-bold">パスワード再設定</p>
        </div>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form
              key="forgot-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <p className="text-[10px] tracking-[0.2em] opacity-40 text-center leading-relaxed">
                登録済みのメールアドレスを入力してください。<br/>
                再設定用のリンクをお送りします。
              </p>

              {error && (
                <div className="p-4 border border-rose-500/30 bg-rose-500/5 text-rose-400 text-center flex items-center justify-center gap-2">
                  <AlertCircle size={12} />
                  <p className="text-[9px] tracking-[0.2em] uppercase font-bold">{error}</p>
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gothic-dark/30 border border-moonlight/10 p-5 pl-14 text-xs tracking-[0.2em] focus:border-moonlight focus:bg-white/[0.05] outline-none transition-all uppercase"
                />
              </div>

              <div className="space-y-4">
                <button 
                  disabled={isLoading}
                  className={`w-full py-5 bg-white text-void text-[10px] font-bold tracking-[0.8em] uppercase hover:bg-emerald-50 transition-all shadow-2xl relative overflow-hidden ${isLoading && 'opacity-50'}`}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
                <button 
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full flex items-center justify-center gap-2 opacity-30 hover:opacity-100 transition-opacity"
                >
                  <ArrowLeft size={12} />
                  <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Back to Login</span>
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="sent-msg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center">
                <CheckCircle className="text-emerald-500" size={48} strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h2 className="text-sm tracking-[0.4em] uppercase">Email Sent</h2>
                <p className="text-[9px] tracking-[0.2em] opacity-40 leading-relaxed uppercase">
                  再設定用のリンクを送信しました。<br/>
                  メールを確認してください。
                </p>
              </div>
              <button 
                onClick={() => router.push("/login")}
                className="w-full py-5 border border-moonlight/10 text-[10px] font-bold tracking-[0.8em] uppercase hover:bg-white/5 transition-all"
              >
                Return to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
