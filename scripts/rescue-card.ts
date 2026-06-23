import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("⚠️ Usage: npx ts-node scripts/rescue-card.ts <CARD_UID> <SECRET>");
    console.error("Example: npx ts-node scripts/rescue-card.ts 04A23BED4A 4B56A1E");
    process.exit(1);
  }

  // UIDを正規化（大文字化・コロン除去）
  const rawUid = args[0];
  const uid = rawUid.replace(/:/g, "").toUpperCase();
  const secret = args[1];

  console.log(`🔗 Attempting to rescue card: UID=${uid}, Secret=${secret}`);

  // internal_serial は一意である必要があるため、既に存在しないか確認
  const existingBySerial = await prisma.card.findUnique({
    where: { internal_serial: secret }
  });

  if (existingBySerial) {
    console.error(`❌ Error: A card with internal_serial '${secret}' already exists in database.`);
    process.exit(1);
  }

  // 内部シリアルを発行規則（00202612345等）に合わせるか、
  // 既にロックされている物理カードのURLパラメタ 's' の値をそのまま internal_serial にセットします。
  const card = await prisma.card.upsert({
    where: { uid: uid },
    update: {
      internal_serial: secret,
      status: "unissued" // 未割り当て状態にし、管理画面から紐付けできるようにする
    },
    create: {
      uid: uid,
      internal_serial: secret,
      status: "unissued"
    }
  });

  console.log(`\n✅ Rescued Card Successfully in Database!`);
  console.log(`-----------------------------------`);
  console.log(`Card UID       : ${card.uid}`);
  console.log(`Internal Serial: ${card.internal_serial}`);
  console.log(`Status         : ${card.status}`);
  console.log(`-----------------------------------`);
  console.log(`You can now assign this card to any order on the Admin Dashboard (/admin/registry).`);
}

main()
  .catch((e) => {
    console.error("❌ Rescue sequence failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
