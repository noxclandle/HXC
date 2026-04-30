import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 【管理者限定】新しいカードスロット（台帳）を作成する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["mastermind", "chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { uid, serial } = await req.json();

    if (!uid || !serial) {
      return NextResponse.json({ error: "UID and Serial are required." }, { status: 400 });
    }

    const card = await prisma.card.create({
      data: {
        uid,
        internal_serial: serial,
        status: "unissued"
      }
    });

    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    console.error("Card creation error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "This UID or Serial is already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to register card in ledger." }, { status: 500 });
  }
}
