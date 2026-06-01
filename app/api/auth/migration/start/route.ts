import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";


/**
 * 端末移行用のハンドシェイクを開始する
 * 1回限りの移行トークンを発行
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const migrationToken = crypto.randomBytes(16).toString("hex");
    
    // 短期間有効なタスクとして保存（ScheduledTaskを一時的に転用または別途テーブルを用意）
    // ここでは簡易的に、1回限りの移行キーとして扱う
    await prisma.scheduledTask.create({
      data: {
        action: "IDENTITY_MIGRATION",
        payload: { userId, migrationToken },
        scheduled_at: new Date(Date.now() + 5 * 60 * 1000), // 5分間有効
      }
    });

    return NextResponse.json({ success: true, migrationToken });
  } catch (error: any) {
    return NextResponse.json({ error: "Migration start failed" }, { status: 500 });
  }
}
