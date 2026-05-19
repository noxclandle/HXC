import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ユーザーの「最後にニュースを読んだ時間」を現在に更新する
    await prisma.user.update({
      where: { id: userId },
      data: { last_read_news_at: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Read News Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
