import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * コンシェルジュがユーザーの全背景（メモ・履歴）を学習・取得するAPI
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. 全名刺のメモを取得
    const contacts = await prisma.contact.findMany({
      where: { owner_id: session.user.id },
      select: { name: true, notes: true }
    });

    // 2. 過去の重要な会話を取得
    const chatHistory = await prisma.chatMessage.findMany({
      where: { user_id: session.user.id },
      orderBy: { created_at: "desc" },
      take: 20
    });

    return NextResponse.json({
      knowledge_base: {
        contacts,
        recent_chats: chatHistory
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Concierge failed to sync with your memory." }, { status: 500 });
  }
}
