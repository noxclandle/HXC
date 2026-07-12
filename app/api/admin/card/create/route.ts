import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const createCardSchema = z.object({
  uid: z.string().min(1),
  serial: z.string().min(1),
});

/**
 * 【管理者限定】新しいカードスロット（台帳）を作成する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = createCardSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "UID and Serial are required." }, { status: 400 });
    }
    const { uid: rawUid, serial } = parsed.data;

    const uid = rawUid.replace(/:/g, "").toUpperCase();

    const card = await prisma.card.create({
      data: {
        uid,
        internal_serial: serial,
        status: "unissued"
      }
    });

    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    logger.error("Card creation error", { error: error?.message || String(error) });
    if (error.code === "P2002") {
      return NextResponse.json({ error: "This UID or Serial is already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to register card in ledger." }, { status: 500 });
  }
}
