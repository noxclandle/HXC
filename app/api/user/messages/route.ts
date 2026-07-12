import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const markReadSchema = z.object({
  messageId: z.string().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const messages = await prisma.cardMessage.findMany({
      where: { target_user_id: user.id },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(messages);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Fetch card messages error", { error: message });
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const json = await req.json();
    const parsed = markReadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }
    const { messageId } = parsed.data;

    await prisma.cardMessage.updateMany({
      where: { 
        id: messageId,
        target_user_id: user.id
      },
      data: { is_read: true }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Mark message read error", { error: message });
    return NextResponse.json({ error: "Failed to mark message as read." }, { status: 500 });
  }
}
