import { useTranslations } from 'next-intl';

const steps = [
  ['ideaTitle', 'ideaText'], ['craftTitle', 'craftText'], ['arriveTitle', 'arriveText'],
];

export function ProcessSection() {
  const t = useTranslations('home');
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-20 md:px-8 lg:px-10">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">{t('processEyebrow')}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl">
          {t('processTitle')}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map(([title, text]) => (
          <div key={title} className="rounded-[1.75rem] border border-[#eedaf1] bg-white p-7 shadow-[0_14px_32px_rgba(148,112,169,0.07)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8e6da5]">{t(`steps.${title}`)}</p>
            <p className="mt-5 text-base leading-7 text-[#5d4b67]">{t(`steps.${text}`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
