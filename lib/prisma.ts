import { PrismaClient } from "@prisma/client";

// BigIntのシリアライズ問題を解決
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
