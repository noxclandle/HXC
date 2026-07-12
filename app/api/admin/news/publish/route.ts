import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { z } from "zod";
import { clearNewsCache } from "@/lib/news-cache";

export const dynamic = "force-dynamic";


const newsSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  type: z.enum(["update", "event", "maintenance", "broadcast"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = newsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid data format", details: parseResult.error.format() }, { status: 400 });
    }

    const { title, content, type } = parseResult.data;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || "update",
        is_published: true
      }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "BROADCAST_PUBLISHED",
        details: { id: announcement.id, title: announcement.title }
      }
    });

    // Clear public news cache
    clearNewsCache();

    return NextResponse.json({ success: true, announcement });

  } catch (error: unknown) {
    console.error("News publish error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
