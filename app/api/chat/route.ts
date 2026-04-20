import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * チャット履歴を取得する（検索対応）
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get("q");

      const messages = await prisma.chatMessage.findMany({
        where: { 
          user_id: session.user.id,
          ...(query ? { text: { contains: query, mode: 'insensitive' } } : {})
        },
        orderBy: { created_at: "asc" },
        take: 50
      });

      return NextResponse.json(messages);
    } catch (dbError) {
      console.warn("Database offline, returning mock chat history.");
      return NextResponse.json([
        { role: "agent", text: "聖域の案内人です。データベースとの同期が一時的に途絶えていますが、私はここにいます。" }
      ]);
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * メッセージを保存する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role, text } = await req.json();

    try {
      const message = await prisma.chatMessage.create({
        data: {
          user_id: session.user.id,
          role,
          text
        }
      });
      return NextResponse.json(message);
    } catch (dbError) {
      console.warn("Database offline, message not saved.");
      return NextResponse.json({ role, text, created_at: new Date() });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
