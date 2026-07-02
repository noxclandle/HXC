"use client";

import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, UserCheck, Mail, Lock, CheckCircle2, Fingerprint, Phone, ArrowRight, Loader2, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "fixer" || (session?.user as any)?.role === "admin";
  const rawUid = searchParams.get("uid") || "";
  const uid = rawUid.replace(/:/g, "").toUpperCase();
  const s = searchParams.get("s") || "";

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    password: "",
    phone: "",
    purchase_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0); // 0: Form, 1: Confirm 1, 2: Confirm 2, 3: Confirm 3, 4: Success
  const [confirmStep, setConfirmStep] = useState(0); // 0: None, 1: Profile, 2: Authorization, 3: Finalize
  const [cardInfo, setCardInfo] = useState<any>(null);

  // Dialogue steps for the guide character
  const dialogueLines = [
    {
      text: "――接続、確認。アイデンティティ透過プロトコルを開始します。",
      enText: "...Connection verified. Initiating identity permeation protocol."
    },
    {
      text: "この度は Hexa Card をご購入いただき、誠にありがとうございます。",
      enText: "Thank you very much for purchasing Hexa Card."
    },
    {
      text: "私はあなたのデバイスとデジタルアトリエを繋ぐ、最初の案内人です。",
      enText: "I am your guide, connecting your device with your digital Atelier."
    },
    {
      text: "これから、物理カードをあなたのアカウントに紐付けるための登録（同期）を行います。",
      enText: "We will now register and synchronize your physical card with your account."
    },
    {
      text: "準備はよろしいですか？　それでは、あなたのアイデンティティを教えてください。",
      enText: "Are you ready? Please let me know who you are."
    }
  ];

  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(true);

  const playBeep = () => {
    try {
      const AudioContextClass = typeof window !== "undefined" && (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Ignored
    }
  };

  useEffect(() => {
    if (showDialogue) {
      const timer = setTimeout(() => {
        playBeep();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Admin用のカード情報取得と出荷処理
  useEffect(() => {
    if (isAdmin && uid) {
      fetch(`/api/admin/items?uid=${uid}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setCardInfo(data));
    }
  }, [isAdmin, uid]);

  const handleShipCard = async () => {
    if (!confirm("このカードを出荷済みにしますか？\n注文者情報と一致しているか確認してください。")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, status: "shipped" })
      });
      if (res.ok) {
        alert("出荷処理が完了しました。");
        router.push("/admin/registry");
      }
    } catch (e) {
      alert("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const startConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name || !formData.handle || !formData.phone) {
      setError("必須項目をすべて入力してください。");
      return;
    }
    // 電話番号の簡易バリデーション（数字以外を除去して10桁以上）
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("電話番号は10桁以上で入力してください。");
      return;
    }
    setError("");
    setConfirmStep(1);
  };

  const handleFinalSubmit = async () => {
    if (!uid || !s) {
      setError("物理カードの認証情報が見つかりません。もう一度かざしてください。");
      setConfirmStep(0);
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          uid,
          s
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStep(4);
        
        // デバイス紐付け用トークンを保存
        if (data.deviceToken) {
          localStorage.setItem("hxc_soul_fragment", data.deviceToken);
        }

        // 自動ログインを試行
        const signInRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          setTimeout(() => {
            router.push("/hub");
          }, 3000);
        } else {
          router.push("/login");
        }
      } else {
        setError(data.error || "登録に失敗しました。");
        setConfirmStep(0);
      }
    } catch (err) {
      setError("通信エラーが発生しました。");
      setConfirmStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showDialogue ? (
        <motion.div
          key="dialogue"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={() => {
            playBeep();
            if (dialogueIndex < dialogueLines.length - 1) {
              setDialogueIndex(dialogueIndex + 1);
            } else {
              setShowDialogue(false);
            }
          }}
          className="max-w-md w-full py-12 flex flex-col items-center justify-center min-h-[70vh] cursor-pointer select-none"
        >
          {/* Character Image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 border border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.03)] flex items-center justify-center">
            {/* Ambient azure glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-azure-950/10 via-transparent to-transparent" />
            <Image 
              src="/purchase-guide.png" 
              alt="Guide" 
              width={320}
              height={320}
              priority
              className="w-full h-full object-contain max-h-[85%] animate-pulse"
              style={{ animationDuration: '4s' }}
            />
          </div>

          {/* Dialogue Bubble */}
          <div className="w-full border border-azure-500/20 bg-void/90 p-6 rounded-lg relative space-y-3 min-h-[140px] text-left shadow-[0_0_30px_rgba(59,130,246,0.05)] flex flex-col justify-between">
            <div className="absolute -top-2.5 left-6 bg-void border border-azure-500/30 px-3 py-0.5 rounded text-[8px] tracking-[0.2em] font-bold text-azure-400 uppercase">
              NAVIGATOR / 案内人
            </div>

            <div className="space-y-2 pt-2 font-sans">
              <p className="text-xs md:text-sm text-white/90 tracking-widest leading-relaxed">
                {dialogueLines[dialogueIndex].text}
              </p>
              <p className="text-[9px] md:text-[10px] text-white/40 tracking-wider leading-relaxed font-mono">
                {dialogueLines[dialogueIndex].enText}
              </p>
            </div>

            <div className="flex justify-end text-[7px] tracking-[0.3em] font-bold text-azure-400/60 uppercase animate-pulse font-sans">
              [ Tap / クリックして次へ ]
            </div>
          </div>
        </motion.div>
      ) : step === 0 ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full space-y-10 py-12"
          >
            {/* Admin Shipping Intercept */}
            {isAdmin && (
              <div className="bg-azure-500/10 border border-azure-500/30 p-6 space-y-4 text-left">
                <div className="flex items-center gap-2 text-azure-400 font-bold text-[10px] tracking-widest uppercase">
                  <User size={14} /> Admin Shipping Control
                </div>
                <p className="text-[9px] tracking-widest opacity-60 leading-relaxed uppercase">
                  管理権限を検知しました。このカードを出荷検品しますか？
                </p>
                {cardInfo && (
                  <div className="py-3 border-y border-white/5 space-y-1">
                    <p className="text-[8px] opacity-40 uppercase">Target Order:</p>
                    <p className="text-[10px] text-white uppercase font-bold">{cardInfo.order?.customer_name || "Unknown Order"}</p>
                    <p className="text-[8px] opacity-40 uppercase">Status: {cardInfo.status}</p>
                  </div>
                )}
                <button 
                  onClick={handleShipCard}
                  disabled={loading}
                  className="w-full py-3 bg-azure-500 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-azure-400 transition-all"
                >
                  {loading ? "Processing..." : "Confirm Shipment"}
                </button>
              </div>
            )}

            <header className="space-y-4">
              <div className="w-12 h-12 border border-azure-500/30 bg-azure-500/5 flex items-center justify-center mx-auto rotate-45 mb-6">
                 <Hexagon size={20} className="text-azure-400 -rotate-45" />
              </div>
              <h2 className="text-2xl tracking-[0.4em] uppercase font-light text-white">Create Profile</h2>
              <p className="text-[12px] tracking-[0.2em] font-bold text-azure-400">
                カードの認証に成功しました。<br />
                あなたの情報を入力して、利用を開始してください。
              </p>
            </header>

            {/* Step Indicator */}
            <div className="flex justify-between items-center px-4 py-2 bg-white/[0.03] border border-white/5 rounded-sm">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i === 1 ? 'bg-azure-500 text-white' : 'bg-white/10 text-white/40'}`}>
                       {i}
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest ${i === 1 ? 'text-white' : 'text-white/20'}`}>
                       {i === 1 ? "入力" : i === 2 ? "確認" : "完了"}
                    </span>
                 </div>
               ))}
            </div>

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
            
            <form onSubmit={startConfirmation} className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 font-bold"><UserCheck size={14}/> 氏名 (必須)</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例：佐々木 大輔"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 tracking-widest focus:border-azure-500 outline-none transition-all text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 font-bold"><Fingerprint size={14}/> フリガナ (必須)</label>
                  <input
                    type="text" required value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    placeholder="例：ササキ ダイスケ"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 tracking-widest focus:border-azure-500 outline-none transition-all text-white text-xs"
                  />
                </div>
              </div>

              {[
                { label: "電話番号 (必須)", key: "phone", icon: <Phone size={14}/>, placeholder: "090-0000-0000", type: "tel" }, { label: "メールアドレス (ログイン用)", key: "email", icon: <Mail size={14}/>, placeholder: "your@email.com", type: "email" },
                { label: "パスワード (8文字以上)", key: "password", icon: <Lock size={14}/>, placeholder: "••••••••", type: "password" },
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 font-bold">{f.icon} {f.label}</label>
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
                className="w-full py-6 bg-white text-void font-bold text-[12px] tracking-[0.6em] uppercase shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:bg-azure-50 transition-all mt-8 active:scale-[0.98] disabled:opacity-50"
              >
                次へ進む / Confirm
              </button>
            </form>

            {/* Triple Confirmation Overlays */}
            <AnimatePresence>
              {confirmStep > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-void/90 backdrop-blur-md flex items-center justify-center p-6"
                >
                  <div className="max-w-xs w-full text-center space-y-12">
                    <div className="space-y-4">
                      <div className="text-azure-400 opacity-50 text-[10px] tracking-[0.4em] uppercase font-bold">Step {confirmStep} / 3</div>
                      <h3 className="text-xl tracking-[0.3em] uppercase font-light">
                        {confirmStep === 1 && "Confirm Profile"}
                        {confirmStep === 2 && "Register Card"}
                        {confirmStep === 3 && "Finalize Setup"}
                      </h3>
                      <p className="text-[9px] tracking-[0.1em] opacity-40 leading-relaxed uppercase">
                        {confirmStep === 1 && "入力された情報は永続的に保存されます。間違いはありませんか？"}
                        {confirmStep === 2 && "この物理カードをあなたのアカウントに紐付けます。よろしいですか？"}
                        {confirmStep === 3 && "最終的な保存プロセスを開始します。この操作は取り消せません。"}
                      </p>

                      {confirmStep === 1 && (
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded text-left space-y-2.5 mt-6 max-w-sm mx-auto font-sans">
                          <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                            <span className="opacity-40 uppercase tracking-widest text-[8px]">氏名 / Name</span>
                            <span className="text-white font-bold tracking-wider">{formData.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                            <span className="opacity-40 uppercase tracking-widest text-[8px]">フリガナ / Reading</span>
                            <span className="text-white font-bold tracking-wider">{formData.handle}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                            <span className="opacity-40 uppercase tracking-widest text-[8px]">電話番号 / Phone</span>
                            <span className="text-white font-bold tracking-wider">{formData.phone}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] pb-0.5">
                            <span className="opacity-40 uppercase tracking-widest text-[8px]">メールアドレス / Email</span>
                            <span className="text-white font-bold tracking-wider">{formData.email}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => {
                          if (confirmStep < 3) setConfirmStep(confirmStep + 1);
                          else handleFinalSubmit();
                        }}
                        disabled={loading}
                        className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.6em] uppercase hover:bg-azure-50 transition-all"
                      >
                        {loading ? "Processing..." : (
                          confirmStep === 1 ? "Confirm Profile" :
                          confirmStep === 2 ? "Register Card" :
                          "Save Now"
                        )}
                      </button>
                      <button 
                        onClick={() => setConfirmStep(0)}
                        disabled={loading}
                        className="w-full py-5 border border-white/10 text-white/40 font-bold text-[10px] tracking-[0.6em] uppercase hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <h2 className="text-3xl tracking-[0.6em] uppercase font-extralight text-white">Setup Complete</h2>
            <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase mt-4">
               プロフィールの保存が完了しました。まもなくホームへ遷移します。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
  );
}

export default function IdentityRegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-void text-moonlight overflow-x-hidden">
      <Suspense fallback={<div className="text-white opacity-10 uppercase tracking-[1em] text-[10px]">Loading...</div>}>
        <RegisterContent />
      </Suspense>
    </main>
  );
}
