import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { executeRTTransaction, calculateFloatingReward } from "@/lib/rt/engine";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limiting: Check if the user has already found a hidden RT very recently
    // (e.g., within the last 1 minute to prevent script abuse)
    const recentTransaction = await prisma.rTTransaction.findFirst({
      where: {
        user_id: userId,
        type: "earn",
        description: { startsWith: "Fragment Observation" },
        created_at: { gte: new Date(Date.now() - 60 * 1000) }
      }
    });

    if (recentTransaction) {
      return NextResponse.json({ error: "Resonance too frequent." }, { status: 429 });
    }

    const amount = calculateFloatingReward();
    
    const { user, transaction } = await executeRTTransaction(
      userId,
      amount,
      "earn",
      `Fragment Observation: ${amount} RT / 断片の観測成功`
    );

    return NextResponse.json({
      success: true,
      amount,
      new_balance: user.rt_balance.toString()
    });
  } catch (error: any) {
    console.error("Hidden RT Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
