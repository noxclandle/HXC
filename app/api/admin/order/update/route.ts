import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { z } from "zod";
import { sendCustomerShipmentNotification } from "@/lib/mail";

export const dynamic = "force-dynamic";

const orderUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["paid", "shipped", "cancelled", "completed"]),
  card_uid: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = orderUpdateSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json({ error: "Invalid order data.", details: body.error.format() }, { status: 400 });
    }

    const { id, status, card_uid } = body.data;

    const updateData: any = { status };
    if (status === "shipped") {
      updateData.shipped_at = new Date();
    }
    if (card_uid) {
      updateData.card_uid = card_uid;
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: updateData,
      });

      if (card_uid) {
        await tx.card.update({
          where: { uid: card_uid },
          data: { status: "shipped" }
        });
      }

      return order;
    });

    if (status === "shipped") {
      try {
        await sendCustomerShipmentNotification(updatedOrder.customer_email, updatedOrder.customer_name);
      } catch (mailError) {
        console.error("Failed to send shipment confirmation email:", mailError);
      }
    }

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "ORDER_UPDATED",
        details: { id, status, card_uid }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
