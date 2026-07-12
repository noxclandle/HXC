import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET: データベースの整合性をチェック（診断）
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. RT残高の不整合監査
    const users = await prisma.user.findMany({
      select: { id: true, rt_balance: true }
    });

    let mismatchCount = 0;

    // 各ユーザーについて、取引履歴（RTTransaction）の合計を算出
    for (const user of users) {
      const txSum = await prisma.rTTransaction.aggregate({
        _sum: { amount: true },
        where: { user_id: user.id }
      });
      const expectedBalance = txSum._sum.amount || 0;
      if (user.rt_balance !== expectedBalance) {
        mismatchCount++;
      }
    }

    // 2. 孤立カードのチェック（ユーザーIDが設定されているが、そのユーザーが実在しない）
    const cards = await prisma.card.findMany({
      where: { user_id: { not: null } },
      select: { uid: true, user_id: true }
    });

    let orphanedCount = 0;

    for (const card of cards) {
      if (card.user_id) {
        const userExists = await prisma.user.findUnique({
          where: { id: card.user_id },
          select: { id: true }
        });
        if (!userExists) {
          orphanedCount++;
        }
      }
    }

    // 3. 未解決の通報件数
    const pendingReports = await prisma.report.count({
      where: { status: "pending" }
    });

    const isHealthy = mismatchCount === 0 && orphanedCount === 0;

    return NextResponse.json({
      isHealthy,
      diagnostics: {
        rtLedger: {
          checkedCount: users.length,
          mismatchCount
        },
        cards: {
          checkedCount: cards.length,
          orphanedCount
        },
        reports: {
          pendingCount: pendingReports
        }
      }
    });
  } catch (error: unknown) {
    console.error("Integrity check failed:", error);
    return NextResponse.json({ error: "Integrity check failed" }, { status: 500 });
  }
}

/**
 * POST: データベース不整合の自動修復
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, rt_balance: true }
    });

    let fixedUsers = 0;

    // トランザクション処理で安全に不整合残高を履歴元帳と同期
    await prisma.$transaction(async (tx) => {
      for (const user of users) {
        const txSum = await tx.rTTransaction.aggregate({
          _sum: { amount: true },
          where: { user_id: user.id }
        });
        const expectedBalance = txSum._sum.amount || 0;
        if (user.rt_balance !== expectedBalance) {
          await tx.user.update({
            where: { id: user.id },
            data: { rt_balance: expectedBalance }
          });
          fixedUsers++;
        }
      }
    });

    // 孤立カードの修復（ユーザーIDをクリアし、未発行状態に戻す）
    const cards = await prisma.card.findMany({
      where: { user_id: { not: null } },
      select: { uid: true, user_id: true }
    });

    let fixedCards = 0;
    for (const card of cards) {
      if (card.user_id) {
        const userExists = await prisma.user.findUnique({
          where: { id: card.user_id },
          select: { id: true }
        });
        if (!userExists) {
          await prisma.card.update({
            where: { uid: card.uid },
            data: { user_id: null, status: "unissued" }
          });
          fixedCards++;
        }
      }
    }

    return NextResponse.json({
      message: `自動修復が完了しました。修正ユーザー数: ${fixedUsers}名、修正カード数: ${fixedCards}枚`
    });
  } catch (error: unknown) {
    console.error("Integrity repair failed:", error);
    return NextResponse.json({ error: "Integrity repair failed" }, { status: 500 });
  }
}
