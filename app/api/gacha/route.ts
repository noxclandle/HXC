import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";
import { ASSETS, Asset } from "@/lib/game/assets";

export const dynamic = "force-dynamic";

const GACHA_COST = 500;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. RTの消費
    try {
      await executeRTTransaction(
        session.user.id,
        -GACHA_COST,
        "spend",
        "Ethereal Gacha Summon"
      );
    } catch (e: any) {
      return NextResponse.json({ error: e.message || "Insufficient RT balance" }, { status: 400 });
    }

    // 2. 抽選ロジック
    // 称号を除外した非共通アセットをプールとする
    const pool = ASSETS.filter(a => a.rarity !== "common" && a.type !== "title");
    
    // レアリティごとの重み付け
    const rarities = [
      { rarity: "rare", weight: 80 },
      { rarity: "epic", weight: 18 },
      { rarity: "mythic", weight: 2 }
    ];

    const totalWeight = rarities.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedRarity = "rare";

    for (const r of rarities) {
      if (random < r.weight) {
        selectedRarity = r.rarity;
        break;
      }
      random -= r.weight;
    }

    const rarityPool = pool.filter(a => a.rarity === selectedRarity);
    const win = rarityPool[Math.floor(Math.random() * rarityPool.length)];

    // 3. アセットの付与
    const ownedAssets = Array.isArray(user.owned_assets) ? [...user.owned_assets] : [];
    let isDuplicate = false;
    let refundAmount = 0;

    if (ownedAssets.includes(win.id)) {
      isDuplicate = true;
      // 重複の場合は200 RTを返還（慰め報酬）
      refundAmount = 200;
      await executeRTTransaction(
        session.user.id,
        refundAmount,
        "earn",
        `Gacha Duplicate Refund: ${win.name}`
      );
    } else {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          owned_assets: Array.from(new Set([...ownedAssets, win.id]))
        }
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { rt_balance: true, owned_assets: true }
    });

    return NextResponse.json({
      success: true,
      item: win,
      isDuplicate,
      refundAmount,
      rt_balance: updatedUser?.rt_balance.toString(),
      owned_assets: updatedUser?.owned_assets
    });

  } catch (error: any) {
    console.error("Gacha error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
