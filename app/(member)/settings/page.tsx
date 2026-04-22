"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Brain, Award, Volume2, Lock, Image } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";

export default function SettingsPage() {
  const [rtBalance, setRtBalance] = useState(2450);
  const [aura, setAura] = useState(50);
  const [personality, setPersonality] = useState("Guide");
  const [activeFrame, setActiveFrame] = useState("Classic Void");
  const [activeSound, setActiveSound] = useState("Deep Resonance");
  const [activeTitle, setActiveTitle] = useState("Initiate");
  const [activeBg, setActiveBg] = useState("Default");

  const [unlockedAssets, setUnlockedAssets] = useState(["Classic Void", "Deep Resonance", "Default", "Initiate"]);

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

  const maintenanceCost = Math.floor(aura / 5) + (personality !== "Guide" ? 10 : 0);

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-24">
      <header className="mb-16">
        <h1 className="text-3xl tracking-[0.4em] uppercase mb-2">Tuning</h1>
        <p className="text-gothic-silver text-xs tracking-widest opacity-60 uppercase italic">Customizing your physical reflection.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Left: Live Preview Mirror */}
        <div className="lg:col-span-1 sticky top-32 space-y-8">
          <div>
            <p className="text-[8px] uppercase tracking-[0.4em] opacity-40 mb-6 text-center italic">Digital Mirror (Live Preview)</p>
            <div className="scale-90 origin-top">
              <HexaCardPreview 
                name="Chief Officer" 
                uid="04:XX:YY:ZZ" 
                rt={rtBalance.toLocaleString()} 
                personality={personality} 
                aura={aura}
                frame={activeBg}
              />
            </div>
          </div>
          <div className="p-6 border border-moonlight/10 bg-white/5 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[8px] uppercase opacity-40">Active Identity</span>
                <span className="text-[9px] text-moonlight font-bold tracking-widest uppercase">{activeTitle}</span>
             </div>
             <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-[8px] uppercase opacity-40">Equipped Assets</span>
                <span className="text-[7px] text-moonlight opacity-60 uppercase tracking-tighter">{activeFrame} • {activeBg}</span>
             </div>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Background Textures */}
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Image size={14} /> Background Texture
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { name: "Default", cost: 0 },
                 { name: "Marble", cost: 1500 },
                 { name: "Constellation", cost: 3000 }
               ].map((asset) => {
                 const isUnlocked = unlockedAssets.includes(asset.name);
                 return (
                   <button 
                     key={asset.name}
                     onClick={() => isUnlocked ? setActiveBg(asset.name) : handleUnlock(asset.name, asset.cost)}
                     className={`p-4 border text-[9px] tracking-[0.4em] uppercase text-left transition-all flex justify-between items-center ${activeBg === asset.name ? 'border-moonlight bg-white/5' : 'border-moonlight/10 bg-gothic-dark/30'}`}
                   >
                     <span className={isUnlocked ? "" : "opacity-40"}>{asset.name}</span>
                     {!isUnlocked && <span className="flex items-center gap-1 text-[7px] opacity-60"><Lock size={8}/> {asset.cost}</span>}
                     {isUnlocked && activeBg === asset.name && <span className="text-emerald-400 text-[7px] font-bold">Active</span>}
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Active Frame Selection */}
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} /> Active Frame
            </h2>
            <div className="space-y-2">
               {[
                 { name: "Classic Void", cost: 0 },
                 { name: "Silver Frame", cost: 1000 },
                 { name: "Obsidian Frame", cost: 5000 }
               ].map((asset) => {
                 const isUnlocked = unlockedAssets.includes(asset.name);
                 return (
                   <button 
                     key={asset.name}
                     onClick={() => isUnlocked ? setActiveFrame(asset.name) : handleUnlock(asset.name, asset.cost)}
                     className={`w-full p-4 border text-[9px] tracking-[0.4em] uppercase text-left transition-all flex justify-between items-center ${activeFrame === asset.name ? 'border-moonlight bg-white/5' : 'border-moonlight/10 bg-gothic-dark/30'}`}
                   >
                     <span className={isUnlocked ? "" : "opacity-40"}>{asset.name}</span>
                     {!isUnlocked && <span className="flex items-center gap-1 text-[7px] opacity-60"><Lock size={8}/> {asset.cost}</span>}
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Aura Intensity */}
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 flex items-center gap-2">
              <Sparkles size={14} /> Identity Aura Intensity
            </h2>
            <div className="p-8 border border-moonlight/10 bg-gothic-dark/20 backdrop-blur-sm">
              <input type="range" min="0" max="100" value={aura} onChange={(e) => setAura(parseInt(e.target.value))} className="w-full accent-moonlight bg-moonlight/10 h-1 rounded-full appearance-none cursor-pointer mb-6" />
              <div className="flex justify-between text-[10px] tracking-widest uppercase opacity-40">
                <span>Minimal</span><span>{aura}% Intensity</span><span>Ethereal</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-moonlight/5 flex justify-end">
             <button className="px-16 py-5 bg-moonlight text-void text-[10px] tracking-[0.6em] uppercase font-bold hover:bg-white transition-all shadow-xl">
               Confirm Configuration
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
