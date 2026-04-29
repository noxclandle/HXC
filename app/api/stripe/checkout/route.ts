import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const { tier, variant, price } = await req.json();

    if (!tier || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Replace ¥ and commas, then convert to number
    const numericPrice = parseInt(price.replace(/¥|,/g, ""), 10);

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
