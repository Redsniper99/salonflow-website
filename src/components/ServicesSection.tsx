'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsapConfig';

const services = [
    {
        icon: '✂️',
        title: 'Hair Styling',
        description: 'Professional cuts, colors, and styling for all hair types',
    },
    {
        icon: '💅',
        title: 'Nail Care',
        description: 'Manicures, pedicures, and nail art by expert technicians',
    },
    {
        icon: '💆',
        title: 'Spa Treatments',
        description: 'Relaxing facials, massages, and body treatments',
    },
    {
        icon: '💄',
        title: 'Makeup',
        description: 'Bridal, party, and everyday makeup services',
    },
    {
        icon: '👰',
        title: 'Bridal Packages',
        description: 'Complete bridal beauty packages for your special day',
    },
    {
        icon: '🧖',
        title: 'Skin Care',
        description: 'Advanced skincare treatments and consultations',
    },
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.section-title', {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            });

            gsap.from('.service-card', {
                opacity: 0,
                y: 60,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="services"
            className="py-20 px-4 relative z-10"
        >
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16 section-title">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text drop-shadow-sm">
                        Our Services
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                        Discover our wide range of premium beauty and wellness services
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card glass p-8 rounded-3xl hover:scale-105 transition-all duration-300 cursor-pointer group hover:bg-white/20"
                        >
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">
                                {service.title}
                            </h3>
                            <p className="text-white/80 leading-relaxed font-medium">
                                {service.description}
                            </p>
                            <button className="mt-6 text-salon-accent font-bold hover:text-white transition-colors duration-300 uppercase tracking-wider text-sm">
                                Learn More →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
