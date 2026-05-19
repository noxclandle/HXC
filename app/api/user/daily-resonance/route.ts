import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";
import { rateLimit } from "@/lib/ratelimit";

/**
 * デイリー共鳴（Connection）報酬付与API
 * POST /api/user/daily-resonance
 */
export async function POST(req: NextRequest) {
  try {
    // 門番（レートリミット）のチェック
    try {
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const { success } = await rateLimit.standard.limit(ip);

      if (!success) {
        return NextResponse.json({ 
          error: "Resonance too frequent. / 同期が速すぎます。しばらくお待ちください。" 
        }, { status: 429 });
      }
    } catch (rlError) {
      console.warn("Rate limit check failed (possibly KV not configured):", rlError);
      // レートリミット自体のエラー（KV未設定など）でボーナス受取をブロックしない
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized (Session invalid)" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("Processing Daily Resonance for User ID:", userId);

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

    // トランザクションでRT付与と日付更新を同時に行う
    const result = await prisma.$transaction(async (tx) => {
      // 再度チェック（レースコンディション防止）
      const checkUser = await tx.user.findUnique({
        where: { id: userId },
        select: { last_daily_at: true, rt_balance: true }
      });

      if (!checkUser) throw new Error("USER_NOT_FOUND");

      const checkLastDaily = checkUser.last_daily_at ? new Date(checkUser.last_daily_at) : null;
      const checkIsSameDay = checkLastDaily && 
        checkLastDaily.getFullYear() === now.getFullYear() &&
        checkLastDaily.getMonth() === now.getMonth() &&
        checkLastDaily.getDate() === now.getDate();

      if (checkIsSameDay) {
        throw new Error("ALREADY_RESONATED");
      }

      const newBalance = checkUser.rt_balance + BigInt(RT_REWARD);

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          rt_balance: newBalance,
          exp: { increment: BigInt(RT_REWARD) },
          last_daily_at: now
        },
      });

      await tx.rTTransaction.create({
        data: {
          user_id: userId,
          amount: RT_REWARD,
          type: "earn",
          description: "Daily Resonance Bonus / デイリー共鳴報酬",
        },
      });

      return updatedUser;
    });

    return NextResponse.json({ 
      success: true, 
      added_rt: RT_REWARD, 
      new_balance: Number(result.rt_balance)
    });

  } catch (error: any) {
    if (error.message === "ALREADY_RESONATED") {
      return NextResponse.json({ error: "Already resonated today." }, { status: 400 });
    }
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.error("Connection Error (Daily Resonance):", error);
    return NextResponse.json({ 
      error: "Failed to connect with the core. / 境界との同期に失敗しました",
      details: error.message
    }, { status: 500 });
  }
}
