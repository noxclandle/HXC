import { prisma } from "@/lib/prisma";
import type { User, RTTransaction } from "@prisma/client";
import { computeNewBalance, assertValidAmount, calculateFloatingReward } from "./pure";

export type RTTransactionType = "earn" | "spend" | "transfer";

interface RTTransactionResult {
  user: User;
  transaction: RTTransaction;
}

// 純粋ロジックは lib/rt/pure.ts に分離済み。既存の import 元を壊さないよう再エクスポートする。
export { computeNewBalance, assertValidAmount, calculateFloatingReward };

/**
 * RTの増減を実行し、履歴を記録する。
 * トランザクションにより原子性を保証し、負の残高を防止する。
 *
 * `idempotencyKey` を渡すと、同じキーの取引が既にある場合は
 * **何も加算せず既存の取引を返す**。
 * Stripe Webhook のように「同じイベントが複数回届きうる」経路から
 * 呼ぶ場合は必ず指定すること。指定しないと二重付与になる。
 */
export async function executeRTTransaction(
  userId: string,
  amount: number,
  type: RTTransactionType,
  description: string,
  idempotencyKey?: string
): Promise<RTTransactionResult> {
  assertValidAmount(amount);

  return await prisma.$transaction(async (tx) => {
    // 1. 現在の残高をロック付きで取得 (FOR UPDATE による競合回避)
    const users = await tx.$queryRaw<{ rt_balance: number }[]>`
      SELECT rt_balance FROM users WHERE id = ${userId}::uuid FOR UPDATE
    `;

    if (!users || users.length === 0) throw new Error("User not found.");
    const currentUser = users[0];

    /*
      2重実行の防止。
      上の FOR UPDATE で同一ユーザーの処理は直列化されるため、
      ロック取得後にここで確認すれば同時実行でもすり抜けない。
      （ロックの前に確認すると、2つの処理が同時に「未処理」と判断しうる）
    */
    if (idempotencyKey) {
      const existing = await tx.rTTransaction.findFirst({
        where: { user_id: userId, description: { contains: idempotencyKey } },
      });

      if (existing) {
        const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
        return { user, transaction: existing };
      }
    }

    // 消費（spend）または転送（transfer）の場合の残高不足チェックを含む純粋関数
    const newBalance = computeNewBalance(currentUser.rt_balance, amount);

    // 2. ユーザーの残高のみを更新（EXPは完全に別データとして扱うため加算しない）
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        rt_balance: newBalance,
      },
    });

    // 3. トランザクション履歴を作成
    const transaction = await tx.rTTransaction.create({
      data: {
        user_id: userId,
        amount,
        type,
        description,
      },
    });

    return { user: updatedUser, transaction };
  });
}
