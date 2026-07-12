import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { clearProfileCache } from "@/lib/user";
import { logger } from "@/lib/logger";

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
  address: z.string().optional().or(z.literal("")),
  link_x: z.string().optional().or(z.literal("")),
  link_instagram: z.string().optional().or(z.literal("")),
  link_line: z.string().optional().or(z.literal("")),
  link_facebook: z.string().optional().or(z.literal("")),
  portfolio_links: z.array(z.object({
    title: z.string(),
    url: z.string()
  })).optional(),
  equipped_assets: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      logger.warn("Profile update validation error", { issues: result.error.format() });
      return NextResponse.json({ error: "Invalid Data Format", details: result.error.format() }, { status: 400 });
    }

    const { 
      name, reading, title, website, bio, company, photo_url, logo_url, 
      phone, email, address, link_x, link_instagram, link_line, link_facebook,
      portfolio_links, equipped_assets
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
      // 1日1回限定のプロフィール更新EXP付与（+50 EXP）チェック
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existingLogs = await tx.auditLog.findFirst({
        where: {
          user_id: session.user.id,
          action: "profile_sync",
          created_at: { gte: today }
        }
      });
      
      const shouldGrantExp = !existingLogs;

      // 名刺データの完全開示（Full Disclosure）チェック
      const isProfileComplete = !!(
        name && name.trim() !== "" &&
        reading && reading.trim() !== "" &&
        website && website.trim() !== "" &&
        link_x && link_x.trim() !== "" &&
        link_instagram && link_instagram.trim() !== "" &&
        link_line && link_line.trim() !== "" &&
        link_facebook && link_facebook.trim() !== "" &&
        finalPhotoUrl && finalPhotoUrl.trim() !== "" &&
        finalLogoUrl && finalLogoUrl.trim() !== "" &&
        phone && phone.trim() !== "" &&
        address && address.trim() !== "" &&
        title && title.trim() !== "" &&
        bio && bio.trim() !== "" &&
        company && company.trim() !== ""
      );

      const disclosureRewardLog = await tx.auditLog.findFirst({
        where: {
          user_id: session.user.id,
          action: "full_disclosure_reward"
        }
      });

      const shouldRewardDisclosure = isProfileComplete && !disclosureRewardLog;

      let expAdd = 0;
      if (shouldGrantExp) expAdd += 50;
      if (shouldRewardDisclosure) expAdd += 500;

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
          address: address,
          portfolio_links: portfolio_links,
          exp: expAdd > 0 ? { increment: expAdd } : undefined,
          // 装備情報をマージ
          equipped_assets: equipped_assets ? ({
            ...((currentUser.equipped_assets as Record<string, unknown>) || {}),
            ...equipped_assets
          } as Prisma.InputJsonValue) : undefined,
          // プロフィール情報をai_config内にマージ（他のプロパティの上書き破壊を防ぐ）
          ai_config: {
            ...((currentUser.ai_config as Record<string, unknown>) || {}),
            profile: {
              ...((currentUser.ai_config as { profile?: Record<string, unknown> } | null)?.profile || {}),
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

      if (shouldRewardDisclosure) {
        await tx.auditLog.create({
          data: {
            user_id: session.user.id,
            action: "full_disclosure_reward",
            details: { completed_at: new Date().toISOString() }
          }
        });
      }
    });

    // キャッシュをクリアして即時反映させる
    if (session.user.id) {
      clearProfileCache(session.user.id);
    }
    if (currentUser.handle_name) {
      clearProfileCache(currentUser.handle_name);
    }
    if (reading) {
      clearProfileCache(reading);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Critical Sync Error", { error: message });
    return NextResponse.json({
      error: "サーバーとの同期に失敗しました。再試行してください。"
    }, { status: 500 });
  }
}
