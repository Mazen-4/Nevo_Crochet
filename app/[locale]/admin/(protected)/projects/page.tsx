import type { ProjectStatus } from '@prisma/client';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { listAdminProjects } from '@/lib/admin/projects';
import { requireAdmin } from '@/lib/auth/session';
import { moveProject, toggleFeatured } from './actions';

const statusStyles: Record<ProjectStatus, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700',
  DRAFT: 'bg-[#f4ebff] text-[#504061]',
  ARCHIVED: 'bg-[#f3eef4] text-[#806d87]',
};

const iconButton =
  'grid size-9 place-items-center rounded-full border border-[#ead8ef] bg-white text-[#563d5f] transition hover:bg-[#f4ebff] disabled:pointer-events-none disabled:opacity-30';

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await requireAdmin(locale);

  const projects = await listAdminProjects();
  const t = await getTranslations('admin.projects');

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">{t('title')}</h1>
          <p className="mt-1 text-sm text-[#806d87]">{t('subtitle')}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-[#7b5ca8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(123,92,168,0.2)] transition hover:bg-[#6d4f9b]"
        >
          {t('add')}
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-6 rounded-[1.5rem] border border-dashed border-[#e5d5ec] bg-white p-8 text-center text-[#6f5877]">{t('empty')}</p>
      ) : (
        <ol className="mt-6 space-y-3">
          {projects.map((project, index) => {
            const translation =
              project.translations.find((tr) => tr.locale === locale) ?? project.translations.find((tr) => tr.locale === 'en');
            const title = translation?.title ?? t('untitled');
            const image = project.images[0];

            return (
              <li
                key={project.id}
                className="flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-[#efdfef] bg-white p-3 shadow-[0_10px_24px_rgba(140,112,163,0.05)] sm:flex-nowrap"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#fdf3fb]">
                  {image ? (
                    <Image src={image.url} alt={image.altText ?? title} fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center px-1 text-center text-[10px] text-[#7a6a81]">{t('noImage')}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/projects/${project.id}`} dir="auto" className="truncate font-semibold text-[#2f1d36] hover:text-[#7b5ca8]">
                      {title}
                    </Link>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[project.status]}`}>
                      {t(`statuses.${project.status}`)}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-[#806d87]">
                    {translation?.category && <span dir="auto">{translation.category}</span>}
                    <span dir="ltr">/{project.slug}</span>
                    <span>{t('inquiriesCount', { count: project._count.inquiryItems })}</span>
                  </p>
                </div>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <form action={toggleFeatured.bind(null, locale, project.id)}>
                    <button
                      type="submit"
                      aria-pressed={project.featured}
                      title={project.featured ? t('unfeature') : t('feature')}
                      className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${project.featured ? 'border-[#7b5ca8] bg-[#7b5ca8] text-white hover:bg-[#6d4f9b]' : 'border-[#ead8ef] bg-white text-[#806d87] hover:bg-[#f4ebff]'}`}
                    >
                      <span aria-hidden="true">{project.featured ? '★' : '☆'}</span>
                      {t('featured')}
                    </button>
                  </form>
                  <form action={moveProject.bind(null, locale, project.id, 'up')}>
                    <button type="submit" disabled={index === 0} aria-label={t('moveUp')} title={t('moveUp')} className={iconButton}>
                      <span aria-hidden="true">↑</span>
                    </button>
                  </form>
                  <form action={moveProject.bind(null, locale, project.id, 'down')}>
                    <button type="submit" disabled={index === projects.length - 1} aria-label={t('moveDown')} title={t('moveDown')} className={iconButton}>
                      <span aria-hidden="true">↓</span>
                    </button>
                  </form>
                  <Link href={`/admin/projects/${project.id}`} className="rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-xs font-semibold text-[#504061] hover:bg-[#f4ebff]">
                    {t('edit')}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
