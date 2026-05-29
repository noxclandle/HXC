import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

/**
 * ユーザー登録とカードの最終紐付け (Atomic Finalization)
 * POST /api/register
 */
export async function POST(req: NextRequest) {
  try {
    const { token, email, password, name } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. トークンの有効性をトランザクション内で厳密に確認
    const result = await prisma.$transaction(async (tx) => {
      const card = await tx.card.findFirst({
        where: {
          activation_token: token,
          status: "activating",
          token_expires_at: { gt: new Date() }
        }
      });

      if (!card) {
        throw new Error("Invalid or expired activation token.");
      }

      // 2. ユーザー作成
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name || "New Member",
          role: "member",
          rank: "Initiate"
        }
      });

      // 3. デバイスバインド (自動ログイン体験のため)
      const deviceToken = uuidv4();
      await tx.deviceBinding.create({
        data: {
          user_id: user.id,
          device_token: deviceToken,
          user_agent: req.headers.get("user-agent") || "unknown"
        }
      });

      // 4. カードの最終紐付けと秘密情報の完全破壊
      await tx.card.update({
        where: { uid: card.uid },
        data: {
          user_id: user.id,
          status: "active",
          activated_at: new Date(),
          internal_serial: "DESTROYED_" + Date.now(),
          activation_token: null,
          token_expires_at: null
        }
      });

      return { userId: user.id, deviceToken };
    });

    const response = NextResponse.json({ success: true, userId: result.userId });

    // Identity Cookie をセット (1年有効)
    response.cookies.set("hxc_soul_fragment", result.deviceToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return response;

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to register." }, { status: 500 });
  }
}
