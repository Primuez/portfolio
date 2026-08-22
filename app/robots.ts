import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/_next/', '/.env'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'Bytespider',
          'Applebot-Extended',
          'CCBot'
        ],
        allow: '/',
        disallow: ['/api/', '/private/'],
      }
    ],
    sitemap: 'https://primuez.in/sitemap.xml',
    host: 'https://primuez.in',
  };
}
