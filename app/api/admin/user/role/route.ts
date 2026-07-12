import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TITLES } from "@/lib/game/titles";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.string().min(1),
  grantChiefTitle: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // 権限チェック: Mastermind の称号を持つ者のみが Role を変更可能とする
    const caller = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" }
    });

    const callerTitles = (caller?.unlocked_titles as string[]) || [];
    if (!callerTitles.includes(TITLES.MASTERMIND)) {
      return NextResponse.json({ error: "Forbidden: Mastermind Authority Required" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = updateRoleSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { userId, role, grantChiefTitle } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const currentTitles = (user.unlocked_titles as string[]) || [];
    let updatedTitles = [...currentTitles];

    if (grantChiefTitle && !updatedTitles.includes(TITLES.CHIEF)) {
      updatedTitles.push(TITLES.CHIEF);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role,
        unlocked_titles: updatedTitles
      }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session?.user?.id || null,
        action: "AUTHORITY_UPDATED",
        details: { targetUserId: userId, newRole: role, grantChief: grantChiefTitle }
      }
    });

    return NextResponse.json({ success: true, role: updatedUser.role, titles: updatedUser.unlocked_titles });

  } catch (error: any) {
    logger.error("Role update error", { error: error?.message || String(error) });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
