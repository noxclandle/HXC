import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";


const reportSchema = z.object({
  targetUserId: z.string().min(1, "Target User ID is required"),
  reason: z.string().min(1, "Reason is required"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parseResult = reportSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request", details: parseResult.error.format() }, { status: 400 });
    }

    const { targetUserId, reason } = parseResult.data;

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
