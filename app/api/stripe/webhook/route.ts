import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2026-04-22.dahlia" as any,
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
      const shippingAddress = (session as any).shipping_details?.address || {};

      const tier = session.metadata?.tier || "unknown";
      const variant = session.metadata?.variant || "";
      const price = session.amount_total || 0;

      // 1. Create the order
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

      // 2. If it's an Apex Black tier, try to automatically grant black_member role
      if (tier === "Apex Black" && customerEmail) {
        const existingUser = await prisma.user.findUnique({
          where: { email: customerEmail }
        });

        if (existingUser) {
          const currentAssets = (existingUser.owned_assets as string[]) || [];
          const currentTitles = (existingUser.unlocked_titles as string[]) || [];
          
          const newAssets = Array.from(new Set([...currentAssets, "ImperialGold"]));
          const newTitles = Array.from(new Set([...currentTitles, "APEX"]));

          await prisma.user.update({
             where: { id: existingUser.id },
             data: { 
               role: 'black_member',
               owned_assets: newAssets,
               unlocked_titles: newTitles
             }
          });
          console.log(`Automatically upgraded user ${existingUser.email} to black_member and granted exclusive assets.`);
        }
      }

      console.log(`Successfully processed session: ${session.id}`);
    } catch (dbError) {
      console.error("Failed to save order to database:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
