import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * 【管理者限定】特定のNFCカードの健康状態と紐付け情報を診断する
 * GET /api/admin/card/diagnose?uid=XXXXXX
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const rawUid = searchParams.get("uid");

    if (!rawUid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // UIDの正規化 (大文字、コロン除去)
    const normalizedUid = rawUid.replace(/[^a-fA-F0-9]/g, "").toUpperCase();

    const card = await prisma.card.findUnique({
      where: { uid: normalizedUid },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            rank: true,
            rt_balance: true,
            exp: true,
            handle_name: true,
            photo_url: true
          }
        },
        order: {
          select: {
            id: true,
            customer_name: true,
            customer_email: true,
            shipping_address: true,
            status: true,
            created_at: true
          }
        }
      }
    });

    if (!card) {
      return NextResponse.json({ 
        found: false, 
        uid: normalizedUid, 
        message: "Card not found in registry. / レジストリに登録されていないカードです。" 
      });
    }

    // 健康状態のチェック (Health Diagnostics)
    const warnings: string[] = [];
    
    if (card.status === "active" && !card.user_id) {
      warnings.push("Card status is ACTIVE but no user is bound. / カードは有効ですが、ユーザーが紐付いていません。");
    }
    if (card.status === "unissued" && card.user_id) {
      warnings.push("Card status is UNISSUED but a user is bound. / カードは未発行ですが、ユーザーが紐付いています。");
    }
    if (card.status === "void" && card.user_id) {
      warnings.push("Card is VOID but still bound to a user. / カードは無効化されていますが、ユーザーの紐付けが残っています。");
    }

    return NextResponse.json({
      found: true,
      uid: card.uid,
      serial: card.internal_serial,
      status: card.status,
      activatedAt: card.activated_at,
      issuedAt: card.issued_at,
      warnings,
      isHealthy: warnings.length === 0,
      user: card.user ? {
        id: card.user.id,
        name: card.user.name || "-",
        handleName: card.user.handle_name || "-",
        email: card.user.email || "-",
        role: card.user.role,
        rank: card.user.rank,
        rtBalance: card.user.rt_balance,
        exp: card.user.exp
      } : null,
      order: card.order ? {
        id: card.order.id,
        customerName: card.order.customer_name,
        customerEmail: card.order.customer_email,
        shippingAddress: card.order.shipping_address,
        status: card.order.status,
        createdAt: card.order.created_at
      } : null
    });

  } catch (error: any) {
    console.error("Card diagnose error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
