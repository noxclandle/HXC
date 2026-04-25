"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Download, Share2, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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
    
    // 自画像をBase64形式で埋め込む
    if (data.photo_url && data.photo_url.startsWith('data:image/')) {
      const parts = data.photo_url.split(',');
      const meta = parts[0]; // data:image/jpeg;base64
      const base64Data = parts[1];
      const type = meta.split(':')[1].split(';')[0].split('/')[1].toUpperCase(); // JPEG, PNG etc
      vcard += `\nPHOTO;ENCODING=b;TYPE=${type}:${base64Data}`;
    }
    
    vcard += `\nEND:VCARD`;
    
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.handle_name || data.name || 'contact'}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
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

      {/* Main Content Area */}
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

        {/* Card Display Section (PCで拡大) */}
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
          <p className="text-[8px] tracking-[0.4em] uppercase opacity-30 italic">Tap card to verify secondary surface / 反転して本人を確認</p>
        </motion.div>

        {/* Action Controls */}
        <div className="w-full max-w-sm space-y-6 mt-20">
           <button 
             onClick={handleSaveContact}
             className="w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1em] uppercase shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:bg-azure-500 transition-all flex items-center justify-center gap-4 group"
           >
              <Download size={14} className="group-hover:translate-y-1 transition-transform" /> Save Contact / 連絡先を保存
           </button>
           
           <button 
             onClick={() => {
               if (navigator.share) {
                 navigator.share({ title: data.name, url: window.location.href }).catch(() => {});
               } else {
                 navigator.clipboard.writeText(window.location.href);
                 alert("Anchor URL Copied.");
               }
             }}
             className="w-full py-5 border border-white/10 bg-white/[0.02] text-[10px] tracking-[0.6em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3"
           >
              <Share2 size={12} /> Share Identity
           </button>
        </div>

        {/* CTA Section (LP風) */}
        <motion.section 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="w-full max-w-3xl mt-48 pt-24 border-t border-white/5 text-center space-y-12"
        >
           <div className="space-y-6">
              <div className="flex justify-center gap-3 text-azure-400/40 mb-8">
                 <ShieldCheck size={24} strokeWidth={1} />
                 <Hexagon size={24} strokeWidth={1} />
                 <Sparkles size={24} strokeWidth={1} />
              </div>
              <h2 className="text-2xl md:text-3xl tracking-[0.3em] font-extralight uppercase text-white/80 leading-relaxed">
                 あなたも、次世代の<br className="md:hidden" />デジタル名刺を<br />始めてみませんか？
              </h2>
              <p className="text-[11px] tracking-[0.2em] leading-loose opacity-40 uppercase max-w-lg mx-auto">
                 Hexa Cardは、物理的な手触りとデジタルの無限性を融合させた、最高級のアイデンティティ管理プラットフォームです。信頼を可視化し、人脈を星座に変える体験を。
              </p>
           </div>

           <Link 
             href="/"
             className="inline-flex items-center gap-4 px-12 py-5 bg-white text-void font-bold text-[10px] tracking-[1em] uppercase hover:bg-azure-50 hover:scale-105 transition-all shadow-2xl group"
           >
              Discover More / 詳細を見る <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </motion.section>

        <footer className="mt-32 opacity-10 text-center pb-12">
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
