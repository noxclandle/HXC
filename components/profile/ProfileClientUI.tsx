"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Download, Share2, ArrowRight, ShieldCheck, Sparkles, Smartphone, Layers, Network, AlertCircle, ChevronDown } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import GeometricBackground from "@/components/background/GeometricBackground";
import ResonanceInteraction from "@/components/ui/ResonanceInteraction";
import Link from "next/link";
import ResidentAgent from "@/components/agent/ResidentAgent";

export default function ProfileClientUI({ data, isOwner }: { data: any, isOwner?: boolean }) {
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  const handleSaveContact = () => {
    if (!data) return;
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name || "MEMBER"}\nTEL:${data.phone || ""}\nEMAIL:${data.profile.contact_email || data.email || ""}\nORG:${data.profile?.company || ""}`;
    
    if (data.photo_url && data.photo_url.startsWith('data:image/')) {
      try {
        const parts = data.photo_url.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || "JPEG";
        const type = mimeType.split('/')[1].toUpperCase();
        const base64Data = parts[1];
        vcard += `\nPHOTO;TYPE=${type};ENCODING=b:${base64Data}`;
      } catch (e) { console.error(e); }
    }
    
    vcard += `\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.handle_name || data.name || 'contact'}.vcf`;
    a.click();
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
      <ResonanceInteraction />
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
           <p className="text-[9px] tracking-[0.8em] uppercase opacity-20 font-bold text-white">{isOwner ? "Your Sanctum Entry" : "Identity Verification"}</p>
           <div className="h-px w-8 bg-white/10 mx-auto" />
           {isOwner && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <Link href="/hub" className="text-[10px] tracking-[0.4em] uppercase text-azure-400 hover:text-white transition-colors border border-azure-500/20 px-4 py-2 bg-azure-500/5">Enter Hub / 拠点へ移動</Link>
             </motion.div>
           )}
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-full flex flex-col items-center gap-12 lg:scale-110 xl:scale-125 transition-transform duration-1000"
        >
          <HexaCardPreview 
            name={data.name} reading={data.handle_name} company={data.profile.company} title={data.profile.title}
            phone={data.phone} email={data.profile.contact_email || data.email}
            logoUrl={data.logo_url} faceUrl={data.photo_url}
            frame={rawEquipped.frame} background={rawEquipped.background} effect={rawEquipped.effect} fontFamily={rawEquipped.fontFamily || rawEquipped.font}
            sound={rawEquipped.sound} link_x={data.link_x} link_instagram={data.link_instagram} link_line={data.link_line} link_facebook={data.link_facebook}
            orientation={currentOrientation}
            alignCompany={currentAligns.company || defaultAlign}
            alignName={currentAligns.name || defaultAlign}
            alignReading={currentAligns.reading || defaultAlign}
            alignTitle={currentAligns.title || defaultAlign}
            alignPhone={currentAligns.phone || defaultAlign}
            alignEmail={currentAligns.email || defaultAlign}
          />
        </motion.div>

        <div className="w-full max-w-sm space-y-6 mt-20">
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
