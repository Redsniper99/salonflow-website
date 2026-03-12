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
import ScissorCutDivider from '@/components/ScissorCutDivider';
import BookingCTA from '@/components/BookingCTA';
import Preloader from '@/components/Preloader';

export default function Home() {
  const [isLoading, setIsLoading]     = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Background prevents flash */}
      <div className="fixed inset-0 bg-[var(--t-bg)] -z-20" />

      <main
        className={`relative min-h-screen transition-opacity duration-700 ease-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      >
        {/* Scroll-controlled video background (hero only) */}
        <VideoScroller />

        <Navbar />
        <HeroSection />

        <ScissorCutDivider direction="right" />
        <ServicesSection />

        <ScissorCutDivider direction="left" />
        <GallerySection />

        <ScissorCutDivider direction="right" />
        <TestimonialsSection />

        <ScissorCutDivider direction="left" />
        <BookingCTA />

        <ScissorCutDivider direction="right" />
        <MapContactSection />

        <Footer />
      </main>
    </>
  );
}
