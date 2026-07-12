import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { clearNewsCache } from "@/lib/news-cache";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const deleteNewsSchema = z.object({
  id: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = deleteNewsSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { id } = parsed.data;

    await prisma.announcement.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "BROADCAST_PURGED",
        details: { id }
      }
    });

    // Clear public news cache
    clearNewsCache();

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("News delete error", { error: message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
