import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { NavBar } from '@/components/public/NavBar';
import { GalleryExplorer } from '@/components/public/GalleryExplorer';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/projects';

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
