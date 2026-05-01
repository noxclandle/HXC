import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetId, rarity } = await req.json();
    
    const assetPricesConfig = await prisma.systemConfig.findUnique({
      where: { key: 'asset_prices' }
    });
    const PRICES = (assetPricesConfig?.value as Record<string, number>) || {};
    
    const cost = PRICES[rarity.toLowerCase()];

    if (cost === undefined) {
      return NextResponse.json({ error: "Invalid rarity" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (Number(user.rt_balance) < cost) {
      return NextResponse.json({ error: "Insufficient RT Balance" }, { status: 400 });
    }

    const ownedAssets = Array.isArray(user.owned_assets) ? [...user.owned_assets] : [];
    
    if (ownedAssets.includes(assetId)) {
      return NextResponse.json({ error: "Asset already unlocked" }, { status: 400 });
    }

    // トランザクションで残高減算とアセット追加を同時に行う
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { email: session.user.email },
        data: {
          rt_balance: { decrement: BigInt(cost) },
          owned_assets: Array.from(new Set([...ownedAssets, assetId]))
        }
      }),
      prisma.rTTransaction.create({
        data: {
          user_id: user.id,
          amount: -cost,
          type: "spend",
          description: `Unlocked asset: ${assetId} (${rarity})`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      rt_balance: updatedUser.rt_balance.toString(),
      owned_assets: updatedUser.owned_assets 
    });

  } catch (error: any) {
    console.error("Unlock error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
