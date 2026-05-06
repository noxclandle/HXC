"use client";

import { useState } from "react";
import { Layout, Smartphone, Share2, Sparkles, Edit3, Trophy } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useToast } from "@/components/ui/ResonanceToast";

export default function IdentityReflection({ user }: { user: any }) {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localOrientation, setLocalOrientation] = useState(user.equipped.orientation);

  const updateOrientation = async (orientation: 'horizontal' | 'vertical') => {
    if (orientation === localOrientation) return;
    setIsUpdating(true);
    setLocalOrientation(orientation); // 即座にUIに反映

    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          equipped: { ...user.equipped, orientation } 
        })
      });

      if (res.ok) {
        showToast(`Alignment Shifted / 向きを変更しました`, "success");
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        setLocalOrientation(user.equipped.orientation); // 失敗したら戻す
      }
    } catch (e) { 
      console.error(e);
      setLocalOrientation(user.equipped.orientation);
    }
    finally {
      setIsUpdating(false);
    }
  };

  const currentAligns = localOrientation === 'horizontal' ? user.equipped.hAlign : user.equipped.vAlign;

  return (
    <section className="p-4 md:p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-white/5 pb-6 sm:pb-4 gap-4">
          <h2 className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] uppercase opacity-30 font-bold italic">Identity Reflection / あなたの証</h2>
          <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6">
            {/* レイアウト即時切替ボタン */}
            <div className="flex gap-1 md:gap-2 p-1 bg-white/5 border border-white/5">
               <button onClick={() => updateOrientation('horizontal')} className={`p-1.5 transition-all ${localOrientation === 'horizontal' ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`} title="Horizontal">
                  <Layout size={12}/>
               </button>
               <button onClick={() => updateOrientation('vertical')} className={`p-1.5 transition-all ${localOrientation === 'vertical' ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`} title="Vertical">
                  <Smartphone size={12}/>
               </button>
            </div>
            <Link href={`/p/${user.slug}`} className="text-[8px] uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 border-l border-white/10 pl-4 md:pl-6">Public View <Share2 size={10}/></Link>
          </div>
       </div>
       
       <div className="flex flex-col items-center">
          <div className={`relative ${isUpdating ? 'opacity-20' : ''} transition-all duration-700 min-h-[280px] flex items-center justify-center w-full py-6`}>
             <HexaCardPreview 
                name={user.name} 
                reading={user.handle} 
                company={user.profile.company} 
                title={user.profile.title} 
                phone={user.profile.phone} 
                email={user.profile.contact_email} 
                logoUrl={user.logo_url} 
                faceUrl={user.photo_url}
                frame={user.equipped.frame}
                background={user.equipped.background}
                effect={user.equipped.effect}
                fontFamily={user.equipped.fontFamily}
                fontScale={user.equipped.fontScale}
                sound={user.equipped.sound}
                orientation={localOrientation}
                alignCompany={currentAligns.company}
                alignName={currentAligns.name}
                alignReading={currentAligns.reading}
                alignTitle={currentAligns.title}
                alignPhone={currentAligns.phone}
                alignEmail={currentAligns.email}
             />
          </div>
       </div>
       
       <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="flex flex-col gap-4">
             <Link href="/profile/edit" className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/btn">
                <Edit3 size={16} className="mb-3 opacity-20 group-hover/btn:opacity-100 group-hover/btn:text-azure-400 transition-all" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white">Tune Identity</span>
                <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">プロフィールの調律</span>
             </Link>
          </div>
          <div className="flex flex-col gap-4">
             <Link href="/inventory" className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/btn">
                <Trophy size={16} className="mb-3 opacity-20 group-hover/btn:opacity-100 group-hover/btn:text-orange-400 transition-all" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white">Treasury</span>
                <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">宝物庫・装備</span>
             </Link>
          </div>
       </div>
    </section>
  );
}
