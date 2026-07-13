import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

let cachedUserCount: number | null = null;
let cachedUserCountExpiry = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedUserCount !== null && now < cachedUserCountExpiry) {
      return NextResponse.json({ userCount: cachedUserCount });
    }

    const userCount = await prisma.user.count();
    cachedUserCount = userCount;
    cachedUserCountExpiry = now + 60000; // Cache for 1 minute

    return NextResponse.json({ userCount });
  } catch (error: unknown) {
    logger.error("Public stats error", { error });
    return NextResponse.json({ userCount: cachedUserCount || 0 });
  }
}
