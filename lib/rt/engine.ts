import { prisma } from "@/lib/prisma";

/**
 * RTの増減を実行し、履歴を記録する
 */
export async function executeRTTransaction(userId: string, amount: number, type: "earn" | "spend" | "transfer", description: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. ユーザーの残高とEXPを更新
    const updateData: any = {
      rt_balance: {
        increment: BigInt(amount),
      },
    };

    // 獲得（earn）の場合のみEXPも増やす
    if (type === "earn" && amount > 0) {
      updateData.exp = { increment: BigInt(amount) };
    }

    const user = await tx.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 残高不足チェック（消費の場合）
    if (user.rt_balance < BigInt(0)) {
      throw new Error("Insufficient RT balance.");
    }

    // 2. トランザクション履歴を作成
    const transaction = await tx.rTTransaction.create({
      data: {
        user_id: userId,
        amount,
        type,
        description,
      },
    });

    return { user, transaction };
  });
}

/**
 * ランダム報酬（浮遊報酬）の計算
 * @returns 0.1%の確率で高額、それ以外は少額のRT
 */
export function calculateFloatingReward() {
  const lucky = Math.random() < 0.01;
  return lucky ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 5) + 1;
}
