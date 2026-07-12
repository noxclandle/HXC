import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const resourceQuerySchema = z.object({
  type: z.enum(["photo", "logo"]),
});

/**
 * 巨大な画像データ（Base64）を非同期で取得するための専用API
 * これによりトップページの初期読み込み（JSON）を爆速化する。
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = resourceQuerySchema.safeParse({ type: searchParams.get("type") });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid or missing type" }, { status: 400 });
    }
    const { type } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        photo_url: type === "photo",
        logo_url: type === "logo"
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = type === "photo" ? user.photo_url : user.logo_url;
    return NextResponse.json({ data });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch resource." }, { status: 500 });
  }
}
