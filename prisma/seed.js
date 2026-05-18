const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
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

  // 2. テストユーザー A (重役クラス)
  await prisma.user.upsert({
    where: { email: "prez@company.com" },
    update: {},
    create: {
      name: "佐藤 栄作",
      handle_name: "SATOH",
      email: "prez@company.com",
      role: "member",
      rank: "Black Tier",
      rt_balance: 50000n,
      ai_config: { personality: "Scholar", visual_effect: 80 }
    },
  });

  // 3. テストユーザー B
  await prisma.user.upsert({
    where: { email: "member-b@test.com" },
    update: {},
    create: {
      name: "田中 太郎",
      handle_name: "TARO",
      email: "member-b@test.com",
      role: "member",
      rank: "Initiate",
      rt_balance: 1200n
    },
  });

  // 4. テストユーザー C
  await prisma.user.upsert({
    where: { email: "member-c@test.com" },
    update: {},
    create: {
      name: "鈴木 一郎",
      handle_name: "ICHIRO",
      email: "member-c@test.com",
      role: "member",
      rank: "Initiate",
      rt_balance: 800n
    },
  });

  // 5. 最強の天才: 佐々木大輔
  const bcrypt = require("bcryptjs");
  const hashedSasakiPassword = await bcrypt.hash("***REMOVED-SECRET***", 10);
  await prisma.user.upsert({
    where: { email: "orehasaikyounotensa@gmail.com" },
    update: {
      password: hashedSasakiPassword,
      rt_balance: 10000n,
    },
    create: {
      name: "佐々木大輔",
      handle_name: "SASAKI",
      email: "orehasaikyounotensa@gmail.com",
      password: hashedSasakiPassword,
      role: "member",
      rank: "ASSOCIATE",
      rt_balance: 10000n,
      owned_assets: ["Obsidian", "Default", "None", "Standard", "ASSOCIATE", "resonance", "Pure White Hex"],
      unlocked_titles: ["ASSOCIATE", "Initiate"]
    },
  });

  console.log("Seed completed: 5 elite souls initialized.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
