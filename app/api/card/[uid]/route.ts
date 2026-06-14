import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const dynamic = "force-dynamic";

const cardParamsSchema = z.object({
  uid: z.string().min(8).max(32),
  s: z.string().optional().nullable(),
});


/**
 * 物理カードタップ時の統合エントリーポイント (Absolute Defense Version)
 * GET /api/card/[uid]?s=[secret]
 */
export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  const normalizedUid = params.uid.replace(/:/g, "").toUpperCase();
  const { searchParams } = new URL(req.url);
  
  const validation = cardParamsSchema.safeParse({
    uid: normalizedUid,
    s: searchParams.get("s")
  });

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid protocol parameters." }, { status: 400 });
  }

  const { uid, s: secretParam } = validation.data;
  const session = await getServerSession(authOptions);
  
  // 1. 台帳（Registry）を確認
  const card = await prisma.card.findUnique({
    where: { uid },
    include: { user: true }
  });

  if (!card) {
    return NextResponse.redirect(new URL(`/invalid-card?uid=${uid}`, req.url));
  }

  // 1.5 永久無効化（Dead）の確認
  if (card.status === "dead") {
    return NextResponse.redirect(new URL(`/invalid-card?uid=${uid}&error=voided`, req.url));
  }

  // 2. 未アクティブの場合 -> 直接登録画面へリダイレクト
  if (card.status === "unissued" || card.status === "shipped" || card.status === "activating") {
    if (!secretParam || secretParam !== card.internal_serial) {
      return NextResponse.redirect(new URL(`/invalid-card?uid=${uid}&error=invalid_secret`, req.url));
    }

    // トークンを介さず、UIDとシークレットを維持したまま登録画面へ
    return NextResponse.redirect(new URL(`/activate/register?uid=${uid}&s=${secretParam}`, req.url));
  }

  // 3. アクティブな場合（既存のロジック）
  if (card.status === "active") {
    if (session?.user?.id === card.user_id) {
      return NextResponse.redirect(new URL("/hub", req.url));
    }

    const soulToken = req.cookies.get("hxc_soul_fragment")?.value;
    if (soulToken && card.user_id) {
      const binding = await prisma.deviceBinding.findFirst({
        where: {
          user_id: card.user_id,
          device_token: soulToken
        }
      });
      if (binding) return NextResponse.redirect(new URL("/hub", req.url));
    }
    
    const slug = card.user?.handle_name || card.user_id;
    return NextResponse.redirect(new URL(`/p/${slug}`, req.url));
  }

  return NextResponse.json({ error: "Unknown card state." }, { status: 400 });
}
