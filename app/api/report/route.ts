import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { targetUserId, reason } = await req.json();

    if (!targetUserId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "Target identity not found" }, { status: 404 });
    }

    const report = await prisma.report.create({
      data: {
        reporter_id: session?.user?.id || null, // 匿名通報も許容
        target_user_id: targetUserId,
        reason: reason,
        status: "pending"
      }
    });

    return NextResponse.json({ success: true, reportId: report.id });

  } catch (error: any) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
