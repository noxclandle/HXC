"use client";

import { useState } from "react";
import { Layout, Smartphone, Share2, Sparkles, Edit3, Trophy } from "lucide-react";
import Link from "next/link";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useToast } from "@/components/ui/ResonanceToast";

interface IdentityReflectionProps {
  user: {
    name: string;
    reading?: string;
    slug: string;
    logo_url?: string;
    photo_url?: string;
    profile?: any;
    equipped: any;
  };
  onUpdate: () => void;
}

export default function IdentityReflection({ user, onUpdate }: IdentityReflectionProps) {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOrientation = async (orient: "horizontal" | "vertical") => {
    if (user.equipped.orientation === orient) return;
    setIsUpdating(true);
    try {
      const newEquipped = { ...user.equipped, orientation: orient };
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: newEquipped })
      });
      if (res.ok) {
        showToast(`Layout Fixed / 形式を保存しました (${orient})`, "success");
        onUpdate();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
       <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
          <h2 className="text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold italic">Identity Reflection / あなたの証</h2>
          <div className="flex items-center gap-6">
            {/* レイアウト即時切替ボタン */}
            <div className="flex gap-2 p-1 bg-white/5 border border-white/5">
               <button onClick={() => updateOrientation('horizontal')} className={`p-1.5 transition-all ${user.equipped.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`} title="Horizontal">
                  <Layout size={12}/>
               </button>
               <button onClick={() => updateOrientation('vertical')} className={`p-1.5 transition-all ${user.equipped.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'opacity-20 hover:opacity-100'}`} title="Vertical">
                  <Smartphone size={12}/>
               </button>
            </div>
            <Link href={`/p/${user.slug}`} className="text-[8px] uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 border-l border-white/10 pl-6">Public View <Share2 size={10}/></Link>
          </div>
       </div>
       
       <div className="flex flex-col items-center">
          <div className={`relative ${isUpdating ? 'opacity-20' : ''} transition-all duration-700 min-h-[250px] flex items-center justify-center w-full`}>
             <HexaCardPreview
               name={user.name}
               reading={user.reading}
               company={user.profile?.company}
               title={user.equipped.title}
               phone={user.profile?.phone}
               email={user.profile?.contact_email}
               logoUrl={user.logo_url}
               faceUrl={user.photo_url}
               frame={user.equipped.frame}
               background={user.equipped.background}
               effect={user.equipped.effect}
               fontFamily={user.equipped.fontFamily || user.equipped.font}
               sound={user.equipped.sound}
               link_x={user.profile?.link_x}
               link_instagram={user.profile?.link_instagram}
               link_line={user.profile?.link_line}
               link_facebook={user.profile?.link_facebook}
               orientation={user.equipped.orientation}
               alignCompany={user.equipped.orientation === 'horizontal' ? (user.equipped.hAlign?.company || "center") : (user.equipped.vAlign?.company || "center")}
               alignName={user.equipped.orientation === 'horizontal' ? (user.equipped.hAlign?.name || "center") : (user.equipped.vAlign?.name || "center")}
               alignReading={user.equipped.orientation === 'horizontal' ? (user.equipped.hAlign?.reading || "center") : (user.equipped.vAlign?.reading || "center")}
               alignTitle={user.equipped.orientation === 'horizontal' ? (user.equipped.hAlign?.title || "center") : (user.equipped.vAlign?.title || "center")}
               alignPhone={user.equipped.orientation === 'horizontal' ? (user.equipped.hAlign?.phone || "center") : (user.equipped.vAlign?.phone || "center")}
               alignEmail={user.equipped.orientation === 'horizontal' ? (user.equipped.hAlign?.email || "center") : (user.equipped.vAlign?.email || "center")}
             />             {isUpdating && <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="animate-spin text-azure-400" /></div>}
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-4 w-full">
             <Link href="/profile/edit" className="py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                <Edit3 size={14} className="mb-1 opacity-40 group-hover:opacity-100" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Tune Identity</span>
                <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">プロフィールの調律</span>
             </Link>
             <Link href="/inventory" className="py-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center group flex flex-col items-center gap-1">
                <Trophy size={14} className="mb-1 opacity-40 group-hover:opacity-100" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Treasury</span>
                <span className="text-[7px] opacity-20 uppercase tracking-[0.2em]">宝物庫・装備</span>
             </Link>
          </div>
       </div>
    </section>
  );
}
