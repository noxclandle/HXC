const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const uid = '04552CAA852190';
  try {
    const card = await prisma.card.findUnique({ where: { uid } });
    console.log('Target Card:', card);
    if (card) {
      const orders = await prisma.order.findMany({ where: { card_uid: uid } });
      console.log('Linked Orders:', orders.length);
    }
  } catch (e) {
    console.error('Check Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
