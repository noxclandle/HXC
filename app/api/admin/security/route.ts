import { NextResponse } from "next/server";
import { Analytics } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { RATE_LIMIT_RULES } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 【管理者限定】セキュリティ司令室のライブデータを取得するAPI
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cutoff = Date.now() - DAY_MS;

    const rules = await Promise.all(
      Object.entries(RATE_LIMIT_RULES).map(async ([id, rule]) => {
        let blocked = 0;
        let allowed = 0;
        try {
          const analytics = new Analytics({ redis: kv, prefix: rule.prefix });
          const usage = await analytics.getUsage(cutoff);
          for (const stats of Object.values(usage)) {
            blocked += stats.blocked;
            allowed += stats.success;
          }
        } catch (error: unknown) {
          logger.warn("Failed to read rate-limit analytics", { rule: id, error });
        }
        return {
          id,
          label: rule.label,
          desc: rule.desc,
          limit: `${rule.points} req / ${rule.window}`,
          blocked24h: blocked,
          allowed24h: allowed,
        };
      })
    );

    const totalBlocked24h = rules.reduce((sum, r) => sum + r.blocked24h, 0);

    let activeConnections: number | null = null;
    try {
      const result = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()
      `;
      activeConnections = Number(result[0]?.count ?? 0);
    } catch (error: unknown) {
      logger.warn("Failed to read active DB connections", { error });
    }

    let lockdown = false;
    let kvAvailable = true;
    try {
      lockdown = (await kv.get<boolean>("system_lockdown")) === true;
    } catch (error: unknown) {
      kvAvailable = false;
      logger.warn("Failed to read lockdown flag from KV", { error });
    }

    return NextResponse.json({ rules, totalBlocked24h, activeConnections, lockdown, kvAvailable });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Security status fetch error", { error: message });
    return NextResponse.json({ error: "Failed to fetch security status." }, { status: 500 });
  }
}
