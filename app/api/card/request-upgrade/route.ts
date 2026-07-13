import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction } from "@/lib/rt/engine";
import { sendDiscordNotification } from "@/lib/discord";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const TIERS = {
  obsidian: { name: "Obsidian Edition", price: 0 },
  gold: { name: "Heritage Gold", price: 5000 },
  platinum: { name: "Platinum Elite", price: 8000 },
} as const;

const requestSchema = z.object({
  tier: z.enum(["obsidian", "gold", "platinum"]),
});

/**
 * 物理カードのグレードアップをリクエストするAPI。
 * RTを消費し、承認待ちの問い合わせとして記録する（承認はMastermind/Chief Officerが行う）。
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { tier } = parsed.data;
    const spec = TIERS[tier];

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (spec.price > 0) {
      try {
        await executeRTTransaction(session.user.id, -spec.price, "spend", `Card upgrade request: ${spec.name}`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message || "RTが不足しています。" }, { status: 400 });
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: user.name ?? "Unknown",
        email: user.email ?? "unknown@hexacard.internal",
        subject: `【物理カード変更申請】${spec.name}`,
        message: `ユーザー ${user.name} (${user.email}) が ${spec.name} (${spec.price} RT) への物理カード変更を申請しました。承認後、製造・発送プロセスを開始してください。`,
        status: "pending",
      },
    });

    sendDiscordNotification(
      `【HXC監視局】物理カード変更申請を受信。\n` +
      `■ ユーザー: ${user.name} (${user.email})\n` +
      `■ 希望グレード: ${spec.name}\n` +
      `■ コスト: ${spec.price} RT`
    ).catch((error: unknown) => logger.warn("Discord notify failed for card upgrade request", { error }));

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Card upgrade request error", { error: message });
    return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
  }
}
