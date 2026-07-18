import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const equipSchema = z.object({
  equipped: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null(), z.record(z.string(), z.string())])
  ).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = equipSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const equipped = parsed.data.equipped || {};

    const keys = Object.keys(equipped);
    let expEarned = 0;

    // 1. Fetch user outside of a transaction to keep connections lightweight
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentEquipped = (user.equipped_assets as any) || {};

    // 2. Perform audit log checks without locking database transactions
    for (const key of keys) {
      const assetValue = equipped[key];
      if (assetValue) {
        // Skip check if it is a helper setting like orientation, aligns, colors (only log actual unlocked assets)
        if (["orientation", "hAlign", "vAlign", "textColor", "textColorMode"].includes(key)) {
          continue;
        }

        const isEquippedBefore = await prisma.auditLog.findFirst({
          where: {
            user_id: user.id,
            action: `equip_asset_${assetValue}`
          }
        });

        if (!isEquippedBefore) {
          await prisma.auditLog.create({
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

    // 3. Atomically update the user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: {
        equipped_assets: {
          ...currentEquipped,
          ...equipped
        },
        exp: expEarned > 0 ? { increment: expEarned } : undefined
      }
    });

    return NextResponse.json({ success: true, equipped: updatedUser.equipped_assets });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Equip update error", { error: message });
    return NextResponse.json({ error: "Failed to synchronize treasury." }, { status: 500 });
  }
}
