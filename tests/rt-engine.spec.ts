import { test, expect } from "@playwright/test";
import { computeNewBalance, assertValidAmount, calculateFloatingReward } from "@/lib/rt/pure";

/**
 * lib/rt/pure.ts（DB非依存の純粋関数群）に対する単体テスト。
 * 金銭（RT）計算の中核ロジックなので、ここが壊れると即座に不整合な残高が生まれる。
 * このファイルは lib/prisma.ts を一切importしないため、DB接続なしで高速に実行できる。
 */

test.describe("computeNewBalance", () => {
  test("加算は素直に反映される", () => {
    expect(computeNewBalance(100, 50)).toBe(150);
  });

  test("残高内の減算は許可される", () => {
    expect(computeNewBalance(100, -50)).toBe(50);
  });

  test("残高がちょうど0になる減算は許可される", () => {
    expect(computeNewBalance(100, -100)).toBe(0);
  });

  test("残高を超える減算は例外を投げ、マイナス残高を防止する", () => {
    expect(() => computeNewBalance(100, -101)).toThrow("Insufficient RT balance.");
  });

  test("残高0からの減算は例外を投げる", () => {
    expect(() => computeNewBalance(0, -1)).toThrow("Insufficient RT balance.");
  });
});

test.describe("assertValidAmount", () => {
  test("正の数値は許可される", () => {
    expect(() => assertValidAmount(100)).not.toThrow();
  });

  test("負の数値は許可される（消費トランザクション用）", () => {
    expect(() => assertValidAmount(-100)).not.toThrow();
  });

  test("0は不正な取引として拒否される", () => {
    expect(() => assertValidAmount(0)).toThrow("Invalid transaction amount.");
  });

  test("NaNは不正な取引として拒否される", () => {
    expect(() => assertValidAmount(NaN)).toThrow("Invalid transaction amount.");
  });
});

test.describe("calculateFloatingReward", () => {
  test("常に1以上の整数を返す", () => {
    for (let i = 0; i < 200; i++) {
      const reward = calculateFloatingReward();
      expect(Number.isInteger(reward)).toBe(true);
      expect(reward).toBeGreaterThanOrEqual(1);
    }
  });

  test("報酬は通常レンジ(1-5)か高額レンジ(50-149)のいずれかに収まる", () => {
    for (let i = 0; i < 200; i++) {
      const reward = calculateFloatingReward();
      const inNormalRange = reward >= 1 && reward <= 5;
      const inLuckyRange = reward >= 50 && reward <= 149;
      expect(inNormalRange || inLuckyRange).toBe(true);
    }
  });
});
