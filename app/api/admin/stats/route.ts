import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [userCount, cardCount, transactions, rtSum] = await Promise.all([
      prisma.user.count(),
      prisma.card.count({ where: { status: "active" } }),
      prisma.rTTransaction.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        include: { user: { select: { name: true } } }
      }),
      prisma.user.aggregate({
        _sum: { rt_balance: true }
      })
    ]);

    return NextResponse.json({
      activeUsers: userCount,
      issuedCards: cardCount,
      totalCP: rtSum._sum.rt_balance?.toString() || "0",
      recentTransactions: transactions.map(t => ({
        id: t.id,
        userName: t.user.name,
        amount: t.amount,
        type: t.type,
        description: t.description,
        date: t.created_at
      }))
    });
  } catch (error: any) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
