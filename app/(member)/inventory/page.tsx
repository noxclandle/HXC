"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, ChevronRight, Check, Lock, Wallet, Trophy } from "lucide-react";
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
  { id: "frame", name: "Frames", icon: Shield },
  { id: "title", name: "Titles", icon: Trophy },
  { id: "sound", name: "Sounds", icon: Music },
  { id: "effect", name: "Effects", icon: Sparkles },
  { id: "angel", name: "Concierge", icon: UserCheck },
];

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const [activeCategory, setActiveCategory] = useState("frame");
  const [rtBalance, setRTBalance] = useState("0");
  
  const [equipped, setEquipped] = useState({
    frame: "Obsidian",
    title: "Chief Officer",
    sound: "Default",
    effect: "None",
    angel: "Classic"
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
    { id: "Void", name: "Deep Void", type: "sound", rarity: "epic", description: "深淵から響く重厚な共鳴音。", unlocked: false },
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
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] tracking-[1em] uppercase opacity-40">
          Syncing Treasury...
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
    <div className="max-w-6xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-3xl tracking-[0.5em] uppercase font-light mb-2">The Treasury</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase">所持アセットと権限の管理</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 px-8 py-4 rounded-sm flex items-center gap-6">
           <Wallet className="text-emerald-400 opacity-40" size={20} />
           <div className="text-right">
              <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1">Available Resonance</p>
              <p className="text-2xl font-extralight tracking-widest text-emerald-400">{Number(rtBalance).toLocaleString()} <span className="text-xs">RT</span></p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-4 bg-white/5 border border-white/5 backdrop-blur-md">
              <h2 className="text-[9px] uppercase tracking-[0.4em] opacity-30 mb-8 text-center">Live Synchronized Preview</h2>
              <HexaCardPreview 
                name={session.user?.name || "ARCHITECT"} 
                uid="04:A2:3F:81:XX:XX:XX"
                rt={Number(rtBalance).toLocaleString()}
                personality="Sentinel"
                aura={85}
                frame={equipped.frame}
              />
              <div className="mt-4 flex justify-center">
                 <span className="px-6 py-2 border border-emerald-500/20 text-emerald-400 text-[8px] uppercase tracking-[0.4em] font-bold bg-emerald-500/5">
                   Selected Title: {equipped.title}
                 </span>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-bold">Current Loadout</h3>
              <div className="grid grid-cols-2 gap-2">
                 {Object.entries(equipped).map(([key, val]) => (
                   <div key={key} className="p-4 border border-white/5 bg-gothic-dark/40">
                      <p className="text-[7px] uppercase opacity-30 mb-1">{key}</p>
                      <p className="text-[10px] uppercase tracking-widest">{val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
           <div className="flex border-b border-white/10 gap-8">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pb-4 text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-2 ${activeCategory === cat.id ? "text-white border-b-2 border-white" : "opacity-30 hover:opacity-100"}`}
                >
                  <cat.icon size={14} />
                  {cat.name}
                </button>
              ))}
           </div>

           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                {filteredAssets.map((asset) => (
                  <motion.div 
                    key={asset.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => asset.unlocked && setEquipped({ ...equipped, [activeCategory as keyof typeof equipped]: asset.id })}
                    className={`group p-6 border transition-all cursor-pointer flex justify-between items-center ${
                      equipped[activeCategory as keyof typeof equipped] === asset.id 
                      ? "border-emerald-500/50 bg-emerald-500/5" 
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                    } ${!asset.unlocked && "opacity-40 grayscale"}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          asset.rarity === "mythic" ? "bg-purple-500 shadow-[0_0_10px_purple]" :
                          asset.rarity === "epic" ? "bg-rose-500 shadow-[0_0_10px_rose]" :
                          asset.rarity === "rare" ? "bg-amber-500" : "bg-moonlight/40"
                        }`} />
                        <h4 className="text-xs tracking-[0.2em] font-bold uppercase">{asset.name}</h4>
                        {equipped[activeCategory as keyof typeof equipped] === asset.id && (
                          <span className="text-[7px] bg-emerald-500 text-void px-2 py-0.5 font-black uppercase tracking-tighter">Equipped</span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-40 leading-relaxed max-w-sm">{asset.description}</p>
                    </div>
                    
                    <div className="text-right">
                       {!asset.unlocked ? (
                         <div className="flex items-center gap-2 text-rose-500">
                           <Lock size={12} />
                           <span className="text-[8px] uppercase tracking-widest">Locked</span>
                         </div>
                       ) : (
                         <ChevronRight size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                       )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
           
           <button className="w-full py-5 bg-white text-void font-bold text-[11px] tracking-[1em] uppercase shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all">
              Commit Changes
           </button>
        </div>
      </div>
    </div>
  );
}
