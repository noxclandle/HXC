import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 物理カードタップ時の統合エントリーポイント
 * GET /api/card/[uid]
 */
export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  // UIDの正規化（コロン削除、大文字化）
  const uid = params.uid.replace(/:/g, "").toUpperCase();
  const session = await getServerSession(authOptions);

  // 1. 台帳（Registry）を確認
  // DB側がコロンありで登録されている可能性も考慮し、両方で検索を試みるか、
  // あるいはDB側の検索時にコロンを無視する（PostgreSQLの機能や、あるいはアプリケーション側で管理）
  // ここではまず完全一致で試し、見つからなければコロン付きでも試す
  let card = await prisma.card.findUnique({
    where: { uid },
    include: { user: true }
  });

  if (!card) {
    // コロン付きの形式（04:2F:3B...）でも検索を試みる
    const colonUid = uid.match(/.{1,2}/g)?.join(":") || uid;
    card = await prisma.card.findUnique({
      where: { uid: colonUid },
      include: { user: true }
    });
  }

  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get("s");

  // 台帳に存在しないUID = 不正または未登録のチップ
  if (!card) {
    return NextResponse.redirect(new URL(`/invalid-card?uid=${uid}`, req.url));
  }

  // 2. 未アクティブの場合 -> セキュリティ照合
  if (card.status === "unissued") {
    if (!secretParam || secretParam !== card.internal_serial) {
      // シリアルが一致しない場合は不正アクセス
      return NextResponse.redirect(new URL(`/invalid-card?uid=${uid}`, req.url));
    }
    // 一致した場合は新規登録ページへ
    return NextResponse.redirect(new URL(`/activate?uid=${uid}&serial=${card.internal_serial}`, req.url));
  }

  // 3. アクティブな場合
  if (card.status === "active") {
    // A. セッションによる確認（既存）
    if (session?.user?.id === card.user_id) {
      return NextResponse.redirect(new URL("/hub", req.url));
    }

    // B. クッキー（Soul-Link）による確認
    const soulToken = req.cookies.get("hxc_soul_fragment")?.value;
    if (soulToken && card.user_id) {
      const binding = await prisma.deviceBinding.findFirst({
        where: {
          user_id: card.user_id,
          device_token: soulToken
        }
      });
      if (binding) {
        // 端末が一致したため、本人とみなしてHubへ
        return NextResponse.redirect(new URL("/hub", req.url));
      }
    }
    
    // 他人の場合（または未ログインかつ紐付けなし） -> その人の公開電子名刺へ
    // ユーザーが設定したslugがあればそれを使用、なければIDを使用
    const slug = card.user?.handle_name || card.user_id;
    return NextResponse.redirect(new URL(`/p/${slug}`, req.url));
  }

  return NextResponse.json({ error: "Unknown card state." }, { status: 400 });
}
