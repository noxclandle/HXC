/**
 * Hexa System Notification Service
 * Sends emails using Resend API. Fallbacks to console logging if RESEND_API_KEY is not configured.
 * Enforces strict "Japanese / English" formatting and simplified English terminology.
 */

import { logger } from "@/lib/logger";

interface SendMailArgs {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendResendEmail({ to, subject, text, html }: SendMailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("[MAILER] RESEND_API_KEY is not defined. Logging email instead", { to, subject, text });
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hexa Relation <system@hexa-relation.com>",
        to,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error("[MAILER] Failed to send email via Resend", { status: res.status, statusText: res.statusText, errText });
    } else {
      const data = await res.json();
      logger.info("[MAILER] Email sent successfully via Resend", { id: data.id });
    }
  } catch (error) {
    logger.error("[MAILER] Error calling Resend API", { error });
  }
}

/**
 * HTML Layout Wrapper for premium dark/minimalist theme (Japanese / English)
 */
function wrapHtmlLayout(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505; color: #a3a3a3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #050505;">
          <!-- Header -->
          <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid #1a1a1a;">
            <h1 style="color: #ffffff; font-size: 20px; font-weight: 200; letter-spacing: 0.25em; margin: 0; text-transform: uppercase;">
              HEXA RELATION
            </h1>
            <p style="color: #666666; font-size: 11px; margin: 5px 0 0 0; letter-spacing: 0.15em; text-transform: uppercase;">
              アイデンティティ登録 / IDENTITY REGISTRY
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 10px; line-height: 1.8; font-size: 14px;">
            ${contentHtml}
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #1a1a1a; font-size: 11px; color: #444444; letter-spacing: 0.05em;">
            <p style="margin: 0 0 10px 0;">HEXA RELATION &copy; All Rights Reserved.</p>
            <p style="margin: 0;">
              本メールはシステムによる自動配信メールです。返信は受け付けておりません。<br>
              This mail was sent from an unmonitored address.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send Admin Order Notification (Admin only, simple fields)
 */
export async function sendAdminOrderNotification(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  tier: string;
  variant: string;
  price: number;
  shippingAddress?: any;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "info@hexa-relation.com";
  const addr = order.shippingAddress || {};
  const addressText = addr.line1 
    ? `${addr.postal_code || ""} ${addr.state || ""}${addr.city || ""}${addr.line1 || ""} ${addr.line2 || ""}`
    : "No address provided";

  const subject = `【HXC Admin】NEW ORDER - ${order.tier} - ${order.customerName}`;
  const text = `
    新規注文を受信しました / New Order Received
    
    [Customer / 購入者]
    - Name / 氏名: ${order.customerName}
    - Email / メール: ${order.customerEmail}
    
    [Plan / 注文内容]
    - Tier / プラン: ${order.tier}
    - Variant / タイプ: ${order.variant}
    - Total / 合計: ${order.price.toLocaleString()} JPY

    [Shipping Address / 発送先]
    - ${addressText}

    管理画面にアクセスして処理を行ってください:
    ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/registry
  `;

  const html = wrapHtmlLayout("新規注文の通知 / New Order Notification", `
    <h2 style="color: #ffffff; font-size: 16px; font-weight: 400; margin-bottom: 24px; letter-spacing: 0.05em; border-left: 2px solid #ffffff; padding-left: 10px;">
      【管理者用】新規注文の受信 / [ADMIN] NEW ORDER RECEIVED
    </h2>
    <p style="margin-bottom: 20px;">新しいデバイスの注文が完了しました。発送手続きをお願いします。</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666; width: 35%;">注文ID / Order ID</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.id}</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666;">購入者氏名 / Customer Name</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.customerName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666;">購入者メール / Customer Email</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.customerEmail}</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666;">プラン・タイプ / Plan & Variant</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.tier} / ${order.variant}</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666;">決済金額 / Total Amount</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.price.toLocaleString()} JPY</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666; vertical-align: top;">発送先住所 / Shipping Address</td>
        <td style="padding: 10px 0; color: #ffffff; line-height: 1.5;">${addressText}</td>
      </tr>
    </table>
    
    <div style="text-align: center; margin-top: 40px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/registry" style="background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 30px; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; display: inline-block; border-radius: 2px;">
        管理画面を開く / ACCESS REGISTRY
      </a>
    </div>
  `);

  await sendResendEmail({ to: adminEmail, subject, text, html });
}

/**
 * Send Password Reset Email (Enforces Japanese first)
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const subject = "【Hexa Relation】パスワードの再設定 / Password Reset";
  const text = `
    パスワードの再設定リクエストを受信しました。
    以下のリンクから再設定を完了させてください：
    ${resetUrl}

    ※このリンクは24時間有効です。
    心当たりがない場合は、このメールを破棄してください。

    ---------------------------------------------------------
    You requested a password reset. Please access the link below:
    ${resetUrl}
    This link is valid for 24 hours.
  `;

  const html = wrapHtmlLayout("パスワードの再設定 / Password Reset", `
    <h2 style="color: #ffffff; font-size: 16px; font-weight: 400; margin-bottom: 24px; letter-spacing: 0.05em; border-left: 2px solid #ffffff; padding-left: 10px;">
      パスワード再設定のご案内 / Password Reset Request
    </h2>
    <p style="margin-bottom: 30px; line-height: 1.6;">
      アカウントのパスワード再設定リクエストを受信しました。以下のボタンより再設定を完了させてください。<br>
      We received a request to reset your password. Click the button below to complete the setup.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${resetUrl}" style="background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 30px; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; display: inline-block; border-radius: 2px;">
        パスワードを再設定する / RESET PASSWORD
      </a>
    </div>
    
    <p style="font-size: 12px; color: #555555; margin-top: 40px;">
      ※このリンクは24時間有効です。リクエストに心当たりがない場合は、このメールを破棄してください。<br>
      * This link will expire in 24 hours. If you did not request this reset, you can safely ignore this email.
    </p>
  `);

  await sendResendEmail({ to: email, subject, text, html });
}

export async function sendCustomerShipmentNotification(email: string, name: string) {
  const subject = "【Hexa Relation】カード発送完了のお知らせ / Identity Card Shipped";
  const text = `
    ${name} 様

    ご注文いただきありがとうございます。物理カードの発送手続きが完了いたしました。
    数日以内にお手元に届きます。
    カードが到着しましたら、別途送信している「初期設定ガイド」メールをご参照の上、初期設定を行ってください。

    ---------------------------------------------------------
    Dear ${name},
    Your physical card has been shipped and will arrive in a few days.
    Once it arrives, please refer to the Setup Guide email to register.
  `;

  const html = wrapHtmlLayout("発送完了のお知らせ / Shipment Confirmation", `
    <h2 style="color: #ffffff; font-size: 16px; font-weight: 400; margin-bottom: 24px; letter-spacing: 0.05em; border-left: 2px solid #ffffff; padding-left: 10px;">
      カード発送完了のお知らせ / Identity Card Shipped
    </h2>
    <p style="margin-bottom: 24px;">
      ${name} 様<br>
      ご注文いただいた物理カードの発送手続きが完了いたしました。数日以内にお手元に届きます。<br>
      また、初期設定の手順について記載した「初期設定ガイド」メールを別途送信しておりますので、カード到着後はそちらをご参照の上設定を行ってください。<br><br>
      Thank you for your order. Your physical card has been shipped and will arrive in a few days.<br>
      We have also sent you a separate "Setup Guide" email. Please refer to it once your card arrives.
    </p>
  `);

  await sendResendEmail({ to: email, subject, text, html });
}

export async function sendCustomerOrderNotification(order: {
  customerEmail: string;
  customerName: string;
  tier: string;
  variant: string;
  price: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://virtual-business-card.hexa-relation.com';
  
  const subject = "【Hexa Relation】ご注文完了のお知らせ / Order Completed";
  const text = `
    ${order.customerName} 様

    Hexa Card をお選びいただきありがとうございます。
    物理デバイス「${order.tier}」のご注文手続きが完了いたしました。商品が発送されるまで今しばらくお待ちください。
    
    [注文内容 / Order Summary]
    - Plan / プラン: ${order.tier}
    - Variant / タイプ: ${order.variant || "Standard"}
    - Total Price / 合計金額: ${order.price.toLocaleString()} JPY

    ※カードの発送時に、初期設定の手順を記載したメールを別途送信いたします。
  `;

  const html = wrapHtmlLayout("ご注文完了のお知らせ / Order Completed", `
    <h2 style="color: #ffffff; font-size: 16px; font-weight: 400; margin-bottom: 24px; letter-spacing: 0.05em; border-left: 2px solid #ffffff; padding-left: 10px;">
      ご注文完了のお知らせ / Order Completed
    </h2>
    <p style="margin-bottom: 24px;">
      ${order.customerName} 様<br>
      物理デバイス「${order.tier}」のご注文手続きが完了いたしました。商品が発送されるまで今しばらくお待ちください。<br>
      ※カードの発送時に、詳細な「初期設定ガイド」メールを別途送信いたします。<br><br>
      Thank you for your order. Your purchase for the "${order.tier}" device has been completed.<br>
      A separate "Setup Guide" email will be sent to you when the card is shipped.
    </p>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666; width: 35%;">プラン / Plan</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.tier}</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666;">タイプ / Variant</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.variant || "Standard"}</td>
      </tr>
      <tr style="border-bottom: 1px solid #141414;">
        <td style="padding: 10px 0; color: #666666;">合計金額 / Total Amount</td>
        <td style="padding: 10px 0; color: #ffffff;">${order.price.toLocaleString()} JPY</td>
      </tr>
    </table>
    
    <p style="font-size: 12px; color: #555555; text-align: center; margin-top: 40px;">
      ご不明な点がございましたら、<a href="${baseUrl}/contact" style="color: #ffffff; text-decoration: underline;">お問い合わせフォーム</a>よりご連絡ください。<br>
      If you have any questions, please contact us via the Contact Form.
    </p>
  `);

  await sendResendEmail({ to: order.customerEmail, subject, text, html });
}

export async function sendSetupGuideNotification(email: string, name: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://virtual-business-card.hexa-relation.com';
  const subject = "【Hexa Relation】デジタル名刺カードの初期設定ガイド / Setup Guide";
  const text = `
    ${name} 様

    お届けする Hexa Card の初期設定手順をお知らせいたします。
    本メールは設定が完了するまで大切に保管してください。

    [初期設定の手順]
    1. かざす（スキャン）
       初めてご利用になる場合、スマートフォンにカードをかざして読み取ります。
       ・iPhone: 端末上部（背面のカメラの横あたり）にかざしてください。
       ・Android: 端末背面の中央付近にかざしてください。
       ※密着させすぎると反応しにくい場合があります。少し離すか位置を微調整してください。
       ※カードの初回スキャン時に限り、アカウントの初期登録画面が表示されます。必ずご自身でスキャンして初期登録を完了してください。登録後、会員ページで名刺の作成・編集が可能になります。

    2. アクセス（ログイン）
       登録したメールアドレスとパスワードは大切に保管してください。
       ログインページ: ${baseUrl}/login
       ※ログイン状態が維持されている場合は、ご自身のカードをかざすだけで直接会員ページにアクセスできます。

    3. 有効化と活用
       初期設定完了後、カードを相手にかざすだけでデジタル名刺を瞬時に共有できます。
       ・ワンクリックで電話、メール、LINE、SNS、Webサイトへアクセス可能。
       ・プロフィールはいつでも自由に変更でき、カードを新しく刷り直す必要はありません。
       ・顔写真を登録することで、相手が「誰から貰ったか忘れる」ことを防ぎます。
       デモ画面で表面・裏面を確認し、あなただけの唯一無二の名刺にカスタマイズしてください。

    4. 様々なシーンでの活用
       ビジネスやショップカードなど、様々な用途で使われています。その他の使い方は会員ページにございます。
  `;

  const html = wrapHtmlLayout("初期設定ガイド / Setup Guide", `
    <h2 style="color: #ffffff; font-size: 16px; font-weight: 400; margin-bottom: 24px; letter-spacing: 0.05em; border-left: 2px solid #ffffff; padding-left: 10px;">
      デジタル名刺の初期設定ガイド / Setup Guide
    </h2>
    <p style="margin-bottom: 24px;">
      ${name} 様<br>
      まもなくお届けとなる Hexa Card の初期設定手順をご案内いたします。設定の完了まで大切に保管してください。<br>
      Here is the setup guide for your Hexa Card. Please keep this email safe until configuration is complete.
    </p>

    <div style="background-color: #0d0d0d; border: 1px solid #1c1c1c; padding: 25px; margin: 30px 0; border-radius: 4px;">
      <h3 style="color: #ffffff; font-size: 14px; font-weight: 500; margin-top: 0; margin-bottom: 20px; letter-spacing: 0.05em; border-bottom: 1px solid #1c1c1c; padding-bottom: 10px;">
        初期設定の手順 / Setup Steps
      </h3>
      
      <div style="margin-bottom: 24px;">
        <h4 style="color: #ffffff; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
          1. かざす / SCAN & TAP
        </h4>
        <p style="margin: 0; font-size: 12.5px; color: #a3a3a3; line-height: 1.7;">
          初めてご利用になる場合、スマートフォンにカードをかざして読み取ります。<br>
          ・<strong>iPhone</strong>: 端末上部（背面のカメラの横あたり）にかざしてください。<br>
          ・<strong>Android</strong>: 端末背面の中央付近にかざしてください。<br>
          <span style="color: #777777; font-size: 11px; display: block; margin-top: 4px;">
            ※ケースの厚みなどにより、密着させすぎると反応しにくい場合があります。少し離すか位置を微調整してください。<br>
            ※カードの初回スキャン時に限り、アカウントの初期登録画面が表示されます。必ずご自身でスキャンして初期登録を行ってください。
          </span>
          <span style="color: #555555; font-size: 11px; display: block; margin-top: 4px; font-family: monospace;">
            Scan the card near your phone to initialize. (iPhone: top back, Android: center back). Tapping too closely may hinder reading. The first scan of the card will open the initial registry page.
          </span>
        </p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: #ffffff; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
          2. アクセス / ACCESS & LOGIN
        </h4>
        <p style="margin: 0; font-size: 12.5px; color: #a3a3a3; line-height: 1.7;">
          登録したメールアドレスとパスワードは大切に保管してください。<br>
          ログインページ: <a href="${baseUrl}/login" style="color: #ffffff; text-decoration: underline;">${baseUrl}/login</a><br>
          <span style="color: #777777; font-size: 11px; display: block; margin-top: 4px;">
            ※ログイン状態（セッション）が維持されている場合は、ご自身のカードをかざすだけで直接会員ページへアクセスできます。
          </span>
          <span style="color: #555555; font-size: 11px; display: block; margin-top: 4px; font-family: monospace;">
            Keep your registered email and password safe. Log in at ${baseUrl}/login. While logged in, scanning your own card takes you directly to your member profile page.
          </span>
        </p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: #ffffff; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
          3. 有効化と活用 / ACTIVATE & CUSTOMIZE
        </h4>
        <p style="margin: 0; font-size: 12.5px; color: #a3a3a3; line-height: 1.7;">
          初期設定完了後、カードを相手のスマートフォンにかざすだけで、あなたのデジタル名刺を瞬時に共有できます。<br>
          ・<strong>紙名刺との違い</strong>: 相手はワンクリックで電話、メール、LINE、SNS、Webサイトへアクセスできます。<br>
          ・<strong>再発行不要</strong>: プロフィール情報はいつでも自分で自由に変更でき、カードを新しく刷り直す必要はありません。<br>
          ・<strong>顔写真の登録</strong>: ご自身の写真を登録することで、相手が「誰の名刺か分からなくなる」ことを防ぎます。<br>
          デモ画面をクリックして表面と裏面を確認し、あなただけの唯一無二のカスタマイズ名刺を作成してください。
          <span style="color: #555555; font-size: 11px; display: block; margin-top: 4px; font-family: monospace;">
            Simply tap to share. Provides interactive links. Updates are instantly applicable. Uploading a portrait helps recipients remember you. Check the card preview (click to flip) and customize your profile.
          </span>
        </p>
      </div>

      <div>
        <h4 style="color: #ffffff; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
          4. 様々なシーンでの活用 / MULTI-SCENE USE
        </h4>
        <p style="margin: 0; font-size: 12.5px; color: #a3a3a3; line-height: 1.7;">
          ビジネスだけでなく、店舗のショップカードやポートフォリオ紹介など、アイデア次第で様々な用途にお使いいただけます。その他の使い方は、会員ページにございますのでぜひご参照ください。
          <span style="color: #555555; font-size: 11px; display: block; margin-top: 4px; font-family: monospace;">
            Perfect for business networking, retail shop cards, and portfolios. Additional guides are available in the Member Hub.
          </span>
        </p>
      </div>
    </div>
  `);

  await sendResendEmail({ to: email, subject, text, html });
}

/**
 * Send Contact Reply Email (Bilingual alignment)
 */
export async function sendContactReplyNotification(
  email: string,
  name: string,
  originalMessage: string,
  replyText: string
) {
  const subject = "【Hexa Relation】お問い合わせへのご返答 / Reply to your Inquiry";
  const text = `
    ${name} 様

    Hexa Relation にお問い合わせいただきありがとうございます。
    ご送信いただいた内容について、ご返答いたします。

    [お問い合わせ内容]
    ${originalMessage}

    [回答]
    ${replyText}

    ---------------------------------------------------------
    Dear ${name},
    We have replied to your inquiry. Thank you for contacting us.
  `;

  const html = wrapHtmlLayout("お問い合わせへのご返答 / Inquiry Reply", `
    <h2 style="color: #ffffff; font-size: 16px; font-weight: 400; margin-bottom: 24px; letter-spacing: 0.05em; border-left: 2px solid #ffffff; padding-left: 10px;">
      お問い合わせへのご返答 / Reply to your Inquiry
    </h2>
    <p style="margin-bottom: 24px;">
      ${name} 様<br>
      Hexa Relation にお問い合わせいただきありがとうございます。ご送信いただいた内容について、以下の通りご返答いたします。<br>
      Thank you for contacting Hexa Relation. We have provided our response below.
    </p>
    
    <div style="background-color: #0b0b0b; border: 1px solid #141414; padding: 20px; margin-bottom: 24px; border-radius: 4px; font-size: 13px; color: #888888; line-height: 1.6;">
      <strong style="color: #ffffff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 5px;">お問い合わせ内容 / Your Inquiry:</strong>
      ${originalMessage.replace(/\n/g, "<br>")}
    </div>
    
    <div style="background-color: #111111; border: 1px solid #222222; padding: 25px; border-radius: 4px; font-size: 13px; color: #ffffff; line-height: 1.8; margin-bottom: 30px;">
      <strong style="color: #ffffff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 10px; border-bottom: 1px solid #222222; padding-bottom: 5px;">回答 / Response:</strong>
      ${replyText.replace(/\n/g, "<br>")}
    </div>
  `);

  await sendResendEmail({ to: email, subject, text, html });
}
