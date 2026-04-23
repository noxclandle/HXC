"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, ChevronRight, Check, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, BadgeCheck } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/ResonanceToast";

export const dynamic = "force-dynamic";

interface Asset {
  id: string;
  name: string;
  type: "frame" | "sound" | "effect" | "angel" | "title" | "pointer" | "achievement";
  rarity: "common" | "rare" | "epic" | "mythic";
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
    angel: "Sentinel"
  });

  const [assets, setAssets] = useState<Asset[]>([
    { id: "Obsidian", name: "Obsidian Frame", type: "frame", rarity: "common", description: "標準的な外枠。ビジネスの誠実さを表現する。", unlocked: true },
    { id: "Gold", name: "Heritage Gold", type: "frame", rarity: "rare", description: "伝統を感じさせる落ち着いた黄金色。", unlocked: true },
    { id: "Dynamic", name: "Azure Pulse", type: "frame", rarity: "epic", description: "知性を感じさせる蒼い脈動。", unlocked: true },
    
    { id: "ASSOCIATE", name: "ASSOCIATE", type: "title", rarity: "common", description: "初期称号。同盟の一員である証。", unlocked: true },
    { id: "PARTNER", name: "PARTNER", type: "title", rarity: "rare", description: "信頼を築いた者へ贈られる称号。", unlocked: true },
    { id: "DIRECTOR", name: "DIRECTOR", type: "title", rarity: "epic", description: "領域の進むべき方向を示す者。", unlocked: false },
    { id: "CHIEF OFFICER", name: "CHIEF OFFICER", type: "title", rarity: "mythic", description: "最高権力者。全ての座標を掌握する。", unlocked: true },
    { id: "FOUNDER", name: "FOUNDER", type: "title", rarity: "mythic", description: "始まりの四人の一人。伝説の血統。", unlocked: true },

    { id: "Pure White Hex", name: "Pure White Hex", type: "pointer", rarity: "common", description: "純白の鋭い軌跡。", unlocked: true },
    { id: "Azure Trace", name: "Azure Trace", type: "pointer", rarity: "rare", description: "知的な蒼い軌跡。", unlocked: true },
    
    { id: "Resonance", name: "Pure Resonance", type: "sound", rarity: "epic", description: "標準的な共鳴音。", unlocked: true },
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setRTBalance(data.rt_balance);
          if (data.equipped) setEquipped(data.equipped);
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
        showToast("Synchronized / 装備を記録しました", "success");
      } else {
        showToast("Error / 同期に失敗しました", "error");
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleSelectAsset = (asset: Asset) => {
    if (!asset.unlocked) {
      showToast("Access Denied / 未解禁のアセットです", "error");
      return;
    }
    setEquipped({ ...equipped, [activeCategory === "title" ? "title" : activeCategory]: asset.id });
  };

  const filteredAssets = assets.filter(a => (activeCategory === "title" ? (a.type === "title" || a.type === "achievement") : a.type === activeCategory));

  if (status === "loading") return null;

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight text-white">Treasury</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold">宝物庫・装備管理</p>
        </div>
        <div className="text-right">
           <p className="text-[9px] uppercase tracking-[0.5em] text-azure-400 opacity-60">Credit Balance</p>
           <p className="text-3xl font-extralight tracking-[0.2em]">{Number(rtBalance).toLocaleString()} <span className="text-xs opacity-20">CP</span></p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              <HexaCardPreview 
                name={session?.user?.name || "ARCHITECT"} 
                uid="04:A2:3F:81:XX:XX:XX"
                rt={Number(rtBalance).toLocaleString()}
                title={equipped.title}
                aura={85}
                frame={equipped.frame}
              />
              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[8px] tracking-[0.3em] uppercase opacity-40">
                    <span>Equipped Title</span>
                    <span className="text-azure-400 font-bold">{equipped.title}</span>
                 </div>
              </div>
           </div>
           <button onClick={handleCommit} disabled={isSaving} className={`w-full py-6 bg-azure-600 text-white font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-azure-500 transition-all active:scale-[0.98] relative overflow-hidden ${isSaving && 'opacity-50'}`}>
              {isSaving ? "Crystalizing..." : "Commit Changes / 変更を記録"}
           </button>
        </div>

        <div className="lg:col-span-7 space-y-10">
           <div className="grid grid-cols-5 border-b border-white/5">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`py-6 flex flex-col items-center gap-3 transition-all border-b-2 ${activeCategory === cat.id ? "border-azure-500 opacity-100 bg-azure-500/5" : "border-transparent opacity-20 hover:opacity-50"}`}>
                  <cat.icon size={18} className={activeCategory === cat.id ? "text-azure-400" : ""} />
                  <div className="text-center">
                    <span className="block text-[8px] uppercase tracking-[0.3em] font-bold">{cat.name.split(' / ')[0]}</span>
                    <span className="block text-[6px] opacity-40 uppercase tracking-widest mt-1">{cat.sub}</span>
                  </div>
                </button>
              ))}
           </div>

           <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} onClick={() => handleSelectAsset(asset)} className={`group p-6 border transition-all cursor-pointer flex justify-between items-center relative overflow-hidden ${equipped[activeCategory === "title" ? "title" : (activeCategory as keyof typeof equipped)] === asset.id ? "border-azure-500/50 bg-azure-500/10" : "border-white/5 bg-white/[0.01] hover:border-azure-500/20"} ${!asset.unlocked && "opacity-40"}`}>
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 flex items-center justify-center border ${equipped[activeCategory === "title" ? "title" : (activeCategory as keyof typeof equipped)] === asset.id ? "border-azure-400 text-azure-400" : "border-white/10 opacity-40"}`}>
                            {asset.unlocked ? <Check size={16} /> : <Lock size={16} />}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                            </div>
                            <p className="text-[9px] tracking-widest opacity-40 uppercase leading-relaxed max-w-md">{asset.description}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        {asset.unlocked ? (equipped[activeCategory === "title" ? "title" : (activeCategory as keyof typeof equipped)] === asset.id ? <span className="text-azure-400 text-[8px] tracking-[0.4em] font-bold uppercase italic">Active</span> : <span className="text-[8px] tracking-[0.4em] opacity-20 uppercase group-hover:opacity-100">Equip</span>) : <Wallet size={12} className="text-bronze-400 opacity-40"/>}
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
