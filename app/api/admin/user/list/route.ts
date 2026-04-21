import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        rank: true,
        role: true,
        rt_balance: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    // BigInt のシリアライズ問題を回避するため、文字列に変換
    const safeUsers = users.map((u) => ({
      ...u,
      rt: u.rt_balance.toString(),
    }));

    return NextResponse.json(safeUsers);
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
