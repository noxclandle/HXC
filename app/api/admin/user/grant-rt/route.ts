import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const grantRtSchema = z.object({
  userId: z.string().min(1),
  amount: z.coerce.number().int().finite(),
});

/**
 * 【チーフオフィサー限定】恩寵としてRTを授与するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = grantRtSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { userId, amount } = parsed.data;

    const result = await executeRTTransaction(
      userId,
      amount,
      "earn",
      "Grace from Chief Officer"
    );

    // 恩寵のログを記録
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "MASTER_GRACE_GRANTED",
        details: { targetUserId: userId, amount }
      }
    });

    return NextResponse.json({ success: true, balance: result.user.rt_balance.toString() });
  } catch (error: any) {
    logger.error("Grace grant error", { error: error?.message || String(error) });
    return NextResponse.json({ error: "Failed to grant grace." }, { status: 500 });
  }
}
