"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const subjectParam = params.get("subject");
      if (subjectParam) {
        setFormData(prev => ({ ...prev, subject: subjectParam }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle className="text-azure-400 mx-auto mb-8" size={64} strokeWidth={1} />
          <h1 className="text-2xl tracking-[0.4em] font-light mb-6">送信完了 / Message Sent</h1>
          <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase leading-relaxed max-w-sm mx-auto mb-12">
            メッセージを受け取りました。内容を確認の上、順次ご返答いたします。<br /><br />
            Message received. We will check the content and respond to you shortly.
          </p>
          <Link href="/" className="px-10 py-4 border border-white/10 text-[9px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
            ゲートウェイに戻る / Return to Gateway
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-40 px-6 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <header className="text-center mb-20">
          <h1 className="text-2xl tracking-[0.4em] font-light mb-4">お問い合わせ / Contact</h1>
          <p className="text-[9px] tracking-[0.2em] opacity-30 uppercase italic">お問い合わせフォーム / Inquiry Form</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[8px] uppercase tracking-[0.3em] opacity-40 ml-1">お名前 / Full Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="YOUR NAME"
              className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-white/30 transition-all uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] uppercase tracking-[0.3em] opacity-40 ml-1">メールアドレス / Email Address</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ADDRESS@EXAMPLE.COM"
              className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] uppercase tracking-[0.3em] opacity-40 ml-1">件名 / Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="SUBJECT"
              className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-white/30 transition-all uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] uppercase tracking-[0.3em] opacity-40 ml-1">内容 / Message</label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="YOUR MESSAGE..."
              className="w-full bg-white/[0.02] border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-white/30 transition-all uppercase resize-none"
            />
          </div>

          <div className="pt-6">
            <button
              disabled={status === "loading"}
              className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  送信する / Send Message
                </>
              )}
            </button>
            {status === "error" && (
              <p className="text-[9px] text-rose-500 uppercase tracking-widest mt-4 text-center">送信に失敗しました。再試行してください。 / Transmission failed. Please try again.</p>
            )}
          </div>
        </form>

        <div className="mt-24 border-t border-white/5 pt-12 text-center">
          <p className="text-[9px] tracking-[0.3em] opacity-20 uppercase mb-8">ソーシャルリンク / Social Links</p>
          <div className="flex justify-center gap-12 text-[10px] tracking-[0.2em] opacity-40">
            <a href="https://x.com/HexaRelation" target="_blank" className="hover:opacity-100 transition-opacity">X (TWITTER)</a>
            <span className="opacity-10 cursor-default">INSTAGRAM</span>
          </div>
        </div>
      </div>
    </main>
  );
}
