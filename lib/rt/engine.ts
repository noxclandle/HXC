import { prisma } from "@/lib/prisma";

export type RTTransactionType = "earn" | "spend" | "transfer";

interface RTTransactionResult {
  user: any;
  transaction: any;
}

/**
 * RTの増減を実行し、履歴を記録する。
 * トランザクションにより原子性を保証し、負の残高を防止する。
 */
export async function executeRTTransaction(
  userId: string, 
  amount: number, 
  type: RTTransactionType, 
  description: string
): Promise<RTTransactionResult> {
  // 数値の妥当性チェック
  if (isNaN(amount) || amount === 0) {
    throw new Error("Invalid transaction amount.");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. 現在の残高をロック付きで取得 (FOR UPDATE による競合回避)
    const users = await tx.$queryRaw<any[]>`
      SELECT rt_balance FROM users WHERE id = ${userId}::uuid FOR UPDATE
    `;

    if (!users || users.length === 0) throw new Error("User not found.");
    const currentUser = users[0];

    const newBalance = currentUser.rt_balance + amount;

    // 消費（spend）または転送（transfer）の場合の残高不足チェック
    if (newBalance < 0) {
      throw new Error("Insufficient RT balance.");
    }

    // 2. ユーザーの残高とEXPを更新
    const updateData: any = {
      rt_balance: newBalance,
    };

    // 獲得（earn）の場合のみEXPも増やす
    if (type === "earn" && amount > 0) {
      updateData.exp = { increment: amount };
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: updateData,
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

/**
 * ランダム報酬（浮遊報酬）の計算
 * @returns 1%の確率で高額、それ以外は少額のRT
 */
export function calculateFloatingReward(): number {
  const lucky = Math.random() < 0.01;
  return lucky ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 5) + 1;
}
