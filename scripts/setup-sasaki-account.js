const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "orehasaikyounotensa@gmail.com";
  const password = "***REMOVED-SECRET***";
  const name = "佐々木大輔";
  const rtAmount = 10000;

  console.log(`🚀 Setting up account for ${name} (${email})...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: name,
      rt_balance: BigInt(rtAmount),
      role: "member",
      rank: "ASSOCIATE"
    },
    create: {
      email,
      password: hashedPassword,
      name: name,
      rt_balance: BigInt(rtAmount),
      role: "member",
      rank: "ASSOCIATE",
      exp: BigInt(0),
      owned_assets: ["Obsidian", "Default", "None", "Standard", "ASSOCIATE", "resonance", "Pure White Hex"],
      unlocked_titles: ["ASSOCIATE", "Member"]
    }
  });

  console.log(`✅ User ${user.id} setup completed.`);
  
  // Create an initial transaction log for the RT
  await prisma.rTTransaction.create({
    data: {
      user_id: user.id,
      amount: rtAmount,
      type: "earn",
      description: "Genesis Grace: Initial bestowal for the Chosen One."
    }
  });

  console.log(`💰 Granted ${rtAmount} RT to ${name}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
