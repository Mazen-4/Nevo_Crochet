import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { CartDock } from '@/components/public/CartDock';
import { Footer } from '@/components/public/Footer';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/projects';

/** Storefront chrome (cart dock + footer) — kept out of the admin area. */
export default async function SiteLayout({ children, params }: Readonly<LayoutProps<'/[locale]'>>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const projects = await getProjects(locale);
  const catalog = projects.map(({ id, slug, title, priceLabel }) => ({ id, slug, title, priceLabel }));

  return (
    <>
      {children}
      <CartDock catalog={catalog} />
      <Footer />
    </>
  );
}
