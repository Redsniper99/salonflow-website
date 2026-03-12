'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import GallerySection from '@/components/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import MapContactSection from '@/components/MapContactSection';
import Footer from '@/components/Footer';
import VideoScroller from '@/components/VideoScroller';
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ScissorCutDivider from '@/components/ScissorCutDivider';
import BookingCTA from '@/components/BookingCTA';
import Preloader from '@/components/Preloader';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Delayed content visibility to ensure smooth transition
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure video/content is ready
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      {/* Preloader - always mounted but fades out */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Background layer to prevent white flash */}
      <div className="fixed inset-0 bg-primary-950 -z-20" />

      {/* Main Content */}
      <main
        className={`relative min-h-screen transition-opacity duration-700 ease-out ${showContent ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      >
        {/* Full-page scroll-controlled video background */}
        <VideoScroller />

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

        {/* Booking Call to Action */}
        <BookingCTA />

        <ScissorCutDivider direction="left" />

        {/* Map & Contact Section */}
        <MapContactSection />

        <Footer />
      </main>
    </>
  );
}
