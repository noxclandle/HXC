import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const announcements = await prisma.announcement.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error("Public news error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { last_read_news_at: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mark news read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
