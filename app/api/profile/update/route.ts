import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, handle, title, website, bio, company, photo_url } = body;

    // Userテーブルの基本フィールドと ai_config (Json) に保存
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name,
        handle_name: handle,
        link_website: website,
        photo_url: photo_url,
        ai_config: {
          profile: {
            title: title,
            bio: bio,
            company: company
          }
        }
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update identity." }, { status: 500 });
  }
}
