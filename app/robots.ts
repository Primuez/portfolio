import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        // Allow major AI crawlers explicitly for GEO indexing
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'anthropic-ai',
          'Claude-Web',
          'Applebot-Extended',
          'PerplexityBot',
          'YouBot',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://primuez.com/sitemap.xml',
    host: 'https://primuez.com',
  };
}
