import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations/message";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { sender_name, sender_company, content, target_user_id } = result.data;

    const message = await prisma.cardMessage.create({
      data: {
        sender_name,
        sender_company,
        content,
        target_user_id,
        is_read: false,
      },
    });

    return NextResponse.json({ success: true, id: message.id });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
