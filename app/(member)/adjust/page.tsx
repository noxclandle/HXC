"use client";

import { useState, useEffect } from "react";
import { Lock, Gem } from "lucide-react";
import { logger } from "@/lib/logger";

interface ShowcaseItem {
  id: string;
  name: string;
  type: "sound" | "frame" | "aura";
  rarity: string;
  category: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  { id: "wind", name: "Whisper", type: "sound", rarity: "rare", category: "Sound" },
  { id: "ImperialGold", name: "Imperial Gold", type: "frame", rarity: "mythic", category: "Frame" },
  { id: "VoidEclipse", name: "Void Eclipse", type: "aura", rarity: "mythic", category: "Aura" },
];

export default function AdjustShopPage() {
  const [ownedAssets, setOwnedAssets] = useState<string[]>([]);
  const [assetPrices, setAssetPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/user/status");
      if (res.ok) {
        const data = await res.json();
        setOwnedAssets(data.owned_assets || []);
        setAssetPrices(data.asset_prices || {});
      }
    } catch (error) {
      logger.error("Failed to fetch user status for adjust shop", { error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAction = async (item: ShowcaseItem) => {
    setPendingId(item.id);
    setStatusMessage(null);
    try {
      const owned = ownedAssets.includes(item.id);
      if (owned) {
        const res = await fetch("/api/user/equip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ equipped: { [item.type]: item.id } }),
        });
        if (res.ok) {
          setStatusMessage(`${item.name} を適用しました。`);
        } else {
          const data = await res.json();
          setStatusMessage(data.error || "適用に失敗しました。");
        }
      } else {
        const res = await fetch("/api/user/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetId: item.id, rarity: item.rarity }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatusMessage(`${item.name} をアンロックしました。`);
          fetchStatus();
        } else {
          setStatusMessage(data.error || "アンロックに失敗しました。");
        }
      }
    } catch (error) {
      logger.error("Failed to apply/unlock adjust shop item", { error });
      setStatusMessage("通信エラーが発生しました。");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-24 text-moonlight">
      <header className="mb-16">
        <h1 className="text-2xl tracking-[0.4em] uppercase mb-2">調整ストア / Adjust Shop</h1>
        <p className="text-[10px] tracking-widest opacity-40 uppercase">カードデザインや効果のカスタマイズアセット / Customize Card Assets & Effects</p>
      </header>

      {statusMessage && (
        <p className="mb-8 text-[10px] tracking-widest uppercase text-azure-400 border border-azure-500/20 bg-azure-500/5 p-4">
          {statusMessage}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SHOWCASE_ITEMS.map((item) => {
          const owned = ownedAssets.includes(item.id);
          const cost = assetPrices[item.rarity.toLowerCase()] ?? null;
          const isPending = pendingId === item.id;
          return (
            <div
              key={item.id}
              className={`p-8 border ${owned ? "border-moonlight/20" : "border-moonlight/5 opacity-70"} bg-white/5 relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-[8px] uppercase opacity-40">{item.category} / {item.rarity}</p>
                  <h3 className="text-sm tracking-widest uppercase">{item.name}</h3>
                </div>
                {!owned ? <Lock size={16} className="opacity-40" /> : <Gem size={16} className="text-moonlight animate-pulse" />}
              </div>

              <div className="flex justify-between items-end">
                <div className="text-lg font-extralight tracking-tighter italic">
                  {loading ? "…" : owned ? "所有済み" : cost !== null ? cost : "—"}
                  {!loading && !owned && cost !== null && <span className="text-[8px] not-italic opacity-40 uppercase ml-1">RT</span>}
                </div>
                <button
                  onClick={() => handleAction(item)}
                  disabled={loading || isPending}
                  className="px-6 py-2 text-[9px] uppercase tracking-widest border border-moonlight/20 hover:bg-white/10 transition-all disabled:opacity-40"
                >
                  {isPending ? "処理中..." : owned ? "適用する / Apply" : "アンロック / Unlock"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
