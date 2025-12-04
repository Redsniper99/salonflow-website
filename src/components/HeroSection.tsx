'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

export default function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate hero content on load
            gsap.from('.hero-title', {
                opacity: 0,
                y: 50,
                duration: 1.2,
                delay: 0.5,
                ease: 'power3.out',
            });

            gsap.from('.hero-subtitle', {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.8,
                ease: 'power3.out',
            });

            gsap.from('.hero-buttons', {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 1.1,
                ease: 'power3.out',
            });

            // Video scroll effect
            if (sectionRef.current && videoRef.current) {
                gsap.to(videoRef.current, {
                    scale: 1.2,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                    },
                });
            }

            // Fade out content on scroll
            if (contentRef.current) {
                gsap.to(contentRef.current, {
                    opacity: 0,
                    y: -100,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '50% top',
                        scrub: 1,
                    },
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="home"
            className="relative w-full h-screen overflow-hidden"
        >
            {/* Hero Content */}
            <div
                ref={contentRef}
                className="relative z-10 h-full flex items-center justify-center text-center px-4"
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Welcome to{' '}
                        <span className="gradient-text block mt-2">SalonFlow</span>
                    </h1>
                    <p className="hero-subtitle text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
                        Where beauty meets elegance. Experience luxury salon services
                        tailored just for you.
                    </p>
                    <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="btn-primary shadow-xl">
                            Book Appointment
                        </button>
                        <button className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-salon-green-dark backdrop-blur-sm transition-all duration-300 rounded-full uppercase tracking-wider text-sm font-semibold">
                            View Services
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="animate-bounce">
                    <svg
                        className="w-6 h-6 text-white drop-shadow-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
}
