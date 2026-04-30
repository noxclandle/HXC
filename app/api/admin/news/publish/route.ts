import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["mastermind", "chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, content, type } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || "update",
        is_published: true
      }
    });

    return NextResponse.json({ success: true, announcement });

  } catch (error: any) {
    console.error("News publish error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
