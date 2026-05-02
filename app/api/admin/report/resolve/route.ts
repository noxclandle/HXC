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

    const { id } = await req.json();

    const updated = await prisma.report.update({
      where: { id },
      data: { status: "resolved" }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "REPORT_RESOLVED",
        details: { id }
      }
    });

    return NextResponse.json({ success: true, status: updated.status });

  } catch (error: any) {
    console.error("Report resolve error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
