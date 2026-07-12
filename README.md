# Hexa Card (HXC)

物理NFCカードとデジタルプロフィールを1:1で紐付けるビジネスカードサービス。Next.js 14 (App Router) / TypeScript / Prisma / PostgreSQL / Stripe / NFCで構築されている。

ブランドトーンやUI/UXの設計思想は `SOVEREIGN_MANDATES.md` と `GEMINI.md` を参照。開発の変遷は `DEVELOPMENT_LOG.md`、物理カードの発送運用は `OPERATORS_MANUAL.md` を参照。

## セットアップ

```bash
npm install
cp .env.example .env   # 値は下記「環境変数」を参照して埋める
npx prisma generate
npx prisma db push     # ローカルDBにスキーマを反映
npm run dev
```

http://localhost:3000 で起動する。

## 環境変数

`.env` に以下を設定する（値そのものはこのREADMEには書かない。1Password等の秘密情報管理から取得すること）。

| 変数名 | 用途 |
|---|---|
| `DATABASE_URL` | PostgreSQL接続文字列（本番はNeon） |
| `NEXTAUTH_SECRET` | NextAuth.jsのセッション署名鍵 |
| `NEXTAUTH_URL` | NextAuthのベースURL |
| `NEXT_PUBLIC_BASE_URL` | フロントエンドから参照する自サイトのベースURL |
| `STRIPE_SECRET_KEY` | Stripe秘密鍵 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook署名検証用シークレット |
| `STRIPE_PUBLIC_KEY` | Stripe公開鍵（クライアント側） |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_ENDPOINT` / `R2_BUCKET_NAME` / `R2_PUBLIC_DOMAIN` | Cloudflare R2（画像アップロード先） |
| `GOOGLE_API_KEY` | Gemini API（コンシェルジュAI機能） |
| `OCR_SPACE_API_KEY` | 名刺OCR機能 |
| `RESEND_API_KEY` | メール送信 |
| `DISCORD_WEBHOOK_URL` | 管理者向けDiscord通知 |
| `CRON_SECRET` | Vercel Cronジョブの認証 |
| `ADMIN_EMAIL` | 管理者通知の宛先 |

KVレートリミット（`@vercel/kv` / `@upstash/ratelimit`）はVercel連携時に自動で環境変数が注入されるため、ローカル開発時のみ別途Upstash Redisの接続情報が必要になる場合がある。

## アーキテクチャ概要

```
app/
  (member)/     会員専用ページ（ログイン必須、middleware.tsで保護）
  admin/        管理画面（ADMIN_ROLES or 称号ベースの権限が必要）
  api/          APIルート（ドメイン別に整理: admin/, stripe/, user/, card/ 等）
lib/
  auth.ts       NextAuth設定（デバイストークン認証 / メール+パスワード認証）
  rt/           RT（ポイント経済）ロジック。pure.ts に純粋関数、engine.ts にDB操作を分離
  prisma.ts     Prisma Clientのシングルトン
  ratelimit.ts  APIレートリミッター（strict/standard/relaxed）
components/     UIコンポーネント（ドメイン別）
prisma/         DBスキーマ
tests/          Playwrightテスト（e2eと静的回帰テストが混在、詳細は下記）
```

認可は2系統ある: `role`ベース（`ADMIN_ROLES`との照合）と、`unlocked_titles`（称号）ベース（例: `TITLES.MASTERMIND`を持つ者のみ許可）。新しい管理者向けAPIを追加する際はどちらかを必ず実装すること（`tests/admin-route-auth.spec.ts` が機械的にチェックする）。

## テスト

```bash
npx playwright install --with-deps   # 初回のみ
npx tsc --noEmit                     # 型チェック
npm run lint                         # ESLint
npx playwright test tests/rt-engine.spec.ts tests/admin-route-auth.spec.ts tests/api-zod-coverage.spec.ts --project=chromium
```

- `tests/rt-engine.spec.ts` — RT残高計算ロジックの単体テスト（DB非依存）
- `tests/admin-route-auth.spec.ts` — 全admin APIが認証・権限チェックを実装していることの静的回帰テスト
- `tests/api-zod-coverage.spec.ts` — 外部入力を受け取るAPIがzod検証を実装していることの静的回帰テスト（未対応ルートは`KNOWN_DEBT`に明記）
- `tests/basic.spec.ts` / `tests/live-diagnose.spec.ts` — 起動中のサーバー・本番URLを対象にしたe2e/診断テスト（現時点でCIには未接続。手動実行用）

CI（`.github/workflows/ci.yml`）は lint・型チェック・上記の静的/単体テストをPRごとに自動実行する。

## デプロイ

Vercelにデプロイされている（`vercel.json`にcronジョブ設定あり）。デプロイ前の運用ルールは `SOVEREIGN_MANDATES.md` を参照——特に、pushする前に変更内容を人間に説明し、明示的な承諾を得ることが定められている。
