import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const publicContactSubmitSchema = z.object({
  ownerId: z.string().uuid("Invalid owner ID"),
  name: z.string().min(1, "Name is required"),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  role: z.string().optional().or(z.literal("")),
  design: z.string().optional().or(z.literal("")),
});

/**
 * GET /api/contacts/public?id=[contact_uuid]
 * 公開用の名刺プレビューAPI（認証なしでスキャン結果カードを描画するため）
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: contact.id,
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      role: contact.handle_name || "Member", // 肩書（Role）
      address: contact.address || "",
      notes: contact.notes || "",
      coord_x: contact.coord_x,
      coord_y: contact.coord_y
    });
  } catch (error) {
    console.error("Public Contact API Error:", error);
    return NextResponse.json({ error: "Failed to fetch contact details" }, { status: 500 });
  }
}

/**
 * POST /api/contacts/public
 * ゲスト（未ログイン）からカード所有者への連絡先送り返し（SHARE BACK）
 * 直接名刺帳に追加するのではなく、受信箱（CardMessage）へメッセージとして送信する仕様
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = publicContactSubmitSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
    }

    const { ownerId, name, email, phone, address, notes, role, design } = result.data;

    // 受信者の存在チェック
    const owner = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!owner) {
      return NextResponse.json({ error: "Card owner not found" }, { status: 404 });
    }

    // 受信箱（CardMessage）にメッセージとして送信（JSON文字列でデータをパッキング）
    const message = await prisma.cardMessage.create({
      data: {
        target_user_id: ownerId,
        sender_name: name,
        sender_company: role || "名刺交換リクエスト",
        content: JSON.stringify({
          type: "contact_shareback",
          name,
          role: role || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          notes: notes || "",
          design: design || "black"
        })
      }
    });

    return NextResponse.json({ success: true, id: message.id });
  } catch (error) {
    console.error("Public Contact Submit Error:", error);
    return NextResponse.json({ error: "Failed to submit contact details" }, { status: 500 });
  }
}
