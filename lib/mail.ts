/**
 * Hexa System Notification Service
 * In production, this would use a real provider like Resend or SendGrid.
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
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const addr = order.shippingAddress || {};
  const addressText = addr.line1 
    ? `${addr.postal_code} ${addr.state}${addr.city}${addr.line1} ${addr.line2 || ""}`
    : "No address provided (Digital?)";
  
  console.log(`[MAILER] Sending order notification to ${adminEmail}`);
  console.log(`[MAILER] Subject: NEW ORDER - ${order.tier} - ${order.customerName}`);
  console.log(`[MAILER] Content: 
    New Hexa Relation order received.
    
    [Customer]
    - Name: ${order.customerName}
    - Email: ${order.customerEmail}
    
    [Plan]
    - Tier: ${order.tier}
    - Variant: ${order.variant}
    - Total: ${order.price.toLocaleString()} JPY

    [Shipping Address]
    - ${addressText}

    Please access the Central Asset Registry to process:
    ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/registry
    `);
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  console.log(`[MAILER] Sending password reset to ${email}`);
  console.log(`[MAILER] Reset Link: ${resetUrl}`);

  // In production, use Resend or SendGrid here.
  // For now, logging to console as per current pattern.
}

/**
 * Send Customer Shipment Confirmation Email
 */
export async function sendCustomerShipmentNotification(email: string, name: string) {
  console.log(`[MAILER] Sending shipment notification to ${email}`);
  console.log(`[MAILER] Subject: 【HXC】アイデンティティ（カード）の発送が完了しました`);
  console.log(`[MAILER] Content: 
    ${name}様、ご注文ありがとうございます。
    先ほど、あなたの物理カードの初期設定と発送が完了しました。
    数日以内にご指定の住所へお届けいたします。
    
    到着後、カードをスマホ（iPhone）の背面に近づけて読み取ることで、アクティベーション（初期登録）を開始できます。
    `);

  // In production, use Resend or SendGrid here.
}

/**
 * Send Customer Purchase Confirmation Email with dark-themed layout and setup instructions
 */
export async function sendCustomerOrderNotification(order: {
  customerEmail: string;
  customerName: string;
  tier: string;
  variant: string;
  price: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://virtual-business-card.hexa-relation.com';
  
  console.log(`[MAILER] Sending order confirmation to ${order.customerEmail}`);
  console.log(`[MAILER] Subject: 【Hexa Relation】Order Completed & Setup Guide / カード注文完了と初期設定ガイド`);
  console.log(`[MAILER] Content (Minimalist Black Theme HTML Mock):
    ====================================================================
    [BLACK THEME EMAIL LAYOUT: bg-void (#050505), text-moonlight, border-azure]
    --------------------------------------------------------------------
    HEXA RELATION | IDENTITY REGISTRY
    --------------------------------------------------------------------
    Dear ${order.customerName},

    Thank you for choosing Hexa Card. 
    Your order for the "${order.tier}" physical asset has been completed.
    
    --------------------------------------------------------------------
    [Order Summary / 注文内容]
    - Plan: ${order.tier}
    - Variant: ${order.variant || "Standard"}
    - Total Price: ${(order.price).toLocaleString()} JPY
    --------------------------------------------------------------------

    [NFC Activation Guide / 初期設定の手順]
    Once your card arrives, follow these steps to connect your identity:

    1. TAP (かざす)
       Tap the physical card near the top-rear of your iPhone.
       カードをスマートフォンの背面（iPhoneは上部）にかざしてください。

    2. ACCESS (アクセス)
       A browser notification will appear. Tap it to open your registry URL.
       自動でポップアップ通知が表示されますので、タップして専用URLを開きます。

    3. ACTIVATE (同期する)
       Click "Activate / アクティベート" to create your account or login. 
       Your card and digital profile will resonate instantly.
       「アクティベート」を押してアカウントを登録またはログインします。
       瞬時にお手元のカードとデジタルプロフィールが共鳴し同期します。

    --------------------------------------------------------------------
    If you have any questions, contact us via:
    ${baseUrl}/contact
    ====================================================================
  `);
}


