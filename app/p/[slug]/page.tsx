import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PublicProfileClient from "@/components/profile/PublicProfileClient";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { getPublicProfile } from "@/lib/user";
import { headers } from 'next/headers';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);
  const conditions: any[] = [
    { handle_name: params.slug }
  ];

  if (isUuid) {
    conditions.push({ id: params.slug });
  }

  const user = await prisma.user.findFirst({
    where: { 
      OR: conditions
    },
    select: { name: true, handle_name: true, role: true, ai_config: true, photo_url: true }
  });

  if (!user) {
    return {
      title: "Profile Not Found",
    };
  }

  const isOfficial = user.role === 'admin' || user.role === 'architect' || user.handle_name === 'architect';
  const aiConfig = (user.ai_config as any) || {};
  const profile = aiConfig.profile || {};
  const title = profile.title ? `${profile.title} | ` : "";
  const displayName = user.name || user.handle_name || "MEMBER";

  return {
    title: `${displayName}`,
    description: profile.bio || `${displayName} のデジタルアイデンティティ / Digital Identity for ${displayName}.`,
    robots: {
      index: isOfficial,
      follow: true,
    },
    openGraph: {
      title: `${title}${displayName} | Hexa Card`,
      description: profile.bio || "アイデンティティを同期する次世代スマート名刺。",
      images: [
        {
          url: user.photo_url || "/ogp_card.png",
          width: 1200,
          height: 630,
          alt: `${displayName}'s Hexa Card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${displayName} | Hexa Card`,
      description: profile.bio || "アイデンティティを同期する次世代スマート名刺。",
      images: [user.photo_url || "/ogp_card.png"],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  // 1. クローラー判定
  const reqHeaders = headers();
  const userAgent = reqHeaders.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);

  // 2. サーバーサイドでプロフィール情報をフェッチ
  const profileData = await getPublicProfile(params.slug);
  
  if (!profileData) {
    notFound();
  }

  const isOfficial = profileData.role === 'admin' || profileData.role === 'architect' || profileData.handle_name === 'architect';

  // 構造化データ（JSON-LD）用オブジェクトの生成
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": profileData.name || profileData.handle_name || "MEMBER",
      "jobTitle": profileData.profile?.title || undefined,
      "worksFor": profileData.profile?.company ? {
        "@type": "Organization",
        "name": profileData.profile.company
      } : undefined,
      "image": profileData.photo_url || undefined,
      "description": profileData.profile?.bio || undefined,
      "sameAs": [
        profileData.link_x ? `https://x.com/${profileData.link_x}` : undefined,
        profileData.link_instagram ? `https://instagram.com/${profileData.link_instagram}` : undefined,
        profileData.profile?.website || undefined
      ].filter(Boolean)
    }
  };

  return (
    <>
      {/* 公式アカウントかつインデックス対象の場合のみJSON-LDを注入 */}
      {isOfficial && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {isBot ? (
        // クローラーにはクリックなどのUI演出をバイパスして、直接SSRデータをレンダリング（SEOスコア100点）
        <ProfileClientUI data={profileData} isOwner={false} />
      ) : (
        // 通常ユーザーには、高級感のある「アンヴェイル（開封）」演出を体験させる
        <PublicProfileClient slug={params.slug} />
      )}
    </>
  );
}
