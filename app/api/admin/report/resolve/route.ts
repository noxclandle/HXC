import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const resolveReportSchema = z.object({
  id: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = resolveReportSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { id } = parsed.data;

    const updated = await prisma.report.update({
      where: { id },
      data: { status: "resolved" }
    });

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "REPORT_RESOLVED",
        details: { id }
      }
    });

    return NextResponse.json({ success: true, status: updated.status });

  } catch (error: any) {
    logger.error("Report resolve error", { error: error?.message || String(error) });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
