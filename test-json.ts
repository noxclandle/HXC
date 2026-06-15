import { prisma } from './lib/prisma';
async function test() {
  const user = await prisma.user.findFirst({ where: { email: 'str1yf5x@gmail.com' } });
  try {
    await prisma.user.update({
      where: { id: user!.id },
      data: {
        equipped_assets: {
          test: undefined,
          valid: "string"
        }
      }
    });
    console.log("Success");
  } catch(e) {
    console.log("Failed:", e.message);
  }
}
test();
