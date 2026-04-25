"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Download, Share2, Loader2, ArrowRight, ShieldCheck, Sparkles, Smartphone, Layers, Network } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import GeometricBackground from "@/components/background/GeometricBackground";
import ResonanceInteraction from "@/components/ui/ResonanceInteraction";
import Link from "next/link";

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${params.slug}`);
        if (res.ok) {
          const profileData = await res.json();
          setData(profileData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.slug]);

  const handleSaveContact = () => {
    if (!data) return;
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name || "MEMBER"}\nTEL:${data.phone || ""}\nEMAIL:${data.contact_email || data.email || ""}\nORG:${data.profile?.company || ""}`;
    if (data.photo_url && data.photo_url.startsWith('data:image/')) {
      const parts = data.photo_url.split(',');
      const base64Data = parts[1];
      const type = parts[0].split(':')[1].split(';')[0].split('/')[1].toUpperCase();
      vcard += `\nPHOTO;ENCODING=b;TYPE=${type}:${base64Data}`;
    }
    vcard += `\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.handle_name || data.name || 'contact'}.vcf`;
    a.click();
  };

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <Loader2 className="animate-spin text-azure-400/20" size={32} />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-void flex items-center justify-center text-[10px] uppercase tracking-[0.5em] opacity-40">
      Identity Dissolved / 実体が見つかりません
    </div>
  );

  const defaultAlign = { company: "center", title: "center", name: "center", reading: "center", phone: "center", email: "center" };
  const rawEquipped = data.equipped_assets || {};
  const equipped = {
    frame: rawEquipped.frame || "Obsidian",
    title: rawEquipped.title || "ASSOCIATE",
    orientation: rawEquipped.orientation || "horizontal",
    hAlign: rawEquipped.hAlign || defaultAlign,
    vAlign: rawEquipped.vAlign || defaultAlign
  };
  const alignments = equipped.orientation === 'horizontal' ? equipped.hAlign : equipped.vAlign;

  return (
    <main className="min-h-screen bg-void text-moonlight relative overflow-x-hidden overflow-y-auto custom-scrollbar">
      <GeometricBackground />
      <ResonanceInteraction />

      <div className="relative z-10 w-full flex flex-col items-center pt-24 pb-32 px-6">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-20"
        >
           <div className="px-6 py-2 border border-white/10 bg-white/[0.02] inline-block backdrop-blur-md">
              <p className="text-[10px] tracking-[0.8em] uppercase opacity-60 font-bold">Synchronized Identity</p>
           </div>
           <h1 className="text-2xl tracking-[0.4em] uppercase font-extralight text-white/90">同調された実体</h1>
        </motion.header>

        {/* Card Display Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center gap-12 lg:scale-110 xl:scale-125 transition-transform duration-1000"
        >
          <HexaCardPreview 
            name={data.name || "NAME"}
            reading={data.handle_name}
            company={data.profile?.company}
            title={data.profile?.title || equipped.title}
            phone={data.phone}
            email={data.contact_email || data.email}
            logoUrl={data.logo_url}
            faceUrl={data.photo_url}
            frame={equipped.frame}
            orientation={equipped.orientation as any}
            alignments={alignments}
          />
          <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 italic">Tap card to verify portrait / 反転して本人を確認</p>
        </motion.div>

        {/* Primary Action */}
        <div className="w-full max-w-sm space-y-6 mt-20">
           <button 
             onClick={handleSaveContact}
             className="w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1em] uppercase shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:bg-azure-500 transition-all flex items-center justify-center gap-4 group"
           >
              <Download size={14} className="group-hover:translate-y-1 transition-transform" /> Save Contact / 連絡先を保存
           </button>
           <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (navigator.share) navigator.share({ title: data.name, url: window.location.href });
                  else { navigator.clipboard.writeText(window.location.href); alert("Copied."); }
                }}
                className="flex-1 py-4 border border-white/10 bg-white/[0.02] text-[9px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              >
                 <Share2 size={12} /> Share
              </button>
           </div>
        </div>

        {/* Mini LP Section (あなたも始めてみませんか？) */}
        <motion.section 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="w-full max-w-4xl mt-64 pt-32 border-t border-white/5 space-y-32"
        >
           {/* Introduction */}
           <div className="text-center space-y-12">
              <div className="flex justify-center gap-6 text-azure-400/40 mb-12">
                 <Smartphone size={32} strokeWidth={1} />
                 <Layers size={32} strokeWidth={1} />
                 <Network size={32} strokeWidth={1} />
              </div>
              <h2 className="text-3xl md:text-5xl tracking-[0.2em] font-extralight uppercase text-white/90 leading-tight">
                 あなたも、次世代の<br />デジタル名刺を<br />始めてみませんか？
              </h2>
              <p className="text-[12px] tracking-[0.3em] leading-loose opacity-40 uppercase max-w-xl mx-auto italic">
                 Hexa Cardは、物理的な手触りとデジタルの無限性を融合させた、<br className="hidden md:block" />
                 最高級のアイデンティティ管理プラットフォームです。
              </p>
           </div>

           {/* Features Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
              {[
                { title: "Physical Sync", desc: "物理カードとデジタルが1:1で同調。タップ一つで相手の記憶に刻まれます。", icon: <Smartphone size={20}/> },
                { title: "Total Control", desc: "デザイン、配置、ロゴ、自画像。すべてをあなたの意志で調律可能。", icon: <Layers size={20}/> },
                { title: "Star Chart", desc: "繋がった人脈は「星座」として記録され、あなたの影響力を可視化します。", icon: <Sparkles size={20}/> },
              ].map((f, i) => (
                <div key={i} className="space-y-4 p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                   <div className="text-azure-400 opacity-40 group-hover:opacity-100 transition-opacity mb-6">{f.icon}</div>
                   <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-white/80">{f.title}</h3>
                   <p className="text-[9px] tracking-widest leading-loose opacity-40 uppercase">{f.desc}</p>
                </div>
              ))}
           </div>

           {/* Final CTA */}
           <div className="text-center py-20 bg-azure-500/[0.02] border border-azure-500/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-azure-500/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite]" />
              <div className="space-y-8 relative z-10">
                 <h3 className="text-xl tracking-[0.5em] uppercase font-light text-white/70">Elevate Your Presence</h3>
                 <p className="text-[10px] tracking-[0.2em] opacity-40 uppercase">信頼を可視化し、人脈を資産に変えるために。</p>
                 <Link 
                   href="/"
                   className="inline-flex items-center gap-6 px-16 py-6 bg-white text-void font-bold text-[11px] tracking-[1.2em] uppercase hover:bg-azure-50 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 group"
                 >
                    Join Sanctum / 詳細を見る <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>
        </motion.section>

        <footer className="mt-48 opacity-10 text-center pb-12">
           <p className="text-[8px] tracking-[1em] uppercase font-bold">Hexa Relation Network Protocol v1.0</p>
        </footer>
      </div>
    </main>
  );
}

function Hexagon({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}
