import { unstable_cache } from 'next/cache';
import { Locale, Prisma, ProjectStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { Project, Testimonial } from '@/types';

/** Cache tags — call `revalidateTag()` with these after admin edits. */
export const PROJECTS_TAG = 'projects';
export const TESTIMONIALS_TAG = 'testimonials';

const REVALIDATE_SECONDS = 3600;

const projectInclude = (locale: Locale) =>
  ({
    // Always load English too: it is the fallback copy and the source of the category key.
    translations: { where: { locale: { in: [locale, Locale.en] } } },
    images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
    colors: { orderBy: { sortOrder: 'asc' } },
  }) satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: ReturnType<typeof projectInclude> }>;

function toProject(row: ProjectRow, locale: Locale, colorLabels: Map<string, string>): Project | null {
  const english = row.translations.find((t) => t.locale === Locale.en);
  const translation = row.translations.find((t) => t.locale === locale) ?? english;
  if (!translation) return null;

  const gallery = row.images.map((image) => image.url);

  return {
    id: row.id,
    slug: row.slug,
    title: translation.title,
    category: translation.category,
    categoryKey: (english ?? translation).category.trim().toLowerCase(),
    description: translation.description,
    materials: translation.materials ?? '',
    colors: row.colors.map((color) => ({ key: color.colorKey, label: colorLabels.get(color.colorKey) ?? color.colorKey })),
    featured: row.featured,
    image: gallery[0] ?? '',
    gallery,
    priceLabel: translation.priceLabel ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

async function loadProjects(locale: Locale, where: Prisma.ProjectWhereInput = {}): Promise<Project[]> {
  const [rows, colorTranslations] = await Promise.all([
    prisma.project.findMany({
      where: { ...where, status: ProjectStatus.PUBLISHED },
      include: projectInclude(locale),
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.colorTranslation.findMany({ where: { locale } }),
  ]);

  const colorLabels = new Map(colorTranslations.map((c) => [c.colorKey, c.label]));
  return rows.map((row) => toProject(row, locale, colorLabels)).filter((p): p is Project => p !== null);
}

/** All published projects, localized. */
export const getProjects = unstable_cache((locale: Locale) => loadProjects(locale), ['projects:list'], {
  tags: [PROJECTS_TAG],
  revalidate: REVALIDATE_SECONDS,
});

/** A single published project by slug, or `null`. */
export const getProjectBySlug = unstable_cache(
  async (slug: string, locale: Locale) => (await loadProjects(locale, { slug }))[0] ?? null,
  ['projects:slug'],
  { tags: [PROJECTS_TAG], revalidate: REVALIDATE_SECONDS },
);

/** Featured testimonials for a locale. */
export const getTestimonials = unstable_cache(
  async (locale: Locale): Promise<Testimonial[]> =>
    prisma.testimonial.findMany({
      where: { locale, featured: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, text: true },
    }),
  ['testimonials:list'],
  { tags: [TESTIMONIALS_TAG], revalidate: REVALIDATE_SECONDS },
);
