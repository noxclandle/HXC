import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Public News API - No authentication required for SEO crawlers and guests.
 */
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        created_at: true,
        // We don't send the full content for the list to keep it lightweight
      }
    });

    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error("Public news list fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
