import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const equipCardSchema = z.object({
  uid: z.string().min(1),
});

/**
 * ログイン中のユーザーに物理カードを紐付ける
 * POST /api/user/equip-card
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = equipCardSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "UID is required" }, { status: 400 });
    const { uid } = parsed.data;

    // UIDの正規化
    const normalizedUid = uid.replace(/:/g, "").toUpperCase();

    // 1. 台帳にそのUIDが存在するか確認
    let card = await prisma.card.findUnique({
      where: { uid: normalizedUid }
    });

    if (!card) {
      // コロン付きでも探す
      const colonUid = normalizedUid.match(/.{1,2}/g)?.join(":") || normalizedUid;
      card = await prisma.card.findUnique({
        where: { uid: colonUid }
      });
    }

    if (!card) {
      return NextResponse.json({ error: "Card not found in ledger." }, { status: 404 });
    }

    if (card.status !== "unissued") {
      return NextResponse.json({ error: "Card already active or assigned." }, { status: 403 });
    }

    // 2. ユーザーに紐付け（トランザクション）
    await prisma.card.update({
      where: { uid: card.uid },
      data: {
        user_id: session.user.id,
        status: "active",
        activated_at: new Date(),
        issued_at: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Card equip error", { error: message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
