const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 0. 不要なテストユーザーの削除
  console.log("🧹 Purging old test souls...");
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["prez@company.com", "member-b@test.com", "member-c@test.com"]
      }
    }
  });

  // 1. チーフオフィサー (あなた)
  const chief = await prisma.user.upsert({
    where: { email: "str1yf5x@gmail.com" },
    update: {},
    create: {
      name: "Nox",
      handle_name: "ARCHITECT",
      email: "str1yf5x@gmail.com",
      password: "***REMOVED-SECRET***",
      role: "chief_officer",
      rank: "Architect",
      address: "HEXA HQ, SHIBUYA",
      phone: "090-XXXX-XXXX",
      rt_balance: 1000000n,
      ai_config: { personality: "Sentinel", visual_effect: 100 },
      unlocked_titles: ["Chief Officer", "Founder", "Architect"]
    },
  });

  // 2. 最強の天才: 佐々木大輔
  const bcrypt = require("bcryptjs");
  const hashedSasakiPassword = await bcrypt.hash("***REMOVED-SECRET***", 10);
  const sasaki = await prisma.user.upsert({
    where: { email: "orehasaikyounotensai@gmail.com" },
    update: {
      password: hashedSasakiPassword,
      rt_balance: 10000n,
    },
    create: {
      name: "佐々木大輔",
      handle_name: "SASAKI",
      email: "orehasaikyounotensai@gmail.com",
      password: hashedSasakiPassword,
      role: "member",
      rank: "ASSOCIATE",
      rt_balance: 10000n,
      owned_assets: ["Obsidian", "Default", "None", "Standard", "ASSOCIATE", "resonance", "Pure White Hex"],
      unlocked_titles: ["ASSOCIATE", "Initiate"]
    },
  });

  // 3. 台帳（Registry）の統合と紐付け
  console.log("🔗 Merging and linking Sasaki's identities in the registry...");
  const targetNames = ["佐々木大輔", "佐々木　大輔"];
  
  await prisma.card.updateMany({
    where: {
      OR: [
        { internal_serial: { in: targetNames } },
        { user: { name: { in: targetNames } } }
      ]
    },
    data: {
      user_id: sasaki.id,
      status: "active"
    }
  });

  console.log("Seed completed: The Architect and The Genius are now synchronized.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
