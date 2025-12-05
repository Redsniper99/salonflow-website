'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
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
import AppointmentSection from '@/components/AppointmentSection';
import Preloader from '@/components/Preloader';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Main Content */}
      <main className={`relative min-h-screen transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
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

        {/* Modern Appointment Booking */}
        <AppointmentSection />

        <ScissorCutDivider direction="left" />

        {/* Map & Contact Section */}
        <MapContactSection />

        <Footer />
      </main>
    </>
  );
}
