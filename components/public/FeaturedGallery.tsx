"use client";

import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { projects } from '@/lib/data/site';
import { useInquiryCart } from '@/components/public/InquiryCartProvider';

export function FeaturedGallery() {
  const { addItem } = useInquiryCart();
  const t = useTranslations('home');
  const common = useTranslations('common');
  const product = useTranslations('products');
  const isArabic = useLocale() === 'ar';
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-5 py-20 md:px-8 lg:px-10">
      <div className="mb-10 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">{t('galleryEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl">
            {t('galleryTitle')}
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
          <Link href="/gallery" className="text-sm font-semibold text-[#6d4e82] hover:text-[#4f3459]">
            {t('showMore')}
          </Link>
          <Link
            href="/#contact-custom"
            onClick={() => window.dispatchEvent(new Event('nevo:open-custom-request'))}
            className="text-sm font-semibold text-[#6d4e82] hover:text-[#4f3459]"
          >
            {t('customPiece')}
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className={`group overflow-hidden rounded-[1.75rem] border border-[#f1e1f0] bg-white shadow-[0_16px_38px_rgba(140,110,166,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(119,80,146,0.12)] ${isArabic ? 'text-ar' : ''}`}>
            <Link href={`/products/${project.slug}`} className="block">
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={product(`${project.slug}.title`)}
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#f9ebf5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#815f86]">
                  {product(`${project.slug}.category`)}
                </span>
                <span className="text-sm font-medium text-[#7d5d8f]">{product(`${project.slug}.price`)}</span>
              </div>

              <div>
                <h3 className={`text-2xl font-semibold tracking-[-0.04em] text-[#2f1d36] ${isArabic ? 'text-ar-title mb-2' : ''}`}>{product(`${project.slug}.title`)}</h3>
                <p className={`mt-2 text-sm leading-6 text-[#5e4b66] ${isArabic ? 'text-ar-body mb-4' : ''}`}>{product(`${project.slug}.description`)}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.colors.map((color, index) => (
                  <span key={color} className="rounded-full border border-[#ead8ef] bg-[#fffafc] px-2.5 py-1 text-xs text-[#5f4e69]">
                    {product(`${project.slug}.colors.${['blush', 'lavender', 'cream', 'rose', 'lilac', 'grey', 'petal', 'peony', 'sand'][project.id === '1' ? index : project.id === '2' ? index + 3 : index + 6]}`)}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/products/${project.slug}`}
                  className={`inline-flex rounded-full bg-[#f4ebff] px-4 py-2.5 text-sm font-semibold text-[#504061] transition hover:bg-[#e9dcff] ${isArabic ? 'text-ar' : ''}`}
                >
                  {common('viewDetails')}
                </Link>
                <button
                  type="button"
                  onClick={() => addItem(project)}
                  className={`inline-flex rounded-full border border-[#ead8ef] px-4 py-2.5 text-sm font-semibold text-[#504061] transition hover:bg-[#fff8fc] ${isArabic ? 'text-ar' : ''}`}
                >
                  {common('addToCart')}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
