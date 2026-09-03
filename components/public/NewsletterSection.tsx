'use client';

import { FormEvent, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export function NewsletterSection() {
  const t = useTranslations('home');
  const isArabic = useLocale() === 'ar';
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section id="newsletter" className="border-y border-[#ead8ef] bg-[#fdf8fb] px-5 py-16 md:px-8 lg:px-10">
      <div className={`mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between ${isArabic ? 'text-ar' : ''}`}>
        <div className="max-w-xl">
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e] ${isArabic ? 'text-ar-small' : ''}`}>
            {t('newsletterEyebrow')}
          </p>
          <h2 className={`mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl ${isArabic ? 'text-ar-title' : ''}`}>
            {t('newsletterTitle')}
          </h2>
          <p className={`mt-4 text-base leading-7 text-[#5d4b67] ${isArabic ? 'text-ar-body' : ''}`}>
            {t('newsletterDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <label htmlFor="newsletter-email" className={`sr-only ${isArabic ? 'text-ar' : ''}`}>{t('newsletterEmailLabel')}</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t('newsletterPlaceholder')}
              className={`min-h-12 flex-1 rounded-full border border-[#decbe5] bg-white px-5 text-sm text-[#2f1d36] outline-none transition placeholder:text-[#927e9a] focus:border-[#7b5ca8] focus:ring-2 focus:ring-[#7b5ca8]/20 ${isArabic ? 'text-ar' : ''}`}
            />
            <button
              type="submit"
              className={`min-h-12 rounded-full bg-[#7b5ca8] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(123,92,168,0.2)] transition hover:bg-[#6e4e9b] ${isArabic ? 'text-ar' : ''}`}
            >
              {t('newsletterButton')}
            </button>
          </div>
          <p className={`mt-3 text-xs text-[#806d87] ${isArabic ? 'text-ar-small' : ''}`}>{t('newsletterPrivacy')}</p>
          {submitted && (
            <p role="status" className={`mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ${isArabic ? 'text-ar-body' : ''}`}>
              {t('newsletterSuccess')}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
