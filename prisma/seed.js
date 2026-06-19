const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 【安全装置】本番環境に近い状態での不用意なデータ削除を禁止
  // const targetEmails = ["prez@company.com", "member-b@test.com", "member-c@test.com", "sasaki@example.com"];
  // const targetNames = ["佐々木大輔", "佐々木　大輔"];

  console.log("⚠️ Seed sequence initiated. Destructive purge is disabled for safety.");
  
  /* 
  // 以下の削除ロジックは開発初期のみ使用し、運用開始後は原則使用禁止
  const usersToPurge = await prisma.user.findMany({ ... });
  ...
  */

  // 1. 最強の天才: 佐々木大輔 (作成・更新 - upsertを使用し、既存データを破壊しない)
  console.log("🚀 Initializing The Genius: Daisuke Sasaki...");
  const bcrypt = require("bcryptjs");
  const hashedSasakiPassword = await bcrypt.hash("HXCsasakiHXC", 10);
  const sasaki = await prisma.user.upsert({
    where: { email: "orehasaikyounotensai@gmail.com" },
    update: {
      password: hashedSasakiPassword,
      rt_balance: 10000,
      role: "member"
    },
    create: {
      name: "佐々木大輔",
      handle_name: "SASAKI",
      email: "orehasaikyounotensai@gmail.com",
      password: hashedSasakiPassword,
      role: "member",
      rank: "ASSOCIATE",
      rt_balance: 10000,
      owned_assets: ["Obsidian", "Default", "None", "Standard", "ASSOCIATE", "resonance", "Pure White Hex"],
      unlocked_titles: ["ASSOCIATE", "Initiate"]
    },
  });

  // 2. チーフオフィサー (あなた)
  const chief = await prisma.user.upsert({
    where: { email: "str1yf5x@gmail.com" },
    update: {},
    create: {
      name: "Nox",
      handle_name: "ARCHITECT",
      email: "str1yf5x@gmail.com",
      password: "2mbDoll5",
      role: "chief_officer",
      rank: "Architect",
      address: "HEXA HQ, SHIBUYA",
      phone: "090-XXXX-XXXX",
      rt_balance: 1000000,
      ai_config: { personality: "Sentinel", visual_effect: 100 },
      unlocked_titles: ["Chief Officer", "Founder", "Architect"]
    },
  });

  // 3. 台帳（Registry）の紐付け（一人に限定）
  console.log("🔗 Finalizing Sasaki's card connection...");
  const sasakiCards = await prisma.card.findMany({
    where: {
      OR: [
        { internal_serial: { contains: "佐々木" } },
        { user_id: sasaki.id }
      ]
    },
    orderBy: { internal_serial: "asc" }
  });

  if (sasakiCards.length > 0) {
    const [mainCard, ...duplicates] = sasakiCards;
    if (duplicates.length > 0) {
      await prisma.card.deleteMany({ where: { uid: { in: duplicates.map(c => c.uid) } } });
    }
    await prisma.card.update({
      where: { uid: mainCard.uid },
      data: { user_id: sasaki.id, status: "active" }
    });
    console.log(`✅ Linked card (UID: ${mainCard.uid}) to Sasaki.`);
  }

  console.log("Seed completed: The system is now pure.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
