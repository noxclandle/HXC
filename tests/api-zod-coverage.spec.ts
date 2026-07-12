import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * 回帰テスト: 外部入力（リクエストボディ・クエリパラメータ）を受け取る API ルートは
 * zod によるスキーマ検証を行うことを静的に検証する。
 *
 * SOVEREIGN_MANDATES.md / GEMINI.md は「全APIエンドポイントはzodで検証すること」と
 * 明文で定めているが、2026-07-12の監査時点では75本中19本しか実装されていなかった。
 * 2026-07-12の追加対応で、外部入力を受け取る全ルートにzod検証を実装済み
 * （app/api/ocr/route.ts のみ FormData を扱うため対象外。理由は下記参照）。
 * このテストは新規ルートでの後退（zodなしでマージされること）を防ぐためのもの。
 *
 * 入力を一切受け取らないルート（GETのみ、cron専用、Webhook署名検証など
 * zodが本質的にそぐわないもの）は対象外。既知の未対応ルートは KNOWN_DEBT に
 * 理由付きで明記し、可視化する。ここに新しいルートを黙って追加しないこと。
 */

const API_ROOT = join(__dirname, "..", "app", "api");

// 既知の未対応ルート。zodを実装したらここから削除すること。
// 新規追加する場合は理由をコメントに残す。
const KNOWN_DEBT = new Set([
  // FormDataを扱うため素のzodスキーマがそぐわない。ファイル種別・サイズ検証は別途必要。
  "/app/api/ocr/route.ts",
]);

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

function hasExternalInput(content: string): boolean {
  return content.includes(".json()") || content.includes("searchParams");
}

function usesZod(content: string): boolean {
  // 直接 zod をimportしているか、共有バリデーションスキーマ（lib/validations/*）を
  // importして .safeParse() を呼んでいれば検証済みとみなす。
  const importsZodDirectly = content.includes('from "zod"') || content.includes("from 'zod'");
  const usesSharedValidationSchema =
    (content.includes('from "@/lib/validations') || content.includes("from '@/lib/validations")) &&
    content.includes(".safeParse(");
  return importsZodDirectly || usesSharedValidationSchema;
}

test.describe("API route zod coverage", () => {
  const routeFiles = findRouteFiles(API_ROOT);

  test("app/api 配下に route.ts が存在する（テスト自体が空振りしていないことの確認）", () => {
    expect(routeFiles.length).toBeGreaterThan(0);
  });

  for (const filePath of routeFiles) {
    const relativePath = filePath.replace(join(__dirname, ".."), "").replace(/\\/g, "/");
    const content = readFileSync(filePath, "utf-8");

    if (!hasExternalInput(content)) continue; // 入力を受け取らないルートは対象外

    if (KNOWN_DEBT.has(relativePath)) {
      test(`${relativePath} は既知の未対応ルートとして記録されている（zod未実装）`, () => {
        expect(usesZod(content), `${relativePath} はzodを実装済みです。KNOWN_DEBTから削除してください。`).toBe(false);
      });
      continue;
    }

    test(`${relativePath} は外部入力を受け取るため zod による検証を実装している`, () => {
      expect(
        usesZod(content),
        `${relativePath} は req.json()/searchParams を使用していますが zod が見当たりません。KNOWN_DEBTに追加するか、zodを実装してください。`
      ).toBe(true);
    });
  }
});
