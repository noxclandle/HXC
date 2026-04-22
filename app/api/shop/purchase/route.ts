import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * アイテム購入API（現在は裏側のみ実装）
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { assetId, cost } = await req.json();

    // トランザクション処理
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: session.user.id } });
      if (!user) throw new Error("User not found");

      if (user.rt_balance < BigInt(cost)) {
        throw new Error("Insufficient RT");
      }

      // 1. RTを減らす
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          rt_balance: { decrement: BigInt(cost) },
          // 2. 所持リストに追加（Json型）
          owned_assets: {
            push: assetId
          }
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
