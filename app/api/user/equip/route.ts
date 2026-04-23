import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { equipped } = await req.json();

    // 装備情報を equipped_assets に保存
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        equipped_assets: equipped
      }
    });

    return NextResponse.json({ success: true, equipped: updatedUser.equipped_assets });
  } catch (error: any) {
    console.error("Equip update error:", error);
    return NextResponse.json({ error: "Failed to synchronize treasury." }, { status: 500 });
  }
}
