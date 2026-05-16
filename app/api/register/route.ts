import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { executeRTTransaction } from "@/lib/rt/engine";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  handle: z.string().min(1, "Handle is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  uid: z.string().min(1, "UID is required"),
  role: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  title: z.string().optional(),
});

/**
 * 新規ユーザー登録と物理カードの有効化を行うAPI
 * POST /api/register
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request", details: parseResult.error.format() }, { status: 400 });
    }

    const { name, handle, email: rawEmail, password, phone, address, uid, title } = parseResult.data;
    const email = rawEmail.toLowerCase();

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
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          handle_name: handle,
          role: "member",
          rank: "Initiate",
          address,
          phone,
          rt_balance: 0n, // 最初は0で作成し、後でexecuteRTTransactionで付与
          ai_config: {
            profile: {
              title: title || "",
            }
          },
          equipped_assets: {
            frame: "Obsidian",
            background: "Default",
            effect: "None",
            fontFamily: "Standard",
            title: "ASSOCIATE",
            sound: "resonance",
            pointer: "Pure White Hex",
            orientation: "horizontal"
          },
          unlocked_titles: ["ASSOCIATE", "Initiate", "Observer"]
        }
      });

      await tx.card.update({
        where: { uid: card!.uid },
        data: {
          user_id: user.id,
          status: "active",
          activated_at: new Date(),
          issued_at: new Date()
        }
      });

      return user;
    });

    // 初期ポイント付与とデバイス紐付け
    let deviceToken = "";
    try {
      await executeRTTransaction(
        newUser.id,
        100,
        "earn",
        "Initial Registration Bonus"
      );

      // デバイス紐付け用のトークン生成
      const crypto = require("crypto");
      deviceToken = crypto.randomBytes(32).toString("hex");
      await prisma.deviceBinding.create({
        data: {
          user_id: newUser.id,
          device_token: deviceToken,
          user_agent: req.headers.get("user-agent") || "Unknown Device"
        }
      });
    } catch (err) {
      console.error("Post-registration steps failed:", err);
    }

    return NextResponse.json({ success: true, userId: newUser.id, slug: newUser.handle_name, deviceToken });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to sync identity record." }, { status: 500 });
  }
}
