import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";

/**
 * デイリー共鳴（Resonance）報酬付与API
 * POST /api/user/daily-resonance
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 現在のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { last_daily_at: true, rt_balance: true, exp: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // デイリーチェック
    const now = new Date();
    const lastDaily = user.last_daily_at ? new Date(user.last_daily_at) : null;
    
    const isSameDay = lastDaily && 
      lastDaily.getFullYear() === now.getFullYear() &&
      lastDaily.getMonth() === now.getMonth() &&
      lastDaily.getDate() === now.getDate();

    if (isSameDay) {
      return NextResponse.json({ error: "Already resonated today." }, { status: 400 });
    }

    // 報酬額の設定
    const RT_REWARD = 100;

    // executeRTTransactionを使用してRTとEXPを更新（earnタイプは自動的にEXPも付与する）
    const { user: updatedUser } = await executeRTTransaction(
      userId,
      RT_REWARD,
      "earn",
      "Daily Bonus Reward"
    );

    // last_daily_atの更新
    await prisma.user.update({
      where: { id: userId },
      data: { last_daily_at: now }
    });

    return NextResponse.json({ 
      success: true, 
      added_rt: RT_REWARD, 
      new_balance: Number(updatedUser.rt_balance)
    });

  } catch (error: any) {
    console.error("Resonance Error:", error);
    return NextResponse.json({ error: "Failed to connect with the core." }, { status: 500 });
  }
}
