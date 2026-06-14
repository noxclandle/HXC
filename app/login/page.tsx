"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  // 魂の同調 (Soul-Link) 自動ログイン試行
  useEffect(() => {
    const tryAutoLogin = async () => {
      const soulToken = localStorage.getItem("hxc_soul_fragment");
      if (soulToken && status === "unauthenticated") {
        setIsAutoLoggingIn(true);
        try {
          const result = await signIn("soul-link", {
            deviceToken: soulToken,
            redirect: false,
          });

          if (result?.ok) {
            // 成功した場合はゲートへ
            router.push("/gate");
          } else {
            // 失敗した場合は通常のログインを促す（トークンが無効などの場合）
            console.warn("Soul-Link auto-login failed.");
          }
        } catch (e) {
          console.error("Auto-login error:", e);
        } finally {
          setIsAutoLoggingIn(false);
        }
      }
    };

    // クエリパラメータで強制同期が指定されている場合や、初回マウント時に実行
    if (searchParams.get("sync") === "1" || status === "unauthenticated") {
      tryAutoLogin();
    }
  }, [status, searchParams, router]);


  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid Credentials / 認証に失敗しました");
      } else if (result?.ok) {
        // ログイン成功後、デバイス紐付け（Soul-Link）を自動実行
        try {
          const bindRes = await fetch("/api/auth/bind-device", { method: "POST" });
          if (bindRes.ok) {
            const bindData = await bindRes.json();
            if (bindData.deviceToken) {
              localStorage.setItem("hxc_soul_fragment", bindData.deviceToken);
            }
          }
        } catch (e) {
          console.warn("Silent binding failed");
        }

        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.role === "fixer") {
          router.push("/gate");
        } else {
          router.push("/hub");
        }
      }
    } catch (err) {
      setError("Connection Severed / 接続が遮断されました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence>
        {isAutoLoggingIn && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-[-20px] bg-azure-500 blur-3xl rounded-full" 
              />
              <Sparkles className="text-white relative z-10 animate-pulse" size={40} strokeWidth={1} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-sm tracking-[0.8em] uppercase font-light">Soul Synchronizing</h2>
              <p className="text-[8px] tracking-[0.4em] opacity-30 uppercase font-bold">魂の同調プロセスを実行中</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-moonlight/10 rounded-full animate-pulse" />
      </div>

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
            priority
            className="opacity-40 mb-10 hover:opacity-100 transition-opacity duration-1000 object-contain" 
          />
          <h1 className="text-2xl tracking-[0.8em] uppercase font-extralight mb-2">Sign In</h1>
          <p className="text-[8px] tracking-[0.4em] opacity-20 uppercase font-bold">認証プロセス</p>
        </div>

        <motion.form
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
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gothic-dark/30 border border-moonlight/10 p-5 pl-14 text-xs tracking-[0.2em] focus:border-moonlight focus:bg-white/[0.05] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end px-1">
            <button 
              type="button"
              onClick={() => router.push("/login/forgot")}
              className="text-[8px] tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity uppercase font-bold"
            >
              Forgot Password? / パスワードを忘れた場合
            </button>
          </div>
          
          <div className="pt-4">
            <button 
              disabled={isLoading}
              className={`w-full py-5 bg-white text-void text-[10px] font-bold tracking-[0.8em] uppercase hover:bg-emerald-50 transition-all shadow-2xl relative overflow-hidden ${isLoading && 'opacity-50'}`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {isLoading && (
                <motion.div 
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none"
                />
              )}
            </button>
          </div>

          <div className="text-center pt-8">
            <p className="text-[7px] tracking-[0.4em] opacity-20 uppercase">
              物理カードをかざしてもログインできない場合は、<br/>
              メールアドレスとパスワードでログインしてください。
            </p>
          </div>
        </motion.form>
      </motion.div>

      <footer className="fixed bottom-12 text-center opacity-10">
        <p className="text-[8px] tracking-[0.8em] uppercase">Hexa Relation System v1.1</p>
      </footer>
    </main>
  );
}

/**
 * ログイン画面
 * 物理カードでの直接スキャン（Web NFC）はiPhone非対応のため、
 * 基本はアカウント情報でのログインに統一し、ログイン成功時に端末を紐付ける。
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
