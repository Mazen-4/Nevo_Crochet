import { Link } from '@/i18n/navigation';
import { hasLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { ProductDetailActions } from '@/components/public/ProductDetailActions';
import { projects } from '@/lib/data/site';
import { routing } from '@/i18n/routing';

const colorKeys: Record<string, string[]> = {
  'luna-cushion-set': ['blush', 'lavender', 'cream'],
  'rose-loop-throw': ['rose', 'lilac', 'grey'],
  'petal-market-basket': ['petal', 'peony', 'sand'],
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return <ProductDetailContent project={project} />;
}

function ProductDetailContent({ project }: { project: (typeof projects)[number] }) {
  const t = useTranslations('common');
  const product = useTranslations(`products.${project.slug}`);

  return (
    <main className="min-h-screen bg-[#fffafc] px-5 py-10 text-[#2f1d36] md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#4f3559] hover:bg-[#fff8fc]">← {t('backToGallery')}</Link>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#efdff2] bg-white p-3 shadow-[0_24px_60px_rgba(140,111,160,0.08)]"><img src={project.image} alt={product('title')} className="h-[520px] w-full rounded-[1.5rem] object-cover" /></div>
          <div className="space-y-6 rounded-[2rem] border border-[#eedaf1] bg-white p-7 shadow-[0_20px_46px_rgba(139,110,160,0.06)]">
            <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">{product('category')}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#2f1d36]">{product('title')}</h1></div>
            <p className="text-lg leading-8 text-[#5f4b67]">{product('description')}</p>
            <div className="rounded-[1.5rem] bg-[#fdf3fb] p-4"><p className="text-sm uppercase tracking-[0.18em] text-[#815f86]">{t('madeToOrder')}</p><p className="mt-2 text-2xl font-semibold text-[#2f1d36]">{product('price')}</p></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5d8d]">{t('materials')}</p><p className="mt-2 text-base leading-7 text-[#564a65]">{product('materials')}</p></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5d8d]">{t('palette')}</p><div className="mt-3 flex flex-wrap gap-2">{project.colors.map((color, index) => <span key={color} className="rounded-full border border-[#e6d3ec] bg-[#fffafc] px-3 py-1.5 text-sm text-[#554563]">{product(`colors.${colorKeys[project.slug][index]}`)}</span>)}</div></div>
            <ProductDetailActions project={project} />
          </div>
        </div>
      </div>
    </main>
  );
}