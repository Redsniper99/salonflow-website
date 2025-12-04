'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsapConfig';
import Image from 'next/image';

const galleryImages = [
    { id: 1, alt: 'Salon Interior 1' },
    { id: 2, alt: 'Hair Styling' },
    { id: 3, alt: 'Nail Art' },
    { id: 4, alt: 'Spa Treatment' },
    { id: 5, alt: 'Makeup Session' },
    { id: 6, alt: 'Salon Interior 2' },
];

export default function GallerySection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.gallery-title', {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            });

            gsap.from('.gallery-item', {
                opacity: 0,
                scale: 0.8,
                stagger: 0.1,
                duration: 0.8,
                ease: 'back.out(1.7)',
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
            id="gallery"
            className="py-20 px-4 relative z-10"
        >
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16 gallery-title">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text drop-shadow-sm">
                        Gallery
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                        Explore our beautiful salon and amazing transformations
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {galleryImages.map((image, index) => (
                        <div
                            key={image.id}
                            className={`gallery-item relative overflow-hidden rounded-2xl group cursor-pointer ${index === 0 || index === 5 ? 'sm:col-span-2 lg:col-span-1' : ''
                                }`}
                        >
                            <div className="relative aspect-square bg-gradient-to-br from-salon-green to-salon-green-light flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">
                                    {image.alt}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button className="btn-primary text-sm">
                                    View Full
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
