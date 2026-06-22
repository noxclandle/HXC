"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, MessageSquare, Calendar, Trash2, Eye, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/ConnectionToast";

interface CardMessage {
  id: string;
  sender_name: string;
  sender_company: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function MailboxPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<CardMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<CardMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/user/messages", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
      showToast("メッセージの取得に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectMessage = async (msg: CardMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      // Mark as read
      try {
        const res = await fetch("/api/user/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId: msg.id }),
        });
        if (res.ok) {
          // Update local state
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
          );
          // Dispatch status updated event for Concierge to refresh unread count
          window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-24 text-moonlight">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
            Back to Atelier / アトリエへ戻る
          </Link>
          <h1 className="text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.4em] uppercase font-extralight text-white">
            Mailbox / 受信ボックス
          </h1>
          <p className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-40">
            Messages transmitted from your physical card / 送信されたメッセージ
          </p>
        </div>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 w-full bg-white/5 border border-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-xl space-y-4 bg-void/50">
          <Mail size={32} className="mx-auto opacity-20" />
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40">No messages received yet</p>
          <p className="text-[8px] tracking-[0.2em] uppercase opacity-20">名刺を渡した相手がメッセージを送るとここに届きます</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* List of Messages */}
          <div className={`${selectedMessage ? "md:col-span-6 hidden md:block" : "md:col-span-12"} space-y-4`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-5 border cursor-pointer transition-all duration-300 rounded-lg flex flex-col justify-between h-28 relative group overflow-hidden ${
                  selectedMessage?.id === msg.id
                    ? "border-azure-500/40 bg-azure-500/[0.03]"
                    : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                }`}
              >
                {!msg.is_read && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-azure-400 rounded-bl-lg shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                )}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-white">
                      {msg.sender_name}
                    </span>
                    <span className="text-[8px] opacity-30 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {msg.sender_company && (
                    <p className="text-[9px] opacity-40 uppercase tracking-widest font-mono">
                      {msg.sender_company}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                  <p className="text-[9px] opacity-60 line-clamp-1 pr-6 font-sans">
                    {msg.content}
                  </p>
                  <ChevronRight
                    size={12}
                    className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-azure-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Message View */}
          {selectedMessage && (
            <div className="md:col-span-6 space-y-4">
              <div className="p-6 border border-white/10 bg-gothic-dark relative rounded-xl shadow-2xl overflow-hidden min-h-[350px] flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/30 to-transparent" />
                
                <div className="space-y-6">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <div className="text-[8px] tracking-[0.2em] uppercase font-bold text-azure-400">
                        TRANSMISSION RECEIVED
                      </div>
                      <h2 className="text-lg tracking-widest uppercase font-light text-white mt-1">
                        {selectedMessage.sender_name}
                      </h2>
                      {selectedMessage.sender_company && (
                        <p className="text-[9px] opacity-40 uppercase tracking-widest font-mono mt-0.5">
                          {selectedMessage.sender_company}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="md:hidden text-[9px] uppercase tracking-wider text-azure-400 underline"
                    >
                      Close / 戻る
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 opacity-30 text-[8px] tracking-widest uppercase font-mono">
                      <Calendar size={10} />
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                    <div className="text-xs leading-relaxed tracking-widest text-white/80 whitespace-pre-wrap font-sans bg-void/50 p-4 border border-white/5 rounded-lg max-h-[220px] overflow-y-auto">
                      {selectedMessage.content}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4 border-t border-white/5 pt-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-6 py-2 border border-white/5 text-[9px] tracking-[0.3em] hover:bg-white/5 transition-all text-white/40 hover:text-white uppercase rounded-sm"
                  >
                    Deselect / 一覧へ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
