import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('home');
  return (
    <section id="hero" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fff8fc,_#f5ecff_32%,_#f0f4ff_100%)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 lg:px-10">
        <div className="space-y-8">
          <span className="inline-flex items-center rounded-full border border-[#eac9e4] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d7d]">
            {t('eyebrow')}
          </span>

          <div className="space-y-5">
            <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.06em] text-[#2f1d36] md:text-6xl">
              {t('heroTitle')} <span className="text-[#9f6cb6]">{t('heroTitleAccent')}</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[#5d4868]">
              {t('heroDescription')}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="#gallery"
              className="rounded-full bg-[#7b5ca8] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_16px_40px_rgba(123,92,168,0.25)] transition hover:bg-[#6e4e9b]"
            >
              {t('exploreGallery')}
            </Link>
            <Link
              href="#about"
              className="rounded-full border border-[#d8c0e4] bg-white/60 px-6 py-3.5 text-center text-sm font-semibold text-[#4d2c57] transition hover:bg-[#fff8fc]"
            >
              {t('learnCraft')}
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-4 text-sm text-[#6a5972]">
            <div>
              <p className="text-2xl font-semibold text-[#2f1d36]">8+</p>
              <p>{t('collections')}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2f1d36]">1:1</p>
              <p>{t('commissions')}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#2f1d36]">100%</p>
              <p>{t('handcrafted')}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-12 h-32 w-32 rounded-full bg-[#f8d3ea]/80 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-40 w-40 rounded-full bg-[#d7d0ff]/80 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-[#eedaf1] bg-white/70 p-4 shadow-[0_30px_80px_rgba(142,99,159,0.17)] backdrop-blur-sm">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#f7eefb]">
              <img
                src="https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80"
                alt="Handcrafted crochet textures and cozy home styling"
                className="h-[560px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-10 left-10 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d6e9e]">{t('featuredMake')}</p>
              <p className="mt-1 text-lg font-semibold text-[#2f1d36]">{t('featuredProduct')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
