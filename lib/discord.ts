import { logger } from "@/lib/logger";
import { postToWebhook } from "@/lib/purchase-notify";

/**
 * Discord Webhook を使用して通知を送信するユーティリティ（一般通知）。
 *
 * 再送とレート制限の待機は postToWebhook 側でまとめて面倒をみている。
 * ここの役目は「未設定」と「最終的に失敗した」を確実に見えるところへ残すこと。
 *
 * 2026-08 に、この関数が黙って失敗しても誰も気づけない状態になっていた
 * （webhook を差し替えても環境変数が旧 URL のままなら warn ログが出るだけだった）。
 * 未設定・失敗ともに error として残し、戻り値でも呼び出し側へ伝える。
 *
 * 購入・売上の通知には使わないこと。専用チャンネルへ流す notifyPurchase を使う。
 */
export async function sendDiscordNotification(message: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    logger.error("DISCORD_WEBHOOK_URL が未設定。通知が誰にも届いていない");
    return false;
  }

  const result = await postToWebhook(webhookUrl, { content: message });

  if (!result.ok) {
    logger.error("Discord通知の送信に失敗", { reason: result.reason });
    return false;
  }

  return true;
}
