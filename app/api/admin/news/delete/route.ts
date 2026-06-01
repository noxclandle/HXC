import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();

    await prisma.announcement.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "BROADCAST_PURGED",
        details: { id }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("News delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
