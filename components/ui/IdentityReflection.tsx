"use client";

import { useState, useEffect, useRef } from "react";
import { Layout, Smartphone, Share2, Sparkles, Edit3, Trophy } from "lucide-react";
import Link from "next/link";
import HexaCardPreview, { mapUserToCardProps } from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import { useToast } from "@/components/ui/ConnectionToast";

export default function IdentityReflection({ user }: { user: any }) {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // 絶対的な安全網: userオブジェクトが不完全な場合でもクラッシュさせない
  const safeUser = user || {};
  const safeEquipped = safeUser.equipped || {};
  const safeProfile = safeUser.profile || {};

  const [localOrientation, setLocalOrientation] = useState(safeEquipped.orientation || "horizontal");
  useEffect(() => {
    // 親から降ってきた向きに常に同期する
    if (safeEquipped.orientation) {
      setLocalOrientation(safeEquipped.orientation);
    }
  }, [safeEquipped.orientation]);

  const defaultAlign = {
    company: "center",
    title: "center",
    name: "center",
    reading: "center",
    phone: "center",
    email: "center"
  };

  const updateOrientation = async (orientation: 'horizontal' | 'vertical') => {
    if (orientation === localOrientation) return;
    setIsUpdating(true);
    setLocalOrientation(orientation);

    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          equipped: { ...safeEquipped, orientation } 
        })
      });

      if (res.ok) {
        showToast(`向きを変更しました`, "success");
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(`変更に失敗しました: ${res.status} ${errData.error || ""}`, "error");
        setLocalOrientation(safeEquipped.orientation || "horizontal");
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      showToast(`通信エラーが発生しました: ${message}`, "error");
      setLocalOrientation(safeEquipped.orientation || "horizontal");
    }
    finally {
      setIsUpdating(false);
    }
  };

  const currentAligns = localOrientation === 'horizontal' 
    ? (safeEquipped.hAlign || defaultAlign) 
    : (safeEquipped.vAlign || defaultAlign);

  return (
    <section className="p-4 md:p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-white/5 pb-6 sm:pb-4 gap-4">
          <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] uppercase opacity-30 font-bold italic">Profile / プロフィール情報</h2>
          <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6">
            <Link href={`/p/${safeUser.slug || 'unknown'}`} className="text-[8px] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2">View Public Page <Share2 size={10}/></Link>
          </div>
       </div>
       
       <div className="flex flex-col items-center">
          <UnifiedCardContainer 
            orientation={localOrientation}
            onOrientationChange={updateOrientation}
            isUpdating={isUpdating}
            previewLabel=""
          >
             <HexaCardPreview 
                {...mapUserToCardProps(safeUser, localOrientation)}
             />
          </UnifiedCardContainer>
       </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 font-sans">
           <div className="flex flex-col gap-4">
              <Link 
                href="/profile/edit" 
                className="flex flex-col items-center justify-center p-6 bg-white/[0.04] border border-azure-500/30 hover:border-azure-400 hover:bg-azure-500/[0.06] shadow-[0_0_15px_rgba(59,130,246,0.03)] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300 group/btn rounded-xl"
              >
                 <Edit3 size={18} className="mb-3 text-azure-400 opacity-60 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" />
                 <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white">Edit Profile</span>
                 <span className="text-[7.5px] tracking-[0.2em] text-white/50 group-hover/btn:text-white/80 uppercase mt-1">プロフィール編集</span>
              </Link>
           </div>
           <div className="flex flex-col gap-4">
              <Link 
                href="/inventory" 
                className="flex flex-col items-center justify-center p-6 bg-white/[0.04] border border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/[0.06] shadow-[0_0_15px_rgba(249,115,22,0.03)] hover:shadow-[0_0_20px_rgba(249,115,22,0.12)] transition-all duration-300 group/btn rounded-xl"
              >
                 <Trophy size={18} className="mb-3 text-orange-400 opacity-60 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" />
                 <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white">Store & Inventory</span>
                 <span className="text-[7.5px] tracking-[0.2em] text-white/50 group-hover/btn:text-white/80 uppercase mt-1">ショップ・装備変更</span>
              </Link>
           </div>
           <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  const shareUrl = `${window.location.origin}/p/${encodeURIComponent(safeUser.slug || 'unknown')}`;
                  if (navigator.share) {
                    navigator.share({
                      title: `${safeUser.name || 'Hexa Card'}`,
                      text: `新時代のデジタル名刺「Hexa Card」と同調しました。私のプロフィールはこちら：`,
                      url: shareUrl
                    }).catch(console.error);
                  } else {
                    try {
                      navigator.clipboard.writeText(shareUrl);
                      showToast("名刺のリンクをコピーしました。 / Link copied.", "success");
                    } catch (err) {
                      console.error(err);
                      showToast("コピーに失敗しました。", "error");
                    }
                  }
                }}
                className="flex flex-col items-center justify-center p-6 bg-white/[0.04] border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/[0.06] shadow-[0_0_15px_rgba(16,185,129,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all duration-300 group/btn w-full text-center rounded-xl"
              >
                 <Share2 size={18} className="mb-3 text-emerald-400 opacity-60 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" />
                 <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white">Share Card</span>
                 <span className="text-[7.5px] tracking-[0.2em] text-white/50 group-hover/btn:text-white/80 uppercase mt-1">名刺を共有・コピー</span>
              </button>
           </div>
        </div>
    </section>
  );
}
