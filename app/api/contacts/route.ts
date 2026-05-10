import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 問い合わせの送信
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject: subject || "No Subject",
        message,
        status: "pending",
      },
    });

    // TODO: 管理者に通知（Discord/Email等）を送るロジックをここに追加可能

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error("Inquiry Submission Error:", error);
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}
