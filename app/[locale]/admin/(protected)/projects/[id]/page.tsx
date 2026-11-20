import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DeleteProjectForm } from '@/components/admin/DeleteProjectForm';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getAdminProject, listCategories, listColorOptions } from '@/lib/admin/projects';
import { requireAdmin } from '@/lib/auth/session';
import type { ProjectFormValues, ProjectTranslationValues } from '@/types';
import { deleteProject, saveProject } from '../actions';

type Translation = NonNullable<Awaited<ReturnType<typeof getAdminProject>>>['translations'][number];

function toValues(translation: Translation | undefined): ProjectTranslationValues {
  return {
    title: translation?.title ?? '',
    category: translation?.category ?? '',
    description: translation?.description ?? '',
    materials: translation?.materials ?? '',
    priceLabel: translation?.priceLabel ?? '',
    seoTitle: translation?.seoTitle ?? '',
    seoDescription: translation?.seoDescription ?? '',
  };
}

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const [project, colorOptions, categories, query] = await Promise.all([getAdminProject(id), listColorOptions(), listCategories(), searchParams]);
  if (!project) notFound();

  const t = await getTranslations('admin.projects');
  const labels = new Map(colorOptions.map((option) => [option.key, option]));

  const initial: ProjectFormValues = {
    slug: project.slug,
    status: project.status,
    featured: project.featured,
    en: toValues(project.translations.find((tr) => tr.locale === 'en')),
    ar: toValues(project.translations.find((tr) => tr.locale === 'ar')),
    colors: project.colors.map((color) => ({
      key: color.colorKey,
      en: labels.get(color.colorKey)?.en ?? color.colorKey,
      ar: labels.get(color.colorKey)?.ar ?? color.colorKey,
    })),
    images: project.images.map((image) => ({ url: image.url, altText: image.altText ?? '' })),
  };
  const title = initial[locale].title || initial.en.title || t('untitled');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/projects" className="inline-flex rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#4f3559] hover:bg-[#fff8fc]">
          {t('back')}
        </Link>
        {project.status === 'PUBLISHED' && (
          <Link href={`/products/${project.slug}`} className="text-sm font-semibold text-[#6d4e82] underline-offset-4 hover:underline">
            {t('view')} ↗
          </Link>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#856895]">{t('editTitle')}</p>
        <h1 dir="auto" className="mt-2 break-words text-3xl font-semibold tracking-[-0.05em]">{title}</h1>
      </div>

      {(query.created || query.saved) && (
        <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {t(query.created ? 'created' : 'saved')}
        </p>
      )}

      <ProjectForm
        key={project.updatedAt.toISOString()}
        action={saveProject.bind(null, locale, project.id)}
        initial={initial}
        isNew={false}
        colorOptions={colorOptions}
        categories={categories}
      />

      <section className="rounded-[1.5rem] border border-rose-100 bg-white p-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">{t('sections.danger')}</h2>
        <DeleteProjectForm action={deleteProject.bind(null, locale, project.id)} />
      </section>
    </div>
  );
}
