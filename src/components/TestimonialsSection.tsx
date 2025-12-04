'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsapConfig';

const testimonials = [
    {
        name: 'Sarah Johnson',
        rating: 5,
        text: 'Absolutely amazing experience! The staff is professional and the results exceeded my expectations.',
        service: 'Hair Styling',
    },
    {
        name: 'Emily Chen',
        rating: 5,
        text: 'Best salon in town! My nails have never looked this good. Highly recommend!',
        service: 'Nail Care',
    },
    {
        name: 'Maria Rodriguez',
        rating: 5,
        text: 'The bridal package was perfect for my wedding day. I felt like a princess!',
        service: 'Bridal Package',
    },
    {
        name: 'Jessica Lee',
        rating: 5,
        text: 'The spa treatment was so relaxing. I left feeling completely rejuvenated.',
        service: 'Spa Treatment',
    },
];

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonials-title', {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            });

            gsap.from('.testimonial-card', {
                opacity: 0,
                x: (index) => (index % 2 === 0 ? -50 : 50),
                stagger: 0.2,
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
            id="testimonials"
            className="py-20 px-4 relative z-10"
        >
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16 testimonials-title">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text drop-shadow-sm">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                        Don't just take our word for it - hear from our satisfied clients
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial-card glass-dark p-8 rounded-3xl"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-salon-accent fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-white text-lg mb-6 leading-relaxed italic">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-bold text-lg">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-salon-accent-light text-sm">
                                        {testimonial.service}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-salon-green to-salon-green-light flex items-center justify-center text-white font-bold text-xl">
                                    {testimonial.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
