import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDiscordNotification } from "@/lib/discord";
import { z } from "zod";

export const dynamic = "force-dynamic";


const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

/**
 * 問い合わせの送信
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
    }

    const { name, email, subject, message } = result.data;

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject: subject || "No Subject",
        message,
        status: "pending",
      },
    });

    // Discord Notification
    await sendDiscordNotification(
      `【HXC監視局】新規問い合わせを受信。\n` +
      `■ 名前: ${name}\n` +
      `■ メールアドレス: ${email}\n` +
      `■ 件名: ${subject || "なし"}\n` +
      `■ 本文:\n${message}`
    );

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error("Inquiry Submission Error:", error);
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}
