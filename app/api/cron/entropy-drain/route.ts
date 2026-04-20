import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { executeRTTransaction } from "@/lib/rt/engine";

const prisma = new PrismaClient();

/**
 * 全ユーザーのEntropy Drain（日々の維持費）を計算し実行する
 * セキュリティのため、実際にはCronジョブなどからの認証済みリクエストのみ許可する
 */
export async function POST(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: { role: "member" },
      select: { id: true, ai_config: true, rt_balance: true }
    });

    const results = [];

    for (const user of users) {
      const config = user.ai_config as { personality?: string; visual_effect?: number } || {};
      const aura = config.visual_effect || 50;
      const personality = config.personality || "Default";

      // 維持費の計算ロジック
      const maintenanceCost = Math.floor(aura / 10) + (personality !== "Default" ? 5 : 0);

      if (maintenanceCost > 0) {
        try {
          const { transaction } = await executeRTTransaction(
            user.id,
            -maintenanceCost,
            "spend",
            "Daily Entropy Drain (Maintenance)"
          );
          results.push({ userId: user.id, status: "success", amount: -maintenanceCost });
        } catch (err: any) {
          results.push({ userId: user.id, status: "failed", reason: err.message });
        }
      }
    }

    return NextResponse.json({ 
      message: "Entropy Drain cycle completed.", 
      processedCount: users.length,
      results 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process entropy drain." }, { status: 500 });
  }
}
