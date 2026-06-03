import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const voidSchema = z.object({
  uid: z.string().min(1),
});

/**
 * 【管理者限定】カードを永久に無効化(void)する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = voidSchema.safeParse(json);
    if (!body.success) {
      return NextResponse.json({ error: "Invalid UID" }, { status: 400 });
    }

    const { uid } = body.data;

    await prisma.$transaction(async (tx) => {
      await tx.card.update({
        where: { uid },
        data: {
          status: "void",
          internal_serial: `VOIDED_${Date.now()}`
        }
      });

      await tx.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "CARD_VOIDED",
          details: { uid }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Void error:", error);
    return NextResponse.json({ error: "Failed to void card." }, { status: 500 });
  }
}
