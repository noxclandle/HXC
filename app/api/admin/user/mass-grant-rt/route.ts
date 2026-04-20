import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";

/**
 * 【チーフオフィサー限定】全ユーザーまたは特定ランクへ一斉にRTを授与する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { rank, amount, message } = data; // messageを追加

    const users = await prisma.user.findMany({
      where: rank && rank !== "All" ? { rank } : { role: "member" },
      select: { id: true }
    });

    for (const user of users) {
      try {
        await executeRTTransaction(
          user.id,
          parseInt(amount),
          "earn",
          `Master Grace: ${message || "A gift from the Chief Officer"}`
        );
        
        // 天使に喋らせるメッセージをChatMessageとして保存
        if (message) {
          // Announcement用にも保存（最新のお知らせとして抽出できるように）
          await prisma.chatMessage.create({
            data: {
              user_id: user.id,
              role: "announcement", // 特別なロールで保存
              text: message
            }
          });
          
          await prisma.chatMessage.create({
            data: {
              user_id: user.id,
              role: "agent",
              text: `【布告】チーフオフィサーよりお言葉が届きました： 「${message}」`
            }
          });
        }
      } catch (err) {
        // ...
      }
    }

    // 監査ログ
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "MASS_GRACE_GRANTED",
        details: { targetRank: rank || "ALL", amount, count: users.length }
      }
    });

    return NextResponse.json({ success: true, count: users.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed mass bestowal." }, { status: 500 });
  }
}
