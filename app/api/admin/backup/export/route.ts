import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * データベースの重要データをJSON形式でエクスポートするAPI
 * 管理者限定。バックアップ用。
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [users, orders, inquiries, reports] = await Promise.all([
      prisma.user.findMany(),
      prisma.order.findMany(),
      prisma.inquiry.findMany(),
      prisma.report.findMany(),
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      data: {
        users,
        orders,
        inquiries,
        reports
      }
    };

    return NextResponse.json(backupData, {
      headers: {
        "Content-Disposition": `attachment; filename="hxc_backup_${new Date().toISOString().split('T')[0]}.json"`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Backup Export Error:", error);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}
