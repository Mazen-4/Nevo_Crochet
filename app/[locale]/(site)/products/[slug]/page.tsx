import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { hasLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProductDetailActions } from '@/components/public/ProductDetailActions';
import { routing } from '@/i18n/routing';
import { getProjectBySlug, getProjects } from '@/lib/projects';
import { alternatesFor, jsonLd, localeUrl, openGraphFor } from '@/lib/site';
import type { Project } from '@/types';

export async function generateStaticParams() {
  const slugs = (await getProjects(routing.defaultLocale)).map((project) => project.slug);
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

/** Search snippets are cut around 160 characters; end on a word boundary. */
function snippet(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [project, t] = await Promise.all([getProjectBySlug(slug, locale), getTranslations({ locale, namespace: 'metadata' })]);
  if (!project) return {};

  const title = project.seoTitle ?? `${project.title} | ${t('siteName')}`;
  const description = project.seoDescription ?? snippet(project.description);
  return {
    title,
    description,
    alternates: alternatesFor(locale, `/products/${project.slug}`),
    openGraph: openGraphFor(locale, t('siteName'), {
      title,
      description,
      url: `/${locale}/products/${project.slug}`,
      images: project.gallery.map((url) => ({ url, alt: project.title })),
    }),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [project, t] = await Promise.all([getProjectBySlug(slug, locale), getTranslations({ locale, namespace: 'metadata' })]);
  if (!project) notFound();

  // No `offers`: pieces are made to order and priced per inquiry.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.title,
    description: project.description,
    image: project.gallery,
    url: localeUrl(locale, `/products/${project.slug}`),
    category: project.category,
    brand: { '@type': 'Brand', name: t('siteName') },
    inLanguage: locale,
    ...(project.materials && { material: project.materials }),
    ...(project.colors.length > 0 && { color: project.colors.map((c) => c.label).join(', ') }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <ProductDetailContent project={project} />
    </>
  );
}

function ProductDetailContent({ project }: { project: Project }) {
  const t = useTranslations('common');

  return (
    <main className="min-h-screen bg-[#fffafc] px-5 py-10 text-[#2f1d36] md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#4f3559] hover:bg-[#fff8fc]">← {t('backToGallery')}</Link>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#efdff2] bg-white p-3 shadow-[0_24px_60px_rgba(140,111,160,0.08)]"><Image src={project.image} alt={project.title} width={600} height={520} className="h-[520px] w-full rounded-[1.5rem] object-cover" /></div>
          <div className="space-y-6 rounded-[2rem] border border-[#eedaf1] bg-white p-7 shadow-[0_20px_46px_rgba(139,110,160,0.06)]">
            <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#856895]">{project.category}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#2f1d36]">{project.title}</h1></div>
            <p className="text-lg leading-8 text-[#5f4b67]">{project.description}</p>
            <div className="rounded-[1.5rem] bg-[#fdf3fb] p-4"><p className="text-sm uppercase tracking-[0.18em] text-[#815f86]">{t('madeToOrder')}</p><p className="mt-2 text-2xl font-semibold text-[#2f1d36]">{project.priceLabel ?? t('madeToOrder')}</p></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5d8d]">{t('materials')}</p><p className="mt-2 text-base leading-7 text-[#564a65]">{project.materials}</p></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5d8d]">{t('palette')}</p><div className="mt-3 flex flex-wrap gap-2">{project.colors.map((color) => <span key={color.key} className="rounded-full border border-[#e6d3ec] bg-[#fffafc] px-3 py-1.5 text-sm text-[#554563]">{color.label}</span>)}</div></div>
            <ProductDetailActions project={project} />
          </div>
        </div>
      </div>
    </main>
  );
}
