/**
 * コンシェルジュレベル（1〜30）と累積経験値（EXP）の定義モジュール
 */

/**
 * 各レベルに達するために必要な累積経験値（EXP）を計算する。
 * レベル30（MAX）でちょうど30,000 EXPに到達するように設計。
 */
export function getRequiredExpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level >= 30) return 30000;
  
  // 指数2.3のべき乗曲線により、低レベルは上がりやすく、後半ほどレベルアップが非常に重くなる
  const progress = (level - 1) / 29;
  const ratio = Math.pow(progress, 2.3); 
  return Math.floor(ratio * 30000);
}

/**
 * 累積経験値（EXP）から現在のコンシェルジュレベル（1〜30）を逆算する。
 * 一般ユーザー・管理者問わず一律のルールを適用。
 */
export function getLevelFromExp(exp: number): number {
  const cleanExp = Math.max(0, exp);
  if (cleanExp >= 30000) return 30;
  
  for (let lvl = 30; lvl >= 1; lvl--) {
    if (cleanExp >= getRequiredExpForLevel(lvl)) {
      return lvl;
    }
  }
  return 1;
}
