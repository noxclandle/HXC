"use client";

import { useState, useEffect } from "react";
import { Mail, MessageSquare, Send, CheckCircle, Clock, Search, Reply } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logger } from "@/lib/logger";

export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/contacts/list");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      logger.error("Failed to fetch inquiries", { error: err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReply = async () => {
    if (!replyText || !selectedInquiry) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/contacts/update", {
        method: "POST",
        body: JSON.stringify({
          id: selectedInquiry.id,
          replyText,
          status: "replied"
        })
      });

      if (res.ok) {
        setReplyText("");
        fetchInquiries();
        const updated = await res.json();
        setSelectedInquiry(updated);
      }
    } catch (err) {
      logger.error("Failed to send reply", { error: err });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedInquiry) return;
    const label = status === "closed" ? "対応完了" : "未対応";
    if (!confirm(`この問い合わせを「${label}」にしますか？`)) return;

    try {
      const res = await fetch("/api/admin/contacts/update", {
        method: "POST",
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: status
        })
      });

      if (res.ok) {
        fetchInquiries();
        const updated = await res.json();
        setSelectedInquiry(updated);
      }
    } catch (err) {
      logger.error("Failed to update inquiry status", { error: err });
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="px-2 py-0.5 border border-amber-500/20 text-amber-500 bg-amber-500/5 text-[8px] uppercase font-bold tracking-widest">Pending</span>;
      case "replied": return <span className="px-2 py-0.5 border border-azure-500/20 text-azure-500 bg-azure-500/5 text-[8px] uppercase font-bold tracking-widest">Replied</span>;
      case "closed": return <span className="px-2 py-0.5 border border-white/10 text-white/20 bg-white/5 text-[8px] uppercase font-bold tracking-widest">Closed</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-12 bg-void text-moonlight min-h-screen">
      <header className="mb-12 border-b border-white/10 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-xl tracking-[0.6em] uppercase flex items-center gap-4">
            <MessageSquare className="text-moonlight opacity-40" size={20} />
            Inquiry Oversight
          </h1>
          <p className="text-[10px] tracking-widest opacity-40 uppercase mt-2">問い合わせ監視局：全接続要求の精査と対応</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3 mb-6 opacity-40">
             <Search size={14} />
             <span className="text-[9px] uppercase tracking-[0.3em]">Communication Logs</span>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            {loading ? (
              <div className="py-12 text-center text-[10px] uppercase opacity-20 animate-pulse">同期中...</div>
            ) : inquiries.length === 0 ? (
              <div className="py-12 text-center text-[10px] uppercase opacity-10 italic">記録なし</div>
            ) : (
              inquiries.map((inq) => (
                <div 
                  key={inq.id} 
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-5 border transition-all cursor-pointer group ${
                    selectedInquiry?.id === inq.id 
                      ? "border-azure-500/40 bg-azure-500/5" 
                      : "border-white/5 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    {statusBadge(inq.status)}
                    <span className="text-[8px] opacity-20 font-mono">{new Date(inq.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-[11px] font-bold tracking-wider mb-1 truncate">{inq.subject}</h3>
                  <p className="text-[10px] opacity-40 truncate">{inq.name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail Section */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {selectedInquiry ? (
               <motion.div 
                 key={selectedInquiry.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 <div className="p-8 border border-white/10 bg-white/[0.01]">
                    <div className="flex justify-between items-start mb-8">
                       <div className="space-y-2">
                         <span className="text-[9px] tracking-[0.4em] uppercase opacity-40 block">Originator Identity</span>
                         <h2 className="text-lg font-light tracking-widest">{selectedInquiry.name}</h2>
                         <p className="text-[10px] text-azure-400 font-mono opacity-60">{selectedInquiry.email}</p>
                       </div>
                       <div className="flex flex-col items-end gap-4">
                         <div className="text-right space-y-1">
                           <span className="text-[9px] tracking-[0.4em] uppercase opacity-40 block">Received At</span>
                           <p className="text-[10px] font-mono">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                         </div>
                         {selectedInquiry.status !== "closed" ? (
                           <button 
                             onClick={() => handleStatusUpdate("closed")}
                             className="flex items-center gap-2 px-4 py-1.5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400/60 hover:text-emerald-400 transition-all text-[8px] uppercase tracking-widest font-bold"
                           >
                              <CheckCircle size={12} /> 対応済みにする
                           </button>
                         ) : (
                           <button 
                             onClick={() => handleStatusUpdate("pending")}
                             className="flex items-center gap-2 px-4 py-1.5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-400/60 hover:text-amber-400 transition-all text-[8px] uppercase tracking-widest font-bold"
                           >
                              <Clock size={12} /> 未対応に戻す
                           </button>
                         )}
                       </div>
                    </div>

                    <div className="space-y-3 mb-12">
                       <span className="text-[9px] tracking-[0.4em] uppercase opacity-40 block">Transmission Content</span>
                       <div className="p-6 bg-white/[0.03] border border-white/5 text-xs leading-relaxed tracking-widest whitespace-pre-wrap">
                          {selectedInquiry.message}
                       </div>
                    </div>

                    {/* Replies */}
                    {selectedInquiry.replies && (selectedInquiry.replies as any[]).length > 0 && (
                      <div className="space-y-6 mb-12 border-t border-white/5 pt-12">
                         <span className="text-[9px] tracking-[0.4em] uppercase opacity-40 block">Communication History</span>
                         <div className="space-y-4">
                            {(selectedInquiry.replies as any[]).map((r, i) => (
                              <div key={i} className="flex flex-col gap-2 pl-6 border-l border-azure-500/20">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-azure-400 font-bold uppercase tracking-widest">{r.sender}</span>
                                    <span className="text-[8px] opacity-20 font-mono">{new Date(r.created_at).toLocaleString()}</span>
                                 </div>
                                 <p className="text-[11px] opacity-60 tracking-wider leading-relaxed">{r.text}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    <div className="space-y-4 pt-12 border-t border-white/5">
                       <span className="text-[9px] tracking-[0.4em] uppercase opacity-40 block">Authorize Response</span>
                       <textarea 
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         placeholder="返信内容を入力..."
                         className="w-full bg-void border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-azure-500/40 transition-all resize-none h-32"
                       />
                       <div className="flex justify-end">
                          <button 
                            onClick={handleReply}
                            disabled={!replyText || isSubmitting}
                            className="flex items-center gap-3 px-10 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all disabled:opacity-30"
                          >
                             {isSubmitting ? "送信中..." : <><Reply size={14} /> Send Response</>}
                          </button>
                       </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 border border-dashed border-white/20">
                  <Mail size={48} strokeWidth={1} />
                  <p className="mt-6 text-[10px] uppercase tracking-[0.6em]">Select a transmission to inspect</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
