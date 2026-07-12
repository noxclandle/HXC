import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Public News Detail API
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { 
        id: params.id,
        is_published: true 
      }
    });

    if (!announcement) {
      return NextResponse.json({ error: "Archives not found." }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error: unknown) {
    console.error("Public news detail fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
