import { hasLocale } from 'next-intl';
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

const FEATURED_COUNT = 3;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [projects, testimonials] = await Promise.all([getProjects(locale), getTestimonials(locale)]);
  // Featured pieces first, keeping the admin-defined order within each group.
  const featured = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, FEATURED_COUNT);

  return (
    <main className="min-h-screen bg-[#fffafc] text-[#2f1d36]">
      <NavBar />
      <HeroSection />
      <FeaturedGallery projects={featured} />
      <ScrollReveal><AboutSection testimonials={testimonials} /></ScrollReveal>
      <ScrollReveal><ProcessSection /></ScrollReveal>
      <ScrollReveal><FAQSection /></ScrollReveal>
      <ScrollReveal><NewsletterSection /></ScrollReveal>
      <ScrollReveal><ContactSection /></ScrollReveal>
    </main>
  );
}
