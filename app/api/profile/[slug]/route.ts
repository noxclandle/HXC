import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    
    // slugを元にユーザーを検索。
    // 本来は slug 専用のカラム (alias_name等) で検索しますが、簡易的に handle_name を小文字にしたものと照合します
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { handle_name: { equals: slug, mode: "insensitive" } },
          { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" } }
        ]
      },
      select: {
        name: true,
        handle_name: true,
        rank: true,
        address: true,
        phone: true,
        email: true,
        photo_url: true,
        link_x: true,
        link_instagram: true,
        link_website: true,
        ai_config: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Identity not found." }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}
