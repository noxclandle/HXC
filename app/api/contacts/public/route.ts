import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
