import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
  } catch (error: any) {
    console.error("Fetch card messages error:", error);
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

    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    await prisma.cardMessage.updateMany({
      where: { 
        id: messageId,
        target_user_id: user.id
      },
      data: { is_read: true }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mark message read error:", error);
    return NextResponse.json({ error: "Failed to mark message as read." }, { status: 500 });
  }
}
