import { AboutSection } from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { FAQSection } from '@/components/public/FAQSection';
import { FeaturedGallery } from '@/components/public/FeaturedGallery';
import { HeroSection } from '@/components/public/HeroSection';
import { NavBar } from '@/components/public/NavBar';
import { NewsletterSection } from '@/components/public/NewsletterSection';
import { ProcessSection } from '@/components/public/ProcessSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffafc] text-[#2f1d36]">
      <NavBar />
      <HeroSection />
      <FeaturedGallery />
      <AboutSection />
      <ProcessSection />
      <FAQSection />
      <NewsletterSection />
      <ContactSection />
    </main>
  );
}
