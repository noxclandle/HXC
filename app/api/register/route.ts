import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * 新規ユーザー登録と物理カードの有効化を行うAPI
 * POST /api/register
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, handle, email, password, role, phone, address, uid } = data;

    if (!uid || !email || !password) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const normalizedUid = uid.replace(/:/g, "").toUpperCase();

    // 1. 台帳にそのUIDが存在し、かつ未発行であることを確認
    let card = await prisma.card.findUnique({
      where: { uid: normalizedUid }
    });

    if (!card) {
      // コロン付きでも探す
      const colonUid = normalizedUid.match(/.{1,2}/g)?.join(":") || normalizedUid;
      card = await prisma.card.findUnique({
        where: { uid: colonUid }
      });
    }

    if (!card || card.status !== "unissued") {
      return NextResponse.json({ error: "Invalid or already issued card." }, { status: 403 });
    }

    // 2. パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. ユーザーの作成とカードの有効化（トランザクション）
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          handle_name: handle,
          role: "member", // 初期ロール
          rank: "Initiate",
          address,
          phone,
          rt_balance: 100n, // 初期ポイント
        }
      });

      await tx.card.update({
        where: { uid },
        data: {
          user_id: newUser.id,
          status: "active",
          activated_at: new Date(),
          issued_at: new Date()
        }
      });

      return newUser;
    });

    return NextResponse.json({ success: true, userId: result.id });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to sync identity record." }, { status: 500 });
  }
}
