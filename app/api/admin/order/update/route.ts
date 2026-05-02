import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["mastermind", "chief_officer", "architect"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "ORDER_STATUS_UPDATED",
        details: { id, status }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
