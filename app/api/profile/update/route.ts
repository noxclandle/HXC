import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";


const profileUpdateSchema = z.object({
  name: z.string().optional(),
  reading: z.string().optional(),
  title: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
  bio: z.string().optional(),
  company: z.string().optional(),
  photo_url: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
  orientation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional().or(z.literal("")),
  hAlign: z.string().optional(),
  vAlign: z.string().optional(),
  link_x: z.string().optional(),
  link_instagram: z.string().optional(),
  link_line: z.string().optional(),
  link_facebook: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 門番（レートリミット）のチェック
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    const { success } = await rateLimit.standard.limit(ip);

    if (!success) {
      return NextResponse.json({ 
        error: "Updating too fast. Please wait. / 更新頻度が高すぎます。少し時間を置いてください。" 
      }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
    }

    const { 
      name, reading, title, website, bio, company, photo_url, logo_url, 
      orientation, phone, email, hAlign, vAlign,
      link_x, link_instagram, link_line, link_facebook
    } = result.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    const currentEquipped = (currentUser?.equipped_assets as any) || {};

    // 画像が "IMAGE_LARGE"（以前の取得で省略されたフラグ）の場合は、既存のデータを維持する
    const finalPhotoUrl = photo_url === "IMAGE_LARGE" ? currentUser?.photo_url : photo_url;
    const finalLogoUrl = logo_url === "IMAGE_LARGE" ? currentUser?.logo_url : logo_url;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: session.user.id },
        data: {
          name: name,
          handle_name: reading,
          link_website: website,
          link_x: link_x,
          link_instagram: link_instagram,
          link_line: link_line,
          link_facebook: link_facebook,
          photo_url: finalPhotoUrl,
          logo_url: finalLogoUrl,
          phone: phone,
          equipped_assets: {
            ...currentEquipped,
            orientation: orientation,
            hAlign: hAlign,
            vAlign: vAlign
          },
          ai_config: {
            profile: {
              ...((currentUser?.ai_config as any)?.profile || {}),
              title: title,
              bio: bio,
              company: company,
              contact_email: email
            }
          }
        }
      });

      // システムログに記録
      await tx.auditLog.create({
        data: {
          user_id: user.id,
          action: "profile_update",
          details: {
            name,
            reading,
            title,
            company,
            updated_at: new Date().toISOString()
          }
        }
      });

      return user;
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update identity." }, { status: 500 });
  }
}
