import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const count = await prisma.inquiry.count({
      where: { status: "pending" }
    });

    return NextResponse.json({ count });
  } catch (error: unknown) {
    console.error("Inquiry count error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
