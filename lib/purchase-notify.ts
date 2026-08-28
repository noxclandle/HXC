import { logger } from "@/lib/logger";

/*
  有料商品が売れたときの Discord 通知。

  一般通知（lib/discord.ts）とは webhook を分けている。売上は流量が読めるうえ、
  他の通知に埋もれると見落とすため、購入専用チャンネルに落とす。

  ここで守っていること:
  - 決済処理を絶対に止めない。通知は「売れた後」の付随処理なので、
    Discord が落ちていようが webhook が消えていようが例外は外に出さない。
  - 黙って失敗しない。以前 HXC の通知が届かなくなっていたのに
    誰も気づけなかったのは、失敗が握りつぶされてログにしか残らなかったため。
    再送し、それでも駄目なら一般通知チャンネルへ「通知が落ちた」ことを流す。

  必要な環境変数:
    DISCORD_PURCHASE_WEBHOOK_URL  購入通知の宛先（必須）
    DISCORD_WEBHOOK_URL           最終手段の退避先（任意・lib/discord.ts と共用）
*/

/** 商品ごとに変える中身。name は 24 文字程度まで、value は Discord の 1024 文字制限内で */
export type PurchaseField = { name: string; value: string; inline?: boolean };

export type PurchaseEvent = {
  /** どのサービスで売れたか。例: "Hexa Card" */
  service: string;
  /** 何が売れたか。例: "別名プロフィール" */
  product: string;
  /** 税込金額（円）。分からなければ null */
  amountJpy?: number | null;
  /** 購入者の表示名。個人情報なので購入通知チャンネル以外へは流さない */
  buyer?: string | null;
  /** 商品ごとの内訳。ここを商品に合わせて詰め替える */
  fields?: PurchaseField[];
  /** 後から突き合わせるための ID（Stripe セッション、注文番号など） */
  reference?: string | null;
};

/** 購入通知の色。サービスごとに変えて、チャンネル上で見分けられるようにする */
const COLOR_BY_SERVICE: Record<string, number> = {
  "Hexa Card": 0x4a90d9,
  "SPI Check": 0x2f9e6b,
  "日報ノート": 0xd98a3a,
  "聴き宮": 0x8d7ab8,
  "GENBA": 0xc4622d,
};

const DEFAULT_COLOR = 0xb4741a;

/** 再送の回数。Discord 側の一時的な不調はたいてい 1〜2 回で抜ける */
const MAX_ATTEMPTS = 3;

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

function buildPayload(e: PurchaseEvent) {
  const fields: PurchaseField[] = [];

  if (e.amountJpy != null) {
    fields.push({ name: "金額", value: yen(e.amountJpy), inline: true });
  }
  if (e.buyer) {
    fields.push({ name: "購入者", value: e.buyer, inline: true });
  }
  for (const f of e.fields ?? []) {
    fields.push({ ...f, value: f.value.slice(0, 1024) });
  }
  if (e.reference) {
    fields.push({ name: "照合ID", value: `\`${e.reference}\``, inline: false });
  }

  return {
    embeds: [
      {
        title: `${e.product} が売れました`,
        color: COLOR_BY_SERVICE[e.service] ?? DEFAULT_COLOR,
        author: { name: e.service },
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type PostResult = { ok: true } | { ok: false; reason: string };

/** webhook への POST。再送とレート制限の待機を内側で面倒みる。例外は投げない */
export async function postToWebhook(url: string, body: unknown): Promise<PostResult> {
  let lastReason = "不明";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      // ネットワーク断。時間をおけば通ることがあるので再送する
      lastReason = `ネットワーク: ${error instanceof Error ? error.message : String(error)}`;
      if (attempt < MAX_ATTEMPTS) await sleep(attempt * 500);
      continue;
    }

    if (res.ok) return { ok: true };

    if (res.status === 429) {
      // Discord のレート制限。待てと言われた時間だけ待つ
      const retryAfter = Number(res.headers.get("retry-after")) || 1;
      lastReason = `レート制限（${retryAfter}秒待機の指示）`;
      if (attempt < MAX_ATTEMPTS) await sleep(Math.min(retryAfter, 5) * 1000);
      continue;
    }

    if (res.status >= 500) {
      lastReason = `Discord側エラー ${res.status}`;
      if (attempt < MAX_ATTEMPTS) await sleep(attempt * 500);
      continue;
    }

    /*
      404 は webhook が削除済み、401/403 はトークン無効、400 はペイロード不正。
      いずれも再送しても結果は変わらないので即座に諦めて理由を残す。
    */
    if (res.status === 404) lastReason = "webhook が存在しない（削除済み）";
    else if (res.status === 401 || res.status === 403) lastReason = "webhook の認証に失敗";
    else lastReason = `送信内容が拒否された ${res.status}`;
    return { ok: false, reason: lastReason };
  }

  return { ok: false, reason: `${MAX_ATTEMPTS}回とも失敗: ${lastReason}` };
}

/**
 * 有料商品の購入を Discord へ通知する。
 *
 * 例外は投げない。呼び出し側は await して構わないし、しなくても構わない。
 * 戻り値の false は「通知が届かなかった」を意味するだけで、購入自体は成立している。
 */
export async function notifyPurchase(e: PurchaseEvent): Promise<boolean> {
  const url = process.env.DISCORD_PURCHASE_WEBHOOK_URL;

  if (!url) {
    // 設定漏れは「壊れている」と同じ。warn ではなく error で残す
    logger.error("購入通知の webhook が未設定。売上を取りこぼしている", {
      service: e.service,
      product: e.product,
      reference: e.reference ?? null,
    });
    return false;
  }

  const result = await postToWebhook(url, buildPayload(e));
  if (result.ok) return true;

  logger.error("購入通知の送信に失敗", {
    service: e.service,
    product: e.product,
    reference: e.reference ?? null,
    reason: result.reason,
  });

  await escalate(e, result.reason);
  return false;
}

/**
 * 購入通知が落ちたことを、一般通知チャンネルへ知らせる。
 *
 * 購入者の氏名やメールは載せない。落ちた事実と照合 ID さえあれば、
 * 管理室の注文台帳から中身は引ける。
 */
async function escalate(e: PurchaseEvent, reason: string): Promise<void> {
  const fallback = process.env.DISCORD_WEBHOOK_URL;
  if (!fallback) return;

  const result = await postToWebhook(fallback, {
    content:
      `⚠️ 購入通知が届きませんでした。管理室で中身を確認してください。\n` +
      `■ サービス: ${e.service}\n` +
      `■ 商品: ${e.product}\n` +
      `■ 照合ID: ${e.reference ?? "なし"}\n` +
      `■ 原因: ${reason}`,
  });

  if (!result.ok) {
    logger.error("購入通知の失敗を退避先へ流すことにも失敗", {
      service: e.service,
      reference: e.reference ?? null,
      reason: result.reason,
    });
  }
}
