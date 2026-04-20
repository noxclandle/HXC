import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";

/**
 * 【チーフオフィサー限定】恩寵としてRTを授与するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { userId, amount } = data;

    if (!userId || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await executeRTTransaction(
      userId,
      parseInt(amount),
      "earn",
      "Grace from Chief Officer"
    );

    // 恩寵のログを記録
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "MASTER_GRACE_GRANTED",
        details: { targetUserId: userId, amount: parseInt(amount) }
      }
    });

    return NextResponse.json({ success: true, balance: result.user.rt_balance.toString() });
  } catch (error: any) {
    console.error("Grace grant error:", error);
    return NextResponse.json({ error: "Failed to grant grace." }, { status: 500 });
  }
}
