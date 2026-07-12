import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Zod Input Validation Schema (GEMINI.md compliance)
const claimRegisterSchema = z.object({
  contactId: z.string().uuid("Invalid contact ID format"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

/**
 * POST /api/register/claim
 * AIスキャンされた連絡先から自動アカウント登録しデジタル名刺をアクティベート
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = claimRegisterSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json({ 
        error: "Invalid input schema.", 
        details: body.error.format() 
      }, { status: 400 });
    }

    const { contactId, email, password, name } = body.data;

    // 1. スキャン元の連絡先データを検索
    const contact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!contact) {
      return NextResponse.json({ error: "No digitized record found for this identifier" }, { status: 404 });
    }

    // 2. メールアドレス重複等のチェックをトランザクション内で実行
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      if (existingUser) {
        throw new Error("This email is already registered.");
      }

      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // 新規ユーザー作成 (Contactの登録情報から初期プロファイルを生成)
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name || contact.name,
          phone: contact.phone || null,
          handle_name: name || contact.name,
          role: "member",
          rank: "Member",
          rt_balance: 1000, // クレーム登録特典の 1000 RT を付与
          exp: 0, // 新規ユーザーは一律 0 EXP (レベル1) からスタート
        }
      });

      // 登録特典のトランザクション履歴を記録
      await tx.rTTransaction.create({
        data: {
          user_id: user.id,
          amount: 1000,
          type: "earn",
          description: "Digitization Claim Bonus / スキャンクレイム特典"
        }
      });

      // デバイスバインディングの作成（自動ログイン用）
      const deviceToken = uuidv4();
      await tx.deviceBinding.create({
        data: {
          user_id: user.id,
          device_token: deviceToken,
          user_agent: req.headers.get("user-agent") || "unknown"
        }
      });

      return { userId: user.id, deviceToken };
    });

    const response = NextResponse.json({ 
      success: true, 
      userId: result.userId,
      deviceToken: result.deviceToken
    });

    // クッキーを設定
    response.cookies.set("hxc_soul_fragment", result.deviceToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return response;

  } catch (error: unknown) {
    console.error("Claim Register Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || "Failed to finalize card claim." }, { status: 500 });
  }
}
