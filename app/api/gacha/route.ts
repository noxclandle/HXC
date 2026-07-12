import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ASSETS } from "@/lib/game/assets";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const GACHA_COST = 500;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // すべての処理（残高チェック、消費、抽選、重複判定、アセット付与、ログ作成）を単一のトランザクションかつ行ロック（FOR UPDATE）で実行
    const result = await prisma.$transaction(async (tx) => {
      // 1. ユーザーレコードをロック付きで取得して競合を防ぐ
      const users = await tx.$queryRaw<any[]>`
        SELECT id, rt_balance, owned_assets FROM users WHERE id = ${session.user.id}::uuid FOR UPDATE
      `;

      if (!users || users.length === 0) {
        throw new Error("USER_NOT_FOUND");
      }

      const dbUser = users[0];
      const currentBalance = dbUser.rt_balance;

      // 残高不足チェック
      if (currentBalance < GACHA_COST) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      // 2. 抽選ロジック
      // 称号を除外した非共通アセットをプールとする
      const pool = ASSETS.filter(a => a.rarity !== "common" && a.type !== "title");
      
      // レアリティごとの重み付け
      const rarities = [
        { rarity: "rare", weight: 80 },
        { rarity: "epic", weight: 18 },
        { rarity: "mythic", weight: 2 }
      ];

      const totalWeight = rarities.reduce((sum, r) => sum + r.weight, 0);
      let random = Math.random() * totalWeight;
      let selectedRarity = "rare";

      for (const r of rarities) {
        if (random < r.weight) {
          selectedRarity = r.rarity;
          break;
        }
        random -= r.weight;
      }

      const rarityPool = pool.filter(a => a.rarity === selectedRarity);
      const win = rarityPool[Math.floor(Math.random() * rarityPool.length)];

      // 3. アセットの付与および重複判定
      const ownedAssets = Array.isArray(dbUser.owned_assets) ? [...dbUser.owned_assets] : [];
      let isDuplicate = false;
      let refundAmount = 0;
      let newBalance = currentBalance - GACHA_COST;

      if (ownedAssets.includes(win.id)) {
        isDuplicate = true;
        // 重複の場合は200 RTを返還（慰め報酬）
        refundAmount = 200;
        newBalance += refundAmount;
      } else {
        ownedAssets.push(win.id);
      }

      // 4. ユーザーデータの更新（残高とアセットを一発で更新）
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          rt_balance: newBalance,
          owned_assets: ownedAssets
        }
      });

      // 5. 取引履歴の作成
      // 消費ログ
      await tx.rTTransaction.create({
        data: {
          user_id: session.user.id,
          amount: -GACHA_COST,
          type: "spend",
          description: `Ethereal Gacha Summon: ${win.name}`
        }
      });

      // 重複返還ログ
      if (isDuplicate) {
        await tx.rTTransaction.create({
          data: {
            user_id: session.user.id,
            amount: refundAmount,
            type: "earn",
            description: `Gacha Duplicate Refund: ${win.name}`
          }
        });
      }

      return {
        win,
        isDuplicate,
        refundAmount,
        newBalance: updatedUser.rt_balance,
        owned_assets: updatedUser.owned_assets
      };
    });

    return NextResponse.json({
      success: true,
      item: result.win,
      isDuplicate: result.isDuplicate,
      refundAmount: result.refundAmount,
      rt_balance: result.newBalance.toString(),
      owned_assets: result.owned_assets
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json({ error: "Insufficient RT balance / 所持RTが不足しています" }, { status: 400 });
    }
    logger.error("Gacha error", { error: message });
    return NextResponse.json({ error: "Internal Server Error / ガチャの実行に失敗しました" }, { status: 500 });
  }
}
