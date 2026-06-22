"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Download, Share2, ArrowRight, ShieldCheck, Sparkles, Smartphone, Layers, Network, AlertCircle, ChevronDown, QrCode } from "lucide-react";
import HexaCardPreview, { mapUserToCardProps } from "@/components/ui/HexaCardPreview";
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
              {...mapUserToCardProps(data, currentOrientation, rawEquipped)}
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

      {/* Messaging Section */}
      <section className="relative z-10 w-full max-w-lg mx-auto py-24 px-6 space-y-24 border-t border-white/5">
         {/* Identity Contact (Message to Owner) */}
         <div className="space-y-8">
            <header className="flex items-center gap-4">
               <MessageSquare className="text-rose-400" size={18} />
               <h3 className="text-[11px] tracking-[0.2em] lg:tracking-[0.4em] uppercase font-bold text-white">Transmit Message / メッセージ送信</h3>
               <span className="text-[8px] tracking-[0.2em] uppercase opacity-20 ml-auto">Secure Channel / 暗号化通信</span>
            </header>
            
            {messageSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4">
                 <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                 <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold">Transmission Complete / 送信完了</p>
                 <p className="text-[8px] tracking-widest text-white/40 uppercase">メッセージを送信しました。相手に届くまでお待ちください。</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      required
                      placeholder="NAME / お名前 (必須)"
                      value={messageForm.name}
                      onChange={(e) => setMessageForm({...messageForm, name: e.target.value})}
                      className="bg-white/[0.02] border border-white/10 p-4 text-[10px] tracking-widest outline-none focus:border-white/30 text-white"
                    />
                    <input 
                      placeholder="COMPANY / 社名・組織名"
                      value={messageForm.company}
                      onChange={(e) => setMessageForm({...messageForm, company: e.target.value})}
                      className="bg-white/[0.02] border border-white/10 p-4 text-[10px] tracking-widest outline-none focus:border-white/30 text-white"
                    />
                 </div>
                 <textarea 
                   required
                   rows={4}
                   placeholder="YOUR MESSAGE / メッセージ内容を入力してください... (必須)"
                   value={messageForm.content}
                   onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                   className="w-full bg-white/[0.02] border border-white/10 p-6 text-[10px] tracking-widest outline-none focus:border-white/30 transition-all resize-none text-white font-sans"
                 />
                 <button 
                   disabled={sendingMessage}
                   className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.3em] lg:tracking-[0.5em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                   {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Transmit Message / メッセージを送信する</>}
                 </button>
              </form>
            )}
         </div>
      </section>

      {/* Digital QR Exchange Section */}
      {isOwner && (
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
      )}

      {/* Feature section */}
      {!isOwner && (
        <section className="relative z-10 w-full max-w-5xl py-48 px-6 border-t border-white/5 space-y-32">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-5xl tracking-[0.2em] font-extralight uppercase text-white leading-tight">あなたも、次世代の<br />デジタル名刺を<br />始めてみませんか？</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* Card 1: Touch Resonance / NFC連携と共鳴 */}
            <div className="space-y-6 p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group text-white rounded-lg flex flex-col justify-between">
              <div className="relative w-full h-36 bg-void/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center group-hover:border-azure-500/30 transition-colors">
                {/* Smartphone silhouette */}
                <div className="absolute right-12 w-14 h-24 border border-white/10 rounded-lg flex items-center justify-center bg-zinc-950/80 transition-all group-hover:border-white/30">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full absolute top-1.5" />
                  <div className="w-8 h-12 bg-white/[0.02] border border-white/5 rounded flex flex-col justify-center items-center">
                    <Smartphone size={12} className="text-white/30 group-hover:text-azure-400 transition-colors duration-300" />
                  </div>
                </div>
                
                {/* NFC Card hovering */}
                <div className="absolute left-12 w-16 h-10 bg-white/5 border border-white/20 rounded-md shadow-lg transition-all duration-500 transform group-hover:translate-x-6 group-hover:rotate-12 flex items-center justify-center backdrop-blur-sm z-10">
                  <div className="text-[6px] tracking-widest text-white/50 uppercase font-mono font-bold">HEXA</div>
                </div>

                {/* Ripple animation */}
                <div className="absolute left-[110px] w-12 h-12 flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full border border-azure-500/40 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute w-12 h-12 rounded-full border border-azure-400/20 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400 flex flex-wrap items-center gap-1">
                  Touch Resonance <span className="text-[9px] text-white/60 font-normal">/ NFC連携と共鳴</span>
                </h3>
                <p className="text-[9px] tracking-widest leading-loose opacity-50">
                  物理カードをスマートフォンの背面にかざすだけで、瞬時にあなたのデジタルポートフォリオを展開。相手の記憶に深く刻み込みます。事前のアプリインストールは一切不要です。
                </p>
              </div>
            </div>

            {/* Card 2: Aesthetic Architect / 3万通りの意匠 */}
            <div className="space-y-6 p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group text-white rounded-lg flex flex-col justify-between">
              <div className="relative w-full h-36 bg-void/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center group-hover:border-azure-500/30 transition-colors">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {/* Frame layer (top) */}
                  <div className="absolute w-20 h-12 border border-azure-400 bg-azure-950/20 rounded transform -rotate-12 -translate-y-4 group-hover:-translate-y-8 group-hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg">
                    <Layers size={10} className="text-azure-400 animate-pulse" />
                  </div>
                  
                  {/* Core Design layer (middle) */}
                  <div className="absolute w-20 h-12 border border-white/20 bg-zinc-900/60 rounded transform -rotate-12 group-hover:scale-100 transition-all duration-300 flex items-center justify-center">
                    <Sparkles size={10} className="text-white/60" />
                  </div>
                  
                  {/* Base structure layer (bottom) */}
                  <div className="absolute w-20 h-12 border border-dashed border-white/10 bg-void rounded transform -rotate-12 translate-y-4 group-hover:translate-y-8 transition-all duration-300 flex items-center justify-center opacity-60">
                    <span className="text-[6px] text-white/20 font-mono">BASE</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400 flex flex-wrap items-center gap-1">
                  Aesthetic Architect <span className="text-[9px] text-white/60 font-normal">/ 3万通りの意匠</span>
                </h3>
                <p className="text-[9px] tracking-widest leading-loose opacity-50">
                  レイアウト、フレーム、背面エフェクト、オーラ光彩。あなたという存在を表現するために、数万通りのデザインシステムから直感的に構築可能。
                </p>
              </div>
            </div>

            {/* Card 3: Stealth Identity / 匿名性と存在の保護 */}
            <div className="space-y-6 p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group text-white rounded-lg flex flex-col justify-between">
              <div className="relative w-full h-36 bg-void/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center group-hover:border-azure-500/30 transition-colors">
                {/* Left Side: Public Profile (Alias) */}
                <div className="w-1/2 h-full border-r border-white/5 flex flex-col items-center justify-center p-3 relative bg-azure-500/[0.01]">
                  <div className="w-8 h-8 rounded-full bg-azure-500/10 border border-azure-500/20 flex items-center justify-center mb-1.5">
                    <Sparkles size={12} className="text-azure-400" />
                  </div>
                  <div className="text-[8px] font-bold tracking-wider text-azure-400">ALIAS NAME</div>
                  <div className="text-[6px] tracking-widest text-white/30 uppercase mt-0.5">Public Persona</div>
                </div>

                {/* Right Side: Private Info (Lock/Shield) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-3 relative">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1.5 group-hover:bg-zinc-800 transition-colors duration-300">
                    <ShieldCheck size={12} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-[8px] font-bold tracking-wider text-white/70">SECURED DATA</div>
                  <div className="text-[6px] tracking-widest text-white/30 uppercase mt-0.5">Personal Info</div>
                </div>
                
                {/* Animated separation barrier */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-azure-500/30 to-transparent" />
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400 flex flex-wrap items-center gap-1">
                  Stealth Identity <span className="text-[9px] text-white/60 font-normal">/ 匿名性と存在の保護</span>
                </h3>
                <p className="text-[9px] tracking-widest leading-loose opacity-50">
                  本名や連絡先を安全に保護。ネットの活動名（Alias）やポートフォリオを主体とし、真に繋がった相手にだけメッセージや連絡先を安全に開示します。
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-12 lg:py-20 bg-azure-500/[0.02] border border-azure-500/10 backdrop-blur-sm relative overflow-hidden px-4">
            <Link 
              href="/purchase" 
              className="inline-flex items-center justify-center gap-3 w-full max-w-md py-5 bg-white text-void font-semibold text-[10px] lg:text-[11px] tracking-[0.2em] lg:tracking-[0.4em] uppercase hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              Order Your Identity / カードを申し込む 
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
