import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true, // 追加
        rank: true,
        role: true,
        rt_balance: true,
        created_at: true,
        owned_assets: true,
        unlocked_titles: true,
        exp: true,
        card: {
          select: {
            uid: true,
            internal_serial: true,
            order: {
              select: {
                customer_name: true // 申し込み時の名前
              }
            }
          }
        }
      },
      orderBy: { created_at: "desc" },
    });

    // BigInt のシリアライズ問題を回避するため、文字列に変換し、元のBigIntフィールドを除去
    const safeUsers = users.map((u) => {
      const { rt_balance, exp, ...rest } = u;
      return {
        ...rest,
        rt: rt_balance.toString(),
        exp: exp.toString(),
        card_uid: u.card?.uid || null,
        card_serial: u.card?.internal_serial || null,
        purchase_name: u.card?.order?.customer_name || null // 追加
      };
    });

    return NextResponse.json(safeUsers);
  } catch (error: unknown) {
    logger.error("Fetch users error", { error });
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
