import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { listCategories, listColorOptions } from '@/lib/admin/projects';
import { requireAdmin } from '@/lib/auth/session';
import type { ProjectFormValues, ProjectTranslationValues } from '@/types';
import { saveProject } from '../actions';

const emptyTranslation: ProjectTranslationValues = {
  title: '',
  category: '',
  description: '',
  materials: '',
  priceLabel: '',
  seoTitle: '',
  seoDescription: '',
};

// New pieces start as drafts so nothing half-finished reaches the storefront.
const emptyProject: ProjectFormValues = {
  slug: '',
  status: 'DRAFT',
  featured: false,
  en: emptyTranslation,
  ar: emptyTranslation,
  colors: [],
  images: [],
};

export default async function NewProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const [colorOptions, categories] = await Promise.all([listColorOptions(), listCategories()]);
  const t = await getTranslations('admin.projects');

  return (
    <div className="space-y-4">
      <Link href="/admin/projects" className="inline-flex rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#4f3559] hover:bg-[#fff8fc]">
        {t('back')}
      </Link>
      <h1 className="text-3xl font-semibold tracking-[-0.05em]">{t('newTitle')}</h1>
      <ProjectForm
        action={saveProject.bind(null, locale, null)}
        initial={emptyProject}
        isNew
        colorOptions={colorOptions}
        categories={categories}
      />
    </div>
  );
}
