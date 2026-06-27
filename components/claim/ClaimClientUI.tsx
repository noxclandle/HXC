"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { playConnectionSound } from "@/lib/audio/resonance";
import HexaCardPreview, { mapUserToCardProps } from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import { Loader2, KeyRound, Mail, User, ShieldAlert } from "lucide-react";
import { signIn } from "next-auth/react";

interface SerializedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  notes: string;
}

interface ClaimClientUIProps {
  contact: SerializedContact;
}

export default function ClaimClientUI({ contact }: ClaimClientUIProps) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(contact.email);
  const [name, setName] = useState(contact.name);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // カード表示用のモックユーザーオブジェクトを作成
  const mockUserForCard = {
    name: name,
    handle_name: contact.role, // 肩書
    email: email,
    phone: contact.phone,
    profile: {
      title: contact.role,
      company: "",
      bio: "Digitized via HXC."
    },
    equipped: {
      frame: "Obsidian",
      background: "Default",
      effect: "None",
      aura: "None"
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setErrorMessage("パスワードは8文字以上である必要があります。 / Password must be at least 8 characters.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    playConnectionSound("resonance");

    try {
      const res = await fetch("/api/register/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          email,
          name,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to finalize card claim.");
      }

      // クライアント側ローカルストレージにデバイストークンを保存
      if (data.deviceToken) {
        localStorage.setItem("hxc_soul_fragment", data.deviceToken);
      }

      setStatus("success");
      playConnectionSound("silver");

      // NextAuthで自動ログインしHubへリダイレクト
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (loginResult?.error) {
        // フォールバック: credentialsがダメな場合はdevice-tokenを試す
        await signIn("soul-link", {
          deviceToken: data.deviceToken,
          redirect: false
        });
      }

      setTimeout(() => {
        router.push("/hub");
      }, 2000);

    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during activation.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center p-6 relative overflow-y-auto select-none">
      {/* Background Ambience (Zero-Canvas Policy compliant pure CSS gradients) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.02)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      <div className="w-full max-w-md z-10 py-12 flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-12 space-y-2">
          <span className="text-[8px] tracking-[0.4em] text-azure-400 font-bold uppercase">Identity Transmitted</span>
          <h1 className="text-2xl font-extralight tracking-[0.2em] text-white">境界の透過 / CLAIM CARD</h1>
          <p className="text-[9px] tracking-widest text-white/30 leading-relaxed uppercase">
            あなたの紙名刺がデジタルに変換されました。<br />
            パスワードを設定してこのデジタル名刺を受け取りましょう。
          </p>
        </header>

        {/* 3D Holographic Card Render */}
        <div className="w-full flex justify-center mb-12">
          <UnifiedCardContainer orientation="horizontal" showControls={false} previewLabel="">
            <HexaCardPreview 
              {...mapUserToCardProps(mockUserForCard, "horizontal")}
            />
          </UnifiedCardContainer>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white/[0.01] border border-white/5 backdrop-blur-md p-8 relative overflow-hidden rounded-sm">
          {/* Inner accent line */}
          <div className="absolute top-0 left-0 w-1 h-full bg-azure-500/20" />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-12 h-12 rounded-full border border-azure-500/30 bg-azure-500/5 flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-azure-400 text-lg">✓</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold tracking-[0.2em] text-white">アクティベート完了</h3>
                  <p className="text-[10px] tracking-widest text-white/40">
                    あなたのアイデンティティが同期されました。<br />
                    HXC Hubへと接続しています...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleClaim}
                className="space-y-6"
              >
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-white/40 flex items-center gap-2">
                    <User size={10} /> Name / 氏名
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-[11px] tracking-widest text-white focus:border-azure-500 outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-white/40 flex items-center gap-2">
                    <Mail size={10} /> Email / メールアドレス
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-[11px] tracking-widest text-white focus:border-azure-500 outline-none transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-white/40 flex items-center gap-2">
                    <KeyRound size={10} /> Choose Password / パスワード設定 (8文字以上)
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-[11px] tracking-widest text-white focus:border-azure-500 outline-none transition-all"
                  />
                </div>

                {/* Feedback Messages */}
                {status === "error" && (
                  <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 flex items-start gap-3">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <p className="text-[9px] tracking-widest leading-relaxed">{errorMessage}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-5 bg-white text-void font-bold text-[10px] uppercase tracking-[0.6em] shadow-[0_0_35px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-void" />
                      Synchronizing...
                    </>
                  ) : (
                    "Claim & Activate / デジタル名刺を有効化"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info link */}
        <footer className="mt-12 text-center">
          <p className="text-[8px] tracking-widest text-white/20">
            Hexa Relation (HXC) — Empowering individual identity boundaries.
          </p>
        </footer>
      </div>
    </main>
  );
}
