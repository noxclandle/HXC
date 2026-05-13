"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Music, Sparkles, UserCheck, Check, Lock, Wallet, Trophy, ArrowLeft, MousePointer2, Smartphone, Layout, Type, Palette, Eye, Zap, Gem } from "lucide-react";
import HexaCardPreview from "@/components/ui/HexaCardPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/ResonanceToast";
import { playResonanceSound } from "@/lib/audio/resonance";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export const dynamic = "force-dynamic";

interface Asset {
  id: string;
  name: string;
  type: "frame" | "sound" | "effect" | "angel" | "title" | "pointer" | "background" | "fontFamily" | "aura";
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  description: string;
  unlocked: boolean;
  cost?: number;
}

const CATEGORIES = [
  { id: "frame", name: "Frames", icon: Shield, sub: "外枠" },
  { id: "aura", name: "Auras", icon: Zap, sub: "オーラ" },
  { id: "background", name: "Backgrounds", icon: Palette, sub: "背景" },
  { id: "effect", name: "Effects", icon: Sparkles, sub: "エフェクト" },
  { id: "title", name: "Titles / 称号", icon: Trophy, sub: "称号" },
  { id: "pointer", name: "Pointers", icon: MousePointer2, sub: "軌跡" },
  { id: "sound", name: "Sounds", icon: Music, sub: "音響" },
];

