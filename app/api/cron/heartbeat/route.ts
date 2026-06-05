import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * システムを「起こし続ける」ためのエンドポイント
 * Vercel Cron Jobs 等から定期的に叩くことで、Serverless Function と DB のスリープを防ぐ
 */
export async function GET() {
  const start = Date.now();
  
  try {
    // 1. DBに極めて軽量なクエリを投げて、DB接続を維持する
    await prisma.$queryRaw`SELECT 1`;
    
    // 2. システムログ（オプション）
    // console.log(`[HEARTBEAT] System is awake. Latency: ${Date.now() - start}ms`);

    return NextResponse.json({ 
      status: "alive", 
      timestamp: new Date().toISOString(),
      latency: `${Date.now() - start}ms`
    });
  } catch (error) {
    console.error("[HEARTBEAT] Wakeup failed:", error);
    return NextResponse.json({ status: "error", message: "Failed to wake up DB" }, { status: 500 });
  }
}
