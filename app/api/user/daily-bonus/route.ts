import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";

/**
 * 1日1回の聖域の光（デイリーボーナス）を付与する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { last_daily_at: true }
    });

    const now = new Date();
    const lastDaily = user?.last_daily_at;

    // 既に今日受け取っているかチェック (JST基準)
    if (lastDaily && lastDaily.toDateString() === now.toDateString()) {
      return NextResponse.json({ success: false, message: "光は既にあなたの中にあります。" });
    }

    // RTとEXPを付与 (新バランス)
    const bonusRT = 50;
    const { transaction } = await executeRTTransaction(
      session.user.id,
      bonusRT,
      "earn",
      "Daily Sanctuary Light"
    );

    // 受領日時を更新
    await prisma.user.update({
      where: { id: session.user.id },
      data: { last_daily_at: now }
    });

    return NextResponse.json({ success: true, amount: bonusRT });
  } catch (error) {
    return NextResponse.json({ error: "Sanctuary connection unstable." }, { status: 500 });
  }
}
