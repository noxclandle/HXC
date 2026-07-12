import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";


const userUpdateSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100).optional(),
  handle: z.string().max(100).optional(),
  address: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  rank: z.string().optional(),
  role: z.string().optional(),
});

/**
 * 【チーフオフィサー限定】他ユーザーの情報を強制更新するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden: Administrative authority required." }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = userUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid data format", details: parseResult.error.format() }, { status: 400 });
    }

    const { userId, name, handle, address, phone, rank, role } = parseResult.data;

    // 【重要】Fixerロールの付与はシステム側で完全にブロック
    if (role === "fixer") {
      return NextResponse.json({ error: "Forbidden: The Fixer role is immutable and cannot be assigned." }, { status: 403 });
    }

    // 更新対象がFixer本人の場合、管理者といえど変更を拒否
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (targetUser?.role === "fixer" && session.user.role !== "fixer") {
       return NextResponse.json({ error: "Forbidden: You cannot modify the Fixer soul record." }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        handle_name: handle,
        address,
        phone,
        rank,
        role,
      },
    });

    // BigIntのシリアライズ問題を解決
    const safeUser = {
      ...updatedUser,
      rt_balance: updatedUser.rt_balance.toString(),
      exp: updatedUser.exp.toString()
    };

    // 監査ログに記録（誰が誰を書き換えたか）
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "MASTER_OVERRIDE",
        details: { targetUserId: userId, changes: body }
      }
    });

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: unknown) {
    console.error("Master override error:", error);
    return NextResponse.json({ error: "Failed to override soul record." }, { status: 500 });
  }
}
