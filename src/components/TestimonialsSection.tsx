'use client';

import { useEffect, useRef, useState } from 'react';

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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            className="py-20 px-4 relative z-10"
        >
            <div className="container mx-auto max-w-7xl">
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text drop-shadow-sm">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                        Don&apos;t just take our word for it - hear from our satisfied clients
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`p-6 sm:p-8 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-primary-400/50 transition-all duration-500 ${isVisible
                                    ? 'opacity-100 translate-x-0'
                                    : index % 2 === 0 ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Stars */}
                            <div className="flex items-center mb-4 gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-white text-base sm:text-lg mb-6 leading-relaxed italic">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-bold text-base sm:text-lg">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-primary-400 text-sm">
                                        {testimonial.service}
                                    </p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
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
