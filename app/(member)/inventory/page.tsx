"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, Check, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, Smartphone, Layout, Type, Palette } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/ResonanceToast";

export const dynamic = "force-dynamic";

interface Asset {
  id: string;
  name: string;
  type: "frame" | "sound" | "effect" | "angel" | "title" | "pointer" | "background" | "fontFamily";
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  description: string;
  unlocked: boolean;
  cost?: number;
}

const CATEGORIES = [
  { id: "frame", name: "Frames", icon: Shield, sub: "外枠" },
  { id: "background", name: "Backgrounds", icon: Palette, sub: "背景" },
  { id: "effect", name: "Effects", icon: Sparkles, sub: "エフェクト" },
  { id: "title", name: "Titles", icon: Trophy, sub: "称号" },
  { id: "pointer", name: "Pointers", icon: MousePointer2, sub: "軌跡" },
  { id: "sound", name: "Sounds", icon: Music, sub: "音響" },
];

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState("frame");
  const [rtBalance, setRTBalance] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [unlockingAsset, setUnlockingAsset] = useState<string | null>(null);
  const [ownedAssets, setOwnedAssets] = useState<string[]>([]);
  const [assetPrices, setAssetPrices] = useState<Record<string, number>>({});
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  
  const [equipped, setEquipped] = useState({
    frame: "Obsidian",
    background: "Default",
    effect: "None",
    fontFamily: "Standard",
    title: "ASSOCIATE",
    sound: "resonance",
    pointer: "Pure White Hex",
    angel: "Sentinel",
    orientation: "horizontal" as "horizontal" | "vertical"
  });

  const [assets, setAssets] = useState<Asset[]>([
    // Frames
    { id: "Obsidian", name: "Obsidian Frame", type: "frame", rarity: "common", description: "標準的な外枠。ビジネスの誠実さを表現する。", unlocked: true },
    { id: "Gold", name: "Heritage Gold", type: "frame", rarity: "epic", description: "伝統を感じさせる落ち着いた黄金色。", cost: 5000, unlocked: false },
    { id: "Dynamic", name: "Azure Pulse", type: "frame", rarity: "legendary", description: "知性を感じさせる蒼い脈動。", cost: 10000, unlocked: false },
    { id: "Sakura", name: "Sakura Aura", type: "frame", rarity: "rare", description: "優雅なピンクの残響。親しみやすさを演出する。", cost: 3000, unlocked: false },
    { id: "Emerald", name: "Emerald Pulse", type: "frame", rarity: "rare", description: "生命力溢れる緑の輝き。成長と調和の証。", cost: 3000, unlocked: false },
    { id: "Platinum", name: "Platinum Edge", type: "frame", rarity: "epic", description: "精巧な装飾が施された銀の縁。洗練されたプロフェッショナルへ。", cost: 8000, unlocked: false },
    { id: "ImperialGold", name: "Imperial Gold", type: "frame", rarity: "legendary", description: "Black Member限定。圧倒的な存在感を放つ極厚の黄金フレーム。", cost: 999999, unlocked: false },
    
    // Backgrounds
    { id: "Default", name: "Solid Void", type: "background", rarity: "common", description: "標準の無地背景。情報の透過性を最大化する。", unlocked: true },
    { id: "Carbon", name: "Carbon Fiber", type: "background", rarity: "rare", description: "強靭なカーボン調のテクスチャ。", cost: 2000, unlocked: false },
    { id: "MonochromeGrid", name: "Monochrome Grid", type: "background", rarity: "epic", description: "計算された緻密なグリッド線。理知的な印象を与える。", cost: 4500, unlocked: false },
    { id: "BrushedMetal", name: "Brushed Metal", type: "background", rarity: "rare", description: "鈍く光るヘアライン加工の金属質。", cost: 3500, unlocked: false },
    { id: "Nebula", name: "Cosmic Nebula", type: "background", rarity: "legendary", description: "深い宇宙を思わせる青の階調。", cost: 9000, unlocked: false },
    { id: "SilkBlur", name: "Silk Blur", type: "background", rarity: "legendary", description: "微かな光の拡散。シルクのような滑らかな空間を演出。", cost: 9000, unlocked: false },

    // Effects
    { id: "None", name: "Clean", type: "effect", rarity: "common", description: "追加効果なし。純粋な情報を提示する。", unlocked: true },
    { id: "Aethereal", name: "Aethereal Diffusion", type: "effect", rarity: "epic", description: "微弱なノイズによる透過エフェクト。存在の境界を曖昧にする。", cost: 6000, unlocked: false },
    { id: "Glitch", name: "Digital Glitch", type: "effect", rarity: "rare", description: "時折発生するグリッチノイズ。技術的な洗練を演出。", cost: 3000, unlocked: false },
    { id: "Interference", name: "Signal Interference", type: "effect", rarity: "legendary", description: "波紋のようなシグナル干渉。静かな存在感を放つ。", cost: 8000, unlocked: false },
    { id: "Petals", name: "Falling Petals", type: "effect", rarity: "rare", description: "静かに舞い散る花びら。余白の美を強調する。", cost: 3000, unlocked: false },

    { id: "ASSOCIATE", name: "ASSOCIATE", type: "title", rarity: "common", description: "初期称号。ネットワークの一員である証。", unlocked: true },
    { id: "CONNECTOR", name: "CONNECTOR", type: "title", rarity: "rare", description: "実績：10人との接続を記録した証。", unlocked: false },
    { id: "STRATEGIST", name: "STRATEGIST", type: "title", rarity: "epic", description: "実績：100人の人脈をアーカイブした証。", unlocked: false },
    { id: "MASTERMIND", name: "MASTERMIND", type: "title", rarity: "mythic", description: "至高実績：ネットワークの構造を解明した知性。", unlocked: false },
    { id: "CHIEF OFFICER", name: "CHIEF OFFICER", type: "title", rarity: "mythic", description: "至高実績：システムの運営に関与する権限。", unlocked: false },

    { id: "Pure White Hex", name: "Pure White Hex", type: "pointer", rarity: "common", description: "純白の鋭い軌跡。", unlocked: true },
    { id: "Azure Trace", name: "Azure Trace", type: "pointer", rarity: "rare", description: "知的な蒼い軌跡。", unlocked: false },
    { id: "Gold Trace", name: "Golden Aura", type: "pointer", rarity: "epic", description: "格式高い黄金の軌跡。", cost: 5000, unlocked: false },
    { id: "Emerald Trace", name: "Emerald Pulse", type: "pointer", rarity: "rare", description: "生命力ある緑の軌跡。", cost: 3000, unlocked: false },
    { id: "Violet Trace", name: "Violet Resonance", type: "pointer", rarity: "epic", description: "神秘的な紫の軌跡。", cost: 4500, unlocked: false },
    { id: "Crimson Trace", name: "Crimson Ember", type: "pointer", rarity: "legendary", description: "情熱的な真紅의 軌跡。", cost: 8000, unlocked: false },
    { id: "resonance", name: "Pure Resonance", type: "sound", rarity: "epic", description: "反転時：空間を震わせる標準的な共鳴音。", unlocked: false },
    { id: "silver", name: "Silver Resonance", type: "sound", rarity: "rare", description: "反転時：透明感のある銀の鈴の音。", unlocked: false },
    { id: "void", name: "Deep Resonance", type: "sound", rarity: "mythic", description: "反転時：重厚で静かな低音。", unlocked: false },
  ]);

  const getRarityStyle = (rarity: Asset["rarity"]) => {
    switch (rarity) {
      case "mythic": return "text-white border-white/40 bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)]";
      case "legendary": return "text-rose-500 border-rose-500/20 bg-rose-500/5";
      case "epic": return "text-orange-500 border-orange-500/20 bg-orange-500/5";
      case "rare": return "text-purple-400 border-purple-500/20 bg-purple-500/5";
      case "common": return "text-white/40 border-white/5 bg-white/[0.01]";
    }
  };

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setRTBalance(data.rt_balance);
          setProfile(data);
          setOwnedAssets(data.owned_assets || []);
          setAssetPrices(data.asset_prices || {});
          if (data.equipped) setEquipped({ ...equipped, ...data.equipped });
        }
      } catch (err) { console.error(err); }
    };
    if (session) fetchInitialData();
  }, [session]);

  const handleCommit = async (customEquipped?: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: customEquipped || equipped })
      });

      if (res.ok) {
        showToast("Synchronized / 装備を同期しました", "success");
        window.dispatchEvent(new CustomEvent("hxc-assets-updated"));
      } else {
        showToast("Error / 保存に失敗しました", "error");
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleUnlock = async (asset: Asset) => {
    if (unlockingAsset) return;
    
    const cost = assetPrices[asset.rarity] || 0;
    if (confirm(`Unlock ${asset.name} for ${cost.toLocaleString()} RT?`)) {
      setUnlockingAsset(asset.id);
      try {
        const res = await fetch("/api/user/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetId: asset.id, rarity: asset.rarity })
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`Unlocked: ${asset.name}`, "success");
          setRTBalance(data.rt_balance);
          setOwnedAssets(data.owned_assets);
          
          // 即座に装備して保存
          const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
          setEquipped(newEquipped);
          handleCommit(newEquipped);
        } else {
          showToast(data.error || "Unlock failed", "error");
        }
      } catch (err) { console.error(err); }
      finally { setUnlockingAsset(null); }
    }
  };

  const handleSelectAsset = (asset: Asset) => {
    const isUnlocked = asset.rarity === "common" || asset.type === "title" || ownedAssets.includes(asset.id);
    
    if (!isUnlocked) {
      handleUnlock(asset);
      return;
    }
    const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
    setEquipped(newEquipped);
    handleCommit(newEquipped);
  };

  const filteredAssets = assets.filter(a => a.type === activeCategory);

  if (status === "loading") return null;

  const displayEquipped = {
    ...equipped,
    ...(previewAsset ? { [previewAsset.type]: previewAsset.id } : {})
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 px-6 pb-24 text-moonlight">
      <header className="mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-5xl tracking-[0.5em] uppercase font-extralight text-white">Treasury</h1>
          <p className="text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold">宝物庫・アセット管理</p>
        </div>
        <div className="text-right">
           <p className="text-[9px] uppercase tracking-[0.5em] text-azure-400 opacity-60">Relation Token</p>
           <p className="text-3xl font-extralight tracking-[0.2em] text-white">{Number(rtBalance).toLocaleString()} <span className="text-xs opacity-20">RT</span></p>
           <div className="mt-2 flex justify-end items-center gap-2 opacity-40">
              <span className="text-[7px] uppercase tracking-widest font-bold">Total EXP</span>
              <span className="text-[10px] font-mono tracking-tighter text-white">{Number(profile?.exp || 0).toLocaleString()}</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 sticky top-32 space-y-12">
           <div className="p-8 bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-azure-500/20 to-transparent" />
              
              <div className="absolute top-6 right-6 z-30 flex gap-2 p-1 bg-white/5 border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => {
                   const newEquipped = {...equipped, orientation: 'horizontal' as const};
                   setEquipped(newEquipped);
                   handleCommit(newEquipped);
                 }} className={`p-1.5 transition-all ${equipped.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={12}/>
                 </button>
                 <button onClick={() => {
                   const newEquipped = {...equipped, orientation: 'vertical' as const};
                   setEquipped(newEquipped);
                   handleCommit(newEquipped);
                 }} className={`p-1.5 transition-all ${equipped.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={12}/>
                 </button>
              </div>

              <HexaCardPreview 
                name={profile?.name || session?.user?.name || "ARCHITECT"} 
                reading={profile?.handle || profile?.reading}
                company={profile?.profile?.company}
                title={profile?.profile?.title}
                phone={profile?.profile?.phone}
                email={profile?.profile?.contact_email || profile?.email}
                logoUrl={profile?.logo_url}
                faceUrl={profile?.photo_url}
                frame={displayEquipped.frame}
                background={displayEquipped.background}
                effect={displayEquipped.effect}
                fontFamily={displayEquipped.fontFamily}
                sound={displayEquipped.sound}
                orientation={displayEquipped.orientation}
                alignCompany="center"
                alignName="center"
                alignReading="center"
                alignTitle="center"
                alignPhone="center"
                alignEmail="center"
              />
              <div className="mt-10 pt-8 border-t border-white/5 space-y-4 w-full">
                 <div className="flex justify-between items-center text-[8px] tracking-[0.3em] uppercase opacity-40">
                    <span>Identity Status</span>
                    <span className="text-azure-400 font-bold uppercase tracking-widest">
                       {previewAsset ? "Preview Mode" : "Authorized"}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
           <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-6 px-8 flex flex-col items-center gap-3 transition-all border-b-2 flex-shrink-0 ${
                    activeCategory === cat.id ? "border-azure-500 opacity-100 bg-azure-500/5" : "border-transparent opacity-20 hover:opacity-50"
                  }`}
                >
                  <cat.icon size={18} className={activeCategory === cat.id ? "text-azure-400" : ""} />
                  <div className="text-center">
                    <span className="block text-[8px] uppercase tracking-[0.3em] font-bold whitespace-nowrap">{cat.name}</span>
                  </div>
                </button>
              ))}
           </div>

           <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
                  {filteredAssets.map((asset) => {
                    const isUnlocked = asset.rarity === "common" || asset.type === "title" || ownedAssets.includes(asset.id);
                    const isActive = equipped[activeCategory as keyof typeof equipped] === asset.id;
                    const cost = assetPrices[asset.rarity] || 0;

                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => handleSelectAsset(asset)} 
                        onMouseEnter={() => setPreviewAsset(asset)}
                        onMouseLeave={() => setPreviewAsset(null)}
                        className={`group p-6 border transition-all cursor-pointer flex justify-between items-center relative overflow-hidden ${isActive ? "border-white/40 bg-white/5" : "border-white/5 bg-white/[0.01] hover:border-azure-500/20"} ${!isUnlocked && "opacity-60"}`}
                      >
                        <div className="flex items-center gap-6">
                           <div className={`w-12 h-12 flex items-center justify-center border ${isActive ? "border-white text-white" : "border-white/10 opacity-40"}`}>
                              {isUnlocked ? <Check size={16} /> : <Lock size={16} />}
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                                 <span className={`text-[7px] px-3 py-0.5 border uppercase tracking-widest font-bold ${getRarityStyle(asset.rarity)}`}>{asset.rarity}</span>
                              </div>
                              <p className="text-[9px] tracking-widest opacity-40 uppercase leading-relaxed max-w-md">{asset.description}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          {isUnlocked ? (
                            isActive ? <span className="text-white text-[8px] tracking-[0.4em] font-bold uppercase italic">Active</span> : <span className="text-[8px] tracking-[0.4em] opacity-20 uppercase group-hover:opacity-100">Equip</span>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[10px] font-mono text-white tracking-widest">{cost.toLocaleString()} RT</span>
                              <span className="text-[7px] tracking-[0.2em] opacity-40 uppercase font-bold">
                                {unlockingAsset === asset.id ? "Unlocking..." : "Unlock"}
                              </span>
                            </div>
                          )}
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
