import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2026-04-22.dahlia" as any,
});

const ALIAS_UNLOCK_PRICE_JPY = 2000;

/**
 * 別名プロフィール機能（alias_name）の解放を購入するAPI
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.is_alias_unlocked) {
      return NextResponse.json({ error: "既に解放済みです。" }, { status: 400 });
    }

    const baseUrl = getBaseUrl();

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: "Alias Profile Activation / 別名プロフィール機能の解放",
              description: "偽名の結界（別名名刺機能）の解放",
            },
            unit_amount: ALIAS_UNLOCK_PRICE_JPY,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/settings?alias_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        type: "alias_unlock",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Alias checkout error", { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
