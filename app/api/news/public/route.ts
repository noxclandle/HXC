import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCachedNews, setCachedNews } from "@/lib/news-cache";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

type PublicAnnouncement = Prisma.AnnouncementGetPayload<{
  select: { id: true; title: true; type: true; created_at: true };
}>;

/**
 * Public News API - No authentication required for SEO crawlers and guests.
 */
export async function GET() {
  try {
    const cached = getCachedNews<PublicAnnouncement>();
    if (cached !== null) {
      return NextResponse.json(cached);
    }

    const announcements = await prisma.announcement.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        created_at: true,
      }
    });

    setCachedNews(announcements);

    return NextResponse.json(announcements);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Public news list fetch error", { error: message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
