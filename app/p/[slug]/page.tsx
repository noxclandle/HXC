"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Download, Share2, Loader2, ArrowLeft } from "lucide-react";
import { playResonanceSound } from "@/lib/audio/resonance";
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
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name || "MEMBER"}\nTEL:${data.phone || ""}\nEMAIL:${data.contact_email || data.email || ""}\nORG:${data.profile?.company || ""}\nEND:VCARD`;
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

  // データの欠落に対する鉄壁のガード
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
    <main className="min-h-screen bg-void text-moonlight relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <GeometricBackground />
      <ResonanceInteraction />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-16">
        <header className="text-center space-y-4">
           <div className="px-4 py-1.5 border border-white/10 bg-white/[0.02] inline-block">
              <p className="text-[8px] tracking-[0.6em] uppercase opacity-40 font-bold">Identity Synchronization</p>
           </div>
           <h1 className="text-xl tracking-[0.4em] uppercase font-extralight text-white/80">同調された実体</h1>
        </header>

        <div className="flex flex-col items-center gap-4">
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
          <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 mt-4 italic">Tap card to verify secondary surface / 反転して本人を確認</p>
        </div>

        <div className="w-full max-w-sm space-y-4 pt-8">
           <button 
             onClick={handleSaveContact}
             className="w-full py-6 bg-azure-600 text-white font-bold text-[10px] tracking-[1em] uppercase shadow-2xl hover:bg-azure-500 transition-all flex items-center justify-center gap-4"
           >
              <Download size={14} /> Save Contact / 連絡先を保存
           </button>
           
           <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: data.name, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("URL Copied.");
                  }
                }}
                className="flex-1 py-4 border border-white/10 bg-white/[0.02] text-[9px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              >
                 <Share2 size={12} /> Share
              </button>
              <Link 
                href="/login"
                className="flex-1 py-4 border border-white/10 bg-white/[0.02] text-[9px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-center"
              >
                 Join Network
              </Link>
           </div>
        </div>

        <footer className="opacity-10 text-center">
           <p className="text-[7px] tracking-[0.8em] uppercase font-bold">Powered by Hexa Relation Network</p>
        </footer>
      </div>
    </main>
  );
}
