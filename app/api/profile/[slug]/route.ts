import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    
    // 特定のスラッグ「architect」または、DB内の handle_name / name で検索
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { handle_name: { equals: slug, mode: "insensitive" } },
          { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" } },
          // チーフオフィサーへの特別バイパス (slugがarchitectの場合)
          slug === "architect" ? { email: "str1yf5x@gmail.com" } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        handle_name: true,
        rank: true,
        address: true,
        phone: true,
        email: true,
        photo_url: true,
        logo_url: true, // 会社ロゴを追加
        link_website: true,
        ai_config: true,
        equipped_assets: true, // 配置情報を追加
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Identity not found." }, { status: 404 });
    }

    // クライアント側で使いやすい形式に整形
    const aiConfig = (user.ai_config as any) || {};
    const profile = aiConfig.profile || {};

    return NextResponse.json({
      ...user,
      profile: {
        company: profile.company || "",
        title: profile.title || "",
        bio: profile.bio || "",
        website: user.link_website || "",
        contact_email: profile.contact_email || user.email || ""
      }
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}
