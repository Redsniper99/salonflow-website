import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import MapContactSection from '@/components/MapContactSection';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ScissorCutDivider from '@/components/ScissorCutDivider';
import AppointmentSection from '@/components/AppointmentSection';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />

      {/* Scissor cut transition */}
      <ScissorCutDivider direction="right" />

      <HorizontalScrollSection />

      {/* Scissor cut transition */}
      <ScissorCutDivider direction="left" />

      <ServicesSection />

      <ScissorCutDivider direction="right" />

      <GallerySection />

      <ScissorCutDivider direction="left" />

      <TestimonialsSection />

      <ScissorCutDivider direction="right" />

      {/* Modern Appointment Booking */}
      <AppointmentSection />

      <ScissorCutDivider direction="left" />

      {/* Map & Contact Section */}
      <MapContactSection />

      <Footer />
    </main>
  );
}
