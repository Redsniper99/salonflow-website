'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
    const contentRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animations after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
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
                className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg transition-all duration-1000 lg:whitespace-nowrap ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        Welcome to <span className="gradient-text">SalonFlow</span>
                    </h1>
                    <p className={`text-base sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto drop-shadow-md transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        Where beauty meets elegance. Experience luxury salon services
                        tailored just for you.
                    </p>
                    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        <a
                            href="/booking"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-400 to-primary-600 text-white rounded-full uppercase tracking-wider text-sm font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(116,150,116,0.5)] hover:scale-105 transition-all duration-300 text-center"
                        >
                            Book Appointment
                        </a>
                        <a
                            href="#services"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/80 text-white hover:bg-white hover:text-primary-700 backdrop-blur-sm transition-all duration-300 rounded-full uppercase tracking-wider text-sm font-semibold text-center"
                        >
                            View Services
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className={`animate-bounce transition-opacity duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md"
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
