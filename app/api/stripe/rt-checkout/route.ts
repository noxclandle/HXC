import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
const isMock = stripeKey === "sk_test_mock";

const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-04-22.dahlia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packId } = await req.json();

    const RT_PACKS: Record<string, { price: number, rt: number, label: string }> = {
      "rt_small": { price: 1000, rt: 2000, label: "Seed Infusion" },
      "rt_medium": { price: 5000, rt: 11000, label: "Orbital Surge" },
      "rt_large": { price: 10000, rt: 23000, label: "Primordial Pulse" },
    };

    const pack = RT_PACKS[packId];

    if (!pack) {
      return NextResponse.json({ error: "Invalid pack ID" }, { status: 400 });
    }

    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `HXC Relation Tokens - ${pack.label}`,
              description: `${pack.rt.toLocaleString()} RT Infusion`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/inventory?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/inventory`,
      metadata: {
        type: "rt_purchase",
        userId: sessionUser.user.id,
        rtAmount: pack.rt.toString(),
        packId: packId
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("RT Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
