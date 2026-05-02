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

  // 1. 台帳（Ledger）を確認
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

  // 台帳に存在しないUID = 不正または未登録のチップ
  if (!card) {
    return NextResponse.redirect(new URL(`/invalid-card?uid=${uid}`, req.url));
  }

  // 2. 未アクティブの場合 -> 新規登録ページへ
  if (card.status === "unissued") {
    return NextResponse.redirect(new URL(`/activate?uid=${uid}&serial=${card.internal_serial}`, req.url));
  }

  // 3. アクティブな場合
  if (card.status === "active") {
    // 所有者本人がログインしている場合 -> ダッシュボード（編集画面）へ
    if (session?.user?.id === card.user_id) {
      return NextResponse.redirect(new URL("/hub", req.url));
    }
    
    // 他人の場合（または未ログイン） -> その人の公開電子名刺へ
    // ユーザーが設定したslugがあればそれを使用、なければIDを使用
    const slug = card.user?.handle_name || card.user_id;
    return NextResponse.redirect(new URL(`/p/${slug}`, req.url));
  }

  return NextResponse.json({ error: "Unknown card state." }, { status: 400 });
}
