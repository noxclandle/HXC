import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";


const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
const isMock = stripeKey === "sk_test_mock";

const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-04-22.dahlia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { tier, variant, customerDetails, referrerId } = await req.json();

    if (!tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 厳格な価格マッピング
    const PRICE_MAP: Record<string, number> = {
      "Standard": 3000,
      "Executive": 10000,
      "Apex": 1000000,
      "Corporate": 580000
    };

    const numericPrice = PRICE_MAP[tier];

    if (!numericPrice) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Base URL for redirects
    const baseUrl = getBaseUrl();

    // もし本番/テスト用の正しいAPIキーが設定されていない場合は、Stripe通信をバイパスして成功画面へ
    if (isMock) {
      console.log("Mocking Stripe Checkout. Creating record and redirecting.");
      const mockSessionId = `mock_session_${Date.now()}`;
      
      // テスト用にDBに注文レコードを作成
      await prisma.order.create({
        data: {
          stripe_session_id: mockSessionId,
          tier: tier,
          variant: variant || "Original",
          price: numericPrice,
          customer_email: customerDetails?.email || "test@example.com",
          customer_name: customerDetails?.name || "テストユーザー",
          shipping_address: {
            postal_code: "150-0001",
            state: "東京都",
            city: "渋谷区",
            line1: "神宮前1-2-3",
            line2: "ヘキサビル 6F"
          } as any,
          status: "paid",
        },
      });

      // ローカルテスト用に紹介システムをモック実行 (ポイント整合性の検証用)
      if (referrerId) {
        const referrer = await prisma.user.findUnique({
          where: { id: referrerId }
        });
        if (referrer) {
          await prisma.$transaction(async (tx) => {
            // A. 紹介者に3000 RTを付与
            await tx.rTTransaction.create({
              data: {
                user_id: referrer.id,
                amount: 3000,
                type: "REFERRAL_BONUS",
                description: `Mock Referral bonus for Session: ${mockSessionId} (Buyer: ${customerDetails?.email || "test@example.com"})`
              }
            });

            // B. 残高の加算
            await tx.user.update({
              where: { id: referrer.id },
              data: {
                rt_balance: {
                  increment: 3000
                }
              }
            });

            // C. 30人紹介によるレジェンダリー称号チェック
            const referralCount = await tx.rTTransaction.count({
              where: {
                user_id: referrer.id,
                type: "REFERRAL_BONUS"
              }
            });

            if (referralCount >= 30) {
              const currentTitles = (referrer.unlocked_titles as string[]) || [];
              if (!currentTitles.includes("Resonance Catalyst")) {
                await tx.user.update({
                  where: { id: referrer.id },
                  data: {
                    unlocked_titles: [...currentTitles, "Resonance Catalyst"]
                  }
                });
              }
            }
          });
          console.log(`[Mock Referral] Successfully processed 3,000 RT referral bonus to ${referrer.email}`);
        }
      }

      return NextResponse.json({ url: `${baseUrl}/purchase/success?session_id=${mockSessionId}` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerDetails?.email, // フォームからの入力を優先
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
        allowed_countries: ["JP"],
      },
      success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/purchase`,
      metadata: {
        tier,
        variant,
        custom_name: customerDetails?.name,
        custom_handle: customerDetails?.handle,
        custom_phone: customerDetails?.phone,
        custom_email: customerDetails?.email,
        referrerId: referrerId || ""
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
