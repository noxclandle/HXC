import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 自分のプロフィール情報を更新するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, handle, address, phone, photo_url, secret_msg } = data;

    // データベースの更新
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        handle_name: handle,
        address,
        phone,
        photo_url,
        // secret_msg も Json である ai_config 内に保存可能だが、今回はシンプルに
      },
    });

    // 監査ログに記録（秘匿）
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "PROFILE_UPDATE",
        details: { name, handle, address, phone }
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update identity record." }, { status: 500 });
  }
}
