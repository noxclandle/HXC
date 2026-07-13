import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * 自分自身の月次アクティビティレポートを取得するAPI
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { unlocked_titles: true },
    });

    const [newConnections, resonanceCount, monthlyContacts] = await Promise.all([
      prisma.contact.count({
        where: { owner_id: userId, created_at: { gte: monthStart } },
      }),
      prisma.resonanceLink.count({
        where: {
          status: "connected",
          updated_at: { gte: monthStart },
          OR: [{ requester_id: userId }, { target_id: userId }],
        },
      }),
      prisma.contact.findMany({
        where: { owner_id: userId, created_at: { gte: monthStart } },
        select: { ai_tags: true },
      }),
    ]);

    // 今月最も多く付与されたタグを算出（データが無ければ null）
    const tagCounts = new Map<string, number>();
    for (const c of monthlyContacts) {
      const tags = Array.isArray(c.ai_tags) ? (c.ai_tags as unknown[]) : [];
      for (const t of tags) {
        if (typeof t === "string") tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
      }
    }
    let topTag: string | null = null;
    let topTagCount = 0;
    for (const [tag, count] of tagCounts) {
      if (count > topTagCount) {
        topTag = tag;
        topTagCount = count;
      }
    }

    // 直近4週間の新規コンタクト数（週次）
    const weeklyGrowth: number[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekEnd = new Date(now.getTime() - i * WEEK_MS);
      const weekStart = new Date(weekEnd.getTime() - WEEK_MS);
      const count = await prisma.contact.count({
        where: { owner_id: userId, created_at: { gte: weekStart, lt: weekEnd } },
      });
      weeklyGrowth.push(count);
    }

    return NextResponse.json({
      month: now.toLocaleDateString("ja-JP", { year: "numeric", month: "long" }),
      newConnections,
      resonanceCount,
      totalTitles: ((user?.unlocked_titles as string[]) || []).length,
      unlockedTitles: (user?.unlocked_titles as string[]) || [],
      weeklyGrowth,
      topTag,
      topTagCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Monthly report fetch error", { error: message });
    return NextResponse.json({ error: "Failed to fetch report." }, { status: 500 });
  }
}
