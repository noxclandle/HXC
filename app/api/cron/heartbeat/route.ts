import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * 境界の覚醒 (Heartbeat)
 * データベースが休止（スリープ）するのを防ぐための定期アクセス用
 */
export async function GET(req: NextRequest) {
  try {
    // 最小限のクエリでDBを叩く
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "Awakened",
      resonance: true,
      timestamp: new Date().toISOString(),
      entities: userCount
    });
  } catch (error) {
    logger.error("Heartbeat sync failed", { error });
    return NextResponse.json({ status: "Silenced", resonance: false }, { status: 500 });
  }
}
