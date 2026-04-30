import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["mastermind", "chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { created_at: "desc" },
    });

    // ターゲットユーザーの名前を別途取得（またはリレーションを貼るのが望ましいが現状は手動）
    const targetIds = reports.map(r => r.target_user_id);
    const users = await prisma.user.findMany({
      where: { id: { in: targetIds } },
      select: { id: true, name: true }
    });

    const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));

    const richReports = reports.map(r => ({
      ...r,
      targetName: userMap[r.target_user_id] || "Unknown",
      targetId: r.target_user_id
    }));

    return NextResponse.json(richReports);
  } catch (error: any) {
    console.error("Report list error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
