import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  id: z.string(),
  replyText: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 });
    }

    const { id, replyText, status } = result.data;

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: any = {
      status: status || "replied"
    };

    if (replyText) {
      const currentReplies = (inquiry.replies as any[]) || [];
      data.replies = [
        ...currentReplies,
        {
          text: replyText,
          sender: session.user.name || "Admin",
          created_at: new Date().toISOString()
        }
      ];
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data
    });

    // TODO: ここで実際にユーザーにメールを送るロジック（Resend等）を追加予定

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Inquiry Update Error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
