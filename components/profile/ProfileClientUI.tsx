"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Download, Share2, ArrowRight, ShieldCheck, Sparkles, Smartphone, Layers, Network, AlertCircle, ChevronDown, QrCode } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import GeometricBackground from "@/components/background/GeometricBackground";
import ConnectionInteraction from "@/components/ui/ConnectionInteraction";
import Link from "next/link";
import ResidentAgent from "@/components/agent/ResidentAgent";
import { useSession, signIn } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { Send, MessageSquare, Edit3, CheckCircle2, Loader2, FileText, ExternalLink } from "lucide-react";

export default function ProfileClientUI({ data, isOwner }: { data: any, isOwner?: boolean }) {
  const { status } = useSession();
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  // Portfolio Links
  const portfolioLinks = data.portfolio_links || [];

  // Local Memo (Observation Log) State
  const [memo, setMemo] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMemo = localStorage.getItem(`hxc_memo_${data.id}`);
      if (savedMemo) setMemo(savedMemo);
    }
  }, [data.id]);

  const handleSaveMemo = (val: string) => {
    setMemo(val);
    localStorage.setItem(`hxc_memo_${data.id}`, val);
  };

  // Message Form State
  const [messageForm, setMessageForm] = useState({ name: "", company: "", content: "" });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMessage(true);
    try {
      const res = await fetch("/api/card/message", {
        method: "POST",
        body: JSON.stringify({
          sender_name: messageForm.name,
          sender_company: messageForm.company,
          content: messageForm.content,
          target_user_id: data.id
        })
      });
      if (res.ok) {
        setMessageSent(true);
        setMessageForm({ name: "", company: "", content: "" });
      }
    } catch (e) { console.error(e); }
    finally { setSendingMessage(false); }
  };

  const soulLinkAttempted = useRef(false);
  useEffect(() => {
    // 魂の同調チェック（未ログインかつ、この端末の持ち主である場合のみ試行）
    const trySoulLink = async () => {
      if (soulLinkAttempted.current) return;
      const token = localStorage.getItem("hxc_soul_fragment");
      if (token && !isOwner && status === "unauthenticated") {
        soulLinkAttempted.current = true;
        const res = await signIn("soul-link", {
          deviceToken: token,
          redirect: false
        });
        if (res?.ok) {
           window.location.reload(); // 成功時のみ1度だけリロードし、主として認識させる
        }
      }
    };
    trySoulLink();
  }, [isOwner, status]);

  const handleSaveContact = async () => {
    if (!data) return;

    // iPhone向けの高級感のある振動
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 10, 30]);
    }

    // サーバーサイドで生成された確実に画像が埋め込まれたvCardをダウンロードする
    const slug = data.handle_name || data.id;
    window.location.href = `/api/profile/${slug}/vcard`;
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setReporting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        body: JSON.stringify({ targetUserId: data.id, reason: reportReason })
      });
      if (res.ok) {
        alert("Report submitted.");
        setShowReport(false);
      }
    } catch (e) { console.error(e); }
    finally { setReporting(false); }
  };

  const defaultAlign = "center";
  const rawEquipped = data.equipped_assets || {};
  const currentOrientation = rawEquipped.orientation || "horizontal";
  const currentAligns = currentOrientation === 'horizontal' ? (rawEquipped.hAlign || {}) : (rawEquipped.vAlign || {});

  return (
    <main className="min-h-screen bg-void text-moonlight relative overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-col items-center">
      <GeometricBackground />
      <ConnectionInteraction />
      {isOwner && <ResidentAgent />}

      {!isOwner && (
        <button onClick={() => setShowReport(true)} className="fixed top-8 right-8 z-50 p-3 border border-white/5 bg-white/[0.02] text-white/20 hover:text-rose-500 hover:border-rose-500/20 transition-all group" title="Report Identity">
           <AlertCircle size={16} />
        </button>
      )}

      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-void/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 space-y-6">
               <h3 className="text-sm tracking-[0.4em] uppercase font-bold text-white">Report Identity</h3>
               <textarea 
                 value={reportReason}
                 onChange={(e) => setReportReason(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 p-4 text-[11px] tracking-widest outline-none focus:border-rose-500 transition-all h-32 resize-none text-white font-sans"
                 placeholder="詳細な理由を記載してください"
               />
               <div className="flex gap-4">
                  <button onClick={() => setShowReport(false)} className="flex-1 py-3 border border-white/10 text-[9px] uppercase tracking-widest text-white/40">Cancel</button>
                  <button onClick={handleReport} disabled={reporting} className="flex-1 py-3 bg-rose-600 text-white font-bold text-[9px] uppercase tracking-[0.3em]">{reporting ? "Sending..." : "Submit Report"}</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6">
        <header className="text-center space-y-2 mb-20">
           <p className="text-[9px] tracking-[0.8em] uppercase opacity-20 font-bold text-white">{isOwner ? "Owner Access" : "User Profile"}</p>
           <div className="h-px w-8 bg-white/10 mx-auto" />
           {isOwner && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <Link href="/hub" className="text-[10px] tracking-[0.4em] uppercase text-azure-400 hover:text-white transition-colors border border-azure-500/20 px-4 py-2 bg-azure-500/5">Go to Home / 拠点へ移動</Link>
             </motion.div>
           )}
        </header>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-full flex flex-col items-center gap-12 transition-all duration-1000"
        >
          <UnifiedCardContainer orientation={currentOrientation} showControls={false} previewLabel="">
            <HexaCardPreview 
              name={data.name} reading={data.handle_name} company={data.profile.company} title={data.profile.title}
              phone={data.phone} email={data.profile.contact_email || data.email} bio={data.profile.bio}
              logoUrl={data.logo_url} faceUrl={data.photo_url}
              frame={rawEquipped.frame} background={rawEquipped.background} effect={rawEquipped.effect} fontFamily={rawEquipped.fontFamily || rawEquipped.font}
              sound={rawEquipped.sound} link_x={data.link_x} link_instagram={data.link_instagram} link_line={data.link_line} link_facebook={data.link_facebook} link_hp={data.profile?.website}
              orientation={currentOrientation}
              alignCompany={currentAligns.company || defaultAlign}
              alignName={currentAligns.name || defaultAlign}
              alignReading={currentAligns.reading || defaultAlign}
              alignTitle={currentAligns.title || defaultAlign}
              alignPhone={currentAligns.phone || defaultAlign}
              alignEmail={currentAligns.email || defaultAlign}
            />
          </UnifiedCardContainer>
        </motion.div>

        <div className="w-full max-w-sm space-y-6 mt-20">
           {portfolioLinks.length > 0 && (
             <div className="space-y-4 mb-12">
                <p className="text-[9px] tracking-[0.4em] uppercase text-azure-400 font-bold text-center mb-6">Documents & Portfolio</p>
                {portfolioLinks.map((link: any, i: number) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <FileText size={16} className="text-white/30 group-hover:text-white transition-colors" />
                       <span className="text-[10px] tracking-widest uppercase font-bold text-white/80">{link.title}</span>
                    </div>
                    <ExternalLink size={14} className="opacity-10 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
             </div>
           )}

           <button onClick={handleSaveContact} className="w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1em] uppercase shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:bg-azure-500 transition-all flex items-center justify-center gap-4 group">
              <Download size={14} className="group-hover:translate-y-1 transition-transform" /> Save Contact
           </button>
           <button onClick={() => { if (navigator.share) navigator.share({ title: data.name, url: window.location.href }); else { navigator.clipboard.writeText(window.location.href); alert("URL Copied."); } }} className="w-full py-5 border border-white/10 bg-white/[0.02] text-[10px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-white/60">
              <Share2 size={12} /> Share Identity
           </button>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-3 opacity-20">
           <span className="text-[7px] tracking-[0.4em] uppercase text-white">Learn More</span>
           <ChevronDown size={14} className="text-white" />
        </motion.div>
      </div>

      {/* Observation Log & Messaging Section */}
      <section className="relative z-10 w-full max-w-lg mx-auto py-24 px-6 space-y-24 border-t border-white/5">
         {/* Observation Log (Local Only) */}
         <div className="space-y-8">
            <header className="flex items-center gap-4">
               <Edit3 className="text-azure-400" size={18} />
               <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white">Observation Log</h3>
               <span className="text-[8px] tracking-[0.2em] uppercase opacity-20 ml-auto">Local Archive Only</span>
            </header>
            <p className="text-[9px] tracking-widest text-white/30 leading-relaxed uppercase">
              この人物に関するあなた専用のメモです。サーバーには送信されず、この端末にのみ保存されます。
            </p>
            <textarea 
              value={memo}
              onChange={(e) => handleSaveMemo(e.target.value)}
              placeholder="MEMO..."
              className="w-full bg-white/[0.02] border border-white/10 p-6 text-xs tracking-widest outline-none focus:border-azure-500/50 transition-all h-32 resize-none text-white font-sans uppercase"
            />
         </div>

         {/* Identity Contact (Message to Owner) */}
         <div className="space-y-8">
            <header className="flex items-center gap-4">
               <MessageSquare className="text-rose-400" size={18} />
               <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white">Transmit Message</h3>
               <span className="text-[8px] tracking-[0.2em] uppercase opacity-20 ml-auto">Secure Channel</span>
            </header>
            
            {messageSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4">
                 <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                 <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold">Transmission Complete</p>
                 <p className="text-[8px] tracking-widest text-white/40 uppercase">メッセージを送信しました。管理局にて精査されます。</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      required
                      placeholder="NAME / お名前"
                      value={messageForm.name}
                      onChange={(e) => setMessageForm({...messageForm, name: e.target.value})}
                      className="bg-white/[0.02] border border-white/10 p-4 text-[10px] tracking-widest outline-none focus:border-white/30 text-white uppercase"
                    />
                    <input 
                      placeholder="COMPANY / 社名 (OPTIONAL)"
                      value={messageForm.company}
                      onChange={(e) => setMessageForm({...messageForm, company: e.target.value})}
                      className="bg-white/[0.02] border border-white/10 p-4 text-[10px] tracking-widest outline-none focus:border-white/30 text-white uppercase"
                    />
                 </div>
                 <textarea 
                   required
                   rows={4}
                   placeholder="YOUR MESSAGE..."
                   value={messageForm.content}
                   onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                   className="w-full bg-white/[0.02] border border-white/10 p-6 text-[10px] tracking-widest outline-none focus:border-white/30 transition-all resize-none text-white font-sans uppercase"
                 />
                 <button 
                   disabled={sendingMessage}
                   className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.5em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                   {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Transmit Identity Message</>}
                 </button>
              </form>
            )}
         </div>
      </section>

      {/* Digital QR Exchange Section */}
      <section className="relative z-10 w-full max-w-lg mx-auto py-24 px-6 border-t border-white/5 flex flex-col items-center space-y-12">
         <div className="text-center space-y-4">
            <h3 className="text-[10px] tracking-[0.5em] uppercase font-bold text-azure-400">Digital Handshake</h3>
            <p className="text-[8px] tracking-[0.2em] uppercase opacity-40">物理カードがない場合は、このQRを読み取ってください</p>
         </div>
         
         <div className="p-6 bg-white border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)] rounded-xl relative group">
            <div className="absolute inset-[-10px] border border-azure-500/20 rounded-2xl animate-pulse" />
            <QRCodeSVG 
              value={typeof window !== "undefined" ? window.location.href : `https://virtual-business-card.hexa-relation.com/p/${data.handle_name || data.id}`}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#020202"
              bgColor="#FFFFFF"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-void flex items-center justify-center rounded-sm">
               <QrCode size={16} className="text-void" />
            </div>
         </div>

         <p className="text-[7px] tracking-[0.4em] uppercase opacity-20 italic">Encrypted via Hexa System</p>
      </section>

      {/* Feature section */}
      <section className="relative z-10 w-full max-w-5xl py-48 px-6 border-t border-white/5 space-y-32">
         <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-5xl tracking-[0.2em] font-extralight uppercase text-white leading-tight">あなたも、次世代の<br />デジタル名刺を<br />始めてみませんか？</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
            {[
              { title: "Physical Sync", desc: "物理カードとデジタルが1:1で同調。タップ一つで相手の記憶に刻まれます。" },
              { title: "Total Control", desc: "デザイン、配置、ロゴ、自画像。すべてをあなたの意志で調律可能。" },
              { title: "Star Chart", desc: "繋がった人脈は「星座」として記録され、あなたの影響力を可視化します。" },
            ].map((f, i) => (
              <div key={i} className="space-y-4 p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group text-white">
                 <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white/80">{f.title}</h3>
                 <p className="text-[9px] tracking-widest leading-loose opacity-40 uppercase">{f.desc}</p>
              </div>
            ))}
         </div>
         <div className="text-center py-20 bg-azure-500/[0.02] border border-azure-500/10 backdrop-blur-sm relative overflow-hidden">
            <Link href="/purchase" className="inline-flex items-center gap-6 px-16 py-6 bg-white text-void font-bold text-[11px] tracking-[1.2em] uppercase hover:bg-azure-50 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 group">Order Your Identity / カードを申し込む <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></Link>
         </div>
      </section>
    </main>
  );
}
