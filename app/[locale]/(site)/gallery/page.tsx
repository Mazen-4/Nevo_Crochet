import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { NavBar } from '@/components/public/NavBar';
import { GalleryExplorer } from '@/components/public/GalleryExplorer';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/projects';
import { alternatesFor, openGraphFor } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, projects] = await Promise.all([getTranslations({ locale, namespace: 'metadata' }), getProjects(locale)]);
  const cover = projects.find((p) => p.featured) ?? projects[0];

  return {
    title: t('galleryTitle'),
    description: t('galleryDescription'),
    alternates: alternatesFor(locale, '/gallery'),
    openGraph: openGraphFor(locale, t('siteName'), {
      title: t('galleryTitle'),
      description: t('galleryDescription'),
      url: `/${locale}/gallery`,
      ...(cover && { images: [{ url: cover.image, alt: cover.title }] }),
    }),
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const projects = await getProjects(locale);

  return (
    <>
      <NavBar />
      <GalleryExplorer projects={projects} />
    </>
  );
}
