const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function triggerMockPurchase() {
  console.log("🔔 Simulating purchase event...");

  const mockOrder = {
    id: `MOCK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    customerName: "テスト 太郎",
    customerEmail: "test@example.com",
    tier: "Executive",
    variant: "Original Blue",
    price: 10000,
  };

  // 1. DBに注文を作成 (実際の運用フローを模倣)
  try {
    const order = await prisma.order.create({
      data: {
        stripe_session_id: `session_${Date.now()}`,
        tier: mockOrder.tier,
        variant: mockOrder.variant,
        price: mockOrder.price,
        customer_email: mockOrder.customerEmail,
        customer_name: mockOrder.customerName,
        shipping_address: {
          postal_code: "150-0001",
          state: "東京都",
          city: "渋谷区",
          line1: "神宮前1-2-3",
          line2: "ヘキサビル 6F"
        },
        status: "paid",
      },
    });
    console.log(`✅ Mock order created in database: ${order.id}`);
  } catch (e) {
    console.error("❌ Failed to create mock order:", e.message);
  }

  // 2. 通知関数のインポートと実行
  const shippingAddr = {
    postal_code: "150-0001",
    state: "東京都",
    city: "渋谷区",
    line1: "神宮前1-2-3",
    line2: "ヘキサビル 6F"
  };

  console.log("\n--- [Admin Email Notification Simulation] ---");
  console.log(`To: admin@example.com`);
  console.log(`Subject: NEW ORDER - ${mockOrder.tier} - ${mockOrder.customerName}`);
  console.log(`Content: 
    New Hexa Relation order received.

    [Customer]
    - Name: ${mockOrder.customerName}
    - Email: ${mockOrder.customerEmail}

    [Plan]
    - Tier: ${mockOrder.tier}
    - Variant: ${mockOrder.variant}
    - Total: ${mockOrder.price.toLocaleString()} JPY

    [Shipping Address]
    - ${shippingAddr.postal_code} ${shippingAddr.state}${shippingAddr.city}${shippingAddr.line1} ${shippingAddr.line2}

    Please access the Central Asset Registry to process:
    http://localhost:3000/admin/registry
  `);

  console.log("\n--- [Discord Notification Simulation] ---");
  const discordMessage = `【HXC監視局】新規注文を検知。プラン: ${mockOrder.tier}, バリアント: ${mockOrder.variant}, 顧客: ${mockOrder.customerName}\n配送先: ${shippingAddr.postal_code} ${shippingAddr.state}${shippingAddr.city}${shippingAddr.line1}`;
  console.log(`Payload: ${discordMessage}`);


  // もし環境変数が設定されていれば、実際にDiscordに飛ばす
  if (process.env.DISCORD_WEBHOOK_URL) {
    console.log("📡 Sending real Discord notification...");
    try {
      // node-fetchの代わりに標準fetchが使える環境を想定
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: discordMessage }),
      });
      console.log("✅ Discord notification sent.");
    } catch (err) {
      console.log("⚠️ Discord real-send failed (this is expected in some environments).");
    }
  } else {
    console.log("ℹ️ DISCORD_WEBHOOK_URL not set. Skipping real-send.");
  }

  console.log("\n✨ Simulation complete. Check the Admin Registry page to see the new order.");
}

triggerMockPurchase()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
