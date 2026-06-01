import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { executeRTTransaction } from "@/lib/rt/engine";

export const dynamic = "force-dynamic";


const unlockSchema = z.object({
  assetId: z.string().min(1),
  rarity: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = unlockSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request", details: parseResult.error.format() }, { status: 400 });
    }

    const { assetId, rarity } = parseResult.data;
    
    const assetPricesConfig = await prisma.systemConfig.findUnique({
      where: { key: 'asset_prices' }
    });
    const PRICES = (assetPricesConfig?.value as Record<string, number>) || {};
    
    const cost = PRICES[rarity.toLowerCase()];

    if (cost === undefined) {
      return NextResponse.json({ error: "Invalid rarity" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ownedAssets = Array.isArray(user.owned_assets) ? [...user.owned_assets] : [];
    
    if (ownedAssets.includes(assetId)) {
      return NextResponse.json({ error: "Asset already unlocked" }, { status: 400 });
    }

    // executeRTTransactionを使用して残高減算と履歴作成を統合
    const { user: updatedUser } = await executeRTTransaction(
      session.user.id,
      -cost,
      "spend",
      `Unlocked asset: ${assetId} (${rarity})`
    );

    // アセットの追加
    const finalUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        owned_assets: Array.from(new Set([...ownedAssets, assetId]))
      }
    });

    return NextResponse.json({ 
      success: true, 
      rt_balance: finalUser.rt_balance.toString(),
      owned_assets: finalUser.owned_assets 
    });

  } catch (error: any) {
    console.error("Unlock error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
