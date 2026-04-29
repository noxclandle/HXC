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

    const config = await prisma.systemConfig.findUnique({
      where: { key: 'asset_prices' }
    });

    return NextResponse.json(config?.value || {});
  } catch (error: any) {
    console.error("Config fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["chief_officer", "architect"];
    
    if (!session?.user?.id || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newPrices = await req.json();

    const updated = await prisma.systemConfig.upsert({
      where: { key: 'asset_prices' },
      update: { value: newPrices },
      create: { key: 'asset_prices', value: newPrices }
    });

    return NextResponse.json({ success: true, value: updated.value });
  } catch (error: any) {
    console.error("Config update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
