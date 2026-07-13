import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";
import { rateLimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";


/**
 * デイリー共鳴（Connection）報酬付与API
 * POST /api/user/daily-resonance
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // 1. Check eligibility and update in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // ロック付きでユーザーレコードを取得（FOR UPDATEによる同時押し不正防止）
      const users = await tx.$queryRaw<any[]>`
        SELECT last_daily_at, rt_balance FROM users WHERE id = ${userId}::uuid FOR UPDATE
      `;

      if (!users || users.length === 0) throw new Error("USER_NOT_FOUND");
      const user = users[0];

      const lastDaily = user.last_daily_at ? new Date(user.last_daily_at) : null;
      
      // JST (UTC+9) 基準で日付比較を行い、タイムゾーンのずれを防ぐ
      const JST_OFFSET = 9 * 60 * 60 * 1000;
      const lastDailyJST = lastDaily ? new Date(lastDaily.getTime() + JST_OFFSET) : null;
      const nowJST = new Date(now.getTime() + JST_OFFSET);

      const isSameDay = lastDailyJST && 
        lastDailyJST.getUTCFullYear() === nowJST.getUTCFullYear() &&
        lastDailyJST.getUTCMonth() === nowJST.getUTCMonth() &&
        lastDailyJST.getUTCDate() === nowJST.getUTCDate();

      if (isSameDay) throw new Error("ALREADY_RESONATED");

      const RT_REWARD = 100;
      
      // Update balance, exp, and date
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          rt_balance: { increment: RT_REWARD },
          exp: { increment: 10 }, // デイリー共鳴ボーナスでのEXP加算を 10 EXP に修正
          last_daily_at: now
        }
      });

      // Log transaction
      await tx.rTTransaction.create({
        data: {
          user_id: userId,
          amount: RT_REWARD,
          type: "earn",
          description: "Daily Resonance Bonus / デイリー共鳴報酬"
        }
      });

      return { updatedUser, amount: RT_REWARD };
    });

    return NextResponse.json({ 
      success: true, 
      added_rt: result.amount,
      new_balance: result.updatedUser.rt_balance.toString()
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "ALREADY_RESONATED") {
      return NextResponse.json({ error: "Already resonated today." }, { status: 400 });
    }
    logger.error("Daily Resonance Error", { error });
    return NextResponse.json({ error: "Sync failed. / 同期に失敗しました。" }, { status: 500 });
  }
}
