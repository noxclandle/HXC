import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 自分のLibraryに保存された名刺リストを座標付きで取得する
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contact.findMany({
      where: { owner_id: session.user.id },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch library contents." }, { status: 500 });
  }
}
