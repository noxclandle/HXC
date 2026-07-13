import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

/**
 * 各プロトコルの上限値。app/admin/security の表示もここを唯一の情報源として参照する。
 */
export const RATE_LIMIT_RULES = {
  strict: { label: "STRICT PROTOCOL", desc: "新規登録・認証試行", points: 5, window: "60 s", prefix: "hxc_rl_strict" },
  standard: { label: "STANDARD PROTOCOL", desc: "ボーナス受取・プロフィール更新", points: 60, window: "60 s", prefix: "hxc_rl_standard" },
  relaxed: { label: "RELAXED PROTOCOL", desc: "一般公開データ取得", points: 60, window: "60 s", prefix: "hxc_rl_relaxed" },
} as const;

/**
 * APIレートリミッター
 * 同一IPからの過剰なリクエストを制限し、DDoS攻撃やブルートフォース攻撃を防ぎます。
 */
export const rateLimit = {
  strict: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_RULES.strict.points, RATE_LIMIT_RULES.strict.window),
    analytics: true,
    prefix: RATE_LIMIT_RULES.strict.prefix,
  }),

  standard: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_RULES.standard.points, RATE_LIMIT_RULES.standard.window),
    analytics: true,
    prefix: RATE_LIMIT_RULES.standard.prefix,
  }),

  relaxed: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_RULES.relaxed.points, RATE_LIMIT_RULES.relaxed.window),
    analytics: true,
    prefix: RATE_LIMIT_RULES.relaxed.prefix,
  }),
};
