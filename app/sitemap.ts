import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getSitemapProjects } from '@/lib/projects';
import { localeUrl } from '@/lib/site';

/** Every public page in both languages, each listing its translations as alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getSitemapProjects();
  const latest = projects.reduce<string | undefined>((max, p) => (!max || p.updatedAt > max ? p.updatedAt : max), undefined);

  const pages: Array<{ path: string; lastModified?: string; priority: number }> = [
    { path: '', lastModified: latest, priority: 1 },
    { path: '/gallery', lastModified: latest, priority: 0.9 },
    ...projects.map((p) => ({ path: `/products/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
  ];

  return pages.flatMap(({ path, lastModified, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      priority,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, path)])) },
    })),
  );
}
