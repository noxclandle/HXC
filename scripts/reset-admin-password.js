const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * 使い方 (Usage):
 *   node scripts/reset-admin-password.js <email> <new-password>
 *
 * メールアドレスと新パスワードは引数で渡す。コード内に平文で残さない。
 * (Email and new password are passed as CLI args — never hardcode secrets here.)
 */
async function main() {
  const [email, newPassword] = process.argv.slice(2);

  if (!email || !newPassword) {
    console.error('Usage: node scripts/reset-admin-password.js <email> <new-password>');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('❌ Refusing to set a password shorter than 8 characters.');
    process.exit(1);
  }

  console.log(`🔐 Updating password for ${email}...`);

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  console.log(`✅ Password updated successfully for user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
