import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // カスタムフィールドから名前を取得
      const customNameField = session.custom_fields?.find((f) => f.key === "customer_name");
      const customerName = customNameField?.text?.value || session.customer_details?.name || "Unknown";
      
      const customerEmail = session.customer_details?.email || "";
      const shippingAddress = session.shipping_details?.address || {};

      const tier = session.metadata?.tier || "unknown";
      const variant = session.metadata?.variant || "";
      const price = session.amount_total || 0;

      await prisma.order.create({
        data: {
          stripe_session_id: session.id,
          tier,
          variant,
          price,
          customer_email: customerEmail,
          customer_name: customerName,
          shipping_address: shippingAddress as any,
          status: "paid",
        },
      });

      console.log(`Successfully created order for session: ${session.id}`);
    } catch (dbError) {
      console.error("Failed to save order to database:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
