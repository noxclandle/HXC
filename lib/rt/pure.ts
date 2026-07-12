/**
 * RTエンジンの純粋関数群。
 * DB (Prisma) に一切依存しないため、テストで安全かつ高速に検証できる。
 * ここにDBアクセスを持ち込まないこと（executeRTTransaction側の責務）。
 */

/**
 * 残高更新ロジック本体。
 * 負の残高になる場合は例外を投げる。
 */
export function computeNewBalance(currentBalance: number, amount: number): number {
  const newBalance = currentBalance + amount;
  if (newBalance < 0) {
    throw new Error("Insufficient RT balance.");
  }
  return newBalance;
}

/**
 * トランザクション金額の妥当性チェック。
 */
export function assertValidAmount(amount: number): void {
  if (isNaN(amount) || amount === 0) {
    throw new Error("Invalid transaction amount.");
  }
}

/**
 * ランダム報酬（浮遊報酬）の計算
 * @returns 1%の確率で高額、それ以外は少額のRT
 */
export function calculateFloatingReward(): number {
  const lucky = Math.random() < 0.01;
  return lucky ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 5) + 1;
}
