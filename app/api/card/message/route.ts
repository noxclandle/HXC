import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations/message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

// 送信元IPと受信者IDの組み合わせで24時間の報酬制限をかけるキャッシュ
const messageRateCache = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { sender_name, sender_company, content, target_user_id } = result.data;

    const message = await prisma.$transaction(async (tx) => {
      const newMessage = await tx.cardMessage.create({
        data: {
          sender_name,
          sender_company,
          content,
          target_user_id,
          is_read: false,
        },
      });

      // 同一IPから同一ターゲットへのメッセージ送信におけるEXP報酬獲得を24時間に1回に制限
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
      const cleanIp = ipAddress.split(',')[0].trim();
      const cacheKey = `${cleanIp}_msg_to_${target_user_id}`;
      const now = Date.now();
      const expiry = messageRateCache.get(cacheKey);

      if (!expiry || now > expiry) {
        messageRateCache.set(cacheKey, now + 24 * 60 * 60 * 1000);

        // メモリリーク対策のキャッシュクリーンアップ
        if (messageRateCache.size > 5000) {
          for (const [key, val] of messageRateCache.entries()) {
            if (now > val) messageRateCache.delete(key);
          }
        }

        // 受信者（カード所有者）に +50 EXP
        await tx.user.update({
          where: { id: target_user_id },
          data: { exp: { increment: 50 } }
        });

        // 送信者がログインユーザーである場合、送信者にも +50 EXP (自分宛てを除く)
        const session = await getServerSession(authOptions);
        if (session?.user?.id && session.user.id !== target_user_id) {
          await tx.user.update({
            where: { id: session.user.id },
            data: { exp: { increment: 50 } }
          });
        }
      }

      return newMessage;
    });

    return NextResponse.json({ success: true, id: message.id });
  } catch (error) {
    logger.error("Message reward update error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
