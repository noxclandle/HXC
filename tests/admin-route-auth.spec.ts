import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * 回帰テスト: 全ての /api/admin/* ルートが認証チェックを実装していることを
 * ソースコード検査によって静的に検証する。
 *
 * 過去に app/api/admin/graph/data/route.ts が getServerSession によるチェックを
 * 一切実装しておらず、未認証のまま全ユーザーの個人情報を取得できる状態になっていた
 * (2026-07-12 の監査で発見・修正済み)。このテストはその再発を機械的に防ぐためのもの。
 * サーバー起動やDB接続を必要とせず、ソースファイルのテキストを読むだけで完結する。
 */

const ADMIN_API_ROOT = join(__dirname, "..", "app", "api", "admin");

function findRouteFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(findRouteFiles(fullPath));
    } else if (entry === "route.ts") {
      files.push(fullPath);
    }
  }
  return files;
}

test.describe("admin API route authorization coverage", () => {
  const routeFiles = findRouteFiles(ADMIN_API_ROOT);

  test("app/api/admin 配下に route.ts が存在する（テスト自体が空振りしていないことの確認）", () => {
    expect(routeFiles.length).toBeGreaterThan(0);
  });

  for (const filePath of routeFiles) {
    const relativePath = filePath.replace(join(__dirname, ".."), "");

    test(`${relativePath} は getServerSession によるセッションチェックを実装している`, () => {
      const content = readFileSync(filePath, "utf-8");
      expect(
        content.includes("getServerSession"),
        `${relativePath} には getServerSession の呼び出しが見当たりません。未認証アクセスを許してしまう可能性があります。`
      ).toBe(true);
    });

    test(`${relativePath} は権限チェック（ロール or 称号ベース）を実装している`, () => {
      const content = readFileSync(filePath, "utf-8");
      // このプロジェクトには2系統の権限チェックが存在する:
      // 1. role ベース（ADMIN_ROLES / supremeRoles / session.user.role の直接比較）
      // 2. 称号（unlocked_titles）ベース（例: TITLES.MASTERMIND を持つ者のみ許可）
      const hasRoleCheck =
        content.includes("ADMIN_ROLES") ||
        content.includes("supremeRoles") ||
        content.includes(".role ===") ||
        content.includes(".role !==") ||
        content.includes("unlocked_titles") ||
        content.includes("TITLES.");
      expect(
        hasRoleCheck,
        `${relativePath} には権限（ロールまたは称号）チェックが見当たりません。ログインさえしていれば誰でもアクセスできる可能性があります。`
      ).toBe(true);
    });
  }
});
