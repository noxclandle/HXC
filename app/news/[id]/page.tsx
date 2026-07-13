import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NewsDetailClient from '@/components/news/NewsDetailClient';
import { logger } from '@/lib/logger';

interface Props {
  params: { id: string };
}

async function getAnnouncement(id: string) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id, is_published: true },
    });
    return announcement;
  } catch (error) {
    logger.error("Failed to fetch announcement in SSR", { error });
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getAnnouncement(params.id);
  if (!item) {
    return {
      title: "Intel Not Found",
    };
  }

  const summary = item.content.slice(0, 160) + (item.content.length > 160 ? "..." : "");

  return {
    title: item.title,
    description: summary,
    alternates: {
      canonical: `https://virtual-business-card.hexa-relation.com/news/${params.id}`,
    },
    openGraph: {
      title: `${item.title} | Hexa Card`,
      description: summary,
      type: "article",
      publishedTime: item.created_at.toISOString(),
      modifiedTime: item.updated_at.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | Hexa Card`,
      description: summary,
    }
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const item = await getAnnouncement(params.id);
  if (!item) {
    notFound();
  }

  // 構造化データ (NewsArticle) JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": item.title,
    "datePublished": item.created_at.toISOString(),
    "dateModified": item.updated_at.toISOString(),
    "description": item.content.slice(0, 160),
    "author": {
      "@type": "Organization",
      "name": "Hexa Relation",
      "url": "https://virtual-business-card.hexa-relation.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hexa Relation",
      "logo": {
        "@type": "ImageObject",
        "url": "https://virtual-business-card.hexa-relation.com/logo.png"
      }
    }
  };

  // Dateオブジェクトをシリアライズ可能なフォーマット（文字列）に変換して渡す
  const serializedItem = {
    ...item,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDetailClient item={serializedItem} />
    </>
  );
}
