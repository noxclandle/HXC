import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/hub/',
        '/dashboard/',
        '/api/',
        '/inventory/',
        '/shop/',
        '/library/',
        '/settings/',
        '/activate/',
        '/gate'
      ],
    },
    sitemap: 'https://virtual-business-card.hexa-relation.com/sitemap.xml',
  }
}
