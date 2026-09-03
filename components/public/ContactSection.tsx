"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [activeForm, setActiveForm] = useState<'question' | 'custom'>('question');
  const [imageCount, setImageCount] = useState(0);
  const isArabic = useLocale() === 'ar';
  const t = useTranslations('home');

  useEffect(() => {
    const selectCustomForm = () => {
      if (window.location.hash === '#contact-custom') {
        setActiveForm('custom');
        window.requestAnimationFrame(() => {
          document.getElementById('contact-custom')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    };

    selectCustomForm();
    window.addEventListener('hashchange', selectCustomForm);

    return () => window.removeEventListener('hashchange', selectCustomForm);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    setImageCount(event.target.files?.length ?? 0);
  };

  return (
    <section id="contact" className="bg-[#291d35] py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.1fr] md:px-8 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e9d0ff]">{t('contactEyebrow')}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
            {t('contactTitle')}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[#efe2f8]">
            {t('contactDescription')}
          </p>

          <div className="mt-8 space-y-4 text-sm text-[#f4ebff]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4b5f3]">{t('email')}</p>
              <a href="mailto:hello@nevo-studio.com" className="mt-1 block text-lg font-medium text-white">
                hello@nevo-studio.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4b5f3]">{t('whatsapp')}</p>
              <a href="https://wa.me/1234567890" className="mt-1 block text-lg font-medium text-white">
                +1 (234) 567-890
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4b5f3]">{t('responseTime')}</p>
              <p className="mt-1 text-lg font-medium text-white">{t('responseValue')}</p>
            </div>
          </div>
        </div>

        <div id="contact-custom" className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-1 rounded-[1.5rem] bg-black/10 p-1" role="tablist" aria-label={t('contactTitle')}>
            {(['question', 'custom'] as const).map((formType) => {
              const isActive = activeForm === formType;
              return (
                <button key={formType} type="button" role="tab" aria-selected={isActive} onClick={() => { setActiveForm(formType); setSubmitted(false); }} className={`rounded-[1.25rem] px-4 py-3 text-sm transition ${isActive ? 'bg-[#f5dcff] text-[#2f1d36]' : 'text-[#f4ebff] hover:bg-white/10'} ${isArabic ? 'text-ar' : ''}`}>
                  {formType === 'question' ? t('questionTab') : t('customTab')}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className={`space-y-4 p-4 pt-6 sm:p-6 ${isArabic ? 'text-ar' : ''}`}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('name')}</label>
            <input id="name" name="name" required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder={t('namePlaceholder')} />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('emailAddress')}</label>
            <input id="email" name="email" type="email" required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder={t('emailPlaceholder')} />
          </div>

          {activeForm === 'question' ? (
            <div>
              <label htmlFor="question" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('questionField')}</label>
              <textarea id="question" name="question" rows={4} required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder={t('questionPlaceholder')} />
            </div>
          ) : (
            <>
              <div><label htmlFor="custom-name" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('customName')}</label><input id="custom-name" name="customName" required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder={t('customNamePlaceholder')} /></div>
              <div><label htmlFor="custom-size" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('customSize')}</label><input id="custom-size" name="customSize" className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder={t('customSizePlaceholder')} /></div>
              <div><label htmlFor="custom-images" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('customImage')}</label><input id="custom-images" name="customImages" type="file" accept="image/*" multiple onChange={handleImages} className="sr-only" /><label htmlFor="custom-images" className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-[#f4ebff] hover:bg-white/10"><span>{t('chooseImages')}</span><span className="text-[#d4b5f3]">{imageCount > 0 ? t('selectedImages', { count: imageCount }) : '＋'}</span></label><p className="mt-2 text-xs leading-6 text-[#d9c0eb]">{t('customImageHint')}</p></div>
              <div><label htmlFor="message" className="mb-2 block text-sm font-medium text-[#f0e6ff]">{t('details')}</label><textarea id="message" name="message" rows={4} required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder={t('detailsPlaceholder')} /></div>
            </>
          )}

          <button type="submit" className="w-full rounded-full bg-[#f5dcff] px-5 py-3.5 text-sm font-semibold text-[#2f1d36] transition hover:bg-[#efd6ff]">
            {activeForm === 'question' ? t('sendMessage') : t('requestPiece')}
          </button>

          {submitted && (
            <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {t('messageSent')}
            </p>
          )}
          </form>
        </div>
      </div>
    </section>
  );
}
