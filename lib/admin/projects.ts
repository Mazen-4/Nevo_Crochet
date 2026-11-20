import 'server-only';
import { Locale } from '@prisma/client';
import { getAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

/** Admin-only data access. Every function re-checks the session, independent of the calling page. */
async function assertAdmin() {
  if (!(await getAdmin())) throw new Error('Unauthorized');
}

/** Same order the storefront uses, so "move up/down" matches what visitors see. */
export const PROJECT_ORDER = [{ sortOrder: 'asc' as const }, { createdAt: 'desc' as const }];

export async function listAdminProjects() {
  await assertAdmin();
  return prisma.project.findMany({
    orderBy: PROJECT_ORDER,
    select: {
      id: true,
      slug: true,
      status: true,
      featured: true,
      updatedAt: true,
      translations: { select: { locale: true, title: true, category: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1, select: { url: true, altText: true } },
      _count: { select: { inquiryItems: true } },
    },
  });
}

export async function getAdminProject(id: string) {
  await assertAdmin();
  return prisma.project.findUnique({
    where: { id },
    include: {
      translations: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      colors: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { inquiryItems: true } },
    },
  });
}

export type ColorOption = { key: string; en: string; ar: string };

/** Every known color with both labels, for the color picker. Labels are shared across projects. */
export async function listColorOptions(): Promise<ColorOption[]> {
  await assertAdmin();
  const rows = await prisma.colorTranslation.findMany({ orderBy: { colorKey: 'asc' } });
  const byKey = new Map<string, ColorOption>();
  for (const row of rows) {
    const option = byKey.get(row.colorKey) ?? { key: row.colorKey, en: row.colorKey, ar: row.colorKey };
    option[row.locale] = row.label;
    byKey.set(row.colorKey, option);
  }
  return [...byKey.values()];
}

/** Existing category names per locale, offered as suggestions so filters stay consistent. */
export async function listCategories(): Promise<Record<Locale, string[]>> {
  await assertAdmin();
  const rows = await prisma.projectTranslation.findMany({
    distinct: ['locale', 'category'],
    select: { locale: true, category: true },
    orderBy: { category: 'asc' },
  });
  return {
    en: rows.filter((row) => row.locale === Locale.en).map((row) => row.category),
    ar: rows.filter((row) => row.locale === Locale.ar).map((row) => row.category),
  };
}
