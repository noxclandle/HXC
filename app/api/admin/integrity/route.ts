import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * 【管理者限定】データベースの整合性をセルフスキャンする
 * GET /api/admin/integrity
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. RT Ledger Check (残高と履歴の突合)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        rt_balance: true,
        rt_transactions: {
          select: {
            amount: true
          }
        }
      }
    });

    const rtMismatches: any[] = [];
    for (const u of users) {
      const transactionSum = u.rt_transactions.reduce((sum, t) => sum + t.amount, 0);
      if (u.rt_balance !== transactionSum) {
        rtMismatches.push({
          userId: u.id,
          name: u.name,
          email: u.email,
          cachedBalance: u.rt_balance,
          actualSum: transactionSum,
          diff: transactionSum - u.rt_balance
        });
      }
    }

    // 2. Orphaned Cards Check (有効だがユーザーのいないカード)
    const orphanedCards = await prisma.card.findMany({
      where: {
        status: "active",
        user_id: null
      },
      select: {
        uid: true,
        internal_serial: true,
        activated_at: true
      }
    });

    // 3. Unresolved Reports Check
    const pendingReportsCount = await prisma.report.count({
      where: { status: "pending" }
    });

    const isHealthy = rtMismatches.length === 0 && orphanedCards.length === 0;

    return NextResponse.json({
      success: true,
      isHealthy,
      diagnostics: {
        rtLedger: {
          checkedCount: users.length,
          mismatchCount: rtMismatches.length,
          mismatches: rtMismatches,
          status: rtMismatches.length === 0 ? "SECURE" : "DISCREPANCY"
        },
        cards: {
          checkedCount: await prisma.card.count(),
          orphanedCount: orphanedCards.length,
          orphaned: orphanedCards,
          status: orphanedCards.length === 0 ? "SECURE" : "ORPHANED"
        },
        reports: {
          pendingCount: pendingReportsCount,
          status: pendingReportsCount === 0 ? "SECURE" : "ATTENTION"
        }
      }
    });

  } catch (error: any) {
    console.error("Integrity check error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * 【管理者限定】不整合データを自動修復する (元帳・台帳ベースでの再構築)
 * POST /api/admin/integrity
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // トランザクション内で安全に修復
    const fixResult = await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        select: {
          id: true,
          rt_balance: true,
          rt_transactions: {
            select: {
              amount: true
            }
          }
        }
      });

      let fixedUsersCount = 0;
      const details: string[] = [];

      for (const u of users) {
        const transactionSum = u.rt_transactions.reduce((sum, t) => sum + t.amount, 0);
        if (u.rt_balance !== transactionSum) {
          // 残高を取引履歴の合計値に強制同期する (原簿優先ルール)
          await tx.user.update({
            where: { id: u.id },
            data: { rt_balance: transactionSum }
          });
          fixedUsersCount++;
          details.push(`User ${u.id}: Reconciled balance from ${u.rt_balance} to ${transactionSum} RT.`);
        }
      }

      // 有効なのにユーザーがいない孤立カードは安全のため status: "unissued" に戻すか、そのまま残す
      // ここでは、勝手に紐付けをいじるのは危険なので警告のみとし、RT残高の自動修復のみを行う
      
      return { fixedUsersCount, details };
    });

    return NextResponse.json({
      success: true,
      message: `Reconciliation complete. Fixed ${fixResult.fixedUsersCount} user records. / データ修復が完了しました。${fixResult.fixedUsersCount}件のレコードを同期しました。`,
      fixedCount: fixResult.fixedUsersCount,
      details: fixResult.details
    });

  } catch (error: any) {
    console.error("Integrity fix error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
