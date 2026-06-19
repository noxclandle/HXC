"use client";

import { useState } from "react";
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
        setLocalOrientation(safeEquipped.orientation || "horizontal");
      }
    } catch (e) { 
      console.error(e);
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
       
       <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="flex flex-col gap-4">
             <Link href="/profile/edit" className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/btn">
                <Edit3 size={16} className="mb-3 opacity-20 group-hover/btn:opacity-100 group-hover/btn:text-azure-400 transition-all" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white">Edit Profile</span>
                <span className="text-[7px] tracking-[0.2em] opacity-40 uppercase">プロフィール編集</span>
             </Link>
          </div>
          <div className="flex flex-col gap-4">
             <Link href="/inventory" className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/btn">
                <Trophy size={16} className="mb-3 opacity-20 group-hover/btn:opacity-100 group-hover/btn:text-orange-400 transition-all" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white">Store & Inventory</span>
                <span className="text-[7px] tracking-[0.2em] opacity-40 uppercase">ショップ・装備変更</span>
             </Link>
          </div>
       </div>
    </section>
  );
}
