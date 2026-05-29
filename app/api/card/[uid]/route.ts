import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

/**
 * 物理カードタップ時の統合エントリーポイント (Absolute Defense Version)
 * GET /api/card/[uid]?s=[secret]
 */
export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  const uid = params.uid.replace(/:/g, "").toUpperCase();
  const session = await getServerSession(authOptions);
  
  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get("s");

  // 1. 台帳（Registry）を確認
  const card = await prisma.card.findUnique({
    where: { uid },
    include: { user: true }
  });

  if (!card) {
    return NextResponse.redirect(new URL(\`/invalid-card?uid=\${uid}\`, req.url));
  }

  // 2. 未アクティブの場合 -> セキュリティ照合と「すり替え(The Swap)」
  if (card.status === "unissued" || card.status === "shipped") {
    if (!secretParam || secretParam !== card.internal_serial) {
      return NextResponse.redirect(new URL(\`/invalid-card?uid=\${uid}\`, req.url));
    }

    // ★重要: シリアルを隠蔽し、15分間有効な一時トークンを生成
    const activationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15分後

    await prisma.card.update({
      where: { uid },
      data: {
        activation_token: activationToken,
        token_expires_at: expiresAt,
        status: "activating" // ステータスを「登録中」へ
      }
    });

    // シリアルコードを含まない「安全なURL」へリダイレクト
    return NextResponse.redirect(new URL(\`/activate?token=\${activationToken}\`, req.url));
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
    return NextResponse.redirect(new URL(\`/p/\${slug}\`, req.url));
  }

  // 登録中(activating)のカードを再度タップした場合
  if (card.status === "activating") {
    // 既存のトークンがあれば再利用
    if (card.activation_token && card.token_expires_at && card.token_expires_at > new Date()) {
        return NextResponse.redirect(new URL(\`/activate?token=\${card.activation_token}\`, req.url));
    }
    
    // 期限切れの場合、シリアル(s)があれば再発行（unissuedと同じロジックへ流す）
    if (secretParam && secretParam === card.internal_serial) {
      const activationToken = uuidv4();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.card.update({
        where: { uid },
        data: {
          activation_token: activationToken,
          token_expires_at: expiresAt
        }
      });
      return NextResponse.redirect(new URL(\`/activate?token=\${activationToken}\`, req.url));
    }
  }

  return NextResponse.json({ error: "Unknown card state." }, { status: 400 });
}
