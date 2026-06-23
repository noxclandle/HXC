"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, Smartphone, Layout, Palette, Eye, Zap, Gem, Loader2, ChevronRight } from "lucide-react";
import HexaCardPreview, { mapUserToCardProps } from "@/components/ui/HexaCardPreview";
import UnifiedCardContainer from "@/components/ui/UnifiedCardContainer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/ConnectionToast";
import { playConnectionSound } from "@/lib/audio/resonance";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useSearchParams } from "next/navigation";
import { ASSETS, Asset, CATEGORIES, getRarityStyles } from "@/lib/game/assets";

const RT_PACKS = [
  { id: "rt_small", price: 1000, rt: 2000, label: "2,000 ポイント", description: "基本的なポイント補充。1回のアセット購入に。" },
  { id: "rt_medium", price: 5000, rt: 11000, label: "11,000 ポイント", description: "推奨パック。広範なカスタマイズを可能にします。", popular: true },
  { id: "rt_large", price: 10000, rt: 23000, label: "23,000 ポイント", description: "最大限の補充。すべてのアイテムを揃える方に。" },
];

export default function InventoryClientUI({ initialStats }: { initialStats: any }) {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const activeCategoryFromUrl = searchParams.get("category");
  const showPurchaseFromUrl = searchParams.get("purchase") === "true";

  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(activeCategoryFromUrl || "frame");
  const [rtBalance, setRTBalance] = useState(initialStats?.rt_balance || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [unlockingAsset, setUnlockingAsset] = useState<string | null>(null);
  const [ownedAssets, setOwnedAssets] = useState<string[]>(initialStats?.owned_assets || []);
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>(initialStats?.titles || ["ASSOCIATE"]);
  const [assetPrices, setAssetPrices] = useState<Record<string, number>>(initialStats?.asset_prices || {});
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [isResonating, setIsResonating] = useState(false);
  const [showRTPurchase, setShowRTPurchase] = useState(showPurchaseFromUrl);
  const [confirmingAsset, setConfirmingAsset] = useState<Asset | null>(null);
  const [showRightScrollIndicator, setShowRightScrollIndicator] = useState(true);
  const [showLeftScrollIndicator, setShowLeftScrollIndicator] = useState(false);

  const handleCategoryScroll = (e: any) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const maxScroll = target.scrollWidth - target.clientWidth;
    setShowLeftScrollIndicator(scrollLeft > 10);
    setShowRightScrollIndicator(scrollLeft < maxScroll - 10);
  };
  
  const defaultAlign = {
    company: "center",
    title: "center",
    name: "center",
    reading: "center",
    phone: "center",
    email: "center"
  };

  const [equipped, setEquipped] = useState<any>({
    frame: "Obsidian",
    background: "Default",
    effect: "None",
    fontFamily: "Standard",
    textColor: "white",
    title: "ASSOCIATE",
    sound: "resonance",
    pointer: "Pure White Hex",
    angel: "Sentinel",
    aura: "None",
    orientation: "horizontal",
    hAlign: defaultAlign,
    vAlign: defaultAlign,
    ...(initialStats?.equipped || {})
  });

  const [profile, setProfile] = useState<any>(initialStats);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/user/status", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setRTBalance(data.rt_balance);
        setOwnedAssets(data.owned_assets || []);
        setUnlockedTitles(data.titles || ["ASSOCIATE"]);
        setAssetPrices(data.asset_prices || {});
        if (data.equipped) setEquipped((prev: any) => ({ ...prev, ...data.equipped, textColor: data.equipped.textColor || "white" }));
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const handleUpdate = () => fetchData();
    window.addEventListener("hxc-assets-updated", handleUpdate);
    return () => window.removeEventListener("hxc-assets-updated", handleUpdate);
  }, [fetchData]);

  const handleCommit = async (customEquipped?: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: customEquipped || equipped })
      });
      if (res.ok) {
        showToast("設定を保存しました / Saved successfully", "success");
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        throw new Error("Failed to sync");
      }
    } catch (e) {
      console.error(e);
      showToast("保存に失敗しました / Save failed", "error");
      fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnlock = async (asset: Asset) => {
    if (unlockingAsset || profile?.role === "fixer") return;
    setUnlockingAsset(asset.id);
    try {
      const res = await fetch("/api/user/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: asset.id, rarity: asset.rarity })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`解放しました: ${asset.name} / Unlocked successfully`, "success");
        setRTBalance(data.rt_balance);
        setOwnedAssets(data.owned_assets);
        const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
        setEquipped(newEquipped);
        handleCommit(newEquipped);
      } else {
        showToast(data.error || "解放に失敗しました / Unlock failed", "error");
      }
    } catch (err) { console.error(err); }
    finally { setUnlockingAsset(null); setConfirmingAsset(null); }
  };

  const handleSelectAsset = (asset: Asset) => {
    const isUnlocked = ownedAssets.includes(asset.id) || asset.rarity === "common" || profile?.role === "fixer";
    const isTitleUnlocked = unlockedTitles.includes(asset.id) || profile?.role === "fixer";

    if (asset.type === "title" ? isTitleUnlocked : isUnlocked) {
      const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
      setEquipped(newEquipped);
      
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
      }

      handleCommit(newEquipped);
      if (asset.type === "sound") playConnectionSound(asset.id);
    } else {
      setConfirmingAsset(asset);
    }
  };

  const handlePreviewAsset = (asset: Asset) => {
    setIsResonating(true);
    setPreviewAsset(asset);
    if (asset.type === "sound") playConnectionSound(asset.id);
    setTimeout(() => setIsResonating(false), 600);
  };

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-azure-500 animate-spin opacity-20" />
      </div>
    );
  }

  const filteredAssets = ASSETS.filter(a => a.type === activeCategory);

  const currentPreview = {
    ...equipped,
    ...(previewAsset ? { 
      [previewAsset.type]: previewAsset.id 
    } : {})
  };

  const currentAligns = currentPreview.orientation === 'horizontal' ? (currentPreview.hAlign || defaultAlign) : (currentPreview.vAlign || defaultAlign);

  const getCategoryIcon = (id: string) => {
    switch(id) {
      case "frame": return Shield;
      case "aura": return Zap;
      case "background": return Palette;
      case "effect": return Sparkles;
      case "title": return Trophy;
      case "pointer": return MousePointer2;
      case "sound": return Music;
      default: return Shield;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-14 lg:pt-32 px-4 lg:px-6 pb-4 lg:pb-32 text-moonlight overflow-hidden h-[calc(100dvh-80px)] lg:h-auto flex flex-col lg:block">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes hxc-marquee {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-40%); }
        }
        .animate-hxc-marquee {
          display: inline-block;
          animation: hxc-marquee 8s ease-in-out infinite;
        }
      `}</style>
      <ConfirmationModal 
        isOpen={!!confirmingAsset} 
        onClose={() => setConfirmingAsset(null)} 
        onConfirm={() => confirmingAsset && handleUnlock(confirmingAsset)}
        title={`Unlock ${confirmingAsset?.name}`}
        description="Do you wish to acquire this asset? / このアイテムを解放しますか？"
        cost={assetPrices[confirmingAsset?.rarity || "common"] || 0}
      />

      <header className="mb-4 lg:mb-20 flex justify-between items-center lg:items-end shrink-0">
        <div className="flex flex-col justify-end">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity">
            <ArrowLeft size={12} /> <span className="hidden lg:inline">Back to Home / </span>拠点へ戻る
          </Link>
          <h1 className="hidden lg:block text-3xl lg:text-5xl tracking-[0.3em] lg:tracking-[0.5em] uppercase font-extralight text-white mt-4">Shop & Items</h1>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold hidden lg:block">ショップ・アイテム管理 / Asset Management</p>
        </div>
        <div className="text-right flex items-center lg:flex-col lg:items-end gap-3 lg:gap-2">
           <div className="flex items-center gap-2 lg:gap-4 group">
              <p className="text-sm lg:text-3xl font-extralight tracking-[0.2em] text-white">{Number(rtBalance).toLocaleString()} <span className="text-[9px] lg:text-xs opacity-20">RT</span></p>
              <button 
                onClick={() => setShowRTPurchase(!showRTPurchase)} 
                className={`p-1.5 lg:p-2 border transition-all ${showRTPurchase ? "bg-white text-void border-white" : "border-white/10 hover:border-azure-500 hover:bg-azure-500/10"}`}
              >
                <Gem size={12} className={showRTPurchase ? "" : "text-azure-400"} />
              </button>
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-stretch lg:items-start flex-1 min-h-0">
        {/* Top Area: Fixed Preview Block on Mobile, Left Column on Desktop */}
        <div className="w-full lg:w-5/12 shrink-0 bg-void pb-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none h-auto flex items-center justify-center lg:sticky lg:top-32 z-30">
           <UnifiedCardContainer 
             orientation={equipped.orientation}
             onOrientationChange={(o) => setEquipped((prev: any) => ({ ...prev, orientation: o }))}
             textColor={equipped.textColor}
             onTextColorChange={(c) => { const next = { ...equipped, textColor: c }; setEquipped(next); handleCommit(next); }}
             previewLabel={previewAsset ? `Previewing: ${previewAsset.name}` : "Live Preview / ライブプレビュー"}
             isUpdating={isResonating}
             compact={true}
           >
              <motion.div
                className="flex justify-center shrink-0"
                animate={isResonating ? { 
                  scale: [1, 0.98, 1],
                  filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
                  opacity: [1, 0.5, 1]
                } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <HexaCardPreview 
                  {...mapUserToCardProps(profile, equipped.orientation, currentPreview)}
                />
              </motion.div>
           </UnifiedCardContainer>
        </div>

        {/* Bottom Area: Fixed Navigation & Scrollable Items on Mobile, Right Column on Desktop */}
        <div className="w-full lg:w-7/12 flex flex-col min-h-0 flex-1 lg:overflow-visible no-scrollbar">
           {/* RT Purchase Section (Inside scrollable container on mobile) */}
           <AnimatePresence>
             {showRTPurchase && (
               <motion.section 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: "auto" }}
                 exit={{ opacity: 0, height: 0 }}
                 className="mb-6 overflow-hidden border-b border-white/5 pb-6 shrink-0"
               >
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {RT_PACKS.map((pack) => (
                     <button
                       key={pack.id}
                       onClick={async () => {
                         try {
                           showToast(`Processing...`, "success");
                           const res = await fetch("/api/stripe/rt-checkout", {
                             method: "POST",
                             headers: { "Content-Type": "application/json" },
                             body: JSON.stringify({ packId: pack.id })
                           });
                           const data = await res.json();
                           if (data.url) {
                             window.location.href = data.url;
                           } else {
                             showToast(data.error || "接続に失敗しました", "error");
                           }
                         } catch (e) {
                           showToast("通信エラー", "error");
                         }
                       }}
                       className="group p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-azure-500/40 transition-all text-left flex flex-col gap-2 relative overflow-hidden"
                     >
                       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex justify-between items-start">
                         <h3 className="text-[8px] tracking-[0.4em] uppercase font-bold text-azure-400">{pack.label}</h3>
                         <Gem size={12} className="opacity-20 group-hover:opacity-100 group-hover:text-azure-400 transition-all" />
                       </div>
                       <div>
                         <p className="text-lg font-extralight tracking-widest text-white">{pack.rt.toLocaleString()} <span className="text-[8px] opacity-30">RT</span></p>
                         <p className="text-[10px] opacity-60 mt-0.5">¥{pack.price.toLocaleString()}</p>
                       </div>
                       <p className="text-[8px] tracking-widest opacity-30 uppercase leading-relaxed mt-2">{pack.description}</p>
                     </button>
                   ))}
                 </div>
                 <p className="text-[7px] tracking-[0.5em] uppercase opacity-20 text-center mt-4 italic">購入内容を確認し、決済を完了してください。 / Review and complete your purchase.</p>
               </motion.section>
             )}
           </AnimatePresence>

            <div className="flex flex-col gap-4 relative flex-1 min-h-0">
              {/* Category Navigation Wrapper with Left/Right Fades to visually indicate horizontal scroll */}
              <div className="relative w-full -mx-4 px-4 lg:mx-0 lg:px-0 z-20">
                 {/* Left Fade Overlay */}
                 <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-void via-void/80 to-transparent pointer-events-none z-30 lg:hidden" />

                 {/* Left Scroll Indicator Arrow */}
                 {showLeftScrollIndicator && (
                   <div className="absolute left-1 top-1/2 -translate-y-1/2 z-40 text-azure-400 opacity-60 pointer-events-none lg:hidden">
                     <ChevronRight size={14} className="rotate-180 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                   </div>
                 )}

                 {/* Category Navigation (Horizontal swipe menu, sticky to top of scroll container) */}
                 <div 
                   onScroll={handleCategoryScroll}
                   className="flex overflow-x-auto lg:flex-wrap no-scrollbar justify-start lg:justify-start border-b border-white/10 sticky top-0 bg-void pt-2 pb-0 gap-x-2"
                 >
                   {CATEGORIES.map((cat) => {
                     const Icon = getCategoryIcon(cat.id);
                     const isActive = activeCategory === cat.id;
                     return (
                       <button
                         key={cat.id}
                         onClick={() => { setActiveCategory(cat.id); setPreviewAsset(null); }}
                         className={`relative py-3 lg:py-4 px-4 lg:px-6 flex flex-col items-center gap-1.5 lg:gap-2 transition-all group overflow-hidden flex-none shrink-0 ${isActive ? "opacity-100 bg-white/[0.03]" : "opacity-30 hover:opacity-100 hover:bg-white/[0.02]"}`}
                       >
                         {isActive && (
                           <motion.div layoutId="activeCategory" className="absolute bottom-0 left-0 w-full h-[2px] bg-azure-400" />
                         )}
                         {isActive && (
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-azure-500/20 blur-xl pointer-events-none" />
                         )}
                         <Icon size={16} className={`relative z-10 transition-colors ${isActive ? "text-azure-400" : "text-white group-hover:text-azure-400"}`} />
                         <span className="text-[9px] lg:text-[10px] tracking-widest relative z-10 uppercase whitespace-nowrap">
                           {cat.name} / {cat.id.toUpperCase()}
                         </span>
                       </button>
                     );
                   })}
                 </div>

                 {/* Right Fade Overlay */}
                 <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-void via-void/80 to-transparent pointer-events-none z-30 lg:hidden" />

                 {/* Right Scroll Indicator Arrow */}
                 {showRightScrollIndicator && (
                   <motion.div 
                     animate={{ x: [0, 4, 0] }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                     className="absolute right-1 top-1/2 -translate-y-1/2 z-40 text-azure-400 opacity-60 pointer-events-none lg:hidden"
                   >
                     <ChevronRight size={14} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                   </motion.div>
                 )}
              </div>

              {/* Items List Container */}
              <div className="space-y-4 flex-1 min-h-0 overflow-y-auto lg:max-h-[680px] pr-2 lg:pr-4 custom-scrollbar pb-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 gap-2.5 lg:gap-4 px-2 lg:px-0 pb-12"
                  >
                    {filteredAssets
                      .filter(asset => {
                        if (profile?.role === "fixer") return true;
                        return asset.type !== "title" || unlockedTitles.includes(asset.id);
                      })
                      .sort((a, b) => {
                        const rarityOrder: Record<string, number> = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 };
                        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
                      })
                      .map((asset) => {
                        const isUnlocked = ownedAssets.includes(asset.id) || asset.rarity === "common" || profile?.role === "fixer";
                        const isActive = equipped[activeCategory as keyof typeof equipped] === asset.id;
                        const isPreviewing = previewAsset?.id === asset.id;
                        const cost = assetPrices[asset.rarity] || 0;

                        return (
                          <div 
                            key={asset.id}
                            className={`group p-3 lg:p-6 border transition-all relative overflow-hidden ${isActive ? "border-azure-500 bg-azure-500/10" : isPreviewing ? "border-azure-400/60 bg-azure-400/5" : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]"}`}
                          >
                            <div className="flex justify-between items-center relative z-10">
                              <div className="flex items-center gap-4 lg:gap-6 min-w-0 flex-1">
                                <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center border shrink-0 ${isUnlocked ? "border-white text-white bg-white/5" : "border-white/20 opacity-60"}`}>
                                  {isUnlocked ? <UserCheck size={14} /> : <Lock size={14} />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col items-start gap-1 mb-1 max-w-[170px] xs:max-w-[200px] sm:max-w-xs overflow-hidden">
                                    <h3 className="text-[10px] lg:text-[11px] tracking-[0.15em] lg:tracking-[0.4em] uppercase font-bold text-white relative w-full overflow-hidden whitespace-nowrap text-ellipsis">
                                      {asset.name}
                                    </h3>
                                    <span className={`text-[6px] lg:text-[7px] w-fit px-2 py-0.5 border uppercase tracking-widest font-bold ${getRarityStyles(asset.rarity)} opacity-90`}>{asset.rarity}</span>
                                  </div>
                                  <p className="text-[8px] lg:text-[9px] tracking-widest opacity-60 uppercase leading-relaxed max-w-[200px] lg:max-w-md line-clamp-1 lg:line-clamp-none text-white">{asset.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 lg:gap-3">
                                {!isActive && (
                                  <button 
                                    onClick={() => handlePreviewAsset(asset)}
                                    className={`p-2.5 lg:p-3 border transition-all ${isPreviewing ? "bg-azure-500 text-white border-azure-500" : "border-white/20 opacity-60 hover:opacity-100 hover:border-white hover:bg-white hover:text-black"}`}
                                    title="Try on / お試し着用"
                                  >
                                    <Eye size={14} />
                                  </button>
                                )}
                                
                                <button 
                                  onClick={() => handleSelectAsset(asset)}
                                  className={`px-3 py-2.5 lg:px-4 lg:py-3 border text-[8px] uppercase tracking-[0.2em] font-bold transition-all ${isUnlocked ? (isActive ? "bg-azure-500 text-white border-azure-500" : "border-white/30 text-white hover:bg-white hover:text-black") : "bg-azure-600/10 border-azure-600/50 text-azure-300"}`}
                                >
                                  {isUnlocked ? (isActive ? "Active / 使用中" : "Equip / 装備") : `${cost.toLocaleString()} RT`}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </motion.div>
                </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
