import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin is also marked noindex; API routes return JSON, not pages.
      disallow: ['/api/', ...routing.locales.map((locale) => `/${locale}/admin`)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
