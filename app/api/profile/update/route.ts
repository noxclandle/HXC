import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";


const profileUpdateSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  reading: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  link_x: z.string().optional().or(z.literal("")),
  link_instagram: z.string().optional().or(z.literal("")),
  link_line: z.string().optional().or(z.literal("")),
  link_facebook: z.string().optional().or(z.literal("")),
  // 装備情報はオブジェクト構造を緩く許容する
  equipped_assets: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 門番（レートリミット）のチェック
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    const { success } = await rateLimit.standard.limit(ip);

    if (!success) {
      return NextResponse.json({ 
        error: "Sync Rate Limited / 更新頻度が制限を超えました。30秒ほどお待ちください。" 
      }, { status: 429 });
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation error:", result.error.format());
      return NextResponse.json({ error: "Invalid Data Format", details: result.error.format() }, { status: 400 });
    }

    const { 
      name, reading, title, website, bio, company, photo_url, logo_url, 
      phone, email, link_x, link_instagram, link_line, link_facebook,
      equipped_assets
    } = result.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 画像が "IMAGE_LARGE"（以前の取得で省略されたフラグ）の場合は、既存のデータを維持する
    const finalPhotoUrl = photo_url === "IMAGE_LARGE" ? currentUser.photo_url : photo_url;
    const finalLogoUrl = logo_url === "IMAGE_LARGE" ? currentUser.logo_url : logo_url;

    // トランザクションで原子性を保証
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
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
          // 装備情報をマージ
          equipped_assets: equipped_assets ? {
            ...((currentUser.equipped_assets as any) || {}),
            ...equipped_assets
          } : undefined,
          // プロフィール情報をai_config内に同期
          ai_config: {
            profile: {
              ...((currentUser.ai_config as any)?.profile || {}),
              title: title,
              bio: bio,
              company: company,
              contact_email: email
            }
          }
        }
      });

      // 監査ログ
      await tx.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "profile_sync",
          details: { name, company, updated_at: new Date().toISOString() }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Critical Sync Error:", error);
    return NextResponse.json({ 
      error: "Vault Sync Error / サーバーとの同期中にエラーが発生しました。" 
    }, { status: 500 });
  }
}
