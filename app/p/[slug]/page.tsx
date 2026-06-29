import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicProfileClient from "@/components/profile/PublicProfileClient";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { getPublicProfile, getCachedProfile } from "@/lib/user";
import { headers } from 'next/headers';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  
  // 1. すでにキャッシュされていれば、DBアクセス不要のため人間でもキャッシュデータをそのまま使ってタイトルを表示する
  let user = getCachedProfile(decodedSlug);

  // 2. キャッシュにない場合、人間ならローディング画面を即座に出すため、ダミーのヘッダー情報をミリ秒で返す（SSRブロッキングを回避）
  if (!user) {
    const reqHeaders = headers();
    const userAgent = reqHeaders.get('user-agent') || '';
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot/i.test(userAgent);

    if (!isBot) {
      return {
        title: "Hexa Card",
        description: "アイデンティティを同期する次世代スマート名刺。",
        alternates: {
          canonical: `https://virtual-business-card.hexa-relation.com/p/${encodeURIComponent(decodedSlug)}`,
        },
      };
    }

    // クローラー（bot）であればブロッキングしてPrismaから最新のSEOメタデータを生成する
    user = await getPublicProfile(decodedSlug);
  }

  if (!user) {
    return {
      title: "Profile Not Found",
    };
  }

  const isOfficial = ['admin', 'architect', 'fixer', 'mastermind', 'manager'].includes(user.role) || user.handle_name === 'architect';
  const profile = user.profile || {};
  const title = profile.title ? `${profile.title} | ` : "";
  const displayName = user.name || user.handle_name || "MEMBER";

  // 美麗な動的名刺OGP画像のURLを生成
  const ogImageUrl = `https://virtual-business-card.hexa-relation.com/api/og?slug=${encodeURIComponent(decodedSlug)}`;

  return {
    title: `${displayName}`,
    description: profile.bio || `${displayName} のデジタルアイデンティティ / Digital Identity for ${displayName}.`,
    alternates: {
      canonical: `https://virtual-business-card.hexa-relation.com/p/${encodeURIComponent(decodedSlug)}`,
    },
    robots: {
      index: isOfficial,
      follow: true,
    },
    openGraph: {
      title: `${title}${displayName} | Hexa Card`,
      description: profile.bio || "アイデンティティを同期する次世代スマート名刺。",
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const decodedSlug = decodeURIComponent(params.slug);
  // 1. クローラー判定
  const reqHeaders = headers();
  const userAgent = reqHeaders.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);

  // 2. サーバーサイドでプロフィール情報をフェッチ
  const profileData = await getPublicProfile(decodedSlug);
  
  if (!profileData) {
    notFound();
  }

  const isOfficial = ['admin', 'architect', 'fixer', 'mastermind', 'manager'].includes(profileData.role) || profileData.handle_name === 'architect';

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
        <PublicProfileClient slug={decodedSlug} initialData={profileData} />
      )}
    </>
  );
}
