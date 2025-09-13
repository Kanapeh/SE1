import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/dashboard/',
        '/_next/',
        '/private/',
        '*.json',
        '/auth/',
      ],
    },
    sitemap: 'https://www.se1a.org/sitemap.xml',
    host: 'https://www.se1a.org',
  }
}
