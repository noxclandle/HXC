import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const grantTitleSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(64),
});

/**
 * 【管理者限定】任意の称号をユーザーに直接付与するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = grantTitleSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { userId, title } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const currentTitles = (user.unlocked_titles as string[]) || [];
    if (currentTitles.includes(title)) {
      return NextResponse.json({ success: true, titles: currentTitles, alreadyHad: true });
    }

    const updatedTitles = [...currentTitles, title];
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { unlocked_titles: updatedTitles },
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "TITLE_BESTOWED",
        details: { targetUserId: userId, title },
      },
    });

    return NextResponse.json({ success: true, titles: updatedUser.unlocked_titles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Title grant error", { error: message });
    return NextResponse.json({ error: "Failed to bestow title." }, { status: 500 });
  }
}
