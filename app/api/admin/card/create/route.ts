import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * 【管理者限定】新しいカードスロット（台帳）を作成する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { uid: rawUid, serial, recipientName, memo } = await req.json();

    if (!rawUid || !serial) {
      return NextResponse.json({ error: "UID and Serial are required." }, { status: 400 });
    }

    const uid = rawUid.replace(/:/g, "").toUpperCase();

    // トランザクションでカードと（必要であれば）ダミー注文を作成
    const card = await prisma.$transaction(async (tx) => {
      const newCard = await tx.card.create({
        data: {
          uid,
          internal_serial: serial,
          status: recipientName ? "shipped" : "unissued" // 名前があれば即「発送済み」扱い
        }
      });

      if (recipientName) {
        await tx.order.create({
          data: {
            stripe_session_id: `GIFT-${uid}-${Date.now()}`,
            tier: "Gift",
            variant: memo || "Direct Handover",
            price: 0,
            customer_name: recipientName,
            customer_email: `gift-${uid.toLowerCase()}@hexa-relation.com`,
            status: "shipped",
            card_uid: uid,
            shipped_at: new Date()
          }
        });
      }

      return newCard;
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
