"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, Check, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, Smartphone, Layout } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/ResonanceToast";

export const dynamic = "force-dynamic";

interface Asset {
  id: string;
  name: string;
  type: "frame" | "sound" | "effect" | "angel" | "title" | "pointer";
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  description: string;
  unlocked: boolean;
}

const CATEGORIES = [
  { id: "frame", name: "Frames", icon: Shield, sub: "外枠" },
  { id: "title", name: "Titles / Achievements", icon: Trophy, sub: "称号・実績" },
  { id: "pointer", name: "Pointers", icon: MousePointer2, sub: "軌跡" },
  { id: "sound", name: "Sounds", icon: Music, sub: "共鳴音" },
  { id: "angel", name: "Concierge", icon: UserCheck, sub: "案内役" },
];

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState("frame");
  const [rtBalance, setRTBalance] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  
  const [equipped, setEquipped] = useState({
    frame: "Obsidian",
    title: "ASSOCIATE",
    sound: "Resonance",
    pointer: "Pure White Hex",
    angel: "Sentinel",
    orientation: "horizontal" as "horizontal" | "vertical"
  });

  const [assets, setAssets] = useState<Asset[]>([
    { id: "Obsidian", name: "Obsidian Frame", type: "frame", rarity: "common", description: "標準的な外枠。ビジネスの誠実さを表現する。", unlocked: true },
    { id: "Gold", name: "Heritage Gold", type: "frame", rarity: "epic", description: "伝統を感じさせる落ち着いた黄金色。", unlocked: true },
    { id: "Dynamic", name: "Azure Pulse", type: "frame", rarity: "legendary", description: "知性を感じさせる蒼い脈動。", unlocked: true },
    
    { id: "ASSOCIATE", name: "ASSOCIATE", type: "title", rarity: "common", description: "初期称号。同盟の一員である証。", unlocked: true },
    { id: "CONNECTOR", name: "CONNECTOR", type: "title", rarity: "rare", description: "実績：10人との接続を記録した証。", unlocked: true },
    { id: "STRATEGIST", name: "STRATEGIST", type: "title", rarity: "epic", description: "実績：100人の人脈をアーカイブした証。", unlocked: true },
    { id: "MASTERMIND", name: "MASTERMIND", type: "title", rarity: "mythic", description: "至高実績：聖域の全真理を解明した究極の知性。", unlocked: true },
    { id: "CHIEF OFFICER", name: "CHIEF OFFICER", type: "title", rarity: "mythic", description: "至高実績：システムの全権を掌握せし権力者。", unlocked: true },

    { id: "Pure White Hex", name: "Pure White Hex", type: "pointer", rarity: "common", description: "純白の鋭い軌跡。", unlocked: true },
    { id: "Azure Trace", name: "Azure Trace", type: "pointer", rarity: "rare", description: "知的な蒼い軌跡。", unlocked: true },
    
    { id: "Resonance", name: "Pure Resonance", type: "sound", rarity: "epic", description: "反転時：空間を震わせる標準的な共鳴音。", unlocked: true },
    { id: "Silver", name: "Silver Resonance", type: "sound", rarity: "rare", description: "反転時：透明感のある銀の鈴の音。", unlocked: true },
    { id: "Void", name: "Deep Void", type: "sound", rarity: "mythic", description: "反転時：深淵から響く重厚な低音。", unlocked: false },
  ]);

  const getRarityStyle = (rarity: Asset["rarity"]) => {
    switch (rarity) {
      case "mythic": return "text-white border-white/40 bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)]";
      case "legendary": return "text-rose-500 border-rose-500/20 bg-rose-500/5";
      case "epic": return "text-orange-500 border-orange-500/20 bg-orange-500/5";
      case "rare": return "text-purple-400 border-purple-500/20 bg-purple-500/5";
      case "common": return "text-white/40 border-white/5 bg-white/[0.01]";
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setRTBalance(data.rt_balance);
          if (data.equipped) setEquipped({ ...equipped, ...data.equipped });
        }
      } catch (err) { console.error(err); }
    };
    if (session) fetchInitialData();
  }, [session]);

  const handleCommit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped })
      });

      if (res.ok) {
        showToast("Treasury Synchronized / 装備を記録しました", "success");
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        showToast("Error / 保存に失敗しました", "error");
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleSelectAsset = (asset: Asset) => {
    if (!asset.unlocked) {
      showToast("Access Denied / 未解禁の項目です", "error");
      return;
    }
    setEquipped({ ...equipped, [activeCategory as keyof typeof equipped]: asset.id });
  };

  const filteredAssets = assets.filter(a => a.type === activeCategory);

  if (status === "loading") return null;

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight text-white">Treasury</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold">宝物庫・アセット管理</p>
        </div>
        <div className="text-right">
           <p className="text-[9px] uppercase tracking-[0.5em] text-azure-400 opacity-60">Credit Balance</p>
           <p className="text-3xl font-extralight tracking-[0.2em] text-white">{Number(rtBalance).toLocaleString()} <span className="text-xs opacity-20">CP</span></p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              
              {/* 【全画面共通】レイアウト即時切替ボタン */}
              <div className="absolute top-6 right-6 z-30 flex gap-2 p-1 bg-white/5 border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => setEquipped({...equipped, orientation: 'horizontal'})} className={`p-1.5 transition-all ${equipped.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={12}/>
                 </button>
                 <button onClick={() => setEquipped({...equipped, orientation: 'vertical'})} className={`p-1.5 transition-all ${equipped.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={12}/>
                 </button>
              </div>

              <HexaCardPreview 
                name={session?.user?.name || "ARCHITECT"} 
                title={equipped.title}
                frame={equipped.frame}
                orientation={equipped.orientation}
                alignHeader="center"
                alignMain="center"
                alignFooter="center"
              />
              <div className="mt-10 pt-8 border-t border-white/5 space-y-4 w-full">
                 <div className="flex justify-between items-center text-[8px] tracking-[0.3em] uppercase opacity-40">
                    <span>Active Title</span>
                    <span className="text-azure-400 font-bold">{equipped.title}</span>
                 </div>
              </div>
           </div>
           
           <button onClick={handleCommit} disabled={isSaving} className={`w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-azure-500 transition-all active:scale-[0.98] relative overflow-hidden ${isSaving && 'opacity-50'}`}>
              {isSaving ? "Synchronizing..." : "Commit Changes / 変更を記録"}
           </button>
        </div>

        <div className="lg:col-span-7 space-y-10">
           <div className="grid grid-cols-5 border-b border-white/5">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-6 flex flex-col items-center gap-3 transition-all border-b-2 ${
                    activeCategory === cat.id ? "border-azure-500 opacity-100 bg-azure-500/5" : "border-transparent opacity-20 hover:opacity-50"
                  }`}
                >
                  <cat.icon size={18} className={activeCategory === cat.id ? "text-azure-400" : ""} />
                  <div className="text-center">
                    <span className="block text-[8px] uppercase tracking-[0.3em] font-bold">{cat.name.split(' / ')[0]}</span>
                  </div>
                </button>
              ))}
           </div>

           <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} onClick={() => handleSelectAsset(asset)} className={`group p-6 border transition-all cursor-pointer flex justify-between items-center relative overflow-hidden ${equipped[activeCategory as keyof typeof equipped] === asset.id ? "border-white/40 bg-white/5" : "border-white/5 bg-white/[0.01] hover:border-azure-500/20"} ${!asset.unlocked && "opacity-40"}`}>
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 flex items-center justify-center border ${equipped[activeCategory as keyof typeof equipped] === asset.id ? "border-white text-white" : "border-white/10 opacity-40"}`}>
                            {asset.unlocked ? <Check size={16} /> : <Lock size={16} />}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                               <span className={`text-[7px] px-3 py-0.5 border uppercase tracking-widest font-bold ${getRarityStyle(asset.rarity)}`}>{asset.rarity}</span>
                            </div>
                            <p className="text-[9px] tracking-widest opacity-40 uppercase leading-relaxed max-w-md">{asset.description}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        {asset.unlocked ? (equipped[activeCategory as keyof typeof equipped] === asset.id ? <span className="text-white text-[8px] tracking-[0.4em] font-bold uppercase italic">Active</span> : <span className="text-[8px] tracking-[0.4em] opacity-20 uppercase group-hover:opacity-100">Equip</span>) : <Wallet size={12} className="text-bronze-400 opacity-40" />}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
