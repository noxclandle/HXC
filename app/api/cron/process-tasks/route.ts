import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeRTTransaction } from "@/lib/rt/engine";

/**
 * 予約されたタスクを処理する定期実行API
 */
export async function POST(req: NextRequest) {
  try {
    const tasks = await prisma.scheduledTask.findMany({
      where: {
        status: "pending",
        scheduled_at: { lte: new Date() }
      }
    });

    for (const task of tasks) {
      const { rank, amount, message } = task.payload as any;

      const users = await prisma.user.findMany({
        where: rank && rank !== "All" ? { rank } : { role: "member" },
        select: { id: true }
      });

      for (const user of users) {
        try {
          if (amount) {
            await executeRTTransaction(user.id, amount, "earn", `Scheduled Grace: ${message || "Gift"}`);
          }
          if (message) {
            await prisma.chatMessage.create({
              data: { user_id: user.id, role: "agent", text: `【予約布告】チーフオフィサーより： 「${message}」` }
            });
          }
        } catch (e) { console.error(`Task execution failed for user ${user.id}`, e); }
      }

      await prisma.scheduledTask.update({
        where: { id: task.id },
        data: { status: "completed", executed_at: new Date() }
      });
    }

    return NextResponse.json({ success: true, executedCount: tasks.length });
  } catch (error) {
    return NextResponse.json({ error: "Task processor failed." }, { status: 500 });
  }
}
