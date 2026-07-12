import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// 資産価格テーブル。キー(アセットID)ごとに数値(価格)を持つ任意のオブジェクト。
const configSchema = z.record(z.string(), z.union([z.number(), z.string()]));

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await prisma.systemConfig.findUnique({
      where: { key: 'asset_prices' }
    });

    return NextResponse.json(config?.value || {});
  } catch (error: any) {
    logger.error("Config fetch error", { error: error?.message || String(error) });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = configSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid config payload" }, { status: 400 });
    }
    const newPrices = parsed.data;

    const updated = await prisma.systemConfig.upsert({
      where: { key: 'asset_prices' },
      update: { value: newPrices },
      create: { key: 'asset_prices', value: newPrices }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "CONFIG_SYNCHRONIZED",
        details: { key: 'asset_prices', value: newPrices }
      }
    });

    return NextResponse.json({ success: true, value: updated.value });
  } catch (error: any) {
    logger.error("Config update error", { error: error?.message || String(error) });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
