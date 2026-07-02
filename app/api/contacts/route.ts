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
  email: z.string().optional().or(z.literal("")),
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

      // トランザクションで名刺作成とEXP加算を同時に行う
      const contact = await prisma.$transaction(async (tx) => {
        const newContact = await tx.contact.create({
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

        // 名刺をライブラリに追加したユーザーに +30 EXP を付与
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            exp: { increment: 30 }
          }
        });

        return newContact;
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

const contactUpdateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().optional().or(z.literal("")), // メールアドレス形式チェックを緩和し、OCRや不完全入力での保存失敗を防止
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  role: z.string().optional().or(z.literal("")),
});

/**
 * 連絡先更新ハンドラー (所有権チェック付き)
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = contactUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid contact request", details: result.error.format() }, { status: 400 });
    }

    const { id, name, email, phone, address, notes, role } = result.data;

    const existing = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existing || existing.owner_id !== session.user.id) {
      return NextResponse.json({ error: "Contact not found or unauthorized" }, { status: 404 });
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        name,
        handle_name: role || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, contact: updated });
  } catch (error) {
    console.error("Update Contact Error:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

/**
 * 連絡先削除ハンドラー (所有権チェック付き)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existing || existing.owner_id !== session.user.id) {
      return NextResponse.json({ error: "Contact not found or unauthorized" }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
