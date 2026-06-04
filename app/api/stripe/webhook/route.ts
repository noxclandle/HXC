import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendAdminOrderNotification } from "@/lib/mail";
import { sendDiscordNotification } from "@/lib/discord";

export const dynamic = "force-dynamic";


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
      const type = session.metadata?.type;

      if (type === "rt_purchase") {
        const userId = session.metadata?.userId;
        const rtAmount = parseInt(session.metadata?.rtAmount || "0");

        if (userId && rtAmount > 0) {
          const { executeRTTransaction } = await import("@/lib/rt/engine");
          await executeRTTransaction(
            userId,
            rtAmount,
            "earn",
            `Stripe RT Purchase (Session: ${session.id})`
          );
          
          await sendDiscordNotification(`【HXC監視局】RTチャージを検知。ユーザーID: ${userId}, 付与RT: ${rtAmount}`);
          console.log(`Successfully granted ${rtAmount} RT to user ${userId} via executeRTTransaction`);
        }
        return NextResponse.json({ received: true });
      }

      // 既存の物理カード注文ロジック
      const customerEmail = session.metadata?.custom_email || session.customer_details?.email || "";
      const customerName = session.metadata?.custom_name || session.customer_details?.name || "Unknown";
      const customerPhone = session.metadata?.custom_phone || session.customer_details?.phone || "-";
      const customerHandle = session.metadata?.custom_handle || "";
      
      const shippingAddress = (session as any).shipping_details?.address || {};

      const tier = session.metadata?.tier || "unknown";
      const variant = session.metadata?.variant || "";
      const price = session.amount_total || 0;

      // 1. Create the order
      const newOrder = await prisma.order.create({
        data: {
          stripe_session_id: session.id,
          tier,
          variant,
          price,
          customer_email: customerEmail,
          customer_name: customerName,
          shipping_address: {
            ...shippingAddress,
            custom_phone: customerPhone,
            custom_handle: customerHandle,
            stripe_name: session.customer_details?.name // Stripe側の名義も念のため保存
          } as any,
          status: "paid",
        },
      });

      // 1.5 Notify admin via email
      try {
        await sendAdminOrderNotification({
          id: newOrder.id,
          customerName,
          customerEmail,
          tier,
          variant,
          price: price / 1,
          shippingAddress: shippingAddress,
        });
        
        // Discord Notification
        await sendDiscordNotification(`【HXC監視局】新規注文を検知。プラン: ${tier}, バリアント: ${variant}, 顧客: ${customerName}\n配送先: ${shippingAddress.postal_code || ""} ${shippingAddress.state || ""}${shippingAddress.city || ""}${shippingAddress.line1 || ""}`);
      } catch (mailError) {
        console.error("Failed to send admin mail:", mailError);
      }

      // 2. If it's an Apex tier, try to automatically grant black_member role
      if (tier === "Apex" && customerEmail) {
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
