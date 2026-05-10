import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const count = await prisma.report.count({
      where: { status: "pending" }
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Report count error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
