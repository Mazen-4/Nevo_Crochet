import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AboutSection } from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { FAQSection } from '@/components/public/FAQSection';
import { FeaturedGallery } from '@/components/public/FeaturedGallery';
import { HeroSection } from '@/components/public/HeroSection';
import { NavBar } from '@/components/public/NavBar';
import { NewsletterSection } from '@/components/public/NewsletterSection';
import { ProcessSection } from '@/components/public/ProcessSection';
import { ScrollReveal } from '@/components/public/ScrollReveal';
import { routing } from '@/i18n/routing';
import { getProjects, getTestimonials } from '@/lib/projects';
import { getContactSettings } from '@/lib/settings';
import { FAQ_KEYS } from '@/lib/faq';
import { alternatesFor, jsonLd, localeUrl, OFFICIAL_SOCIAL, openGraphFor } from '@/lib/site';
import type { Project } from '@/types';

const FEATURED_COUNT = 3;

/** Featured pieces first, keeping the admin-defined order within each group. */
const pickFeatured = (projects: Project[]) => [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, FEATURED_COUNT);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [projects, t] = await Promise.all([getProjects(locale), getTranslations({ locale, namespace: 'metadata' })]);
  const cover = pickFeatured(projects)[0];

  return {
    alternates: alternatesFor(locale, ''),
    openGraph: openGraphFor(locale, t('siteName'), {
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      ...(cover && { images: [{ url: cover.image, alt: cover.title }] }),
    }),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [projects, testimonials, contact, t, meta] = await Promise.all([
    getProjects(locale),
    getTestimonials(locale),
    getContactSettings(),
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'metadata' }),
  ]);
  const featured = pickFeatured(projects);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: meta('siteName'),
      url: localeUrl(locale, ''),
      slogan: meta('slogan'),
      description: meta('description'),
      sameAs: Object.values(OFFICIAL_SOCIAL),
      ...(contact.email && { email: contact.email }),
      ...(contact.whatsapp && { telephone: `+${contact.whatsapp.digits}` }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale,
      mainEntity: FAQ_KEYS.map((key) => ({
        '@type': 'Question',
        name: t(`faq.${key}.question`),
        acceptedAnswer: { '@type': 'Answer', text: t(`faq.${key}.answer`) },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffafc] text-[#2f1d36]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <NavBar />
      <HeroSection featured={featured[0]} />
      <FeaturedGallery projects={featured} />
      <ScrollReveal><AboutSection testimonials={testimonials} /></ScrollReveal>
      <ScrollReveal><ProcessSection /></ScrollReveal>
      <ScrollReveal><FAQSection /></ScrollReveal>
      <ScrollReveal><NewsletterSection /></ScrollReveal>
      <ScrollReveal><ContactSection contact={contact} /></ScrollReveal>
    </main>
  );
}
