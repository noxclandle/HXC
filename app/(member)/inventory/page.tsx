"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, ChevronRight, Check, Lock, Wallet, Trophy, ArrowLeft } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Asset {
  id: string;
  name: string;
  type: "frame" | "sound" | "effect" | "angel" | "title";
  rarity: "common" | "rare" | "epic" | "mythic";
  description: string;
  unlocked: boolean;
}

const CATEGORIES = [
  { id: "frame", name: "Frames", icon: Shield, sub: "外枠" },
  { id: "title", name: "Titles", icon: Trophy, sub: "称号" },
  { id: "sound", name: "Sounds", icon: Music, sub: "共鳴音" },
  { id: "effect", name: "Effects", icon: Sparkles, sub: "演出" },
  { id: "angel", name: "Concierge", icon: UserCheck, sub: "執事" },
];

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const [activeCategory, setActiveCategory] = useState("frame");
  const [rtBalance, setRTBalance] = useState("0");
  
  const [equipped, setEquipped] = useState({
    frame: "Obsidian",
    title: "Chief Officer",
    sound: "Resonance",
    effect: "None",
    angel: "Sentinel"
  });

  const [assets, setAssets] = useState<Asset[]>([
    { id: "Obsidian", name: "Obsidian Frame", type: "frame", rarity: "common", description: "漆黒の標準外枠。静寂を体現する。", unlocked: true },
    { id: "Gold", name: "Aureum Gold", type: "frame", rarity: "rare", description: "黄金の輝きを纏った高貴な枠。", unlocked: true },
    { id: "Dynamic", name: "Neural Emerald", type: "frame", rarity: "epic", description: "思考の波形に合わせて脈動する。", unlocked: false },
    { id: "Chief Officer", name: "Chief Officer", type: "title", rarity: "mythic", description: "システムの最高権力者。全ての扉を開く。", unlocked: true },
    { id: "Founder", name: "Founder", type: "title", rarity: "mythic", description: "始まりの1人。伝説の証。", unlocked: true },
    { id: "Architect", name: "Architect", type: "title", rarity: "epic", description: "世界の構造を定義する者。", unlocked: true },
    { id: "Initiate", name: "Initiate", type: "title", rarity: "common", description: "深淵に足を踏み入れたばかりの魂。", unlocked: true },
    { id: "Silver", name: "Silver Resonance", type: "sound", rarity: "rare", description: "透明感のある銀の鈴の音。", unlocked: true },
    { id: "Resonance", name: "Pure Resonance", type: "sound", rarity: "epic", description: "空間を震わせる純粋な共鳴音。", unlocked: true },
    { id: "Void", name: "Deep Void", type: "sound", rarity: "mythic", description: "深淵から響く重厚な低音。", unlocked: false },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/status");
        if (res.ok) {
          const data = await res.json();
          setRTBalance(data.rt_balance);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const filteredAssets = assets.filter(a => a.type === activeCategory);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-center">
          <div className="text-[10px] tracking-[1em] uppercase opacity-40 mb-2">Syncing Treasury</div>
          <div className="text-[7px] tracking-[0.2em] opacity-20 uppercase">宝物庫と同期中...</div>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
       <div className="flex min-h-screen items-center justify-center bg-void">
          <div className="text-center space-y-6">
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">Vault Locked. Re-authenticate.</p>
            <Link href="/login" className="block px-8 py-3 border border-white/10 text-[9px] uppercase tracking-widest hover:bg-white/5">Login</Link>
          </div>
       </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight">Treasury</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase">宝物庫・アセット管理</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-[9px] uppercase tracking-[0.5em] text-emerald-400 opacity-60">RT Balance</p>
          <p className="text-3xl font-extralight tracking-[0.2em] text-emerald-400">
            {Number(rtBalance).toLocaleString()} <span className="text-xs opacity-40 ml-1">RT</span>
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Live Preview */}
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <h2 className="text-[9px] uppercase tracking-[0.6em] opacity-30 mb-10 text-center">Synchronized Preview</h2>
              <HexaCardPreview 
                name={session.user?.name || "ARCHITECT"} 
                uid="04:A2:3F:81:XX:XX:XX"
                rt={Number(rtBalance).toLocaleString()}
                personality={equipped.angel}
                aura={85}
                frame={equipped.frame}
              />
              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[8px] tracking-[0.3em] uppercase opacity-40">
                    <span>Equipped Title</span>
                    <span className="text-emerald-400 font-bold">{equipped.title}</span>
                 </div>
                 <div className="flex justify-between items-center text-[8px] tracking-[0.3em] uppercase opacity-40">
                    <span>Active Resonance</span>
                    <span>{equipped.sound}</span>
                 </div>
              </div>
           </div>
           
           <button className="w-full py-6 bg-white text-void font-bold text-[11px] tracking-[1.2em] uppercase shadow-2xl hover:bg-emerald-50 transition-all active:scale-[0.98]">
              Commit Changes / 変更を確定
           </button>
        </div>

        {/* Right: Asset Categories & List */}
        <div className="lg:col-span-7 space-y-10">
           {/* Category Selection */}
           <div className="grid grid-cols-5 border-b border-white/5">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-6 flex flex-col items-center gap-3 transition-all border-b-2 ${
                    activeCategory === cat.id 
                    ? "border-emerald-500 opacity-100 bg-emerald-500/5" 
                    : "border-transparent opacity-20 hover:opacity-50"
                  }`}
                >
                  <cat.icon size={18} />
                  <div className="text-center">
                    <span className="block text-[8px] uppercase tracking-[0.3em] font-bold">{cat.name}</span>
                    <span className="block text-[6px] opacity-40 uppercase tracking-widest mt-1">{cat.sub}</span>
                  </div>
                </button>
              ))}
           </div>

           {/* Assets Grid */}
           <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {filteredAssets.map((asset) => (
                    <div 
                      key={asset.id} 
                      onClick={() => asset.unlocked && setEquipped({ ...equipped, [activeCategory as keyof typeof equipped]: asset.id })}
                      className={`group p-6 border transition-all cursor-pointer flex justify-between items-center relative overflow-hidden ${
                        equipped[activeCategory as keyof typeof equipped] === asset.id 
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.05)]" 
                        : "border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]"
                      } ${!asset.unlocked && "opacity-40"}`}
                    >
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 flex items-center justify-center border ${
                           equipped[activeCategory as keyof typeof equipped] === asset.id 
                           ? "border-emerald-400 text-emerald-400" 
                           : "border-white/10 opacity-40"
                         }`}>
                            {asset.unlocked ? <Check size={16} /> : <Lock size={16} />}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                               <span className={`text-[6px] px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest opacity-40`}>
                                 {asset.rarity}
                               </span>
                            </div>
                            <p className="text-[9px] tracking-widest opacity-40 uppercase leading-relaxed max-w-md">{asset.description}</p>
                         </div>
                      </div>
                      
                      {asset.unlocked ? (
                        <div className="text-right">
                           {equipped[activeCategory as keyof typeof equipped] === asset.id ? (
                             <span className="text-emerald-400 text-[8px] tracking-[0.4em] font-bold uppercase italic">Active</span>
                           ) : (
                             <span className="text-[8px] tracking-[0.4em] opacity-20 uppercase group-hover:opacity-100 transition-opacity">Equip</span>
                           )}
                        </div>
                      ) : (
                        <div className="text-right">
                           <span className="text-amber-400/60 text-[8px] tracking-[0.4em] font-bold uppercase flex items-center gap-2">
                             Locked <Wallet size={10} />
                           </span>
                        </div>
                      )}
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
