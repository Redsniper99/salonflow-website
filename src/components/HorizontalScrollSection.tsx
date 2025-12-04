'use client';

import { useRef, useLayoutEffect } from 'react';
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
    const triggerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const totalWidth = features.length * 100;

            gsap.to(sectionRef.current, {
                x: `-${(features.length - 1) * 100}vw`,
                ease: 'none',
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: 'top top',
                    end: `+=${2000}`, // Adjust scroll length
                    scrub: 1,
                    pin: true,
                    // snap: 1 / (features.length - 1), // Optional: snap to slides
                },
            });
        }, triggerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="relative overflow-hidden" ref={triggerRef}>
            {/* Horizontal Container */}
            <div
                ref={sectionRef}
                className="flex h-screen w-[400vw]" // Width = 100vw * number of slides
            >
                {features.map((feature, index) => (
                    <div
                        key={feature.id}
                        className="w-screen h-screen flex items-center justify-center relative px-4 sm:px-10"
                    >
                        {/* Glass Card */}
                        <div className="glass-dark p-8 md:p-12 rounded-2xl max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center transform transition-transform hover:scale-[1.02] duration-500">

                            {/* Text Content */}
                            <div className="order-2 md:order-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-6xl font-display text-salon-accent opacity-50">
                                        0{index + 1}
                                    </span>
                                    <div className="h-[1px] bg-white/20 flex-1"></div>
                                </div>

                                <h3 className="text-4xl md:text-5xl font-display text-white">
                                    {feature.title}
                                </h3>

                                <p className="text-salon-neutral-100/80 text-lg leading-relaxed">
                                    {feature.description}
                                </p>

                                <button className="px-8 py-3 border border-salon-accent text-salon-accent hover:bg-salon-accent hover:text-white transition-all duration-300 rounded-full uppercase tracking-wider text-sm">
                                    Learn More
                                </button>
                            </div>

                            {/* Image Content */}
                            <div className="order-1 md:order-2 relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-2xl group">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {features.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/20"></div>
                ))}
            </div>
        </section>
    );
}
