import type { Metadata } from 'next';
import { Almarai, Cairo } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/public/Footer';
import { CartDock } from '@/components/public/CartDock';
import { routing } from '@/i18n/routing';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: locale === 'ar' ? 'نيفو | صُنِع ببطء، ليبقى إلى الأبد' : 'Nevo | Made slowly. Kept forever.' };
}

export default async function LocaleLayout({ children, params }: Readonly<LayoutProps<'/[locale]'>>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${cairo.variable} ${almarai.variable} ${locale === 'ar' ? 'font-cairo' : 'font-sans'} flex min-h-full flex-1 flex-col`}>
      <NextIntlClientProvider messages={messages}>
        {children}
        <CartDock />
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}