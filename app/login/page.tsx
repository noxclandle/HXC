"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, ShieldCheck, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [method, setStatus] = useState<"card" | "credentials">("card");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-void text-moonlight flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-12">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 opacity-40 mb-8" />
          <h1 className="text-xl tracking-[0.6em] uppercase font-light">Authenticating</h1>
        </div>

        <AnimatePresence mode="wait">
          {method === "card" ? (
            <motion.div
              key="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 text-center"
            >
              <div className="p-12 border border-moonlight/10 bg-gothic-dark/10 relative group cursor-pointer" onClick={() => window.location.href = '/activate'}>
                <div className="absolute inset-0 bg-moonlight/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck size={40} className="mx-auto opacity-20 mb-4" />
                <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">Sync with Card</p>
              </div>
              <button 
                onClick={() => setStatus("credentials")}
                className="text-[9px] tracking-[0.3em] uppercase opacity-20 hover:opacity-100 transition-opacity"
              >
                Or use Account Credentials
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="credentials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleCredentialsLogin}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gothic-dark/30 border border-moonlight/10 p-4 pl-12 text-xs tracking-widest focus:border-moonlight outline-none transition-all uppercase"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gothic-dark/30 border border-moonlight/10 p-4 pl-12 text-xs tracking-widest focus:border-moonlight outline-none transition-all"
                  />
                </div>
              </div>
              <button className="w-full py-4 bg-moonlight text-void text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-white transition-all">
                Enter Sanctum
              </button>
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setStatus("card")}
                  className="text-[9px] tracking-[0.3em] uppercase opacity-20 hover:opacity-100 transition-opacity"
                >
                  Return to Card Sync
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
