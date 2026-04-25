"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Brain, Award, Volume2, Lock, Image } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [rtBalance, setRtBalance] = useState(2450);
  const [aura, setAura] = useState(50);
  const [personality, setPersonality] = useState("ASSOCIATE");
  const [activeFrame, setActiveFrame] = useState("Obsidian");
  const [activeBg, setActiveBg] = useState("Obsidian");

  const [unlockedAssets, setUnlockedAssets] = useState(["Obsidian", "ASSOCIATE"]);

  const handleUnlock = (name: string, cost: number) => {
    if (rtBalance >= cost) {
      if (confirm(`${name} を ${cost} RT でアンロックしますか？`)) {
        setRtBalance(rtBalance - cost);
        setUnlockedAssets([...unlockedAssets, name]);
      }
    } else {
      alert("RTが不足しています。活動してポイントを蓄積してください。");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-24 text-moonlight">
      <header className="mb-16">
        <h1 className="text-3xl tracking-[0.4em] uppercase mb-2 font-extralight">Tuning</h1>
        <p className="text-xs tracking-widest opacity-40 uppercase italic">Customizing your physical reflection.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Left: Live Preview Mirror */}
        <div className="lg:col-span-1 sticky top-32 space-y-8">
          <div>
            <p className="text-[8px] uppercase tracking-[0.4em] opacity-40 mb-6 text-center italic">Digital Mirror (Live Preview)</p>
            <div className="scale-90 origin-top">
              <HexaCardPreview 
                name={session?.user?.name || "MEMBER"} 
                title={personality} 
                frame={activeBg}
                alignHeader="center"
                alignMain="center"
                alignFooter="center"
              />
            </div>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-2 space-y-16">
          {/* Frame Selection */}
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} /> Active Frame / 外枠
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { name: "Obsidian", cost: 0 },
                 { name: "Gold", cost: 5000 },
                 { name: "Dynamic", cost: 10000 }
               ].map((asset) => {
                 const isUnlocked = unlockedAssets.includes(asset.name);
                 return (
                   <button 
                     key={asset.name}
                     onClick={() => isUnlocked ? setActiveBg(asset.name) : handleUnlock(asset.name, asset.cost)}
                     className={`p-4 border text-[9px] tracking-[0.4em] uppercase text-left transition-all flex justify-between items-center ${activeBg === asset.name ? 'border-azure-400 bg-azure-400/5' : 'border-white/10 bg-white/[0.02]'}`}
                   >
                     <span className={isUnlocked ? "" : "opacity-40"}>{asset.name}</span>
                     {!isUnlocked && <span className="flex items-center gap-1 text-[7px] opacity-60"><Lock size={8}/> {asset.cost}</span>}
                   </button>
                 );
               })}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-end">
             <button className="px-16 py-5 bg-white text-void text-[10px] tracking-[0.6em] uppercase font-bold hover:bg-azure-50 transition-all shadow-xl">
               Confirm Configuration
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
