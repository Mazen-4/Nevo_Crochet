'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

    const frame = window.requestAnimationFrame(() => {
      document.documentElement.removeAttribute('data-locale-switching');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [locale]);

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    document.documentElement.setAttribute('data-locale-switching', 'true');
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextLocale === 'ar' ? 'rtl' : 'ltr';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#ead8ef] bg-white/70 p-1 text-xs text-ar" aria-label="Language">
      {(['en', 'ar'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => switchLocale(option)}
          aria-pressed={locale === option}
          className={`rounded-full px-2.5 py-1.5 font-semibold transition ${locale === option ? 'bg-[#2f1d36] text-white' : 'text-[#563d5f] hover:bg-[#f4ebff]'}`}
        >
          {option === 'en' ? 'English' : 'العربية'}
        </button>
      ))}
    </div>
  );
}