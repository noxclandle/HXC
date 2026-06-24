import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // トランザクションで実行
    await prisma.$transaction(async (tx) => {
      // 1. 紐付いているカードを「無能化(dead)」する
      const card = await tx.card.findUnique({
        where: { user_id: userId }
      });

      if (card) {
        await tx.card.update({
          where: { uid: card.uid },
          data: {
            status: "dead",
            user_id: null,
            // internal_serial は認識のために残すが、statusがdeadなので再利用不可
          }
        });
      }

      // 2. 関連データの削除 (CASCADE設定がない場合は手動)
      await tx.cardMessage.deleteMany({ where: { target_user_id: userId } });
      await tx.auditLog.updateMany({
        where: { user_id: userId },
        data: { user_id: null }
      });
      await tx.deviceBinding.deleteMany({ where: { user_id: userId } });
      await tx.chatMessage.deleteMany({ where: { user_id: userId } });
      await tx.contact.deleteMany({ where: { owner_id: userId } });
      await tx.rTTransaction.deleteMany({ where: { user_id: userId } });
      
      // 3. ユーザー自身の削除
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ message: "Identity erased." });
  } catch (error) {
    console.error("Deletion error:", error);
    return NextResponse.json({ error: "Failed to erase identity." }, { status: 500 });
  }
}
