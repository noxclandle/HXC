import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";
import { z } from "zod";
import crypto from "crypto";
import { logger } from "@/lib/logger";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // セキュリティ上の理由から、ユーザーが見つからなくても成功を返す
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    const rawToken = uuidv4();
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: hashedToken,
        reset_token_at: expires,
      },
    });

    await sendPasswordResetEmail(user.email!, rawToken);


    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    logger.error("Forgot password error", { error });
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
