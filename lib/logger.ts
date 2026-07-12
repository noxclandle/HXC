/**
 * 軽量な構造化ロガー。
 * 新規パッケージを追加せず、console.* をラップするだけの薄い実装。
 * - 本番: 1行JSON（ログ収集基盤でパース・検索しやすい形）
 * - 開発: 読みやすいプレフィックス付きテキスト
 *
 * 個人情報（メールアドレス、パスワード、トークン等）をログに残さないこと。
 * 必要な場合は必ずマスキングしてから渡す。
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

function emit(level: LogLevel, message: string, meta?: LogMeta) {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    const payload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    const line = JSON.stringify(payload);
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
    return;
  }

  const prefix = `[${level.toUpperCase()}]`;
  const args: unknown[] = [prefix, message];
  if (meta) args.push(meta);

  if (level === "error") console.error(...args);
  else if (level === "warn") console.warn(...args);
  else console.log(...args);
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => emit("debug", message, meta),
  info: (message: string, meta?: LogMeta) => emit("info", message, meta),
  warn: (message: string, meta?: LogMeta) => emit("warn", message, meta),
  error: (message: string, meta?: LogMeta) => emit("error", message, meta),
};
