'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const faqKeys = ['custom', 'timing', 'care', 'shipping', 'inquiry'] as const;

export function FAQSection() {
  const t = useTranslations('home');
  const isArabic = useLocale() === 'ar';
  const [openKey, setOpenKey] = useState<string | null>(faqKeys[0]);

  return (
    <section id="faq" className={`mx-auto max-w-4xl px-5 py-20 md:px-8 ${isArabic ? 'text-ar' : ''}`}>
      <div className="mb-10 text-center">
        <p className={`text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e] ${isArabic ? 'text-ar-small' : ''}`}>
          {t('faqEyebrow')}
        </p>
        <h2 className={`mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl ${isArabic ? 'text-ar-title' : ''}`}>
          {t('faqTitle')}
        </h2>
      </div>

      <div className="divide-y divide-[#eedaf1] rounded-[1.5rem] border border-[#eedaf1] bg-white px-5 shadow-[0_14px_32px_rgba(148,112,169,0.07)]">
        {faqKeys.map((key) => {
          const isOpen = openKey === key;
          const panelId = `faq-answer-${key}`;

          return (
            <div key={key}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenKey(isOpen ? null : key)}
                className={`flex w-full items-center justify-between gap-6 py-5 text-start text-base font-semibold text-[#2f1d36] ${isArabic ? 'text-ar' : ''}`}
              >
                <span>{t(`faq.${key}.question`)}</span>
                <span aria-hidden="true" className="text-2xl font-normal text-[#7b5ca8]">{isOpen ? '−' : '+'}</span>
              </button>
              <div id={panelId} hidden={!isOpen} className={`pb-5 text-sm leading-7 text-[#5d4b67] ${isArabic ? 'text-ar-body' : ''}`}>
                {t(`faq.${key}.answer`)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}