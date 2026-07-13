import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const aliasSchema = z.object({
  aliasName: z.string().max(50).optional(),
  isAliasActive: z.boolean().optional(),
});

/**
 * 別名プロフィール（alias_name）の設定・有効化切り替え。
 * is_alias_active は is_alias_unlocked（購入済み）でない限り true にできない。
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = aliasSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { aliasName, isAliasActive } = parsed.data;

    if (isAliasActive && !user.is_alias_unlocked) {
      return NextResponse.json({ error: "別名プロフィール機能が未解放です。" }, { status: 403 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(aliasName !== undefined ? { alias_name: aliasName } : {}),
        ...(isAliasActive !== undefined ? { is_alias_active: isAliasActive } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      alias_name: updated.alias_name,
      is_alias_active: updated.is_alias_active,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Alias update error", { error: message });
    return NextResponse.json({ error: "Failed to update alias." }, { status: 500 });
  }
}
