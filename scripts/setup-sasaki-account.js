const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * 使い方 (Usage):
 *   node scripts/setup-sasaki-account.js <email> <password> <name> [rtAmount]
 *
 * メールアドレス・パスワード・氏名は引数で渡す。コード内に平文で残さない。
 * (Email/password/name are passed as CLI args — never hardcode secrets here.)
 */
async function main() {
  const [email, password, name, rtAmountArg] = process.argv.slice(2);
  const rtAmount = rtAmountArg ? parseInt(rtAmountArg, 10) : 0;

  if (!email || !password || !name) {
    console.error('Usage: node scripts/setup-sasaki-account.js <email> <password> <name> [rtAmount]');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Refusing to set a password shorter than 8 characters.');
    process.exit(1);
  }

  console.log(`🚀 Setting up account for ${name} (${email})...`);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: name,
      rt_balance: rtAmount,
      role: "member",
      rank: "ASSOCIATE"
    },
    create: {
      email,
      password: hashedPassword,
      name: name,
      rt_balance: rtAmount,
      role: "member",
      rank: "ASSOCIATE",
      exp: 0,
      owned_assets: ["Obsidian", "Default", "None", "Standard", "ASSOCIATE", "resonance", "Pure White Hex"],
      unlocked_titles: ["ASSOCIATE", "Initiate"]
    }
  });

  console.log(`✅ User ${user.id} setup completed.`);

  if (rtAmount > 0) {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
