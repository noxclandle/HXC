import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDiscordNotification } from "@/lib/discord";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  role: z.string().optional().or(z.literal("")),
  coord_x: z.number().optional(),
  coord_y: z.number().optional(),
});

/**
 * 送信ハンドラー (セッションがある場合はLibrary用Contact作成、ない場合はInquiry作成)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (session?.user?.id) {
      // メンバーのカメラ・ライブラリ保存
      const result = contactSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: "Invalid contact request", details: result.error.format() }, { status: 400 });
      }

      const { name, email, phone, address, notes, role, coord_x, coord_y } = result.data;

      const contact = await prisma.contact.create({
        data: {
          owner_id: session.user.id,
          name,
          handle_name: role || null, // スキャンされた肩書（Role）をハンドル名として保存
          email: email || null,
          phone: phone || null,
          address: address || null,
          notes: notes || null,
          coord_x: coord_x !== undefined ? coord_x : null,
          coord_y: coord_y !== undefined ? coord_y : null,
          ai_tags: [],
        },
      });

      return NextResponse.json({ success: true, id: contact.id });
    } else {
      // 一般問い合わせ
      const result = inquirySchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: "Invalid inquiry request", details: result.error.format() }, { status: 400 });
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
    }
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
