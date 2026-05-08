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

    return NextResponse.json({ success: true, deviceToken });
  } catch (error: any) {
    console.error("Device binding error:", error);
    return NextResponse.json({ error: "Failed to bind device." }, { status: 500 });
  }
}
