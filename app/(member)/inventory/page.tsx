"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, Check, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, Smartphone, Layout, Type, Palette, Eye, Zap, Gem, Loader2, ChevronRight } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/ConnectionToast";
import { playConnectionSound } from "@/lib/audio/resonance";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useSearchParams } from "next/navigation";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStatus } from "@/lib/user";
import { redirect } from "next/navigation";
import { ASSETS, Asset, CATEGORIES, getRarityStyles } from "@/lib/game/assets";

export const dynamic = "force-dynamic";

const RT_PACKS = [
  { id: "rt_small", price: 1000, rt: 2000, label: "2,000 ポイント", description: "基本的なポイント補充。1回のアセット購入に。" },
  { id: "rt_medium", price: 5000, rt: 11000, label: "11,000 ポイント", description: "推奨パック。広範なカスタマイズを可能にします。", popular: true },
  { id: "rt_large", price: 10000, rt: 23000, label: "23,000 ポイント", description: "最大限の補充。すべてのアイテムを揃える方に。" },
];

function InventoryContent({ initialStats }: { initialStats: any }) {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const activeCategoryFromUrl = searchParams.get("category");
  const showPurchaseFromUrl = searchParams.get("purchase") === "true";

  const [activeCategory, setActiveCategory] = useState(activeCategoryFromUrl || "frame");
  const [rtBalance, setRTBalance] = useState(initialStats.rt_balance);
  const [isSaving, setIsSaving] = useState(false);
  const [unlockingAsset, setUnlockingAsset] = useState<string | null>(null);
  const [ownedAssets, setOwnedAssets] = useState<string[]>(initialStats.owned_assets || []);
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>(initialStats.titles || ["ASSOCIATE"]);
  const [assetPrices, setAssetPrices] = useState<Record<string, number>>(initialStats.asset_prices || {});
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [isLoaded, setIsLoaded] = useState(true); // サーバーサイドデータがあるため、最初はtrue
  const [showRTPurchase, setShowRTPurchase] = useState(showPurchaseFromUrl);
  const [confirmingAsset, setConfirmingAsset] = useState<Asset | null>(null);
  
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
    title: "ASSOCIATE",
    sound: "resonance",
    pointer: "Pure White Hex",
    angel: "Sentinel",
    aura: "None",
    orientation: "horizontal",
    hAlign: defaultAlign,
    vAlign: defaultAlign,
    ...(initialStats.equipped || {})
  });

  const [profile, setProfile] = useState<any>(initialStats);

  const fetchData = useCallback(async () => {
    // 初回はサーバーサイドデータを使用するため、即時取得は不要
    try {
      const res = await fetch("/api/user/status", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setRTBalance(data.rt_balance);
        setOwnedAssets(data.owned_assets || []);
        setUnlockedTitles(data.titles || ["ASSOCIATE"]);
        setAssetPrices(data.asset_prices || {});
        if (data.equipped) setEquipped((prev: any) => ({ ...prev, ...data.equipped }));
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    // 最初のマウント時はfetchDataをスキップし、何らかの更新があった際のみ実行する
    // ただし、もし強制リロードが必要な場合のために登録はしておく
    const handleUpdate = () => fetchData();
    window.addEventListener("hxc-assets-updated", handleUpdate);
    return () => window.removeEventListener("hxc-assets-updated", handleUpdate);
  }, [fetchData]);

  const handleCommit = async (customEquipped?: any) => {
    // 楽観的更新: 既にstateは更新済みである前提で、保存中フラグのみ管理
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: customEquipped || equipped })
      });
      if (res.ok) {
        // 保存成功時はトーストのみ表示（微かな振動は既に実行済み）
        showToast("保存しました", "success");
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        throw new Error("Failed to sync");
      }
    } catch (e) {
      console.error(e);
      showToast("保存に失敗しました。再試行してください。", "error");
      // 必要に応じてfetchDataを再度呼び出して最新状態に戻す
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
        showToast(`解放しました: ${asset.name}`, "success");
        setRTBalance(data.rt_balance);
        setOwnedAssets(data.owned_assets);
        const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
        setEquipped(newEquipped);
        handleCommit(newEquipped);
      } else {
        showToast(data.error || "解放に失敗しました", "error");
      }
    } catch (err) { console.error(err); }
    finally { setUnlockingAsset(null); setConfirmingAsset(null); }
  };

  const handleSelectAsset = (asset: Asset) => {
    const isUnlocked = ownedAssets.includes(asset.id) || asset.rarity === "common" || profile?.role === "fixer";
    const isTitleUnlocked = unlockedTitles.includes(asset.id) || profile?.role === "fixer";

    if (asset.type === "title" ? isTitleUnlocked : isUnlocked) {
      // 楽観的更新: APIの返答を待たずにUIを切り替える
      const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
      setEquipped(newEquipped);
      
      // 指先に伝わるフィードバック（Haptic）
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
    setPreviewAsset(asset);
    if (asset.type === "sound") playConnectionSound(asset.id);
  };

  const filteredAssets = ASSETS.filter(a => a.type === activeCategory);

  if (status === "loading") return null;

  const currentPreview = {
    ...equipped,
    ...(previewAsset ? { [previewAsset.type]: previewAsset.id } : {})
  };

  const currentAligns = currentPreview.orientation === 'horizontal' ? (currentPreview.hAlign || defaultAlign) : (currentPreview.vAlign || defaultAlign);

  return (
    <div className="max-w-7xl mx-auto pt-24 lg:pt-32 px-4 lg:px-6 pb-24 text-moonlight overflow-x-hidden">
      <ConfirmationModal 
        isOpen={!!confirmingAsset} 
        onClose={() => setConfirmingAsset(null)} 
        onConfirm={() => confirmingAsset && handleUnlock(confirmingAsset)}
        title={`Unlock ${confirmingAsset?.name}`}
        description="Do you wish to acquire this asset?"
        cost={assetPrices[confirmingAsset?.rarity || "common"] || 0}
      />

      <header className="mb-8 lg:mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-4 lg:mb-8">
            <ArrowLeft size={12} /> Back to Home / 拠点へ戻る
          </Link>
          <h1 className="text-3xl lg:text-5xl tracking-[0.3em] lg:tracking-[0.5em] uppercase font-extralight text-white">Shop & Items</h1>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold hidden lg:block">ショップ・アイテム管理</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
           <Link href="/shop" className="text-[7px] lg:text-[9px] uppercase tracking-[0.4em] lg:tracking-[0.5em] text-azure-400 opacity-60 hover:opacity-100 transition-opacity mb-2 flex items-center gap-2">
              The Exchange <ChevronRight size={10} />
           </Link>
           <p className="text-[7px] lg:text-[9px] uppercase tracking-[0.4em] lg:tracking-[0.5em] text-azure-400 opacity-60">Points</p>
           <div className="flex items-center gap-4 group">
              <p className="text-xl lg:text-3xl font-extralight tracking-[0.2em] text-white">{Number(rtBalance).toLocaleString()} <span className="text-xs opacity-20">RT</span></p>
              <button 
                onClick={() => setShowRTPurchase(!showRTPurchase)} 
                className={`p-2 border transition-all ${showRTPurchase ? "bg-white text-void border-white" : "border-white/10 hover:border-azure-500 hover:bg-azure-500/10"}`}
              >
                <Gem size={16} className={showRTPurchase ? "" : "text-azure-400"} />
              </button>
           </div>
        </div>
      </header>

      {/* RT Purchase Section (Boundary) */}
      <AnimatePresence>
        {showRTPurchase && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 overflow-hidden border-b border-white/5 pb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="group p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-azure-500/40 transition-all text-left flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start">
                    <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-azure-400">{pack.label}</h3>
                    <Gem size={14} className="opacity-20 group-hover:opacity-100 group-hover:text-azure-400 transition-all" />
                  </div>
                  <div>
                    <p className="text-2xl font-extralight tracking-widest text-white">{pack.rt.toLocaleString()} <span className="text-[10px] opacity-30">RT</span></p>
                    <p className="text-[12px] opacity-60 mt-1">¥{pack.price.toLocaleString()}</p>
                  </div>
                  <p className="text-[9px] tracking-widest opacity-30 uppercase leading-relaxed mt-4">{pack.description}</p>
                </button>
              ))}
            </div>
            <p className="text-[8px] tracking-[0.5em] uppercase opacity-20 text-center mt-8 italic">購入内容を確認し、決済を完了してください。</p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Card Preview (Sticky) */}
        <div className="w-full lg:w-5/12 sticky top-0 lg:top-32 z-50 order-1 lg:order-none bg-void/98 pb-1 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none h-[38vh] lg:h-auto flex items-center justify-center">
           <div className="py-2 lg:p-8 bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-visible group flex flex-col items-center w-full">
              {previewAsset && (
                <div className="absolute top-0 left-0 w-full h-[1px] bg-azure-500 animate-pulse z-50" />
              )}
              
              <div className="absolute top-2 right-6 lg:top-4 lg:right-4 z-30 flex gap-2 p-1 bg-white/10 lg:bg-white/5 border border-white/10 scale-90 lg:scale-100">
                 <button onClick={() => setEquipped((prev: any) => ({ ...prev, orientation: 'horizontal' }))} className={`p-1.5 transition-all ${equipped.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={10}/>
                 </button>
                 <button onClick={() => setEquipped((prev: any) => ({ ...prev, orientation: 'vertical' }))} className={`p-1.5 transition-all ${equipped.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={10}/>
                 </button>
              </div>

              <div className="py-1 lg:py-0 w-full flex justify-center scale-[0.6] xs:scale-[0.75] sm:scale-85 lg:scale-100 origin-center lg:origin-top transition-transform duration-500 relative z-20">
                <HexaCardPreview 
                  name={profile?.name || "ARCHITECT"}
                  reading={profile?.handle || profile?.reading}
                  company={profile?.profile?.company}
                  title={profile?.profile?.title}
                  phone={profile?.profile?.phone}
                  email={profile?.profile?.contact_email || profile?.email}
                  logoUrl={profile?.logo_url}
                  faceUrl={profile?.photo_url}
                  frame={currentPreview.frame}
                  background={currentPreview.background}
                  effect={currentPreview.effect}
                  aura={currentPreview.aura}
                  fontFamily={currentPreview.fontFamily}
                  sound={currentPreview.sound}
                  orientation={equipped.orientation}
                  alignCompany={currentAligns.company}
                  alignName={currentAligns.name}
                  alignReading={currentAligns.reading}
                  alignTitle={currentAligns.title}
                  alignPhone={currentAligns.phone}
                  alignEmail={currentAligns.email}
                  bio={profile?.profile?.bio}
                />
              </div>

              <div className="lg:hidden text-center mt-[-15%] pb-1 flex flex-col items-center gap-1">
                 <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 font-bold">Live Preview</p>
                 {previewAsset && <span className="text-[6px] text-azure-400 uppercase font-bold tracking-widest animate-pulse">Previewing: {previewAsset.name}</span>}
              </div>
           </div>
        </div>

        {/* Selection Area */}
        <div className="w-full lg:w-7/12 space-y-8 lg:space-y-10 order-2 lg:order-none">
           <div className="lg:hidden h-[38vh]" />
           
           <div className="flex flex-col gap-4">
              <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth sticky top-[38vh] lg:top-0 bg-void/98 lg:bg-transparent z-40 -mx-4 px-4 lg:mx-0 lg:px-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setPreviewAsset(null); }}
                    className={`py-4 lg:py-6 px-6 lg:px-8 flex flex-col items-center gap-2 lg:gap-3 transition-all border-b-2 flex-shrink-0 ${activeCategory === cat.id ? "border-azure-500 opacity-100 bg-azure-500/5" : "border-transparent opacity-20 hover:opacity-50"}`}
                  >
                    <cat.icon size={16} className={activeCategory === cat.id ? "text-azure-400" : ""} />
                    <span className="block text-[7px] lg:text-[8px] uppercase tracking-[0.3em] font-bold whitespace-nowrap">{cat.name}</span>
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4 lg:max-h-[700px] overflow-y-visible lg:overflow-y-auto lg:pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 gap-4 px-2 lg:px-0 pb-12"
                >
                  {filteredAssets.filter(asset => {
                    if (profile?.role === "fixer") return true;
                    return asset.type !== "title" || unlockedTitles.includes(asset.id);
                  }).map((asset) => {
                    const isUnlocked = ownedAssets.includes(asset.id) || asset.rarity === "common" || profile?.role === "fixer";
                    const isActive = equipped[activeCategory as keyof typeof equipped] === asset.id;
                    const isPreviewing = previewAsset?.id === asset.id;
                    const cost = assetPrices[asset.rarity] || 0;

                    return (
                      <div 
                        key={asset.id}
                        className={`group p-4 lg:p-6 border transition-all relative overflow-hidden ${isActive ? "border-white/40 bg-white/5" : isPreviewing ? "border-azure-500/40 bg-azure-500/5" : "border-white/5 bg-white/[0.01] hover:border-white/20"}`}
                      >
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-4 lg:gap-6">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center border ${isUnlocked ? "border-white text-white" : "border-white/10 opacity-40"}`}>
                              {isUnlocked ? <UserCheck size={14} /> : <Lock size={14} />}
                            </div>
                            <div>
                              <div className="flex flex-col lg:items-start gap-1 mb-1">
                                <h3 className="text-[10px] lg:text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                                <span className={`text-[6px] lg:text-[7px] w-fit px-2 py-0.5 border uppercase tracking-widest font-bold ${getRarityStyles(asset.rarity)}`}>{asset.rarity}</span>
                              </div>
                              <p className="text-[8px] lg:text-[9px] tracking-widest opacity-40 uppercase leading-relaxed max-w-[200px] lg:max-w-md line-clamp-1 lg:line-clamp-none">{asset.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {!isActive && (
                              <button 
                                onClick={() => handlePreviewAsset(asset)}
                                className={`p-3 border transition-all ${isPreviewing ? "bg-azure-500 text-white border-azure-500" : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/30"}`}
                                title="Try on / お試し着用"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleSelectAsset(asset)}
                              className={`px-4 py-3 border text-[8px] uppercase tracking-[0.2em] font-bold transition-all ${isUnlocked ? (isActive ? "bg-white text-void border-white" : "border-white/20 opacity-40 hover:opacity-100 hover:border-white") : "bg-azure-600/10 border-azure-600/30 text-azure-400"}`}
                            >
                              {isUnlocked ? (isActive ? "Active" : "Equip") : `${cost.toLocaleString()} RT`}
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
  );
}

async function InventoryLoader() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const stats = await getUserStatus(session.user.email);
  if (!stats) redirect("/activate");

  return (
    <InventoryContent 
      initialStats={stats} 
    />
  );
}

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-void">
      <Suspense fallback={<div className="min-h-screen bg-void flex items-center justify-center text-[10px] tracking-widest opacity-20 uppercase">Loading Treasury...</div>}>
        <InventoryLoader />
      </Suspense>
    </main>
  );
}
