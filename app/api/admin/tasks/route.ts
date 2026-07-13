import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const createTaskSchema = z.object({
  rank: z.string().optional(),
  amount: z.coerce.number().int().optional(),
  message: z.string().optional(),
  scheduledAt: z.string().datetime(),
});

/**
 * 【管理者限定】予約された Mass Grace タスクの一覧取得
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tasks = await prisma.scheduledTask.findMany({
      where: { action: "MASS_GRACE" },
      orderBy: { scheduled_at: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error: unknown) {
    logger.error("Fetch scheduled tasks error", { error });
    return NextResponse.json({ error: "Failed to fetch tasks." }, { status: 500 });
  }
}

/**
 * 【管理者限定】予約 Mass Grace タスクの新規作成
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = createTaskSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { rank, amount, message, scheduledAt } = parsed.data;
    if (!amount && !message) {
      return NextResponse.json({ error: "amount または message のいずれかが必要です。" }, { status: 400 });
    }

    const task = await prisma.scheduledTask.create({
      data: {
        action: "MASS_GRACE",
        payload: { rank: rank || "All", amount, message },
        scheduled_at: new Date(scheduledAt),
      },
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "SCHEDULED_TASK_CREATED",
        details: { taskId: task.id, rank, amount, scheduledAt },
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Create scheduled task error", { error: message });
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 });
  }
}
