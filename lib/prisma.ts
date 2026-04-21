import { PrismaClient } from "@prisma/client";

// BigIntのシリアライズ問題を解決
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * Prisma Client のシングルトンインスタンスを作成
 * 本番環境でのコネクションリークを防ぐ
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
