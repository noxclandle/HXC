import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const diagnoseQuerySchema = z.object({
  uid: z.string().min(1),
});

/**
 * GET: 特定の物理カードの簡易診断・詳細取得
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = diagnoseQuerySchema.safeParse({ uid: searchParams.get("uid") });

    if (!parsed.success) {
      return NextResponse.json({ found: false, message: "UID is required" }, { status: 400 });
    }
    const { uid: uidInput } = parsed.data;

    // UIDの正規化（大文字化・コロン除去）
    const normalizedUid = uidInput.replace(/:/g, "").toUpperCase();

    const card = await prisma.card.findUnique({
      where: { uid: normalizedUid },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            rank: true,
            rt_balance: true
          }
        }
      }
    });

    if (!card) {
      return NextResponse.json({
        found: false,
        message: `カード (UID: ${normalizedUid}) はレジストリに登録されていません。出荷前の登録状況を確認してください。`
      });
    }

    // 各種ステータスの整合性検証
    const warnings: string[] = [];
    let isHealthy = true;

    if (card.status === "active" && !card.user_id) {
      warnings.push("ステータスが有効（active）ですが、ユーザーIDが紐付けられていません（孤立状態）。");
      isHealthy = false;
    }

    if (card.status === "unissued" && card.user_id) {
      warnings.push("ステータスが未発行（unissued）ですが、ユーザーIDが設定されています。");
      isHealthy = false;
    }

    return NextResponse.json({
      found: true,
      uid: card.uid,
      serial: card.internal_serial,
      status: card.status,
      isHealthy,
      warnings,
      user: card.user ? {
        name: card.user.name || "未設定",
        email: card.user.email || "未設定",
        role: card.user.role,
        rank: card.user.rank,
        rtBalance: card.user.rt_balance
      } : null
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Card diagnosis failed", { error: message });
    return NextResponse.json({ found: false, message: "Card diagnosis failed" }, { status: 500 });
  }
}
