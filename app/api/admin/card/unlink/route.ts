import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const unlinkSchema = z.object({
  uid: z.string().min(1),
});

/**
 * 【管理者限定】カードの紐付けを解除し、初期状態(unissued)に戻す
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const supremeRoles = ["fixer", "mastermind"];
    if (!session || !supremeRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized. Supreme authority required." }, { status: 401 });
    }

    const json = await req.json();
    const body = unlinkSchema.safeParse(json);
    if (!body.success) {
      return NextResponse.json({ error: "Invalid UID" }, { status: 400 });
    }

    const { uid } = body.data;

    // 新しいシリアルを生成し、状態を完全にリセット
    const newSerial = Array.from({ length: 12 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

    await prisma.$transaction(async (tx) => {
      // 1. カードのリセット
      await tx.card.update({
        where: { uid },
        data: {
          user_id: null,
          status: "unissued",
          internal_serial: newSerial,
          activated_at: null,
          activation_token: null,
          token_expires_at: null
        }
      });

      // 2. 監査ログの記録
      await tx.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "CARD_UNLINKED",
          details: { uid, new_serial: newSerial }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Unlink error:", error);
    return NextResponse.json({ error: "Failed to unlink card." }, { status: 500 });
  }
}
