import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 【チーフオフィサー限定】他ユーザーの情報を強制更新するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["mastermind", "chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden: Master authority required." }, { status: 403 });
    }

    const data = await req.json();
    const { userId, name, handle, address, phone, rank, role } = data;

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

    // 監査ログに記録（誰が誰を書き換えたか）
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "MASTER_OVERRIDE",
        details: { targetUserId: userId, changes: data }
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Master override error:", error);
    return NextResponse.json({ error: "Failed to override soul record." }, { status: 500 });
  }
}
