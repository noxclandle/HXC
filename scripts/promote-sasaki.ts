import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const email = "orehasaikyounotensai@gmail.com";

  console.log(`🔍 Finding user with email: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`❌ User with email ${email} not found.`);
    process.exit(1);
  }

  const currentTitles = (user.unlocked_titles as string[]) || [];
  const updatedTitles = Array.from(new Set([...currentTitles, "Mastermind"]));

  console.log(`⚡ Updating role, rank, and titles for: ${user.name}`);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: "mastermind",
      rank: "Mastermind",
      unlocked_titles: updatedTitles
    }
  });

  console.log(`\n✅ Promotion Successful!`);
  console.log(`-----------------------------------`);
  console.log(`User Name      : ${updated.name}`);
  console.log(`System Role    : ${updated.role} (Administrator)`);
  console.log(`Profile Rank   : ${updated.rank}`);
  console.log(`Unlocked Titles: ${JSON.stringify(updated.unlocked_titles)}`);
  console.log(`-----------------------------------`);
}

main()
  .catch((e) => {
    console.error("❌ Promotion failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
