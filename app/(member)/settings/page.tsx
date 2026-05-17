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

  // Report Form State
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

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
        <h1 className="text-3xl tracking-[0.4em] uppercase mb-2 font-extralight">Adjust</h1>
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
                alignCompany="center"
                alignName="center"
                alignReading="center"
                alignTitle="center"
                alignPhone="center"
                alignEmail="center"
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

          {/* Support Section */}
          <div className="pt-24 border-t border-white/5">
            <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-8 flex items-center gap-2">
              <Brain size={14} /> Support & Feedback / 不具合・要望
            </h2>
            
            <form onSubmit={handleReport} className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-widest opacity-30">Category</label>
                <select 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 p-4 text-[10px] tracking-widest uppercase outline-none focus:border-azure-400 transition-all"
                  required
                >
                  <option value="" className="bg-void">Select category...</option>
                  <option value="BUG" className="bg-void">Bug Report / 不具合</option>
                  <option value="REQUEST" className="bg-void">Feature Request / 要望</option>
                  <option value="OTHER" className="bg-void">Other / その他</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-widest opacity-30">Details</label>
                <textarea 
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe the situation..."
                  className="w-full bg-white/[0.02] border border-white/10 p-4 h-32 text-[10px] tracking-widest outline-none focus:border-azure-400 transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isReporting}
                className="w-full py-4 border border-azure-400/30 text-azure-400 text-[9px] tracking-[0.4em] uppercase font-bold hover:bg-azure-400 hover:text-white transition-all disabled:opacity-20"
              >
                {isReporting ? "Transmitting..." : "Submit Report"}
              </button>

              <AnimatePresence>
                {reportSuccess && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[9px] text-azure-400 tracking-widest text-center uppercase"
                  >
                    Report successfully logged. Thank you for your resonance.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
