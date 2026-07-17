import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const APEX_TOTAL_SLOTS = 10;

let cachedUserCount: number | null = null;
let cachedApexSold: number | null = null;
let cacheExpiry = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedUserCount !== null && cachedApexSold !== null && now < cacheExpiry) {
      return NextResponse.json({
        userCount: cachedUserCount,
        apexSold: cachedApexSold,
        apexRemaining: Math.max(APEX_TOTAL_SLOTS - cachedApexSold, 0),
      });
    }

    const [userCount, apexSold] = await Promise.all([
      prisma.user.count(),
      prisma.order.count({ where: { tier: "Apex", status: "paid" } }),
    ]);
    cachedUserCount = userCount;
    cachedApexSold = apexSold;
    cacheExpiry = now + 60000; // Cache for 1 minute

    return NextResponse.json({
      userCount,
      apexSold,
      apexRemaining: Math.max(APEX_TOTAL_SLOTS - apexSold, 0),
    });
  } catch (error: unknown) {
    logger.error("Public stats error", { error });
    return NextResponse.json({
      userCount: cachedUserCount || 0,
      apexSold: cachedApexSold || 0,
      apexRemaining: Math.max(APEX_TOTAL_SLOTS - (cachedApexSold || 0), 0),
    });
  }
}
