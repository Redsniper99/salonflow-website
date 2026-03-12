'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';
import Image from 'next/image';

const features = [
    {
        id: 1,
        title: "Precision Cutting",
        description: "Our master stylists craft the perfect shape for your face and lifestyle.",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Luxury Coloring",
        description: "From balayage to vivid transformations, we use premium products for vibrant health.",
        image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2026&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Rejuvenating Spa",
        description: "Escape the city noise with our tranquil spa treatments and massages.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Bridal Packages",
        description: "Make your special day unforgettable with our comprehensive bridal beauty services.",
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop",
    },
];

export default function HorizontalScrollSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !sectionRef.current || !containerRef.current) return;

        // Wait for DOM to be ready
        const timer = setTimeout(() => {
            const section = sectionRef.current;
            const container = containerRef.current;
            if (!section || !container) return;

            const totalWidth = container.scrollWidth;
            const viewportWidth = window.innerWidth;
            const scrollDistance = totalWidth - viewportWidth;

            const ctx = gsap.context(() => {
                gsap.to(container, {
                    x: () => -scrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => `+=${scrollDistance}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });
            }, section);

            return () => ctx.revert();
        }, 300);

        return () => clearTimeout(timer);
    }, [isMounted]);

    return (
        <div
            ref={sectionRef}
            className="relative overflow-hidden z-10"
        >
            {/* Section Title */}
            <div className="absolute top-4 sm:top-8 left-0 right-0 z-20 text-center pointer-events-none">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text drop-shadow-lg">Our Expertise</h2>
                <p className="text-white/70 mt-1 sm:mt-2 text-xs sm:text-sm">Scroll to explore →</p>
            </div>

            {/* Horizontal Container */}
            <div
                ref={containerRef}
                className="flex h-screen will-change-transform"
                style={{ width: `${features.length * 100}vw` }}
            >
                {features.map((feature, index) => (
                    <div
                        key={feature.id}
                        className="w-screen h-screen flex items-center justify-center px-3 sm:px-6 md:px-10 flex-shrink-0"
                    >
                        {/* Glass Card */}
                        <div className="p-4 sm:p-6 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center border-2 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-primary-400/50 transition-all duration-500">

                            {/* Text Content */}
                            <div className="order-2 md:order-1 space-y-3 sm:space-y-4 md:space-y-6">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary-400/50">
                                        0{index + 1}
                                    </span>
                                    <div className="h-[1px] bg-white/20 flex-1"></div>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                                    {feature.title}
                                </h3>

                                <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
                                    {feature.description}
                                </p>

                                <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 border border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white transition-all duration-300 rounded-full uppercase tracking-wider text-xs sm:text-sm">
                                    Learn More
                                </button>
                            </div>

                            {/* Image Content */}
                            <div className="order-1 md:order-2 relative h-[180px] sm:h-[250px] md:h-[350px] lg:h-[400px] w-full rounded-lg sm:rounded-xl overflow-hidden shadow-2xl group">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                {features.map((_, i) => (
                    <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/30 border border-white/50"></div>
                ))}
            </div>
        </div>
    );
}
