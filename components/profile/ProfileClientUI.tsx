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
  const profileName = data?.name || "MEMBER";

  useEffect(() => {
    if (typeof window !== "undefined" && data?.name) {
      document.title = data.name;
    }
  }, [data]);

  // Portfolio Links
  const portfolioLinks = data.portfolio_links || [];



  // Message Form State
  const [messageForm, setMessageForm] = useState({ name: "", company: "", content: "" });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Share Back (Two-Way Resonance) State
  const [showShareBack, setShowShareBack] = useState(false);
  const [shareBackForm, setShareBackForm] = useState({ name: "", role: "", email: "", phone: "", address: "", company: "", notes: "" });
  const [selectedDesign, setSelectedDesign] = useState<"black" | "white" | "silver">("black");
  const [sendingShareBack, setSendingShareBack] = useState(false);
  const [shareBackSuccess, setShareBackSuccess] = useState(false);

  // Resonance Link State
  const [resonanceStatus, setResonanceStatus] = useState<"none" | "pending_sent" | "pending_received" | "connected" | "self" | null>(null);
  const [isViewerMember, setIsViewerMember] = useState(false);
  const [loadingResonance, setLoadingResonance] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMessage(true);
    try {
      const res = await fetch("/api/card/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      } else {
        alert("Failed to transmit message. Please try again. / 送信に失敗しました。再度お試しください。");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again. / 通信エラーが発生しました。再度お試しください。");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleShareBackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareBackForm.name) return;
    setSendingShareBack(true);
    try {
      const res = await fetch("/api/contacts/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: data.id,
          name: shareBackForm.name,
          role: shareBackForm.role,
          email: shareBackForm.email,
          phone: shareBackForm.phone,
          address: shareBackForm.address,
          company: shareBackForm.company,
          notes: shareBackForm.notes,
          design: selectedDesign
        })
      });
      if (res.ok) {
        setShareBackSuccess(true);
        // 相手へのリスペクト・高級感のあるバイブレーション
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([40, 10, 40, 10, 80]);
        }
      } else {
        alert("Failed to transmit contact. Please try again. / 送信に失敗しました。再度お試しください。");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again. / 通信エラーが発生しました。再度お試しください。");
    } finally {
      setSendingShareBack(false);
    }
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

  useEffect(() => {
    if (isOwner || !data) return;
    
    const fetchResonanceStatus = async () => {
      try {
        const slug = data.handle_name || data.id;
        const res = await fetch(`/api/profile/resonance?targetSlug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const resData = await res.json();
          setResonanceStatus(resData.status);
          setIsViewerMember(resData.isViewerMember);
        }
      } catch (e) {
        console.error("Failed to fetch resonance status:", e);
      }
    };
    
    fetchResonanceStatus();
  }, [isOwner, data]);

  const handleResonate = async () => {
    if (isOwner || loadingResonance || !data) return;
    setLoadingResonance(true);
    
    try {
      const slug = data.handle_name || data.id;
      const res = await fetch("/api/profile/resonance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetSlug: slug })
      });
      
      if (res.ok) {
        const resData = await res.json();
        setResonanceStatus(resData.status);
        if (resData.status === "connected") {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 300]);
          }
          alert(resData.message || "Resonance established! Mutual contact details exchanged, +3,000 RT awarded, and 'Resonance Catalyst' Title unlocked.");
        } else if (resData.status === "pending") {
          alert("Resonance signal transmitted. Wait for partner to resonate back. / 共鳴シグナルを送信しました。相手が共鳴するのをお待ちください。");
        }
      } else {
        alert("Failed to establish resonance. / 共鳴リンクに失敗しました。");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again. / 通信エラーが発生しました。");
    } finally {
      setLoadingResonance(false);
    }
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: data.id, reason: reportReason })
      });
      if (res.ok) {
        alert("Report submitted. Thank you for your feedback. / 通報を受け付けました。ご協力ありがとうございます。");
        setShowReport(false);
        setReportReason("");
      } else {
        alert("Failed to submit report. Please try again. / 通報の送信に失敗しました。再度お試しください。");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again. / 通信エラーが発生しました。再度お試しください。");
    } finally {
      setReporting(false);
    }
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

      {/* Brand Top Link */}
      <div className="fixed top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2.5">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase font-bold text-white/60 hover:text-white hover:border-white/20 transition-all bg-void/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          ← Hexa Card
        </Link>
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase font-bold text-azure-400/80 hover:text-azure-400 hover:border-azure-500/30 transition-all bg-void/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          Login
        </Link>
      </div>

      {!isOwner && (
        <button onClick={() => setShowReport(true)} className="fixed top-8 right-8 z-50 p-3 border border-white/5 bg-white/[0.02] text-white/20 hover:text-rose-500 hover:border-rose-500/20 transition-all group" title="Report Identity">
           <AlertCircle size={16} />
        </button>
      )}

      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-void/95 z-[100] flex items-center justify-center p-6">
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

        {/* SHARE BACK MODAL (Two-Way Resonance with Card Preview) */}
        {showShareBack && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-void/95 z-[100] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative max-h-[95vh] overflow-y-auto custom-scrollbar font-sans">
              
              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowShareBack(false);
                  setShareBackSuccess(false);
                  setShareBackForm({ name: "", role: "", email: "", phone: "", address: "", company: "", notes: "" });
                }} 
                className="absolute top-4 right-4 text-white/40 hover:text-white text-xs font-mono tracking-widest"
              >
                [ CLOSE ]
              </button>

              {!shareBackSuccess ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Left: Input Form (Shows below card on mobile) */}
                  <div className="space-y-6 md:order-first order-last">
                    <div>
                      <h3 className="text-sm tracking-[0.3em] uppercase font-bold text-white">Share Your Contact</h3>
                      <p className="text-[8.5px] tracking-widest text-white/40 uppercase mt-1">連絡先を送り返し、同調を完了する</p>
                    </div>

                    <form onSubmit={handleShareBackSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">NAME / お名前 *</label>
                        <input 
                          required
                          placeholder="あなたのフルネーム"
                          value={shareBackForm.name}
                          onChange={(e) => setShareBackForm({...shareBackForm, name: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">COMPANY / 会社名</label>
                        <input 
                          placeholder="例: 株式会社ヘキサ"
                          value={shareBackForm.company}
                          onChange={(e) => setShareBackForm({...shareBackForm, company: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">TITLE / 肩書・職種</label>
                        <input 
                          placeholder="例: デザイナー, エンジニア, VTuber"
                          value={shareBackForm.role}
                          onChange={(e) => setShareBackForm({...shareBackForm, role: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">EMAIL / メールアドレス</label>
                        <input 
                          type="email"
                          placeholder="your-email@example.com"
                          value={shareBackForm.email}
                          onChange={(e) => setShareBackForm({...shareBackForm, email: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">PHONE / 電話番号</label>
                        <input 
                          type="tel"
                          placeholder="090-0000-0000"
                          value={shareBackForm.phone}
                          onChange={(e) => setShareBackForm({...shareBackForm, phone: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">ADDRESS / 住所</label>
                        <input 
                          placeholder="東京都渋谷区神宮前..."
                          value={shareBackForm.address}
                          onChange={(e) => setShareBackForm({...shareBackForm, address: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1">NOTES / メモ・メッセージ (会社名など)</label>
                        <textarea 
                          rows={2}
                          placeholder="会社名、SNSアカウント、またはオーナーへのメッセージをご記入ください"
                          value={shareBackForm.notes}
                          onChange={(e) => setShareBackForm({...shareBackForm, notes: e.target.value})}
                          className="w-full bg-white/[0.02] border border-white/10 p-3 text-[10px] tracking-widest outline-none focus:border-emerald-500/50 text-white resize-none font-sans"
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-[7.5px] tracking-widest text-white/30 uppercase pl-1 block font-bold">CARD DESIGN / カードデザインの選択</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["black", "white", "silver"] as const).map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setSelectedDesign(d)}
                              className={`py-2 text-[9px] font-bold tracking-widest uppercase border transition-all ${
                                selectedDesign === d 
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                                  : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/10"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        disabled={sendingShareBack}
                        className="w-full py-4 mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {sendingShareBack ? <Loader2 size={12} className="animate-spin" /> : <><Send size={12} /> Send Contact / 同調を送信する</>}
                      </button>
                    </form>
                  </div>

                  {/* Right: Live Interactive Card Preview (Shows at the top on mobile) */}
                  <div className="flex flex-col items-center justify-center h-full space-y-6 py-6 border-t md:border-t-0 md:border-l border-white/5 md:pl-8 order-first md:order-last">
                    <span className="text-[7.5px] tracking-[0.3em] text-white/30 uppercase font-mono">Live Card Preview / 一時名刺プレビュー</span>
                    
                    <div className="relative group">
                      {/* Interactive glowing effect based on design */}
                      <div className={`absolute inset-[-8px] rounded-2xl opacity-40 blur-md transition-all duration-300 ${
                        selectedDesign === "white" ? "bg-zinc-200/20" :
                        selectedDesign === "silver" ? "bg-cyan-500/15 group-hover:blur-lg" :
                        "bg-rose-500/15 group-hover:blur-lg"
                      }`} />

                      {/* Card Component */}
                      <div className={`w-[270px] h-[155px] rounded-2xl p-5 flex flex-col justify-between font-mono relative overflow-hidden transition-all duration-500 ${
                        selectedDesign === "white" ? "bg-white text-zinc-900 border border-zinc-200" :
                        selectedDesign === "silver" ? "bg-gradient-to-br from-zinc-800 to-zinc-950 text-cyan-100 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]" :
                        "bg-gradient-to-br from-zinc-950 via-void to-zinc-900 text-rose-100 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                      }`}>
                        {/* Top Row */}
                        <div className="flex justify-between items-start z-10">
                          {/* Company Name on Top Left */}
                          <div className="flex flex-col text-left">
                            <div className="text-[8px] font-bold tracking-[0.15em] uppercase opacity-85 truncate max-w-[170px]">
                              {shareBackForm.company || "TEMPORARY ID"}
                            </div>
                            <div className="text-[5px] opacity-45 tracking-widest uppercase mt-0.5">
                              {shareBackForm.company ? "ORGANIZATION" : "GUEST CONNECTION"}
                            </div>
                          </div>

                          {/* NFC Chip on Top Right */}
                          <div className={`w-7 h-6 rounded border flex items-center justify-center bg-white/[0.02] ${
                            selectedDesign === "white" ? "border-zinc-300" :
                            selectedDesign === "silver" ? "border-cyan-500/30" :
                            "border-rose-500/30"
                          }`}>
                            <div className="w-3 h-3 border-t border-r border-white/20" />
                          </div>
                        </div>

                        {/* Center Row: Name & Title */}
                        <div className="z-10 text-left my-auto pt-2">
                          <div className="text-[6.5px] opacity-50 tracking-[0.2em] uppercase font-bold mb-0.5">
                            {shareBackForm.role || "MEMBER"}
                          </div>
                          <div className="text-[14px] font-light tracking-[0.25em] text-white truncate">
                            {shareBackForm.name || "YOUR NAME"}
                          </div>
                        </div>

                        {/* Bottom Row: Contacts */}
                        <div className="z-10 text-left space-y-0.5 pt-1.5 border-t border-white/10">
                          {shareBackForm.email && (
                            <div className="text-[6px] opacity-40 tracking-wider truncate">{shareBackForm.email}</div>
                          )}
                          {shareBackForm.phone && (
                            <div className="text-[6px] opacity-40 tracking-wider truncate">{shareBackForm.phone}</div>
                          )}
                          {shareBackForm.address && (
                            <div className="text-[6px] opacity-40 tracking-wider truncate">{shareBackForm.address}</div>
                          )}
                          {!shareBackForm.email && !shareBackForm.phone && !shareBackForm.address && (
                            <div className="text-[6px] opacity-25 tracking-widest">NO CONTACT DETAILS PROVIDED</div>
                          )}
                        </div>

                        <div className="absolute right-4 top-4 text-[7px] tracking-[0.25em] opacity-30 font-black uppercase">
                          TEMPORARY
                        </div>
                      </div> {/* End of Card Component */}
                    </div> {/* End of Group */}
                    
                    <p className="text-[8px] text-white/30 leading-relaxed text-center max-w-[240px]">
                      入力された情報は暗号化され、{profileName} の名刺管理ライブラリに安全に転送されます。
                    </p>
                  </div>

                </div>
              ) : (
                // Success Screen with Purchase Call to Action
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-8 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={32} className="animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-md tracking-[0.4em] uppercase font-bold text-white">Transmission Complete</h3>
                    <p className="text-[11px] tracking-widest text-emerald-400 uppercase">一時名刺の同調と送信が完了しました！</p>
                  </div>

                  <p className="text-[10px] text-white/50 leading-relaxed max-w-md mx-auto">
                    あなたの名刺情報は {profileName} のLibraryへ安全に送信されました。<br />
                    この一時名刺を半永久的に有効化し、自分だけの物理スマートカードを作成しませんか？
                  </p>

                  {/* Render the completed card */}
                  <div className="py-4">
                    <div className={`w-[270px] h-[155px] rounded-2xl p-5 flex flex-col justify-between font-mono text-left relative overflow-hidden shadow-2xl ${
                      selectedDesign === "white" ? "bg-white text-zinc-900 border border-zinc-200" :
                      selectedDesign === "silver" ? "bg-gradient-to-br from-zinc-800 to-zinc-950 text-cyan-100 border border-cyan-500/30" :
                      "bg-gradient-to-br from-zinc-950 via-void to-zinc-900 text-rose-100 border border-rose-500/30"
                    }`}>
                      {/* Top Row */}
                      <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col text-left">
                          <div className="text-[8px] font-bold tracking-[0.15em] uppercase opacity-85 truncate max-w-[170px]">
                            {shareBackForm.company || "TEMPORARY ID"}
                          </div>
                          <div className="text-[5px] opacity-45 tracking-widest uppercase mt-0.5">
                            {shareBackForm.company ? "ORGANIZATION" : "GUEST CONNECTION"}
                          </div>
                        </div>

                        <div className={`w-7 h-6 rounded border flex items-center justify-center bg-white/[0.02] ${
                          selectedDesign === "white" ? "border-zinc-300" :
                          selectedDesign === "silver" ? "border-cyan-500/30" :
                          "border-rose-500/30"
                        }`}>
                          <div className="w-3 h-3 border-t border-r border-white/20" />
                        </div>
                      </div>

                      {/* Center Row: Name & Title */}
                      <div className="z-10 text-left my-auto pt-2">
                        <div className="text-[6.5px] opacity-50 tracking-[0.2em] uppercase font-bold mb-0.5">
                          {shareBackForm.role || "MEMBER"}
                        </div>
                        <div className="text-[14px] font-light tracking-[0.25em] text-white truncate">
                          {shareBackForm.name}
                        </div>
                      </div>

                      {/* Bottom Row: Contacts */}
                      <div className="z-10 text-left space-y-0.5 pt-1.5 border-t border-white/10">
                        {shareBackForm.email && (
                          <div className="text-[6px] opacity-40 tracking-wider truncate">{shareBackForm.email}</div>
                        )}
                        {shareBackForm.phone && (
                          <div className="text-[6px] opacity-40 tracking-wider truncate">{shareBackForm.phone}</div>
                        )}
                        {shareBackForm.address && (
                          <div className="text-[6px] opacity-40 tracking-wider truncate">{shareBackForm.address}</div>
                        )}
                      </div>

                      <div className="absolute right-4 top-4 text-[7px] tracking-[0.25em] opacity-30 font-black uppercase">
                        TEMPORARY
                      </div>
                    </div> {/* End of Card Component */}
                  </div> {/* End of Wrapper */}

                  <div className="w-full max-w-sm pt-4 space-y-4">
                    <Link
                      href={`/purchase?ref=${data.id}`}
                      onClick={() => {
                        setShowShareBack(false);
                        setShareBackSuccess(false);
                      }}
                      className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      Activate Permanently / 自分用のカードを作る <ArrowRight size={12} />
                    </Link>
                    
                    <button 
                      onClick={() => {
                        setShowShareBack(false);
                        setShareBackSuccess(false);
                        setShareBackForm({ name: "", role: "", email: "", phone: "", address: "", company: "", notes: "" });
                      }}
                      className="w-full py-4 border border-white/10 text-[9px] tracking-[0.3em] uppercase hover:bg-white/5 text-white/40"
                    >
                      Close / 閉じる
                    </button>
                  </div>
                </motion.div>
              )}

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
                <p className="text-[9px] tracking-[0.4em] uppercase text-azure-400 font-bold text-center mb-6">Documents / 資料</p>
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

           {/* RESONANCE / SHARE BACK BUTTONS */}
           {!isOwner && (
             <>
               {isViewerMember ? (
                 <>
                   {resonanceStatus === "connected" ? (
                     <div className="w-full py-5 bg-azure-950/20 border border-azure-500/30 text-azure-400 font-bold text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 rounded cursor-default animate-in fade-in duration-300">
                       <CheckCircle2 size={12} className="text-azure-400 animate-pulse" /> Resonated / 共鳴同調済み
                     </div>
                   ) : resonanceStatus === "pending_sent" ? (
                     <div className="w-full py-5 bg-zinc-900/40 border border-white/10 text-white/40 font-bold text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 rounded cursor-wait animate-in fade-in duration-300">
                       <Loader2 size={12} className="animate-spin text-white/30" /> Resonating... / 共鳴待機中...
                     </div>
                   ) : (
                     <button 
                       onClick={handleResonate} 
                       disabled={loadingResonance}
                       className="w-full py-5 bg-azure-950/20 border border-azure-500/30 text-azure-400 font-bold text-[10px] tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:bg-azure-500/10 transition-all flex items-center justify-center gap-3 group rounded animate-in fade-in duration-300"
                     >
                       <Network size={12} className="group-hover:scale-110 transition-transform" /> 
                       {resonanceStatus === "pending_received" 
                         ? "Accept Resonance / 共鳴を承認し同調する" 
                         : "Establish Resonance / アイデンティティを共鳴させる"}
                     </button>
                   )}
                 </>
               ) : (
                 <button onClick={() => setShowShareBack(true)} className="w-full py-5 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(52,211,153,0.1)] hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-3 group rounded animate-in fade-in duration-300">
                    <Network size={12} className="group-hover:scale-110 transition-transform" /> Share Your Contact / 連絡先を送り返す
                 </button>
               )}
             </>
           )}

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
               <h3 className="text-[11px] tracking-[0.2em] lg:tracking-[0.4em] uppercase font-bold text-white">Transmit Message to {profileName} / {profileName} にメッセージを送信</h3>
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
                  <div className="space-y-2">
                      <textarea 
                        required
                        rows={4}
                        placeholder="YOUR MESSAGE / メッセージ内容を入力してください... (必須)"
                        value={messageForm.content}
                        onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/10 p-6 text-[10px] tracking-widest outline-none focus:border-white/30 transition-all resize-none text-white font-sans"
                      />
                      <p className="text-[9px] tracking-widest text-white/50 leading-relaxed text-left pl-1">
                          * If you require a response, please include your contact details within the message. <br />
                          ※返信をご希望の場合は、メッセージ内にご自身の連絡先（メールアドレス等）をご記載ください。
                      </p>
                   </div>
                  <button 
                    disabled={sendingMessage}
                    className="w-full py-5 bg-white text-void font-bold text-[10px] tracking-[0.3em] lg:tracking-[0.5em] uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Transmit Message to {profileName} / {profileName} にメッセージを送信する</>}
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
            {/* Card 1: Paper Card Scan / 紙名刺のデジタル管理 */}
            <motion.div 
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="space-y-6 p-6 border border-white/5 bg-white/[0.01] hover:border-azure-500/30 hover:bg-azure-500/[0.01] transition-all duration-300 group text-white rounded-lg flex flex-col justify-between cursor-pointer"
            >
              <div className="relative w-full h-36 bg-void/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center group-hover:border-azure-500/20 transition-colors">
                {/* Physical Card Silhouette */}
                <motion.div 
                  variants={{
                    rest: { rotate: -6, y: 0, scale: 0.9 },
                    hover: { rotate: 0, y: -4, scale: 0.95, transition: { type: "spring", stiffness: 200, damping: 15 } }
                  }}
                  className="w-28 h-16 border border-white/10 bg-zinc-950/90 rounded flex flex-col justify-between p-2.5 relative shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-azure-400/40 animate-pulse" />
                    <div className="w-10 h-1 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="w-16 h-1.5 bg-white/15 rounded" />
                    <div className="w-10 h-1 bg-white/10 rounded" />
                  </div>
                </motion.div>

                {/* Scanner Laser Line */}
                <motion.div 
                  variants={{
                    rest: { y: "-100%", opacity: 0 },
                    hover: { 
                      y: ["-50px", "50px", "-50px"], 
                      opacity: [0, 1, 0],
                      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                    }
                  }}
                  className="absolute left-6 right-6 h-[1.5px] bg-azure-400 shadow-[0_0_8px_#38bdf8] z-20 pointer-events-none"
                />

                {/* OCR Text Nodes (glowing particles appearing on hover) */}
                <motion.div 
                  variants={{
                    rest: { opacity: 0, scale: 0.8 },
                    hover: { opacity: 0.6, scale: 1, transition: { delay: 0.2 } }
                  }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                  <div className="absolute top-8 left-16 w-1 h-1 bg-azure-400 rounded-full animate-ping" />
                  <div className="absolute bottom-8 right-16 w-1 h-1 bg-azure-400 rounded-full animate-ping" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400 flex flex-wrap items-center gap-1">
                  Paper Card Scan <span className="text-[9px] text-white/60 font-normal">/ 紙名刺のデジタル管理</span>
                </h3>
                <p className="text-[9px] tracking-widest leading-loose opacity-50">
                  受け取った紙名刺は、高性能AIスキャナーで読み取って自動データベース化。名刺管理やホルダーに悩む必要はもうありません。 / Scan physical paper cards with our built-in AI OCR scanner, saving them instantly to your digital connection list.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Dynamic Media / メディアと資料の即時共有 */}
            <motion.div 
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="space-y-6 p-6 border border-white/5 bg-white/[0.01] hover:border-azure-500/30 hover:bg-azure-500/[0.01] transition-all duration-300 group text-white rounded-lg flex flex-col justify-between cursor-pointer"
            >
              <div className="relative w-full h-36 bg-void/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center group-hover:border-azure-500/20 transition-colors">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {/* Frame layer (top - slides up on hover) */}
                  <motion.div 
                    variants={{
                      rest: { y: -16, x: 0, rotate: -12, scale: 1 },
                      hover: { y: -34, x: -8, rotate: -8, scale: 1.05, transition: { type: "spring", stiffness: 200, damping: 15 } }
                    }}
                    className="absolute w-20 h-12 border border-azure-400 bg-azure-950/20 rounded flex items-center justify-center shadow-lg"
                  >
                    <Layers size={10} className="text-azure-400 animate-pulse" />
                  </motion.div>
                  
                  {/* Core Design layer (middle) */}
                  <motion.div 
                    variants={{
                      rest: { y: 0, x: 0, rotate: 6, scale: 0.95 },
                      hover: { y: 6, x: 12, rotate: 12, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
                    }}
                    className="absolute w-20 h-12 border border-white/10 bg-zinc-900 rounded flex items-center justify-center shadow-md"
                  >
                     <Smartphone size={10} className="opacity-40" />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400 flex flex-wrap items-center gap-1">
                  Dynamic Media <span className="text-[9px] text-white/60 font-normal">/ メディアと資料の即時共有</span>
                </h3>
                <p className="text-[9px] tracking-widest leading-loose opacity-50">
                  静止した紙では不可能な、動的デザイン、BGM、そして提案資料(PDF)やポートフォリオの即時共有。この1枚で全てが完結します。 / Share dynamic designs, background music, and proposal PDFs instantly. Deliver a rich experience paper can never match.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Stealth Identity / 匿名性と情報保護 */}
            <motion.div 
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="space-y-6 p-6 border border-white/5 bg-white/[0.01] hover:border-azure-500/30 hover:bg-azure-500/[0.01] transition-all duration-300 group text-white rounded-lg flex flex-col justify-between cursor-pointer"
            >
              <div className="relative w-full h-36 bg-void/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center group-hover:border-azure-500/20 transition-colors">
                {/* Left Side: Public Profile (Alias) */}
                <div className="w-1/2 h-full border-r border-white/5 flex flex-col items-center justify-center p-3 relative bg-azure-500/[0.01]">
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full bg-azure-500/10 border border-azure-500/20 flex items-center justify-center mb-1.5"
                  >
                    <Sparkles size={12} className="text-azure-400" />
                  </motion.div>
                  <div className="text-[8px] font-bold tracking-wider text-azure-400 font-mono">ALIAS NAME</div>
                  <div className="text-[6px] tracking-widest text-white/30 uppercase mt-0.5 font-mono">Public Persona</div>
                </div>

                {/* Right Side: Private Info (Lock/Shield) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-3 relative">
                  <motion.div 
                    variants={{
                      rest: { scale: 1, rotate: 0 },
                      hover: { scale: 1.15, rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.6 } }
                    }}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1.5"
                  >
                    <ShieldCheck size={12} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  <div className="text-[8px] font-bold tracking-wider text-white/70 font-mono">SECURED DATA</div>
                  <div className="text-[6px] tracking-widest text-white/30 uppercase mt-0.5 font-mono">Personal Info</div>
                </div>
                
                {/* Animated separation barrier (laser scan) */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-azure-500/30 to-transparent">
                  <motion.div 
                    variants={{
                      rest: { y: "-100%" },
                      hover: { 
                        y: ["-100%", "100%", "-100%"], 
                        transition: { repeat: Infinity, duration: 2, ease: "linear" } 
                      }
                    }}
                    className="w-full h-1/4 bg-azure-400 shadow-[0_0_8px_#38bdf8]" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-azure-400 flex flex-wrap items-center gap-1">
                  Stealth Identity <span className="text-[9px] text-white/60 font-normal">/ 匿名性と情報保護</span>
                </h3>
                <p className="text-[9px] tracking-widest leading-loose opacity-50">
                  本名を保護し、活動名（エイリアス）や実績のみを開示。信頼できる相手にだけ情報を安全に共有できる、プライバシー保護設計。 / Safeguard your real name and share only your alias or portfolio. Maintain absolute control over your personal data, sharing securely with trusted contacts.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="text-center py-12 lg:py-20 bg-azure-500/[0.02] border border-azure-500/10 backdrop-blur-sm relative overflow-hidden px-4 flex flex-col items-center gap-6">
            <Link 
              href="/purchase" 
              className="inline-flex items-center justify-center gap-3 w-full max-w-md py-5 bg-white text-void font-semibold text-[10px] lg:text-[11px] tracking-[0.2em] lg:tracking-[0.4em] uppercase hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              Order Your Identity / カードを申し込む 
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase font-bold text-white/40 hover:text-white transition-colors"
            >
              ← Visit Official Site / 公式サイトトップへ
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
