import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
const isMock = stripeKey === "sk_test_mock";

const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-04-22.dahlia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { tier, variant } = await req.json();

    if (!tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 厳格な価格マッピング
    const PRICE_MAP: Record<string, number> = {
      "Standard": 5000,
      "Executive": 30000,
      "Apex": 1000000
    };

    const numericPrice = PRICE_MAP[tier];

    if (!numericPrice) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // もし本番/テスト用の正しいAPIキーが設定されていない場合は、Stripe通信をバイパスして成功画面へ
    if (isMock) {
      console.log("Mocking Stripe Checkout. Redirecting to success page.");
      // 強制的にローカルの3000ポートへリダイレクト（環境変数のキャッシュ等による3001への誤爆を防ぐため）
      const baseUrl = "http://localhost:3000";
      return NextResponse.json({ url: `${baseUrl}/purchase/success?session_id=mock_session_${Date.now()}` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `HXC Physical Card - ${tier} Edition`,
              description: `Variant: ${variant || 'Standard'}`,
            },
            unit_amount: numericPrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["JP"], // Restrict shipping to Japan for now
      },
      custom_fields: [
        {
          key: "customer_name",
          label: {
            type: "custom",
            custom: "フルネーム（配送用）",
          },
          type: "text",
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/purchase`,
      metadata: {
        tier,
        variant,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
