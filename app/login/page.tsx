"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, ShieldCheck, Mail, Lock, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [method, setStatus] = useState<"card" | "credentials">("card");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid Credentials / 認証に失敗しました");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Connection Severed / 接続が遮断されました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-moonlight/10 rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-16 text-center">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 opacity-40 mb-10 hover:opacity-100 transition-opacity duration-1000" />
          <h1 className="text-2xl tracking-[0.8em] uppercase font-extralight mb-2">Authenticating</h1>
          <p className="text-[8px] tracking-[0.4em] opacity-20 uppercase font-bold">魂の認証プロセス</p>
        </div>

        <AnimatePresence mode="wait">
          {method === "card" ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12 text-center"
            >
              <div 
                className="p-16 border border-moonlight/10 bg-gothic-dark/10 relative group cursor-pointer overflow-hidden" 
                onClick={() => window.location.href = '/activate'}
              >
                <div className="absolute inset-0 bg-moonlight/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-moonlight/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <ShieldCheck size={48} className="mx-auto opacity-20 mb-6 group-hover:opacity-40 transition-all duration-700" />
                <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 group-hover:opacity-60 transition-opacity">Sync with Card</p>
                <p className="text-[7px] tracking-[0.2em] opacity-10 group-hover:opacity-20 mt-2 uppercase">物理カードで同調</p>
              </div>
              
              <button 
                onClick={() => { setError(null); setStatus("credentials"); }}
                className="text-[9px] tracking-[0.4em] uppercase opacity-20 hover:opacity-100 transition-opacity border-b border-transparent hover:border-moonlight/30 pb-1"
              >
                Use Account Credentials / アカウント入力
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="credentials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleCredentialsLogin}
              className="space-y-8"
            >
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border border-rose-500/30 bg-rose-500/5 text-rose-400 text-center space-y-1"
                  >
                    <div className="flex items-center justify-center gap-2">
                       <AlertCircle size={12} />
                       <p className="text-[9px] tracking-[0.2em] uppercase font-bold">{error.split(" / ")[0]}</p>
                    </div>
                    <p className="text-[7px] tracking-[0.1em] opacity-60">{error.split(" / ")[1]}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
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
                  <p className="absolute -bottom-5 left-0 text-[6px] tracking-[0.1em] opacity-20 uppercase">Registered Soul Address</p>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    onKeyDown={(e) => e.key === "Enter" && handleCredentialsLogin(e as any)}
                    className="w-full bg-gothic-dark/30 border border-moonlight/10 p-5 pl-14 text-xs tracking-[0.2em] focus:border-moonlight focus:bg-white/[0.05] outline-none transition-all"
                  />
                  <p className="absolute -bottom-5 left-0 text-[6px] tracking-[0.1em] opacity-20 uppercase">Secret Resonance Key</p>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  disabled={isLoading}
                  className={`w-full py-5 bg-white text-void text-[10px] font-bold tracking-[0.8em] uppercase hover:bg-emerald-50 transition-all shadow-2xl relative overflow-hidden ${isLoading && 'opacity-50'}`}
                >
                  {isLoading ? "Synchronizing..." : "Enter Sanctum"}
                  {isLoading && (
                    <motion.div 
                      animate={{ left: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none"
                    />
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => { setError(null); setStatus("card"); }}
                  className="text-[8px] tracking-[0.3em] uppercase opacity-20 hover:opacity-100 transition-opacity"
                >
                  Return to Card Sync / カード同期に戻る
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Decoration */}
      <footer className="fixed bottom-12 text-center opacity-10">
        <p className="text-[8px] tracking-[0.8em] uppercase">Hexa Relation System v1.0</p>
      </footer>
    </main>
  );
}