const RT_PACKS = [
  { id: "rt_small", price: 1000, rt: 2000, label: "Seed Infusion", description: "少量のRTを注入し、共鳴の端緒を開く。" },
  { id: "rt_medium", price: 5000, rt: 11000, label: "Orbital Surge", description: "推奨パック。広範なカスタマイズを可能にする。" },
  { id: "rt_large", price: 10000, rt: 23000, label: "Primordial Pulse", description: "最大限の同調。すべての境界を超える力を得る。" },
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRTPurchase, setShowRTPurchase] = useState(false);
  const [confirmingAsset, setConfirmingAsset] = useState<Asset | null>(null);
  
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
    orientation: "horizontal" as "horizontal" | "vertical"
  });

  const [assets, setAssets] = useState<Asset[]>([
    // --- Auras (10 new) ---
    { id: "None", name: "No Aura", type: "aura", rarity: "common", description: "静寂。オーラを纏わない。", unlocked: true },
    { id: "WhiteMist", name: "White Mist", type: "aura", rarity: "rare", description: "境界から漏れ出す白い霧。", cost: 3000, unlocked: false },
    { id: "AzureFlame", name: "Azure Flame", type: "aura", rarity: "rare", description: "知性を燃やす蒼い炎。", cost: 3000, unlocked: false },
    { id: "GoldenHalo", name: "Golden Halo", type: "aura", rarity: "epic", description: "神聖な黄金の輪郭。", cost: 8000, unlocked: false },
    { id: "VioletHaze", name: "Violet Haze", type: "aura", rarity: "rare", description: "神秘的な紫の霞。", cost: 3000, unlocked: false },
    { id: "EmeraldDust", name: "Emerald Dust", type: "aura", rarity: "rare", description: "生命を育む緑の粒子。", cost: 3000, unlocked: false },
    { id: "CrimsonFlare", name: "Crimson Flare", type: "aura", rarity: "epic", description: "情熱が爆発する深紅の輝き。", cost: 8000, unlocked: false },
    { id: "VoidEclipse", name: "Void Eclipse", type: "aura", rarity: "mythic", description: "光を飲み込む漆黒のオーラ。", cost: 50000, unlocked: false },
    { id: "PrismGlow", name: "Prism Glow", type: "aura", rarity: "mythic", description: "全波長を網羅する究極の輝き。", cost: 50000, unlocked: false },
    { id: "CyberGrid", name: "Cyber Grid", type: "aura", rarity: "epic", description: "電子の格子が漂う。技術の極致。", cost: 8000, unlocked: false },
    // --- Frames (15) ---
    { id: "Obsidian", name: "Obsidian", type: "frame", rarity: "common", description: "標準的な黒檀の外枠。誠実さの象徴。", unlocked: true },
    { id: "Silver", name: "Sterling Silver", type: "frame", rarity: "rare", description: "鈍い光沢を放つ銀の枠。", cost: 3000, unlocked: false },
    { id: "Gold", name: "Heritage Gold", type: "frame", rarity: "epic", description: "格式高い黄金の細工枠。", cost: 8000, unlocked: false },
    { id: "Sakura", name: "Sakura Aura", type: "frame", rarity: "rare", description: "淡い紅色の残響を纏う枠。", cost: 3000, unlocked: false },
    { id: "RoseGold", name: "Rose Gold Elegance", type: "frame", rarity: "epic", description: "気品あるピンクゴールドの枠。", cost: 8000, unlocked: false },
    { id: "PearlWhite", name: "Pearl Essence", type: "frame", rarity: "rare", description: "真珠のような柔らかな輝き。", cost: 3000, unlocked: false },
    { id: "Moonlight", name: "Moonlight Silver", type: "frame", rarity: "rare", description: "月光を宿した静かな銀枠。", cost: 3000, unlocked: false },
    { id: "Grace", name: "Graceful Lace", type: "frame", rarity: "epic", description: "繊細なレースを模した白の細工枠。", cost: 8000, unlocked: false },
    { id: "Silk", name: "Silk Ribbon", type: "frame", rarity: "rare", description: "絹のようになめらかな質感の枠。", cost: 3000, unlocked: false },
    { id: "Emerald", name: "Emerald Pulse", type: "frame", rarity: "rare", description: "生命力を感じさせる深緑の輝き。", cost: 3000, unlocked: false },
    { id: "Platinum", name: "Platinum Edge", type: "frame", rarity: "epic", description: "精巧な装飾が施された白金の縁。", cost: 8000, unlocked: false },
    { id: "Dynamic", name: "Azure Pulse", type: "frame", rarity: "epic", description: "知性を感じさせる蒼い脈動。", cost: 8000, unlocked: false },
    { id: "Crimson", name: "Crimson Guard", type: "frame", rarity: "epic", description: "情熱的な深紅の防壁。", cost: 8000, unlocked: false },
    { id: "Void", name: "Void Shell", type: "frame", rarity: "mythic", description: "全ての光を吸収する深淵の枠。", cost: 50000, unlocked: false },
    { id: "ImperialGold", name: "Imperial Gold", type: "frame", rarity: "mythic", description: "圧倒的な威厳。頂点の黄金。", cost: 50000, unlocked: false },
    
    // --- Backgrounds (15) ---
    { id: "Default", name: "Solid Void", type: "background", rarity: "common", description: "標準の漆黒背景。", unlocked: true },
    { id: "PastelSakura", name: "Eternal Sakura", type: "background", rarity: "rare", description: "淡い桜色が舞う春の情景。", cost: 3000, unlocked: false },
    { id: "PearlVeil", name: "Pearl Veil", type: "background", rarity: "rare", description: "真珠層のような虹色の光沢。", cost: 3000, unlocked: false },
    { id: "SilkSheet", name: "White Silk", type: "background", rarity: "rare", description: "高級な絹布のドレープ。", cost: 3000, unlocked: false },
    { id: "GraceGradient", name: "Graceful Dawn", type: "background", rarity: "epic", description: "夜明けのような淡い紫と金の階調。", cost: 8000, unlocked: false },
    { id: "CrystalGlass", name: "Frozen Crystal", type: "background", rarity: "epic", description: "凍てついたクリスタルの輝き。", cost: 8000, unlocked: false },
    { id: "Carbon", name: "Carbon Fiber", type: "background", rarity: "rare", description: "精密なカーボンテクスチャ。", cost: 3000, unlocked: false },
    { id: "BrushedMetal", name: "Brushed Metal", type: "background", rarity: "rare", description: "ヘアライン加工の金属質。", cost: 3000, unlocked: false },
    { id: "MonochromeGrid", name: "Monochrome Grid", type: "background", rarity: "epic", description: "緻密な設計グリッド。", cost: 8000, unlocked: false },
    { id: "Stardust", name: "Stardust", type: "background", rarity: "rare", description: "微細な星屑の瞬き。", cost: 3000, unlocked: false },
    { id: "RoyalGold", name: "Royal Gold Dust", type: "background", rarity: "epic", description: "金粉が舞う格式高い空間。", cost: 8000, unlocked: false },
    { id: "Nebula", name: "Cosmic Nebula", type: "background", rarity: "epic", description: "静かなる宇宙の階調。", cost: 8000, unlocked: false },
    { id: "SilkBlur", name: "Silk Blur", type: "background", rarity: "epic", description: "滑らかな光の拡散。", cost: 8000, unlocked: false },
    { id: "DigitalFlow", name: "Digital Flow", type: "background", rarity: "epic", description: "情報の奔流。", cost: 8000, unlocked: false },
    { id: "PrismFractal", name: "Prism Fractal", type: "background", rarity: "mythic", description: "七色に屈折する光の幾何学。", cost: 50000, unlocked: false },

    // --- Effects (15) ---
    { id: "None", name: "Clean", type: "effect", rarity: "common", description: "追加効果なし。純粋な情報の提示。", unlocked: true },
    { id: "Sparkle", name: "Fairy Dust", type: "effect", rarity: "rare", description: "幻想的に煌めく小さな光。", cost: 3000, unlocked: false },
    { id: "FallingFlowers", name: "Falling Grace", type: "effect", rarity: "rare", description: "天から舞い降りる白い花弁。", cost: 3000, unlocked: false },
    { id: "Feathers", name: "Angelic Feathers", type: "effect", rarity: "epic", description: "ゆっくりと漂う純白の羽。", cost: 8000, unlocked: false },
    { id: "Bubbles", name: "Champagne Bubbles", type: "effect", rarity: "rare", description: "華やかに立ち昇る気泡。", cost: 3000, unlocked: false },
    { id: "Ribbons", name: "Streaming Ribbons", type: "effect", rarity: "epic", description: "優雅に流れる光のリボン。", cost: 8000, unlocked: false },
    { id: "Glitch", name: "Digital Glitch", type: "effect", rarity: "rare", description: "技術的な洗練を感じさせるノイズ。", cost: 3000, unlocked: false },
    { id: "Petals", name: "Falling Petals", type: "effect", rarity: "rare", description: "静かに舞い散る花びら。", cost: 3000, unlocked: false },
    { id: "Snow", name: "Digital Snow", type: "effect", rarity: "rare", description: "静寂を演出する微細な粒子。", cost: 3000, unlocked: false },
    { id: "Aethereal", name: "Aethereal Diffusion", type: "effect", rarity: "epic", description: "境界を曖昧にするノイズ。", cost: 8000, unlocked: false },
    { id: "Scanline", name: "CRT Scanline", type: "effect", rarity: "epic", description: "レトロフューチャーな走査線。", cost: 8000, unlocked: false },
    { id: "Interference", name: "Signal Interference", type: "effect", rarity: "epic", description: "静かな波紋の干渉。", cost: 8000, unlocked: false },
    { id: "Dust", name: "Cosmic Dust", type: "effect", rarity: "epic", description: "漂う宇宙の塵。", cost: 8000, unlocked: false },
    { id: "Aurora", name: "Boreal Aurora", type: "effect", rarity: "mythic", description: "揺らめく極光の残響。", cost: 50000, unlocked: false },
    { id: "Singularity", name: "Singularity", type: "effect", rarity: "mythic", description: "中心へと収束する時空の歪み。", cost: 50000, unlocked: false },

    // --- Pointers (10) ---
    { id: "Pure White Hex", name: "Standard White", type: "pointer", rarity: "common", description: "標準的な白い軌跡。", unlocked: true },
    { id: "Azure Trace", name: "Azure Trace", type: "pointer", rarity: "rare", description: "知的な蒼い軌跡。", cost: 3000, unlocked: false },
    { id: "Emerald Trace", name: "Emerald Pulse", type: "pointer", rarity: "rare", description: "生命力ある緑の軌跡。", cost: 3000, unlocked: false },
    { id: "Ruby Trace", name: "Ruby Flare", type: "pointer", rarity: "rare", description: "情熱的な紅の軌跡。", cost: 3000, unlocked: false },
    { id: "Gold Trace", name: "Golden Aura", type: "pointer", rarity: "epic", description: "格式高い黄金の軌跡。", cost: 8000, unlocked: false },
    { id: "Violet Trace", name: "Violet Resonance", type: "pointer", rarity: "epic", description: "神秘的な紫の軌跡。", cost: 8000, unlocked: false },
    { id: "Crimson Trace", name: "Crimson Ember", type: "pointer", rarity: "epic", description: "消えない残り火の軌跡。", cost: 8000, unlocked: false },
    { id: "Shadow Trace", name: "Ink Shadow", type: "pointer", rarity: "epic", description: "空間を塗りつぶす墨の軌跡。", cost: 8000, unlocked: false },
    { id: "Prism Trace", name: "Light Refraction", type: "pointer", rarity: "mythic", description: "虹色に輝く光の軌跡。", cost: 50000, unlocked: false },
    { id: "Void Trace", name: "Reality Tear", type: "pointer", rarity: "mythic", description: "空間を切り裂く闇の軌跡。", cost: 50000, unlocked: false },

    // --- Sounds (10) ---
    { id: "resonance", name: "Resonance", type: "sound", rarity: "common", description: "標準的な共鳴音。", unlocked: true },
    { id: "click", name: "Mechanical", type: "sound", rarity: "rare", description: "精密な機械のクリック音。", cost: 3000, unlocked: false },
    { id: "wind", name: "Whisper", type: "sound", rarity: "rare", description: "微かな風の囁き。", cost: 3000, unlocked: false },
    { id: "water", name: "Droplet", type: "sound", rarity: "rare", description: "静かな水滴の音。", cost: 3000, unlocked: false },
    { id: "silver", name: "Silver Bell", type: "sound", rarity: "epic", description: "透明感のある銀の鈴。", cost: 8000, unlocked: false },
    { id: "crystal", name: "Crystal Chord", type: "sound", rarity: "epic", description: "水晶が奏でる和音。", cost: 8000, unlocked: false },
    { id: "deep", name: "Deep Impact", type: "sound", rarity: "epic", description: "腹に響く重厚な低音。", cost: 8000, unlocked: false },
    { id: "heaven", name: "Angelic Choir", type: "sound", rarity: "epic", description: "天界の歌声の一節。", cost: 8000, unlocked: false },
    { id: "void", name: "Deep Resonance", type: "sound", rarity: "mythic", description: "深淵からの呼び声。", cost: 50000, unlocked: false },
    { id: "omega", name: "Eternal Chord", type: "sound", rarity: "mythic", description: "世界の終焉と始まりの音。", cost: 50000, unlocked: false },

    // --- Titles ---
    { id: "ASSOCIATE", name: "ASSOCIATE", type: "title", rarity: "common", description: "初期称号。", unlocked: true },
    { id: "Initiate", name: "Initiate", type: "title", rarity: "common", description: "アカウント作成の証。", unlocked: true },
    { id: "Observer", name: "Observer", type: "title", rarity: "common", description: "世界の観測者。", unlocked: true },
    { id: "Collector", name: "Collector", type: "title", rarity: "rare", description: "10人との共鳴。", cost: 3000, unlocked: false },
    { id: "Messenger", name: "Messenger", type: "title", rarity: "rare", description: "20人との共鳴。", cost: 3000, unlocked: false },
    { id: "Connector", name: "Connector", type: "title", rarity: "rare", description: "世界を繋ぐ者。", cost: 3000, unlocked: false },
    { id: "Void Voyager", name: "Void Voyager", type: "title", rarity: "epic", description: "50人との共鳴。", cost: 8000, unlocked: false },
    { id: "Strategist", name: "Strategist", type: "title", rarity: "epic", description: "100人の人脈。", cost: 8000, unlocked: false },
    { id: "Tech Lead", name: "Tech Lead", type: "title", rarity: "epic", description: "技術者との深い絆。", cost: 8000, unlocked: false },
    { id: "Headhunter", name: "Headhunter", type: "title", rarity: "epic", description: "重役層との共鳴。", cost: 8000, unlocked: false },
    { id: "Gilded Soul", name: "Gilded Soul", type: "title", rarity: "epic", description: "富の象徴。", cost: 8000, unlocked: false },
    { id: "The Sovereign", name: "The Sovereign", type: "title", rarity: "mythic", description: "王権の象徴。", cost: 50000, unlocked: false },
    { id: "Mastermind", name: "Mastermind", type: "title", rarity: "mythic", description: "運営責任者。", cost: 50000, unlocked: false },
    { id: "Manager", name: "Manager", type: "title", rarity: "mythic", description: "実務管理者。", cost: 50000, unlocked: false },
    { id: "APEX", name: "APEX", type: "title", rarity: "mythic", description: "頂点のアイデンティティ。", cost: 50000, unlocked: false },
    { id: "Fixer", name: "Fixer", type: "title", rarity: "mythic", description: "創造主。", cost: 50000, unlocked: false },
  ]);

  const getRarityStyle = (rarity: Asset["rarity"]) => {
    switch (rarity) {
      case "mythic": return "text-white border-white/40 bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)]";
      case "legendary": return "text-rose-500 border-rose-500/20 bg-rose-50/5";
      case "epic": return "text-orange-500 border-orange-500/20 bg-orange-50/5";
      case "rare": return "text-purple-400 border-purple-500/20 bg-purple-50/5";
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
          setUnlockedTitles(data.titles || ["ASSOCIATE"]);
          const pricing = data.asset_prices || { common: 0, rare: 3000, epic: 8000, legendary: 15000, mythic: 50000 };
          setAssetPrices(pricing);
          if (data.equipped) setEquipped((prev: any) => ({ ...prev, ...data.equipped }));
        }
      } catch (err) { console.error(err); }
      finally { setIsLoaded(true); }
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
        showToast(`Resonance Established: ${asset.name}`, "success");
        setRTBalance(data.rt_balance);
        setOwnedAssets(data.owned_assets);
        const newEquipped = { ...equipped, [activeCategory as keyof typeof equipped]: asset.id };
        setEquipped(newEquipped);
        handleCommit(newEquipped);
      } else {
        showToast(data.error || "Unlock failed", "error");
      }
    } catch (err) { console.error(err); }
    finally { setUnlockingAsset(null); setConfirmingAsset(null); }
  };

  const handlePreviewAsset = (asset: Asset) => {
    setPreviewAsset(asset);
    if (asset.type === "sound") {
      playResonanceSound(asset.id);
    }
  };

  const handleSelectAsset = (asset: Asset) => {
    const isFixer = profile?.role === "fixer";
    const isUnlocked = isFixer || (asset.type === "title" 
      ? unlockedTitles.includes(asset.id)
      : (asset.rarity === "common" || ownedAssets.includes(asset.id)));
    
    if (!isUnlocked) {
      setConfirmingAsset(asset);
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
    <div className="max-w-7xl mx-auto pt-24 lg:pt-32 px-4 lg:px-6 pb-24 text-moonlight overflow-x-hidden">
      <ConfirmationModal 
        isOpen={!!confirmingAsset}
        onClose={() => setConfirmingAsset(null)}
        onConfirm={() => confirmingAsset && handleUnlock(confirmingAsset)}
        title={`Unlock ${confirmingAsset?.name}`}
        description={`Do you wish to permeate the boundary and acquire this asset?`}
        cost={assetPrices[confirmingAsset?.rarity || 'common'] || 0}
      />

      <header className="mb-8 lg:mb-20 flex justify-between items-end">
        <div className="space-y-4">
          <Link href="/hub" className="flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity mb-4 lg:mb-8">
            <ArrowLeft size={12} /> Back to Hub / 拠点へ戻る
          </Link>
          <h1 className="text-3xl lg:text-5xl tracking-[0.3em] lg:tracking-[0.5em] uppercase font-extralight text-white">Treasury</h1>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] opacity-30 uppercase font-bold hidden lg:block">宝物庫・アセット管理</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
           <p className="text-[7px] lg:text-[9px] uppercase tracking-[0.4em] lg:tracking-[0.5em] text-azure-400 opacity-60">RT Balance</p>
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

      {/* RT Purchase Section (Sanctuary) */}
      <AnimatePresence>
        {showRTPurchase && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 overflow-hidden border-b border-white/5 pb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={async () => {
                    try {
                      showToast(`Opening Sanctuary...`, "success");
                      const res = await fetch("/api/stripe/rt-checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ packId: pack.id })
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        showToast(data.error || "Connection failed.", "error");
                      }
                    } catch (e) {
                      showToast("Gateway error.", "error");
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
            <p className="text-[8px] tracking-[0.5em] uppercase opacity-20 text-center mt-8 italic">意志の注入を確定させ、共鳴の境界を拡張してください。</p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Preview Container */}
        <div className="w-full lg:w-5/12 sticky top-0 lg:top-32 z-50 order-1 lg:order-none bg-void/95 backdrop-blur-lg pb-1 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 border-b border-white/10 lg:border-none h-[38vh] lg:h-auto flex items-center justify-center">
           <div className="py-2 lg:p-8 bg-white/[0.01] lg:bg-white/[0.02] lg:border lg:border-white/5 shadow-2xl relative overflow-visible group flex flex-col items-center w-full">
              {previewAsset && (
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-azure-500 animate-pulse z-50" />
              )}
              
              <div className="absolute top-2 right-6 lg:top-4 lg:right-4 z-30 flex gap-2 p-1 bg-white/10 lg:bg-white/5 border border-white/10 scale-90 lg:scale-100">
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

              <div className="py-1 lg:py-0 w-full flex justify-center scale-[0.6] xs:scale-[0.75] sm:scale-85 lg:scale-100 origin-center lg:origin-top transition-transform duration-500 relative z-20">
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
                  aura={displayEquipped.aura}
                  fontFamily={displayEquipped.fontFamily}
                  sound={displayEquipped.sound}
                  orientation={displayEquipped.orientation}
                  alignCompany="center" alignName="center" alignReading="center" alignTitle="center" alignPhone="center" alignEmail="center"
                  bio={profile?.profile?.bio}
                />
              </div>

              <div className="lg:hidden text-center mt-[-15%] pb-1 flex flex-col items-center gap-1">
                 <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 font-bold">Live Resonance Preview</p>
                 {previewAsset && <span className="text-[6px] text-azure-400 uppercase font-bold tracking-widest animate-pulse">Previewing: {previewAsset.name}</span>}
              </div>
           </div>
        </div>

        <div className="w-full lg:w-7/12 space-y-8 lg:space-y-10 order-2 lg:order-none">
           <div className="lg:hidden h-[38vh]" />

           <div className="flex flex-col gap-4">
              <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth sticky top-[38vh] lg:top-0 bg-void/95 lg:bg-transparent z-40 backdrop-blur-md lg:backdrop-blur-none -mx-4 px-4 lg:mx-0 lg:px-0">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => { setActiveCategory(cat.id); setPreviewAsset(null); }}
                    className={`py-4 lg:py-6 px-6 lg:px-8 flex flex-col items-center gap-2 lg:gap-3 transition-all border-b-2 flex-shrink-0 ${
                      activeCategory === cat.id ? "border-azure-500 opacity-100 bg-azure-500/5" : "border-transparent opacity-20 hover:opacity-50"
                    }`}
                  >
                    <cat.icon size={16} className={activeCategory === cat.id ? "text-azure-400" : ""} />
                    <span className="block text-[7px] lg:text-[8px] uppercase tracking-[0.3em] font-bold whitespace-nowrap">{cat.name}</span>
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4 lg:max-h-[700px] overflow-y-visible lg:overflow-y-auto lg:pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4 px-2 lg:px-0 pb-12">
                  {filteredAssets.filter(asset => {
                    if (profile?.role === "fixer") return true;
                    return asset.type !== "title" || unlockedTitles.includes(asset.id);
                  }).map((asset) => {
                    const isFixer = profile?.role === "fixer";
                    const isUnlocked = isFixer || (asset.type === "title" 
                      ? unlockedTitles.includes(asset.id)
                      : (asset.rarity === "common" || ownedAssets.includes(asset.id)));
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
                             <div className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center border ${isActive ? "border-white text-white" : "border-white/10 opacity-40"}`}>
                                {isUnlocked ? <Check size={14} /> : <Lock size={14} />}
                             </div>
                             <div>
                                <div className="flex flex-col lg:items-start gap-1 mb-1">
                                   <h3 className="text-[10px] lg:text-[11px] tracking-[0.4em] uppercase font-bold">{asset.name}</h3>
                                   <span className={`text-[6px] lg:text-[7px] w-fit px-2 py-0.5 border uppercase tracking-widest font-bold ${getRarityStyle(asset.rarity)}`}>{asset.rarity}</span>
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
