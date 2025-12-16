'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

export default function BookingCTA() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from('.booking-cta-content', {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="book"
            className="relative py-20 md:py-32 overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-950/50 via-[#0a1a0a] to-primary-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-400/10 via-transparent to-transparent" />

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-400/5 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-primary-400/5 blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="booking-cta-content max-w-3xl mx-auto text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center border border-primary-400/30">
                        <span className="text-4xl">✂️</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready for Your
                        <span className="block mt-2 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 bg-clip-text text-transparent">
                            Transformation?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Book your appointment today and experience the luxury of our premium salon services.
                        Our expert stylists are ready to help you look and feel your best.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-6 mb-10">
                        {[
                            { icon: '⚡', text: 'Easy Online Booking' },
                            { icon: '👤', text: 'Choose Your Stylist' },
                            { icon: '📱', text: 'Instant Confirmation' },
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/70">
                                <span className="text-xl">{feature.icon}</span>
                                <span className="text-sm md:text-base">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/booking"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 text-white font-semibold text-lg shadow-[0_0_30px_rgba(116,150,116,0.4)] hover:shadow-[0_0_50px_rgba(116,150,116,0.6)] hover:scale-105 transition-all duration-300"
                    >
                        <span>Book Your Appointment</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>

                    {/* Sub-text */}
                    <p className="mt-6 text-white/40 text-sm">
                        No registration required • Book in under 2 minutes
                    </p>
                </div>
            </div>
        </section>
    );
}
