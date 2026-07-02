import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { equipped } = await req.json();

    const keys = Object.keys(equipped || {});
    let expEarned = 0;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email as string }
      });
      if (!user) throw new Error("User not found");

      const currentEquipped = (user.equipped_assets as any) || {};

      // 初回装備チェック
      for (const key of keys) {
        const assetValue = equipped[key];
        if (assetValue) {
          // 過去にこのアセットの装備履歴があるか監査ログを検索
          const isEquippedBefore = await tx.auditLog.findFirst({
            where: {
              user_id: user.id,
              action: `equip_asset_${assetValue}`
            }
          });

          if (!isEquippedBefore) {
            // 初回装備なのでログに記録して +100 EXP 加算
            await tx.auditLog.create({
              data: {
                user_id: user.id,
                action: `equip_asset_${assetValue}`,
                details: { category: key, value: assetValue }
              }
            });
            expEarned += 100;
          }
        }
      }

      return await tx.user.update({
        where: { email: session.user.email as string },
        data: {
          equipped_assets: {
            ...currentEquipped,
            ...equipped
          },
          exp: expEarned > 0 ? { increment: expEarned } : undefined
        }
      });
    });

    return NextResponse.json({ success: true, equipped: updatedUser.equipped_assets });
  } catch (error: any) {
    console.error("Equip update error:", error);
    return NextResponse.json({ error: "Failed to synchronize treasury." }, { status: 500 });
  }
}
