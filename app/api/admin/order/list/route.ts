import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    logger.error("Order List Fetch Error", { error });
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
