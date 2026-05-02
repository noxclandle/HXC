import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ userCount });
  } catch (error: any) {
    console.error("Public stats error:", error);
    return NextResponse.json({ userCount: 0 });
  }
}
