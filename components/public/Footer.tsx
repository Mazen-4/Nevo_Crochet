import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="border-t border-[#ead8ef] bg-[#fffafc] px-5 py-8 text-sm text-[#6a5972] md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-[#2f1d36]">Nevo</p>
          <p>{t('tagline')}</p>
        </div>
        <nav aria-label="Footer navigation" className="flex gap-5">
          <a href="#contact" className="hover:text-[#7b5ca8]">{t('contact')}</a>
          <a href="#" className="hover:text-[#7b5ca8]">{t('privacy')}</a>
          <a href="#" className="hover:text-[#7b5ca8]">{t('terms')}</a>
        </nav>
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}