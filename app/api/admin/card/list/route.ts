import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * 【管理者限定】カード台帳の一覧を取得する
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cards = await prisma.card.findMany({
      include: { user: { select: { name: true, role: true, rank: true } } },
      orderBy: { activated_at: "desc" }
    });

    const formatted = cards.map(c => ({
      uid: c.uid,
      serial: c.internal_serial,
      status: c.status,
      user: c.user?.name || "-",
      role: c.user?.role || "",
      rank: c.user?.rank || ""
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ledger." }, { status: 500 });
  }
}
