import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";


const chatQuerySchema = z.object({
  q: z.string().max(100).optional(),
});

const chatMessageSchema = z.object({
  role: z.enum(["user", "agent"]),
  text: z.string().min(1).max(2000),
});

/**
 * チャット履歴を取得する（検索対応）
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const parseResult = chatQuerySchema.safeParse({ q: searchParams.get("q") });
    
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const query = parseResult.data.q;

    try {
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
      logger.warn("Database offline, returning mock chat history", { error: dbError });
      return NextResponse.json([
        { role: "agent", text: "境界の観測者です。データベースとの同期が一時的に途絶えていますが、私はここにいます。" }
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

    const body = await req.json();
    const parseResult = chatMessageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid message format", details: parseResult.error.format() }, { status: 400 });
    }

    const { role, text } = parseResult.data;

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
      logger.warn("Database offline, message not saved", { error: dbError });
      return NextResponse.json({ role, text, created_at: new Date() });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
