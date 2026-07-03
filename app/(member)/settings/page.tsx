"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Brain, Award, Volume2, Lock, Image } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [rtBalance, setRtBalance] = useState(0);
  const [aura, setAura] = useState(50);
  const [personality, setPersonality] = useState("ASSOCIATE");
  const [activeBg, setActiveBg] = useState("Obsidian");
  const [unlockedAssets, setUnlockedAssets] = useState<string[]>(["Obsidian", "ASSOCIATE"]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Report Form State
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setRtBalance(parseInt(data.rt_balance) || 0);
          setUnlockedAssets(data.owned_assets || []);
          setActiveBg(data.equipped?.frame || "Obsidian");
          setPersonality(data.equipped?.title || "ASSOCIATE");
          setAura(parseInt(data.equipped?.aura_harmony) || 50);
          setPrices(data.asset_prices || {});
        }
      } catch (e) {
        console.error("Failed to load user status", e);
      } finally {
        setIsLoaded(true);
      }
    };
    if (session) {
      fetchStatus();
    }
  }, [session]);

  const handleUnlock = async (name: string, rarity: string) => {
    if (session?.user?.role === "fixer") return;
    const cost = prices[rarity.toLowerCase()] || 0;
    if (rtBalance >= cost) {
      if (confirm(`${name} を ${cost} RT でアンロックしますか？ / Unlock ${name} for ${cost} RT?`)) {
        try {
          const res = await fetch("/api/user/unlock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assetId: name, rarity })
          });
          const data = await res.json();
          if (res.ok) {
            setRtBalance(parseInt(data.rt_balance) || 0);
            setUnlockedAssets(data.owned_assets || []);
            alert("アンロックに成功しました！ / Unlocked successfully.");
          } else {
            alert(data.error || "アンロックに失敗しました。 / Unlock failed.");
          }
        } catch (e) {
          console.error("Unlock request failed", e);
          alert("通信エラーが発生しました。 / Connection error.");
        }
      }
    } else {
      alert("RTが不足しています。活動してポイントを蓄積してください。 / Insufficient RT.");
    }
  };

  const handleEquipFrame = async (frameName: string) => {
    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: { frame: frameName } })
      });
      if (res.ok) {
        setActiveBg(frameName);
      } else {
        alert("設定の保存に失敗しました。 / Failed to equip frame.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEquipTitle = async (titleName: string) => {
    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: { title: titleName } })
      });
      if (res.ok) {
        setPersonality(titleName);
      } else {
        alert("設定の保存に失敗しました。 / Failed to equip title.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEquipAura = async (auraValue: number) => {
    try {
      await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: { aura_harmony: auraValue } })
      });
    } catch (e) {
      console.error("Failed to save aura harmony", e);
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
          targetUserId: session?.user?.id,
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-[10px] tracking-widest opacity-20 uppercase">
        Loading Config...
      </div>
    );
  }

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
                 { name: "Obsidian", cost: 0, rarity: "common" },
                 { name: "Gold", cost: 500, rarity: "epic" },
                 { name: "Dynamic", cost: 1000, rarity: "epic" },
                 { name: "PearlWhite", cost: 2000, rarity: "rare" },
               ].map((item) => {
                 const isUnlocked = unlockedAssets.includes(item.name) || item.rarity === "common" || session?.user?.role === "fixer";
                 const isActive = activeBg === item.name;
                 const itemCost = prices[item.rarity.toLowerCase()] !== undefined ? prices[item.rarity.toLowerCase()] : item.cost;
                 return (
                   <button
                     key={item.name}
                     onClick={() => isUnlocked ? handleEquipFrame(item.name) : handleUnlock(item.name, item.rarity)}
                     className={`p-6 border text-left transition-all relative overflow-hidden ${
                       isActive ? "border-azure-500 bg-azure-500/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                     }`}
                   >
                     <p className="text-[10px] tracking-widest uppercase mb-1">{item.name}</p>
                     <p className="text-[8px] opacity-40">
                       {isActive ? "Equipped" : isUnlocked ? "Unlocked" : `${itemCost} RT`}
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
                 { name: "ASSOCIATE", cost: 0, rarity: "common" },
                 { name: "ARCHITECT", cost: 1000, rarity: "rare" },
                 { name: "DIRECTOR", cost: 3000, rarity: "epic" },
                 { name: "FIXER", cost: 10000, rarity: "mythic" },
               ].map((item) => {
                 const isUnlocked = unlockedAssets.includes(item.name) || item.rarity === "common" || session?.user?.role === "fixer";
                 const isActive = personality === item.name;
                 const itemCost = prices[item.rarity.toLowerCase()] !== undefined ? prices[item.rarity.toLowerCase()] : item.cost;
                 return (
                   <button
                     key={item.name}
                     onClick={() => isUnlocked ? handleEquipTitle(item.name) : handleUnlock(item.name, item.rarity)}
                     className={`p-6 border text-left transition-all relative ${
                       isActive ? "border-bronze-500 bg-bronze-500/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                     }`}
                   >
                     <p className="text-[10px] tracking-widest uppercase mb-1">{item.name}</p>
                     <p className="text-[8px] opacity-40">
                       {isActive ? "Active" : isUnlocked ? "Unlocked" : `${itemCost} RT`}
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
                onMouseUp={() => handleEquipAura(aura)}
                onTouchEnd={() => handleEquipAura(aura)}
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
