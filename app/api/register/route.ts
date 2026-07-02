import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Input Validation Schema (Mandated by GEMINI.md)
const registerSchema = z.object({
  uid: z.string().min(8),
  s: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  handle: z.string().optional(),
  phone: z.string().min(10), // 必須（最低10桁）に変更
});

/**
 * ユーザー登録とカードの最終紐付け (Atomic Finalization)
 * POST /api/register
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = registerSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json({ 
        error: "Invalid input schema.", 
        details: body.error.format() 
      }, { status: 400 });
    }

    const { uid: rawUid, s: secret, email, password, name, handle, phone } = body.data;
    const uid = rawUid.replace(/:/g, "").toUpperCase();

    // 1. シークレットの有効性をトランザクション内で厳密に確認
    const result = await prisma.$transaction(async (tx) => {
      // メールアドレスの重複チェック
      const existingUser = await tx.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      if (existingUser) {
        throw new Error("Email already established.");
      }

      const card = await tx.card.findUnique({
        where: { uid }
      });

      if (!card || card.internal_serial !== secret || card.status === "active") {
        throw new Error("Invalid or already activated card.");
      }

      // 2. ユーザー作成
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name || "New Member",
          phone: phone, // 電話番号を追加
          handle_name: handle || name, // フリガナ/ハンドル名をセット
          role: "member",
          rank: "Member", // Initiateを廃止し、最初から対等な会員として登録
          rt_balance: 3000, // 新規購入特典の3,000 RTを付与
          exp: 0 // EXPは0（レベル1）からスタート
        }
      });

      // 2.5 新規購入特典のトランザクション履歴を記録
      await tx.rTTransaction.create({
        data: {
          user_id: user.id,
          amount: 3000,
          type: "earn",
          description: "Initial Activation Bonus / 新規購入特典"
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
      // internal_serialは@uniqueなので、衝突を避けるためにUUIDなどを使用
      await tx.card.update({
        where: { uid: card.uid },
        data: {
          user_id: user.id,
          status: "active",
          activated_at: new Date(),
          internal_serial: `VOID_${uuidv4().split("-")[0].toUpperCase()}_${Date.now()}`,
          activation_token: null,
          token_expires_at: null
        }
      });

      return { userId: user.id, deviceToken };
    });

    const response = NextResponse.json({ 
      success: true, 
      userId: result.userId,
      deviceToken: result.deviceToken // フロントエンドにトークンを返却
    });

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
