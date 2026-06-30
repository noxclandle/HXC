"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, Smartphone, Layout, Palette, Eye, Zap, Gem, Loader2, ChevronRight, Camera } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
  { id: "rt_small", price: 1000, rt: 2000, label: "2,000 Points / 2,000 ポイント", description: "Basic point refill. For a single asset purchase. / 基本的なポイント補充。1回のアセット購入に。" },
  { id: "rt_medium", price: 5000, rt: 11000, label: "11,000 Points / 11,000 ポイント", description: "Recommended pack. Unlocks extensive customization. / 推奨パック。広範なカスタマイズを可能にします。", popular: true },
  { id: "rt_large", price: 10000, rt: 23000, label: "23,000 Points / 23,000 ポイント", description: "Maximum refill. Perfect for collecting all assets. / 最大限の補充。すべてのアイテムを揃える方に。" },
];

const getPointerStyle = (id: string) => {
  switch (id) {
    case "Azure Trace": return { color: "#3B82F6", shape: "hex" };
    case "Emerald Trace": return { color: "#10B981", shape: "hex" };
    case "Ruby Trace": return { color: "#F43F5E", shape: "square" };
    case "Gold Trace": return { color: "#F59E0B", shape: "hex" };
    case "Violet Trace": return { color: "#8B5CF6", shape: "hex" };
    case "Crimson Trace": return { color: "#EF4444", shape: "square" };
    case "Shadow Trace": return { color: "#111111", shape: "square" };
    case "Prism Trace": return { color: "rgba(255, 255, 255, 0.8)", shape: "hex" };
    case "Void Trace": return { color: "#000000", shape: "square" };
    case "Nebula Trace": return { color: "#a855f7", shape: "hex" };
    case "Solar Trace": return { color: "#f97316", shape: "square" };
    case "Dot": return { color: "#FFFFFF", shape: "circle" };
    case "Ring": return { color: "#FFFFFF", shape: "ring" };
    case "Cross": return { color: "#FFFFFF", shape: "cross" };
    default: return { color: "#FFFFFF", shape: "hex" };
  }
};

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
  const [localPulses, setLocalPulses] = useState<{ id: number; x: number; y: number; color: string; shape: string }[]>([]);

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
    zoom_bg: "ZoomBgDefault",
    orientation: "horizontal",
    hAlign: defaultAlign,
    vAlign: defaultAlign,
    ...(initialStats?.equipped || {})
  });

  const [profile, setProfile] = useState<any>(initialStats);

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
    setMounted(true);
    fetchData();
  }, [fetchData]);

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
    if (asset.type === "pointer") {
      const style = getPointerStyle(asset.id);
      const id = Date.now() + Math.random();
      setLocalPulses(prev => [...prev.slice(-6), { id, x: 225, y: 126, ...style }]);
    }
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
      case "zoom_bg": return Camera;
      default: return Shield;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-3 lg:pt-32 px-4 lg:px-6 pb-3 lg:pb-32 text-moonlight overflow-hidden h-[calc(100dvh-60px)] lg:h-auto flex flex-col lg:block">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes hxc-marquee {
          0%, 15% { transform: translateX(0); }
          45%, 55% { transform: translateX(-40%); }
          85%, 100% { transform: translateX(0); }
        }
        .animate-hxc-marquee {
          display: inline-block;
          animation: hxc-marquee 12s ease-in-out infinite;
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
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold hidden lg:block">Asset Management / ショップ・アイテム管理</p>
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

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-16 items-stretch lg:items-start flex-1 min-h-0">
        {/* Top Area: Fixed Preview Block on Mobile, Left Column on Desktop */}
        <div className="w-full lg:w-5/12 shrink-0 bg-void pb-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none h-auto flex items-center justify-center lg:sticky lg:top-32 z-30">
           <UnifiedCardContainer 
             orientation={
               activeCategory === "zoom_bg" || 
               activeCategory === "sound" || 
               activeCategory === "pointer" || 
               activeCategory === "title" 
                 ? "horizontal" 
                 : equipped.orientation
             }
             onOrientationChange={(o) => setEquipped((prev: any) => ({ ...prev, orientation: o }))}
             textColor={equipped.textColor}
             onTextColorChange={(c) => { const next = { ...equipped, textColor: c }; setEquipped(next); handleCommit(next); }}
             previewLabel={previewAsset ? `Previewing: ${previewAsset.name}` : "Live Preview / ライブプレビュー"}
             isUpdating={isResonating}
             compact={true}
             showControls={
               activeCategory !== "zoom_bg" && 
               activeCategory !== "sound" && 
               activeCategory !== "pointer" && 
               activeCategory !== "title"
             }
           >
              {activeCategory === "zoom_bg" ? (
                <motion.div
                  className="w-[450px] h-[253px] border flex items-center justify-center relative overflow-hidden group rounded-lg shadow-2xl transition-all"
                  style={{
                    backgroundColor: 
                      currentPreview.zoom_bg === "ZoomBgCyber" ? "#030712" :
                      currentPreview.zoom_bg === "ZoomBgSlate" ? "#0f172a" :
                      currentPreview.zoom_bg === "ZoomBgWashi" ? "#18140f" :
                      currentPreview.zoom_bg === "ZoomBgMist" ? "#0d0b13" :
                      currentPreview.zoom_bg === "ZoomBgGold" ? "#1c150c" :
                      currentPreview.zoom_bg === "ZoomBgMattePlates" ? "#0c0a09" :
                      currentPreview.zoom_bg === "ZoomBgBronze" ? "#140e0a" :
                      currentPreview.zoom_bg === "ZoomBgDawn" ? "#060416" :
                      currentPreview.zoom_bg === "ZoomBgPrism" ? "#090514" :
                      currentPreview.zoom_bg === "ZoomBgNebula" ? "#02020f" : "#020202",
                    borderColor: 
                      currentPreview.zoom_bg === "ZoomBgCyber" ? "rgba(34, 211, 238, 0.3)" :
                      currentPreview.zoom_bg === "ZoomBgSlate" ? "rgba(148, 163, 184, 0.25)" :
                      currentPreview.zoom_bg === "ZoomBgWashi" ? "rgba(217, 119, 6, 0.25)" :
                      currentPreview.zoom_bg === "ZoomBgMist" ? "rgba(168, 85, 247, 0.25)" :
                      currentPreview.zoom_bg === "ZoomBgGold" ? "rgba(245, 158, 11, 0.3)" :
                      currentPreview.zoom_bg === "ZoomBgMattePlates" ? "rgba(120, 113, 108, 0.25)" :
                      currentPreview.zoom_bg === "ZoomBgBronze" ? "rgba(180, 83, 9, 0.25)" :
                      currentPreview.zoom_bg === "ZoomBgDawn" ? "rgba(217, 119, 6, 0.25)" :
                      currentPreview.zoom_bg === "ZoomBgPrism" ? "rgba(168, 85, 247, 0.3)" :
                      currentPreview.zoom_bg === "ZoomBgNebula" ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.1)",
                  }}
                  animate={isResonating ? { 
                    scale: [1, 0.98, 1],
                    filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
                    opacity: [1, 0.5, 1]
                  } : {}}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {/* Cyber Grid Pattern */}
                  {currentPreview.zoom_bg === "ZoomBgCyber" && (
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  )}

                  {/* Slate Vertical Accent */}
                  {currentPreview.zoom_bg === "ZoomBgSlate" && (
                    <div className="absolute top-2 bottom-2 left-3 w-[1px] bg-slate-500/30" />
                  )}

                  {/* Washi Amber Glow */}
                  {currentPreview.zoom_bg === "ZoomBgWashi" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(217,119,6,0.03)_100%)]" />
                  )}

                  {/* Mist Shadow Fade */}
                  {currentPreview.zoom_bg === "ZoomBgMist" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  )}
                  
                  {/* Default Hex Pattern */}
                  {currentPreview.zoom_bg === "ZoomBgDefault" && (
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
                  )}

                  {/* Nebula Glow */}
                  {currentPreview.zoom_bg === "ZoomBgNebula" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.12)_0%,rgba(45,212,191,0.08)_50%,transparent_100%)] animate-pulse" style={{ animationDuration: '6s' }} />
                  )}

                  {/* Gold Inner Frame */}
                  {currentPreview.zoom_bg === "ZoomBgGold" && (
                    <div className="absolute inset-2 border border-amber-500/10 rounded" />
                  )}

                  {/* Matte Obsidian Plate Dots */}
                  {currentPreview.zoom_bg === "ZoomBgMattePlates" && (
                    <>
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white/40 rounded-full" />
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
                      <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/40 rounded-full" />
                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
                    </>
                  )}

                  {/* Bronze Double Border */}
                  {currentPreview.zoom_bg === "ZoomBgBronze" && (
                    <div className="absolute inset-1 border border-amber-900/10 rounded" />
                  )}

                  {/* Dawn Sunrise Light */}
                  {currentPreview.zoom_bg === "ZoomBgDawn" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,119,6,0.08)_0%,transparent_70%)]" />
                  )}

                  <Camera size={48} className="opacity-10 z-10 text-white" />
                  
                  {/* QR Code Area at Top Right */}
                  <div className="absolute top-4 right-4 p-1.5 bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.15)] rounded-sm">
                     <QRCodeSVG 
                       value={
                         typeof window !== "undefined" 
                           ? `${window.location.origin}/p/${profile?.slug || ""}` 
                           : `https://virtual-business-card.hexa-relation.com/p/${profile?.slug || ""}`
                       } 
                       size={56} 
                     />
                  </div>

                  {/* Brand Text at Bottom Left */}
                  <div className="absolute bottom-4 left-4 text-[8px] tracking-[6px] text-white/20 uppercase font-bold z-10">
                    HEXA RELATION
                  </div>

                  <div className="absolute bottom-4 right-4 text-[7px] tracking-[2px] opacity-20 uppercase font-bold z-10">
                    Preview
                  </div>
                </motion.div>
              ) : activeCategory === "sound" ? (
                <motion.div
                  onClick={() => {
                    const soundId = currentPreview.sound;
                    playConnectionSound(soundId);
                    setIsResonating(true);
                    setTimeout(() => setIsResonating(false), 500);
                  }}
                  className="w-[450px] h-[253px] bg-[#020202] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center cursor-pointer group rounded-lg shadow-2xl"
                  animate={isResonating ? { scale: [1, 0.97, 1] } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute w-40 h-40 bg-azure-500/10 rounded-full blur-2xl pointer-events-none"
                  />
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-10, -80],
                        x: [0, (i % 2 === 0 ? 25 : -25)],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1.1, 0.5]
                      }}
                      transition={{
                        duration: 2.5 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                      className="absolute text-azure-400 opacity-0 pointer-events-none text-xs"
                      style={{
                        bottom: "35%",
                        left: `${40 + i * 5}%`
                      }}
                    >
                      ♩
                    </motion.div>
                  ))}
                  
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute w-24 h-24 border border-azure-500/20 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                    className="absolute w-24 h-24 border border-azure-500/10 rounded-full"
                  />

                  <div className="z-10 flex flex-col items-center gap-4">
                    <Music size={40} className="text-azure-400 animate-pulse" />
                    <div className="text-center">
                      <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-1">Equipped Sound / 共鳴音響</p>
                      <h4 className="text-sm tracking-[0.3em] font-light text-white uppercase">
                        {ASSETS.find(a => a.id === currentPreview.sound)?.name || currentPreview.sound}
                      </h4>
                      <p className="text-[7px] tracking-widest text-azure-400 uppercase mt-2 opacity-60">Tap to Resonance / クリックして試聴</p>
                    </div>
                  </div>
                </motion.div>
              ) : activeCategory === "pointer" ? (
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;
                    const id = Date.now() + Math.random();
                    const style = getPointerStyle(currentPreview.pointer || "Pure White Hex");
                    setLocalPulses(prev => [...prev.slice(-6), { id, x: clickX, y: clickY, ...style }]);
                    if (currentPreview.sound) playConnectionSound(currentPreview.sound);
                  }}
                  className="w-[450px] h-[253px] bg-[#020202] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center cursor-crosshair group rounded-lg shadow-2xl"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_80%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  <AnimatePresence>
                    {localPulses.map((p) => {
                      if (p.shape === "cross") {
                        return (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0.8, scale: 0, x: p.x - 24, y: p.y - 24 }}
                            animate={{ opacity: 0, scale: 2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute w-12 h-12 flex items-center justify-center pointer-events-none"
                          >
                            <div className="absolute w-full h-[2px]" style={{ backgroundColor: p.color }} />
                            <div className="absolute h-full w-[2px]" style={{ backgroundColor: p.color }} />
                          </motion.div>
                        );
                      }
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0.8, scale: 0, x: p.x - 24, y: p.y - 24, rotate: 0 }}
                          animate={{ 
                            opacity: 0, 
                            scale: 2.5, 
                            rotate: p.shape === "hex" ? 90 : 180,
                            y: p.y - 24 - 30 
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`absolute border-2 pointer-events-none`}
                          style={{ 
                            borderColor: p.shape === "ring" ? p.color : "transparent",
                            backgroundColor: p.shape !== "ring" ? p.color : "transparent",
                            width: "48px",
                            height: "48px",
                            borderRadius: p.shape === "circle" || p.shape === "ring" ? "50%" : "0%",
                            clipPath: p.shape === "hex" ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" : "none"
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>

                  <div className="z-10 flex flex-col items-center gap-3 pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity">
                    <MousePointer2 size={36} className="text-azure-400" />
                    <div className="text-center">
                      <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-1">Click Pad / タップテスト</p>
                      <h4 className="text-sm tracking-[0.3em] font-light text-white uppercase">
                        {ASSETS.find(a => a.id === currentPreview.pointer)?.name || currentPreview.pointer}
                      </h4>
                      <p className="text-[7px] tracking-widest text-azure-400 uppercase mt-2 opacity-60">Click anywhere to test effect / パッド内をクリック</p>
                    </div>
                  </div>
                </div>
              ) : activeCategory === "title" ? (
                <motion.div
                  className="w-[450px] h-[253px] bg-[#020202] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center rounded-lg shadow-2xl"
                  animate={isResonating ? { scale: [1, 0.98, 1] } : {}}
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute w-56 h-56 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,transparent_70%)] pointer-events-none"
                  />
                  
                  <div className="border border-white/10 bg-white/[0.01] p-6 w-[320px] text-center relative flex flex-col items-center gap-3 rounded">
                     <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
                     <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
                     <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
                     <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />
                     
                     <Trophy size={28} className="text-azure-400 opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
                     
                     <div className="space-y-1 w-full">
                        <p className="text-[7px] tracking-[0.4em] uppercase text-white/30">Holographic Title Plaque</p>
                        <h3 className="text-xs tracking-[0.25em] font-light text-white uppercase break-all truncate">
                          {previewAsset && previewAsset.type === "title" ? previewAsset.name : currentPreview.title}
                        </h3>
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full my-1.5" />
                        <div className="max-h-[60px] overflow-y-auto no-scrollbar">
                          <p className="text-[7px] tracking-wider text-white/50 leading-relaxed uppercase">
                            {previewAsset && previewAsset.type === "title" ? previewAsset.description : (ASSETS.find(a => a.id === currentPreview.title)?.description || "Authorized member title.")}
                          </p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ) : (
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
              )}
           </UnifiedCardContainer>
        </div>

        {/* Bottom Area: Fixed Navigation & Scrollable Items on Mobile */}
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
                             showToast(data.error || "Connection failed. / 接続に失敗しました", "error");
                           }
                         } catch (e) {
                           showToast("Network error. / 通信エラーが発生しました", "error");
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

             <div className="flex flex-col gap-2.5 lg:gap-4 relative flex-1 min-h-0">
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
              <div className="space-y-3 lg:space-y-4 flex-1 min-h-0 overflow-y-auto lg:max-h-[680px] pr-2 lg:pr-4 custom-scrollbar pb-16">
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
                                  <div className="w-full max-w-[160px] xs:max-w-[200px] sm:max-w-xs lg:max-w-md overflow-hidden whitespace-nowrap">
                                    <span className={`text-[8px] lg:text-[9px] tracking-widest opacity-60 uppercase leading-relaxed text-white inline-block whitespace-nowrap ${asset.description && asset.description.length > 20 ? "animate-hxc-marquee" : ""}`}>
                                      {asset.description}
                                    </span>
                                  </div>
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
