import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PublicProfileClient from "@/components/profile/PublicProfileClient";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { handle_name: params.slug },
        { id: params.slug } // IDでアクセスされた場合のフォールバック
      ]
    },
    select: { name: true, handle_name: true, ai_config: true, photo_url: true }
  });

  if (!user) {
    return {
      title: "Profile Not Found",
    };
  }

  const aiConfig = (user.ai_config as any) || {};
  const profile = aiConfig.profile || {};
  const title = profile.title ? `${profile.title} | ` : "";
  const displayName = user.name || user.handle_name || "MEMBER";

  return {
    title: `${displayName}`,
    description: profile.bio || `${displayName} のデジタルアイデンティティ / Digital Identity for ${displayName}.`,
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

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  return <PublicProfileClient slug={params.slug} />;
}
