require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulatePurchase(pattern) {
  console.log(`\n--- Simulating Pattern: ${pattern.tier} (${pattern.variant || 'No Variant'}) ---`);

  try {
    const order = await prisma.order.create({
      data: {
        stripe_session_id: `test_session_${pattern.tier}_${Date.now()}`,
        tier: pattern.tier,
        variant: pattern.variant,
        price: pattern.price,
        customer_email: pattern.email,
        customer_name: pattern.name,
        shipping_address: {
          postal_code: "123-4567",
          state: "東京都",
          city: "港区",
          line1: "テストビル 1-2-3",
          line2: "101号室"
        },
        status: "paid",
      },
    });
    console.log(`✅ Order Created: ${order.id}`);

    // Simulation of Discord Content
    const discordMessage = `【HXC監視局】新規注文を検知。プラン: ${pattern.tier}, バリアント: ${pattern.variant || 'N/A'}, 顧客: ${pattern.name}\n配送先: 123-4567 東京都港区テストビル 1-2-3 101号室`;
    
    // Real Discord Send (Since we loaded dotenv)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      console.log("📡 Sending real Discord notification...");
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: discordMessage }),
      });
      if (res.ok) {
        console.log("✅ Discord notification sent.");
      } else {
        console.error("❌ Discord notification failed:", await res.text());
      }
    } else {
      console.warn("⚠️ DISCORD_WEBHOOK_URL not set in .env");
    }
    
    return order;
  } catch (e) {
    console.error(`❌ Failed Pattern ${pattern.tier}:`, e.message);
  }
}

async function runTests() {
  const patterns = [
    { tier: "Standard", variant: "Original", price: 3000, name: "スタンダード 太郎", email: "standard@example.com" },
    { tier: "Executive", variant: "Silver", price: 20000, name: "エグゼクティブ 銀子", email: "silver@example.com" },
    { tier: "Executive", variant: "Gold", price: 20000, name: "エグゼクティブ 金男", email: "gold@example.com" },
    { tier: "Apex", variant: "Black", price: 1000000, name: "アペックス 王", email: "apex@example.com" }
  ];

  for (const p of patterns) {
    await simulatePurchase(p);
  }

  console.log("\n✨ All 4 patterns simulated with REAL notifications. Please check Discord.");
}

runTests()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
