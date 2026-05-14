import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { executeRTTransaction } from "@/lib/rt/engine";

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

    // executeRTTransactionを使用して残高更新と履歴作成を統合
    const { user: updatedUser } = await executeRTTransaction(
      session.user.id,
      -cost,
      "spend",
      `Purchased asset: ${assetId}`
    );

    // アセットの追加（これはexecuteRTTransactionの外で行う必要があるが、
    // executeRTTransaction自体がトランザクション内なので、
    // ここで別途更新するか、エンジンを拡張する必要がある。
    // 今回はシンプルに、残高チェック済みのexecuteRTTransactionの後に実行する。）
    
    const currentAssets = Array.isArray(updatedUser.owned_assets) ? updatedUser.owned_assets : [];
    const updatedAssets = [...new Set([...currentAssets, assetId])];

    const finalUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        owned_assets: updatedAssets
      },
    });

    return NextResponse.json({ success: true, balance: finalUser.rt_balance.toString() });
  } catch (error: any) {
    console.error("Purchase error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
