import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const purchaseSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  cost: z.number().min(0, "Cost must be a positive number"),
});

/**
 * アイテム購入API
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parseResult = purchaseSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request", details: parseResult.error.format() }, { status: 400 });
    }

    const { assetId, cost } = parseResult.data;

    // トランザクション処理
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: session.user.id } });
      if (!user) throw new Error("User not found");

      if (user.rt_balance < BigInt(cost)) {
        throw new Error("Insufficient RT");
      }

      // 現状の所持リストを取得して更新
      const currentAssets = Array.isArray(user.owned_assets) ? user.owned_assets : [];
      const updatedAssets = [...new Set([...currentAssets, assetId])];

      // データベースを更新
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          rt_balance: { decrement: BigInt(cost) },
          owned_assets: updatedAssets
        },
      });

      return updatedUser;
    });

    return NextResponse.json({ success: true, balance: result.rt_balance.toString() });
  } catch (error: any) {
    console.error("Purchase error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
