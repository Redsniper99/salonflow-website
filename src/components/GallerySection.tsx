'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsapConfig';
import Image from 'next/image';
import { themeContent } from '@/themes';

const { gallery } = themeContent;

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef   = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sectionRef.current) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(titleRef.current, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
        gsap.fromTo('.gallery-item', { opacity: 0 }, {
          opacity: 1, stagger: 0.07, duration: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        });
      }, sectionRef);
      return () => ctx.revert();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-14 lg:py-20 bg-[var(--t-bg-2)] relative z-10"
    >
      {/* Header */}
      <div ref={titleRef} className="max-w-screen-xl mx-auto px-6 lg:px-12 mb-8 lg:mb-10">
        <p className="t-script text-[var(--t-accent-2)] mb-4" style={{ fontSize: '1.2rem' }}>{gallery.label}</p>
        <h2
          className="t-display font-light text-[var(--t-text)]"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
        >
          {gallery.heading}
        </h2>
      </div>

      {/* Full-width tight grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        {gallery.images.map((image) => (
          <div
            key={image.id}
            className={`gallery-item relative overflow-hidden group ${image.wide ? 'md:col-span-2' : ''}`}
            style={{ opacity: 1 }}
          >
            <div className="relative w-full aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes={image.wide ? '50vw' : '25vw'}
              />
            </div>
            {/* Hover overlay — warm tan tint instead of pure black */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{ background: 'rgba(205,155,119,0.55)' }}
            >
              <span className="t-label text-white tracking-widest text-center px-4">
                {image.alt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
