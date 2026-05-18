const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. 最強の天才: 佐々木大輔 (最優先で作成・更新)
  console.log("🚀 Initializing The Genius: Daisuke Sasaki...");
  const bcrypt = require("bcryptjs");
  const hashedSasakiPassword = await bcrypt.hash("HXCsasakiHXC", 10);
  const sasaki = await prisma.user.upsert({
    where: { email: "orehasaikyounotensai@gmail.com" },
    update: {
      password: hashedSasakiPassword,
      rt_balance: 10000n,
      role: "member"
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

  // 2. 不要なテストユーザーおよび重複「佐々木大輔」の削除
  console.log("🧹 Purging redundant souls and duplicates...");
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "prez@company.com", 
          "member-b@test.com", 
          "member-c@test.com",
          "sasaki@example.com" // 重複していた佐々木大輔を削除
        ]
      }
    }
  });

  // 3. チーフオフィサー (あなた)
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
      rt_balance: 1000000n,
      ai_config: { personality: "Sentinel", visual_effect: 100 },
      unlocked_titles: ["Chief Officer", "Founder", "Architect"]
    },
  });

  // 4. 台帳（Registry）の統合と紐付け（一人に限定）
  console.log("🔗 Merging and linking Sasaki's single identity in the registry...");
  const targetNames = ["佐々木大輔", "佐々木　大輔"];
  
  // 対象の名前を持つカードをすべて取得
  const sasakiCards = await prisma.card.findMany({
    where: {
      OR: [
        { internal_serial: { in: targetNames } },
        { user: { name: { in: targetNames } } }
      ]
    },
    orderBy: { internal_serial: "asc" }
  });

  if (sasakiCards.length > 0) {
    const [mainCard, ...duplicates] = sasakiCards;
    
    if (duplicates.length > 0) {
      console.log(`🗑️ Deleting ${duplicates.length} duplicate card(s)...`);
      await prisma.card.deleteMany({
        where: {
          uid: { in: duplicates.map(c => c.uid) }
        }
      });
    }

    await prisma.card.update({
      where: { uid: mainCard.uid },
      data: {
        user_id: sasaki.id,
        status: "active"
      }
    });
    console.log(`✅ Linked card (UID: ${mainCard.uid}) to Sasaki.`);
  }

  console.log("Seed completed: The Architect and The Genius are now synchronized.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
