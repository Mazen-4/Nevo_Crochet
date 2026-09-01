import { AboutSection } from '@/components/public/AboutSection';
import { ContactSection } from '@/components/public/ContactSection';
import { FeaturedGallery } from '@/components/public/FeaturedGallery';
import { HeroSection } from '@/components/public/HeroSection';
import { NavBar } from '@/components/public/NavBar';
import { ProcessSection } from '@/components/public/ProcessSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffafc] text-[#2f1d36]">
      <NavBar />
      <HeroSection />
      <FeaturedGallery />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
