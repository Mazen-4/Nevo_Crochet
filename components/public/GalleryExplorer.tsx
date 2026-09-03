'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { projects } from '@/lib/data/site';
import { useInquiryCart } from '@/components/public/InquiryCartProvider';

type Filter = 'all' | 'home' | 'blankets' | 'accessories';
type Sort = 'featured' | 'latest' | 'name';

const categoryKeys: Record<string, Filter> = {
  Home: 'home',
  Blankets: 'blankets',
  Accessories: 'accessories',
};

const colorKeys: Record<string, string[]> = {
  'luna-cushion-set': ['blush', 'lavender', 'cream'],
  'rose-loop-throw': ['rose', 'lilac', 'grey'],
  'petal-market-basket': ['petal', 'peony', 'sand'],
};

const placeholderKeys = ['placeholderOne', 'placeholderTwo', 'placeholderThree'] as const;

export function GalleryExplorer() {
  const { addItem } = useInquiryCart();
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('home');
  const product = useTranslations('products');
  const common = useTranslations('common');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((project) => filter === 'all' || categoryKeys[project.category] === filter);
    return [...filtered].sort((first, second) => {
      if (sort === 'featured') return Number(second.featured) - Number(first.featured);
      if (sort === 'latest') return Number(second.id) - Number(first.id);
      return product(`${first.slug}.title`).localeCompare(product(`${second.slug}.title`), locale);
    });
  }, [filter, sort, product, locale]);

  const filters: Array<[Filter, string]> = [
    ['all', 'all'],
    ['home', 'home'],
    ['blankets', 'blankets'],
    ['accessories', 'accessories'],
  ];

  return (
    <main className={`min-h-screen bg-[#fffafc] text-[#2f1d36] ${isArabic ? 'text-ar' : ''}`}>
      <section className="border-b border-[#ead8ef] bg-[radial-gradient(circle_at_top_left,_#fff8fc,_#f5ecff_34%,_#fffafc_82%)] px-5 py-16 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e] ${isArabic ? 'text-ar-small' : ''}`}>{t('galleryPage.eyebrow')}</p>
          <h1 className={`mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-6xl ${isArabic ? 'text-ar-title' : ''}`}>{t('galleryPage.title')}</h1>
          <p className={`mt-5 max-w-2xl text-lg leading-8 text-[#5d4868] ${isArabic ? 'text-ar-body' : ''}`}>{t('galleryPage.description')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#ead8ef] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <label className={`mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6e9e] ${isArabic ? 'text-ar-small' : ''}`}>
              {t('galleryPage.filterLabel')}
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('galleryPage.filterLabel')}>
              {filters.map(([value, label]) => (
                <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === value ? 'border-[#2f1d36] bg-[#2f1d36] text-white' : 'border-[#ead8ef] bg-white text-[#563d5f] hover:bg-[#f4ebff]'} ${isArabic ? 'text-ar' : ''}`}>
                  {t(`galleryPage.${label}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm text-[#806d87] ${isArabic ? 'text-ar-small' : ''}`}>{t('galleryPage.results', { count: visibleProjects.length })}</span>
            <label htmlFor="gallery-sort" className="sr-only">{t('galleryPage.sortLabel')}</label>
            <select id="gallery-sort" value={sort} onChange={(event) => setSort(event.target.value as Sort)} className={`rounded-full border border-[#decbe5] bg-white px-4 py-2.5 text-sm font-semibold text-[#563d5f] outline-none focus:border-[#7b5ca8] ${isArabic ? 'text-ar' : ''}`}>
              <option value="featured">{t('galleryPage.featured')}</option>
              <option value="latest">{t('galleryPage.latest')}</option>
              <option value="name">{t('galleryPage.name')}</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {visibleProjects.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-[1.75rem] border border-[#f1e1f0] bg-white shadow-[0_16px_38px_rgba(140,110,166,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(119,80,146,0.12)]">
              <Link href={`/products/${project.slug}`} className="block">
                <div className="overflow-hidden"><img src={project.image} alt={product(`${project.slug}.title`)} className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" /></div>
              </Link>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4"><span className="rounded-full bg-[#f9ebf5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#815f86]">{product(`${project.slug}.category`)}</span><span className="text-sm font-medium text-[#7d5d8f]">{product(`${project.slug}.price`)}</span></div>
                <div><h2 className={`text-2xl font-semibold tracking-[-0.04em] text-[#2f1d36] ${isArabic ? 'text-ar-title' : ''}`}>{product(`${project.slug}.title`)}</h2><p className={`mt-2 text-sm leading-6 text-[#5e4b66] ${isArabic ? 'text-ar-body' : ''}`}>{product(`${project.slug}.description`)}</p></div>
                <div className="flex flex-wrap gap-2">{project.colors.map((color, index) => <span key={color} className="rounded-full border border-[#ead8ef] bg-[#fffafc] px-2.5 py-1 text-xs text-[#5f4e69]">{product(`${project.slug}.colors.${colorKeys[project.slug][index]}`)}</span>)}</div>
                <div className="flex gap-3"><Link href={`/products/${project.slug}`} className={`inline-flex rounded-full bg-[#f4ebff] px-4 py-2.5 text-sm font-semibold text-[#504061] transition hover:bg-[#e9dcff] ${isArabic ? 'text-ar' : ''}`}>{common('viewDetails')}</Link><button type="button" onClick={() => addItem(project)} className={`inline-flex rounded-full border border-[#ead8ef] px-4 py-2.5 text-sm font-semibold text-[#504061] transition hover:bg-[#fff8fc] ${isArabic ? 'text-ar' : ''}`}>{common('addToCart')}</button></div>
              </div>
            </article>
          ))}

          {placeholderKeys.map((key) => (
            <article key={key} className="flex min-h-[34rem] flex-col justify-between rounded-[1.75rem] border border-dashed border-[#d9c5e1] bg-[#fdf8fb] p-6">
              <div className="flex h-80 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_#fff,_#f7eefb)]"><span className="rounded-full border border-[#e5d2eb] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6e9e]">{t('galleryPage.comingSoon')}</span></div>
              <div><h2 className={`mt-6 text-2xl font-semibold text-[#2f1d36] ${isArabic ? 'text-ar-title' : ''}`}>{t(`galleryPage.${key}`)}</h2><p className={`mt-2 text-sm leading-6 text-[#6b5873] ${isArabic ? 'text-ar-body' : ''}`}>{t('galleryPage.placeholderText')}</p></div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/#contact-custom" className={`inline-flex rounded-full bg-[#7b5ca8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(123,92,168,0.2)] transition hover:bg-[#6d4f9b] ${isArabic ? 'text-ar' : ''}`}>
            {t('galleryPage.requestCustom')}
          </Link>
        </div>
      </section>
    </main>
  );
}
