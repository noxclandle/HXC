const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function triggerRTInfusionMock() {
  console.log("💎 Simulating RT Purchase event...");

  const mockRTData = {
    userId: "ca2f4d88-491a-417f-8df8-d00fbdb17d5c", // Nox or Sasaki ID
    rtAmount: 23000,
    packLabel: "23,000 RT Pack",
  };

  const discordMessage = `【HXC監視局】RTチャージを検知。ユーザーID: ${mockRTData.userId}, 付与RT: ${mockRTData.rtAmount.toLocaleString()} (${mockRTData.packLabel})`;
  
  console.log("\n--- [Discord RT Notification Simulation] ---");
  console.log(`Payload: ${discordMessage}`);

  if (process.env.DISCORD_WEBHOOK_URL) {
    console.log("📡 Sending real Discord notification for RT...");
    try {
      const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: discordMessage }),
      });
      if (res.ok) {
          console.log("✅ Discord RT notification sent.");
      } else {
          console.error("❌ Discord send failed:", await res.text());
      }
    } catch (err) {
      console.log("⚠️ Discord real-send failed:", err.message);
    }
  } else {
    console.log("ℹ️ DISCORD_WEBHOOK_URL not set.");
  }

  console.log("\n✨ Simulation complete.");
}

triggerRTInfusionMock()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
