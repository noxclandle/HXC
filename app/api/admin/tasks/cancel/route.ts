import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const cancelTaskSchema = z.object({
  id: z.string().min(1),
});

/**
 * 【管理者限定】未実行の予約タスクをキャンセルする
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = cancelTaskSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { id } = parsed.data;

    const task = await prisma.scheduledTask.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (task.status !== "pending") {
      return NextResponse.json({ error: "既に実行済み、またはキャンセル済みのタスクです。" }, { status: 400 });
    }

    await prisma.scheduledTask.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "SCHEDULED_TASK_CANCELLED",
        details: { taskId: id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Cancel scheduled task error", { error: message });
    return NextResponse.json({ error: "Failed to cancel task." }, { status: 500 });
  }
}
