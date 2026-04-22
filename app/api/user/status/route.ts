import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        card: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // セッション情報の名前が古い場合があるため、DBの値を優先
    const titles = Array.isArray(user.unlocked_titles) ? user.unlocked_titles : [];

    return NextResponse.json({
      rt_balance: user.rt_balance.toString(),
      rank: user.rank,
      titles: titles,
      uid: user.card?.uid || "NO CARD LINKED",
      handle: user.handle_name || "",
      slug: user.handle_name || user.id
    });
  } catch (error: any) {
    console.error("Fetch status error:", error);
    return NextResponse.json({ error: "Failed to fetch status." }, { status: 500 });
  }
}
