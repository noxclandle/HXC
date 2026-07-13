import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { kv } from "@vercel/kv";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const lockdownSchema = z.object({
  enabled: z.boolean(),
});

/**
 * 【管理者限定】システム全体の緊急ロックダウンを切り替えるAPI。
 * middleware.ts がこのフラグを見て、管理者以外のアクセスを遮断する。
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = lockdownSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { enabled } = parsed.data;
    await kv.set("system_lockdown", enabled);

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: enabled ? "SYSTEM_LOCKDOWN_ENABLED" : "SYSTEM_LOCKDOWN_DISABLED",
        details: {},
      },
    });

    return NextResponse.json({ success: true, lockdown: enabled });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Lockdown toggle error", { error: message });
    return NextResponse.json({ error: "Failed to toggle lockdown." }, { status: 500 });
  }
}
