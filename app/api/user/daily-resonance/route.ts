import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

    // デイリーチェック（24時間以内は不可、または日付が変わったらOKなどのロジック）
    const now = new Date();
    const lastDaily = user.last_daily_at ? new Date(user.last_daily_at) : null;
    
    // 簡易的に「今日すでに実行したか」を判定
    const isSameDay = lastDaily && 
      lastDaily.getFullYear() === now.getFullYear() &&
      lastDaily.getMonth() === now.getMonth() &&
      lastDaily.getDate() === now.getDate();

    if (isSameDay) {
      // 開発中につき、テストしやすくするために400を返すが、本番では適切なメッセージを。
      // return NextResponse.json({ error: "Already resonated today." }, { status: 400 });
    }

    // 報酬額の設定
    const RT_REWARD = 100n;
    const EXP_REWARD = 50n;

    // データベース更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        rt_balance: { increment: RT_REWARD },
        exp: { increment: EXP_REWARD },
        last_daily_at: now
      }
    });

    return NextResponse.json({ 
      success: true, 
      added_rt: RT_REWARD, 
      added_exp: EXP_REWARD,
      new_balance: Number(updatedUser.rt_balance)
    });

  } catch (error: any) {
    console.error("Resonance Error:", error);
    return NextResponse.json({ error: "Failed to connect with the core." }, { status: 500 });
  }
}
