import { logger } from "@/lib/logger";

/**
 * Discord Webhook を使用して通知を送信するユーティリティ
 */
export async function sendDiscordNotification(message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    logger.warn("DISCORD_WEBHOOK_URL is not set. Skipping notification.");
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!res.ok) {
      logger.error("Failed to send Discord notification", { error: await res.text() });
    }
  } catch (error) {
    logger.error("Discord notification error", { error });
  }
}
