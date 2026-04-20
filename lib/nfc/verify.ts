import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * NFC UIDとシリアル番号の整合性を検証する
 * @param uid 物理カードのUID
 * @param serial 発行されたシリアル番号
 * @returns 検証結果と関連データ
 */
export async function verifyHexaCard(uid: string, serial: string) {
  const card = await prisma.cards.findUnique({
    where: { uid },
  });

  if (!card) {
    return { success: false, message: "Unknown card." };
  }

  if (card.internal_serial !== serial) {
    return { success: false, message: "Serial mismatch." };
  }

  if (card.status !== "unissued") {
    return { success: false, message: "Card already activated or void." };
  }

  return { success: true, card };
}

/**
 * 新規カードを登録（アクティベーション）
 */
export async function activateHexaCard(uid: string, userId: string) {
  return await prisma.cards.update({
    where: { uid },
    data: {
      status: "active",
      user_id: userId,
      activated_at: new Date(),
    },
  });
}
