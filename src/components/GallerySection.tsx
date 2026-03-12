'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';
import Image from 'next/image';

const galleryImages = [
    {
        id: 1,
        alt: 'Salon Interior',
        src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop',
    },
    {
        id: 2,
        alt: 'Hair Styling',
        src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1969&auto=format&fit=crop',
    },
    {
        id: 3,
        alt: 'Nail Art',
        src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1974&auto=format&fit=crop',
    },
    {
        id: 4,
        alt: 'Spa Treatment',
        src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 5,
        alt: 'Makeup Session',
        src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1971&auto=format&fit=crop',
    },
    {
        id: 6,
        alt: 'Hair Coloring',
        src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1974&auto=format&fit=crop',
    },
    {
        id: 7,
        alt: 'Bridal Beauty',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 8,
        alt: 'Salon Tools',
        src: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1974&auto=format&fit=crop',
    },
];

export default function GallerySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!sectionRef.current) return;

            const ctx = gsap.context(() => {
                gsap.fromTo(titleRef.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );

                const items = gridRef.current?.querySelectorAll('.gallery-item');
                if (items) {
                    gsap.fromTo(items,
                        { opacity: 0, scale: 0.8 },
                        {
                            opacity: 1,
                            scale: 1,
                            stagger: 0.1,
                            duration: 0.8,
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: gridRef.current,
                                start: 'top 85%',
                                toggleActions: 'play none none none',
                            },
                        }
                    );
                }
            }, sectionRef);

            return () => ctx.revert();
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="gallery"
            className="py-20 px-4 relative z-10"
        >
            <div className="container mx-auto max-w-7xl">
                <div ref={titleRef} className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text drop-shadow-sm">
                        Gallery
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                        Explore our beautiful salon and amazing transformations
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {galleryImages.map((image, index) => (
                        <div
                            key={image.id}
                            className={`gallery-item relative overflow-hidden rounded-2xl group cursor-pointer ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                }`}
                            style={{ opacity: 1 }}
                        >
                            <div className={`relative w-full ${index === 0 ? 'aspect-square' : 'aspect-square'}`}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                                />
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3 sm:p-4">
                                <span className="text-white font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{image.alt}</span>
                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-primary-400 transition-colors">
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
