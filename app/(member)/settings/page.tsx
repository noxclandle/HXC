"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Brain, Award, Volume2, Lock, Image } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [rtBalance, setRtBalance] = useState(2450);
  const [aura, setAura] = useState(50);
  const [personality, setPersonality] = useState("ASSOCIATE");
  const [activeFrame, setActiveFrame] = useState("Obsidian");
  const [activeBg, setActiveBg] = useState("Obsidian");

  const [unlockedAssets, setUnlockedAssets] = useState(["Obsidian", "ASSOCIATE"]);

  // Report Form State
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleUnlock = (name: string, cost: number) => {
    if (rtBalance >= cost) {
      if (confirm(`Unlock ${name} for ${cost} RT? / ${name} を ${cost} RT でアンロックしますか？`)) {
        setRtBalance(rtBalance - cost);
        setUnlockedAssets([...unlockedAssets, name]);
      }
    } else {
      alert("Insufficient RT. Please accumulate points. / RTが不足しています。活動してポイントを蓄積してください。");
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    setIsReporting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetUserId: session?.user?.id, // 自分自身の環境報告として送信
          reason: reportReason,
          details: reportDetails 
        })
      });
      if (res.ok) {
        setReportSuccess(true);
        setReportReason("");
        setReportDetails("");
        setTimeout(() => setReportSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Report failed", error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-24 text-moonlight">
      <header className="mb-16">
        <h1 className="text-3xl tracking-[0.4em] mb-2 font-extralight">Settings / 設定</h1>
        <p className="text-xs tracking-widest opacity-40">Account & System Configuration / アカウントとシステムの詳細設定</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Left: Live Preview Mirror */}
        <div className="lg:col-span-1 sticky top-32 space-y-8">
          <div>
            <UnifiedCardContainer 
              orientation="horizontal"
              showControls={false}
              previewLabel="Current Status / 現在の状態"
            >
              <HexaCardPreview 
                name={session?.user?.name || "MEMBER"} 
                title={personality} 
                frame={activeBg}
                alignCompany="center"
                alignName="center"
                alignReading="center"
                alignTitle="center"
                alignPhone="center"
                alignEmail="center"
              />
            </UnifiedCardContainer>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-2 space-y-16">
          {/* Frame Selection */}
          <div>
            <h2 className="text-[10px] tracking-[0.3em] opacity-40 mb-6 flex items-center gap-2">
              <Zap size={14} /> Frame Selection / 外枠設定
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { name: "Obsidian", cost: 0 },
                 { name: "Gold", cost: 500 },
                 { name: "Dynamic", cost: 1000 },
                 { name: "PearlWhite", cost: 2000 },
               ].map((item) => {
                 const isUnlocked = unlockedAssets.includes(item.name);
                 const isActive = activeBg === item.name;
                 return (
                   <button
                     key={item.name}
                     onClick={() => isUnlocked ? setActiveBg(item.name) : handleUnlock(item.name, item.cost)}
                     className={`p-6 border text-left transition-all relative overflow-hidden ${
                       isActive ? "border-azure-500 bg-azure-500/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                     }`}
                   >
                     <p className="text-[10px] tracking-widest uppercase mb-1">{item.name}</p>
                     <p className="text-[8px] opacity-40">
                       {isUnlocked ? "Equipped" : `${item.cost} RT`}
                     </p>
                     {!isUnlocked && <Lock size={12} className="absolute top-4 right-4 opacity-20" />}
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Personality / Title */}
          <div>
            <h2 className="text-[10px] tracking-[0.3em] opacity-40 mb-6 flex items-center gap-2">
              <Brain size={14} /> Title Selection / 性格階級（称号）
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { name: "ASSOCIATE", cost: 0 },
                 { name: "ARCHITECT", cost: 1000 },
                 { name: "DIRECTOR", cost: 3000 },
                 { name: "FIXER", cost: 10000 },
               ].map((item) => {
                 const isUnlocked = unlockedAssets.includes(item.name);
                 const isActive = personality === item.name;
                 return (
                   <button
                     key={item.name}
                     onClick={() => isUnlocked ? setPersonality(item.name) : handleUnlock(item.name, item.cost)}
                     className={`p-6 border text-left transition-all relative ${
                       isActive ? "border-bronze-500 bg-bronze-500/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                     }`}
                   >
                     <p className="text-[10px] tracking-widest uppercase mb-1">{item.name}</p>
                     <p className="text-[8px] opacity-40">
                       {isUnlocked ? "Active" : `${item.cost} RT`}
                     </p>
                     {!isUnlocked && <Lock size={12} className="absolute top-4 right-4 opacity-20" />}
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Environmental Harmony (Aura) */}
          <div className="space-y-6">
            <h2 className="text-[10px] tracking-[0.3em] opacity-40 flex items-center gap-2">
              <Sparkles size={14} /> Environmental Harmony (Aura) / 環境調和率（オーラ）
            </h2>
            <div className="space-y-4">
              <div className="h-1 bg-white/5 w-full relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${aura}%` }}
                  className="h-full bg-azure-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                />
              </div>
              <div className="flex justify-between items-center text-[8px] tracking-[0.2em] opacity-40 uppercase">
                <span>Dissonance</span>
                <span>Harmony: {aura}%</span>
              </div>
              <input 
                type="range" 
                value={aura} 
                onChange={(e) => setAura(parseInt(e.target.value))} 
                className="w-full accent-azure-500 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Account Management (Danger Zone) */}
          <div className="pt-16 border-t border-white/5">
            <h2 className="text-[10px] tracking-[0.3em] text-azure-400 mb-8 uppercase flex items-center gap-2">
              <Volume2 size={14} /> Support & Feedback / 環境報告・サポート
            </h2>
            <form onSubmit={handleReport} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[8px] tracking-widest opacity-40 uppercase">Report Subject / 報告内容</label>
                 <select 
                   value={reportReason}
                   onChange={(e) => setReportReason(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-white/20"
                 >
                   <option value="">Select Option / 選択してください</option>
                   <option value="UI_GLITCH">表示の乱れ (UI Glitch)</option>
                   <option value="SYNC_ERROR">同期エラー (Sync Error)</option>
                   <option value="FEATURE_REQUEST">機能提案 (Feature Request)</option>
                   <option value="OTHER">その他 (Other)</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[8px] tracking-widest opacity-40 uppercase">Details / 詳細</label>
                 <textarea 
                   value={reportDetails}
                   onChange={(e) => setReportDetails(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 p-4 text-xs tracking-widest outline-none focus:border-white/20 h-32 resize-none"
                   placeholder="Please provide details of the issue... / 状況を詳しく教えてください..."
                 />
               </div>
               <button 
                 type="submit"
                 disabled={isReporting || !reportReason}
                 className="px-8 py-3 border border-white/10 text-[9px] tracking-[0.4em] uppercase hover:bg-white/5 transition-all disabled:opacity-20"
               >
                 {isReporting ? "SENDING... / 送信中..." : "SUBMIT REPORT / 報告を送信"}
               </button>
               {reportSuccess && <p className="text-[9px] text-emerald-400 tracking-widest uppercase">Report received. Adjusting environmental boundary. / 報告を受領しました。境界の調整を行います。</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
