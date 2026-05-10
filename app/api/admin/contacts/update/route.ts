import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, replyText, status } = await req.json();

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const currentReplies = (inquiry.replies as any[]) || [];
    const newReplies = [
      ...currentReplies,
      {
        text: replyText,
        sender: session.user.name || "Admin",
        created_at: new Date().toISOString()
      }
    ];

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        replies: newReplies,
        status: status || "replied",
      }
    });

    // TODO: ここで実際にユーザーにメールを送るロジック（Resend等）を追加予定

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Inquiry Update Error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
