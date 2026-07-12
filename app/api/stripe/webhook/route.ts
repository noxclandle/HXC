import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendAdminOrderNotification, sendCustomerOrderNotification } from "@/lib/mail";
import { sendDiscordNotification } from "@/lib/discord";
import { logger } from "@/lib/logger";

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Webhook signature verification failed.", { error: message });
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
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
          
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true }
          });
          const userIdentifier = user ? `${user.name || "不明"} (${user.email || "メールなし"})` : "不明";
          await sendDiscordNotification(`【HXC監視局】RTチャージを検知。ユーザー: ${userIdentifier} (ID: ${userId}), 付与RT: ${rtAmount}`);
          console.log(`Successfully granted ${rtAmount} RT to user ${userId} via executeRTTransaction`);
        }
        return NextResponse.json({ received: true });
      }

      // 既存の物理カード注文ロジック
      const customerEmail = session.metadata?.custom_email || session.customer_details?.email || "";
      const customerName = session.metadata?.custom_name || session.customer_details?.name || "Unknown";
      const customerPhone = session.metadata?.custom_phone || session.customer_details?.phone || "-";
      const customerHandle = session.metadata?.custom_handle || "";
      
      // このバージョンのStripe型定義には shipping_details が含まれないため、実行時の形状に合わせて最小限の型を当てる
      const shippingAddress =
        (session as unknown as { shipping_details?: { address?: Record<string, string> } })
          .shipping_details?.address || {};

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
          } as Prisma.InputJsonValue,
          status: "paid",
        },
      });

      // 1.2 紹介システム（レフェラル）のトランザクション処理
      const referrerId = session.metadata?.referrerId;
      if (referrerId) {
        try {
          // 二重付与防止の事前チェック (Idempotency check)
          const existingReferralTx = await prisma.rTTransaction.findFirst({
            where: {
              description: {
                contains: `Referral bonus for Session: ${session.id}`
              }
            }
          });

          if (!existingReferralTx) {
            // 紹介者がデータベースに存在するか検証
            const referrer = await prisma.user.findUnique({
              where: { id: referrerId }
            });

            if (referrer) {
              // トランザクションで安全に実行 (並行実行によるズレを防ぐため、ブロック内でも再確認)
              await prisma.$transaction(async (tx) => {
                const doubleCheckTx = await tx.rTTransaction.findFirst({
                  where: {
                    description: {
                      contains: `Referral bonus for Session: ${session.id}`
                    }
                  }
                });

                if (doubleCheckTx) {
                  console.log(`[Referral] Duplicate prevention triggered inside transaction for session ${session.id}`);
                  return;
                }

                // A. 紹介者に2000 RTの付与ログを作成
                await tx.rTTransaction.create({
                  data: {
                    user_id: referrer.id,
                    amount: 2000,
                    type: "REFERRAL_BONUS",
                    description: `Referral bonus for Session: ${session.id} (Buyer: ${customerEmail})`
                  }
                });

                // B. 紹介者の残高(+2000 RT)とEXP(+300 EXP)をアトミックに加算
                await tx.user.update({
                  where: { id: referrer.id },
                  data: {
                    rt_balance: {
                      increment: 2000
                    },
                    exp: {
                      increment: 300
                    }
                  }
                });

                // C. 30人紹介のレジェンダリー称号獲得判定 (紹介トランザクション数で集計するため、カラムズレが絶対に起きない)
                const referralCount = await tx.rTTransaction.count({
                  where: {
                    user_id: referrer.id,
                    type: "REFERRAL_BONUS"
                  }
                });

                if (referralCount >= 30) {
                  const currentTitles = (referrer.unlocked_titles as string[]) || [];
                  if (!currentTitles.includes("Resonance Catalyst")) {
                    const newTitles = [...currentTitles, "Resonance Catalyst"];
                    await tx.user.update({
                      where: { id: referrer.id },
                      data: {
                        unlocked_titles: newTitles
                      }
                    });
                    console.log(`[Referral] Referrer ${referrer.email} unlocked Legendary Title: Resonance Catalyst`);
                  }
                }
              });
              console.log(`[Referral] Successfully processed 2,000 RT and 300 EXP referral bonus to ${referrer.email} for session ${session.id}`);
            } else {
              console.warn(`[Referral] Referrer ID ${referrerId} not found in database for session ${session.id}`);
            }
          } else {
            console.log(`[Referral] Referral bonus already processed for session ${session.id}`);
          }
        } catch (referralError) {
          console.error("[Referral] Error processing referral bonus:", referralError);
          // 紹介処理のエラーで全体の注文処理(Webhook)を落とさないようキャッチするが、ログには残す
        }
      }

      // 1.5 Notify admin and customer via email
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

        if (customerEmail) {
          await sendCustomerOrderNotification({
            customerEmail,
            customerName,
            tier,
            variant,
            price: price / 1,
          });
        }
        
        // Discord Notification
        await sendDiscordNotification(
          `【HXC監視局】新規注文を検知。\n` +
          `■ プラン: ${tier}\n` +
          `■ バリアント: ${variant || "なし"}\n` +
          `■ 顧客氏名: ${customerName}\n` +
          `■ 顧客メール: ${customerEmail}\n` +
          `■ 顧客電話: ${customerPhone}\n` +
          `■ 配送先: ${shippingAddress.postal_code || ""} ${shippingAddress.state || ""}${shippingAddress.city || ""}${shippingAddress.line1 || ""} ${shippingAddress.line2 || ""}`
        );
      } catch (mailError) {
        console.error("Failed to send notification mails:", mailError);
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
