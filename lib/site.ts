import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Public origin used for canonical URLs, the sitemap and Open Graph.
 * Set NEXT_PUBLIC_APP_URL once the domain is chosen; until then Vercel's production URL
 * (provided automatically on Vercel) is used, and localhost in development.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/+$/, '');

export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', ar: 'ar_AR' };

/** `/gallery` → absolute URL for one locale. Pass `''` for the home page. */
export const localeUrl = (locale: Locale, path: string) => `${SITE_URL}/${locale}${path}`;

/** Canonical URL plus `hreflang` links for every locale (English is the default). */
export function alternatesFor(locale: Locale, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`]));
  languages['x-default'] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

type OpenGraph = NonNullable<Metadata['openGraph']>;

/**
 * Full Open Graph block for a page. Next.js merges metadata shallowly, so a page that sets
 * `openGraph` replaces the layout's entirely — always build it here to keep site name and locale.
 */
export function openGraphFor(locale: Locale, siteName: string, page: Omit<OpenGraph, 'locale' | 'siteName'>): OpenGraph {
  return {
    type: 'website',
    siteName,
    locale: OG_LOCALES[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
    ...page,
  } as OpenGraph;
}

/** Serialize JSON-LD safely for a <script> tag (escapes `<` so content can't close the tag). */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
