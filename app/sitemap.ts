import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://virtual-business-card.hexa-relation.com'
  
  // Base static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/purchase`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Fetch only official/admin profiles to be indexed
    const users = await prisma.user.findMany({
      where: {
        handle_name: { not: null },
        role: { in: ['admin', 'architect'] }
      },
      select: {
        handle_name: true,
        created_at: true,
      }
    });

    const dynamicRoutes: MetadataRoute.Sitemap = users.map((user) => ({
      url: `${baseUrl}/p/${user.handle_name}`,
      lastModified: user.created_at,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Fetch all published news
    const announcements = await prisma.announcement.findMany({
      where: { is_published: true },
      select: { id: true, updated_at: true }
    });

    const newsRoutes: MetadataRoute.Sitemap = announcements.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: item.updated_at,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes, ...newsRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return staticRoutes; // Fallback to static routes if DB fails
  }
}
