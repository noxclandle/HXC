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
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>(["ASSOCIATE"]);
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
    { id: "Stardust", name: "Stardust", type: "background", rarity: "rare", description: "星屑のような微細な輝きを散りばめた漆黒。", cost: 3000, unlocked: false },
    { id: "RoyalGold", name: "Royal Gold", type: "background", rarity: "epic", description: "微かな金粉が舞う、格式高い黒金の世界。", cost: 5000, unlocked: false },
    { id: "MidnightMist", name: "Midnight Mist", type: "background", rarity: "legendary", description: "静寂な霧が立ち込める、深淵のグラデーション。", cost: 8500, unlocked: false },
    { id: "DigitalFlow", name: "Digital Flow", type: "background", rarity: "epic", description: "情報が流動するサイバー空間のシグナル。", cost: 5500, unlocked: false },
    { id: "PrismFractal", name: "Prism Fractal", type: "background", rarity: "rare", description: "屈折した光が七色に揺らめく、透過の極致。", cost: 3500, unlocked: false },

    // Effects
    { id: "None", name: "Clean", type: "effect", rarity: "common", description: "追加効果なし。純粋な情報を提示する。", unlocked: true },
    { id: "Aethereal", name: "Aethereal Diffusion", type: "effect", rarity: "epic", description: "微弱なノイズによる透過エフェクト。存在の境界を曖昧にする。", cost: 6000, unlocked: false },
    { id: "Glitch", name: "Digital Glitch", type: "effect", rarity: "rare", description: "時折発生するグリッチノイズ。技術的な洗練を演出。", cost: 3000, unlocked: false },
    { id: "Interference", name: "Signal Interference", type: "effect", rarity: "legendary", description: "波紋のようなシグナル干渉。静かな存在感を放つ。", cost: 8000, unlocked: false },
    { id: "Petals", name: "Falling Petals", type: "effect", rarity: "rare", description: "静かに舞い散る花びら。余白の美を強調する。", cost: 3000, unlocked: false },

    { id: "ASSOCIATE", name: "ASSOCIATE", type: "title", rarity: "common", description: "初期称号。ネットワークの一員である証。", unlocked: true },
    { id: "Initiate", name: "Initiate", type: "title", rarity: "common", description: "アカウントを作成し、システムに認識された証。", unlocked: true },
    { id: "Observer", name: "Observer", type: "title", rarity: "common", description: "観測者。世界を記録し始めた者の称号。", unlocked: true },
    { id: "Collector", name: "Collector", type: "title", rarity: "common", description: "実績：10人との接続を記録した証。", unlocked: false },
    { id: "Messenger", name: "Messenger", type: "title", rarity: "rare", description: "実績：20人との接続を記録した証。", unlocked: false },
    { id: "Connector", name: "Connector", type: "title", rarity: "rare", description: "世界を繋ぐ者。広範なネットワークを持つ証。", unlocked: false },
    { id: "Void Voyager", name: "Void Voyager", type: "title", rarity: "epic", description: "実績：50人との接続を記録した証。", unlocked: false },
    { id: "Strategist", name: "Strategist", type: "title", rarity: "epic", description: "実績：100人の人脈をアーカイブした証。", unlocked: false },
    { id: "Tech Lead", name: "Tech Lead", type: "title", rarity: "epic", description: "実績：10人の技術者と共鳴した証。", unlocked: false },
    { id: "Headhunter", name: "Headhunter", type: "title", rarity: "legendary", description: "実績：5人の重役クラスと共鳴した証。", unlocked: false },
    { id: "Gilded Soul", name: "Gilded Soul", type: "title", rarity: "legendary", description: "実績：50,000 RTを保有する富の象徴。", unlocked: false },
    { id: "The Sovereign", name: "The Sovereign", type: "title", rarity: "mythic", description: "実績：30人の重役クラスと共鳴した証。王権の象徴。", unlocked: false },
    { id: "Mastermind", name: "Mastermind", type: "title", rarity: "mythic", description: "至高実績：ネットワークの構造を解明した知性。", unlocked: false },
    { id: "Architect", name: "Architect", type: "title", rarity: "mythic", description: "管理者級特権。アーキテクチャに干渉する権限。", unlocked: false },
    { id: "Chief Officer", name: "Chief Officer", type: "title", rarity: "mythic", description: "至高実績：システムの運営に関与する権限。", unlocked: false },
    { id: "APEX", name: "APEX", type: "title", rarity: "mythic", description: "Black Card保有者専用。頂点に立つ者の称号。", unlocked: false },

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
          setUnlockedTitles(data.unlocked_titles || ["ASSOCIATE"]);
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
    const isUnlocked = asset.type === "title" 
      ? unlockedTitles.includes(asset.id)
      : (asset.rarity === "common" || ownedAssets.includes(asset.id));
    
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
    <div className="max-w-7xl mx-auto pt-24 lg:pt-32 px-4 lg:px-6 pb-24 text-moonlight">
      <header className="mb-8 lg:mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-4 lg:mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-3xl lg:text-5xl tracking-[0.3em] lg:tracking-[0.5em] uppercase font-extralight text-white">Treasury</h1>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold hidden lg:block">宝物庫・アセット管理</p>
        </div>
        <div className="text-right">
           <p className="text-[7px] lg:text-[9px] uppercase tracking-[0.4em] lg:tracking-[0.5em] text-azure-400 opacity-60">Relation Token</p>
           <p className="text-xl lg:text-3xl font-extralight tracking-[0.2em] text-white">{Number(rtBalance).toLocaleString()} <span className="text-xs opacity-20">RT</span></p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Preview Container: Optimized sticky behavior for mobile */}
        <div className="w-full lg:w-5/12 sticky top-0 lg:top-32 z-50 order-1 lg:order-none bg-void/95 backdrop-blur-lg pb-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none">
           <div className="py-4 lg:p-8 bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-hidden group flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azure-500/40 to-transparent hidden lg:block" />
              
              <div className="absolute top-2 right-6 lg:top-4 lg:right-4 z-30 flex gap-2 p-1 bg-white/10 lg:bg-white/5 border border-white/10">
                 <button onClick={() => {
                   const newEquipped = {...equipped, orientation: 'horizontal' as const};
                   setEquipped(newEquipped);
                   handleCommit(newEquipped);
                 }} className={`p-1.5 transition-all ${equipped.orientation === 'horizontal' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Layout size={10}/>
                 </button>
                 <button onClick={() => {
                   const newEquipped = {...equipped, orientation: 'vertical' as const};
                   setEquipped(newEquipped);
                   handleCommit(newEquipped);
                 }} className={`p-1.5 transition-all ${equipped.orientation === 'vertical' ? 'bg-azure-600 text-white' : 'hover:bg-white/10'}`}>
                    <Smartphone size={10}/>
                 </button>
              </div>

              {/* Mobile-friendly scaling: compact preview to leave room for content below */}
              <div className="py-2 lg:py-0 w-full flex justify-center scale-[0.55] xs:scale-[0.7] sm:scale-80 lg:scale-100 origin-center lg:origin-top transition-transform duration-500">
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
                  alignCompany="center" alignName="center" alignReading="center" alignTitle="center" alignPhone="center" alignEmail="center"
                />
              </div>

              <div className="hidden lg:block mt-10 pt-8 border-t border-white/5 space-y-4 w-full">
                 <div className="flex justify-between items-center text-[8px] tracking-[0.3em] uppercase opacity-40">
                    <span>Identity Status</span>
                    <span className="text-azure-400 font-bold uppercase tracking-widest">
                       {previewAsset ? "Preview Mode" : "Authorized"}
                    </span>
                 </div>
              </div>
              
              {/* Mobile instruction helper */}
              <div className="lg:hidden text-center mt-[-18%] pb-1">
                 <p className="text-[7px] tracking-[0.3em] uppercase opacity-20">Live Resonance Preview</p>
              </div>
           </div>
        </div>

        <div className="w-full lg:w-7/12 space-y-8 lg:space-y-10 order-2 lg:order-none">
           {/* Responsive spacer - significantly reduced on mobile due to scaling and sticky top-0 */}
           <div className={`lg:hidden ${equipped.orientation === 'vertical' ? 'h-[230px]' : 'h-[130px]'}`} />

           <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth sticky top-[180px] xs:top-[220px] sm:top-[250px] lg:top-0 bg-void/95 lg:bg-transparent z-40 backdrop-blur-md lg:backdrop-blur-none -mx-4 px-4 lg:mx-0 lg:px-0">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-4 lg:py-6 px-6 lg:px-8 flex flex-col items-center gap-2 lg:gap-3 transition-all border-b-2 flex-shrink-0 ${
                    activeCategory === cat.id ? "border-azure-500 opacity-100 bg-azure-500/5" : "border-transparent opacity-20 hover:opacity-50"
                  }`}
                >
                  <cat.icon size={16} className={activeCategory === cat.id ? "text-azure-400" : ""} />
                  <div className="text-center">
                    <span className="block text-[7px] lg:text-[8px] uppercase tracking-[0.3em] font-bold whitespace-nowrap">{cat.name}</span>
                  </div>
                </button>
              ))}
           </div>

           <div className="space-y-4 lg:max-h-[700px] overflow-y-visible lg:overflow-y-auto lg:pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4 px-2 lg:px-0">
                  {filteredAssets.filter(asset => asset.type !== "title" || unlockedTitles.includes(asset.id)).map((asset) => {
                    const isUnlocked = asset.type === "title" 
                      ? unlockedTitles.includes(asset.id)
                      : (asset.rarity === "common" || ownedAssets.includes(asset.id));
                    const isActive = equipped[activeCategory as keyof typeof equipped] === asset.id;
                    const cost = assetPrices[asset.rarity] || 0;

                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => handleSelectAsset(asset)} 
                        onMouseEnter={() => setPreviewAsset(asset)}
                        onMouseLeave={() => setPreviewAsset(null)}
                        className={`group p-4 lg:p-6 border transition-all cursor-pointer flex justify-between items-center relative overflow-hidden ${isActive ? "border-white/40 bg-white/5" : "border-white/5 bg-white/[0.01] hover:border-azure-500/20"} ${!isUnlocked && "opacity-60"}`}
                      >
                        <div className="flex items-center gap-4 lg:gap-6 relative z-10">
                           <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center border ${isActive ? "border-white text-white" : "border-white/10 opacity-40"}`}>
                              {isUnlocked ? <Check size={14} /> : <Lock size={14} />}
                           </div>
                           <div>
                              <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 mb-1">
                                 <h3 className="text-[10px] lg:text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                                 <span className={`text-[6px] lg:text-[7px] w-fit px-2 py-0.5 border uppercase tracking-widest font-bold ${getRarityStyle(asset.rarity)}`}>{asset.rarity}</span>
                              </div>
                              <p className="text-[8px] lg:text-[9px] tracking-widest opacity-40 uppercase leading-relaxed max-w-[200px] lg:max-w-md line-clamp-1 lg:line-clamp-none">{asset.description}</p>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                          {isUnlocked ? (
                            isActive ? <span className="text-white text-[7px] lg:text-[8px] tracking-[0.4em] font-bold uppercase italic">Active</span> : <span className="text-[7px] lg:text-[8px] tracking-[0.4em] opacity-20 uppercase group-hover:opacity-100">Equip</span>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[9px] lg:text-[10px] font-mono text-white tracking-widest">{cost.toLocaleString()} RT</span>
                              <span className="text-[6px] lg:text-[7px] tracking-[0.2em] opacity-40 uppercase font-bold">
                                {unlockingAsset === asset.id ? "..." : "Unlock"}
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
