import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import VideoScroller from '@/components/VideoScroller';
import HorizontalScrollSection from "@/components/HorizontalScrollSection";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <VideoScroller />
      <Navbar />
      <HeroSection />
      <HorizontalScrollSection />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
