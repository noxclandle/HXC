import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const deleteSchema = z.object({
  uid: z.string().min(1),
});

/**
 * 【Fixer限定】カードデータを台帳から完全に抹消する (Force Delete)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "fixer") {
      return NextResponse.json({ error: "Forbidden. Fixer authority required." }, { status: 403 });
    }

    const json = await req.json();
    const body = deleteSchema.safeParse(json);
    if (!body.success) {
      return NextResponse.json({ error: "Invalid UID" }, { status: 400 });
    }

    const { uid: rawUid } = body.data;
    const uid = rawUid.replace(/[:\s]/g, "").toUpperCase();

    // 1. まず依存関係を確実に切断 (アトミックに実行)
    await prisma.$transaction(async (tx) => {
      await tx.order.updateMany({
        where: { card_uid: uid },
        data: { card_uid: null }
      });

      await tx.card.deleteMany({
        where: { uid }
      });
    });

    // 2. 証跡の記録 (失敗してもメイン処理は完遂させる)
    try {
      await prisma.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "CARD_ERADICATED",
          details: { uid, timestamp: new Date().toISOString() }
        }
      });
    } catch (logError) {
      console.warn("Log creation failed, but eradication succeeded.");
    }

    return NextResponse.json({ success: true, message: "Eradication confirmed." });

  } catch (error: any) {
    console.error("CRITICAL ERADICATE ERROR:", error);
    // 必ずJSONを返すことでフロントエンドのクラッシュを防ぐ
    return NextResponse.json({ 
      error: "抹消システム内部で深刻なエラーが発生しました。", 
      details: error.message 
    }, { status: 500 });
  }
}
