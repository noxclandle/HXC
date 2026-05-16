import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

/**
 * 端末をユーザーに紐付ける（Soul-Linkの断片を発行）
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deviceToken = crypto.randomBytes(32).toString("hex");
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    await prisma.deviceBinding.create({
      data: {
        user_id: session.user.id,
        device_token: deviceToken,
        user_agent: userAgent
      }
    });

    const response = NextResponse.json({ success: true, deviceToken });
    
    // Cookieにも保存（サーバーサイドでの識別の用）
    // 400日間有効（ほぼ永久的）なCookieを設定
    response.cookies.set("hxc_soul_fragment", deviceToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return response;
  } catch (error: any) {
    console.error("Device binding error:", error);
    return NextResponse.json({ error: "Failed to bind device." }, { status: 500 });
  }
}
