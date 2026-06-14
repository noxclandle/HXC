import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

/**
 * APIレートリミッター
 * 同一IPからの過剰なリクエストを制限し、DDoS攻撃やブルートフォース攻撃を防ぎます。
 */
export const rateLimit = {
  /**
   * 厳格な制限 (新規登録、ログイン試行など)
   * 1分間に 5リクエストまで
   */
  strict: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "hxc_rl_strict",
  }),

  /**
   * 標準的な制限 (ボーナス受取、プロフィール更新など)
   * 1分間に 60リクエストまで (Autosave対応)
   */
  standard: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
    prefix: "hxc_rl_standard",
  }),

  /**
   * 読み取り制限 (一般公開ページなど)
   * 1分間に 60リクエストまで
   */
  relaxed: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
    prefix: "hxc_rl_relaxed",
  }),
};
