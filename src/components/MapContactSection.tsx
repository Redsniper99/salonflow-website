'use client';

import { useEffect, useRef, useState } from 'react';

const contactInfo = [
    {
        icon: '📍',
        title: 'Visit Us',
        details: ['123 Beauty Boulevard', 'Downtown Fashion District', 'New York, NY 10001'],
    },
    {
        icon: '📞',
        title: 'Call Us',
        details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    },
    {
        icon: '✉️',
        title: 'Email Us',
        details: ['hello@salonflow.com', 'bookings@salonflow.com'],
    },
    {
        icon: '🕐',
        title: 'Working Hours',
        details: ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat: 10:00 AM - 6:00 PM', 'Sun: Closed'],
    },
];

export default function MapContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeCard, setActiveCard] = useState<number | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        setTimeout(() => setMapLoaded(true), 500);
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
            id="contact"
            className="relative py-20 px-4 z-10 bg-gradient-to-b from-transparent via-primary-950/50 to-primary-950"
        >
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text">
                        Find Us
                    </h2>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        Visit our salon or get in touch with us
                    </p>
                </div>

                {/* Main Content - Side by Side */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    {/* Map Side */}
                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                        }`}>
                        <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            {/* Map Loading Animation */}
                            {!mapLoaded && (
                                <div className="absolute inset-0 bg-primary-900 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-white/60">Loading map...</p>
                                    </div>
                                </div>
                            )}

                            {/* Interactive Map Iframe */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076904379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1635959481234!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(30%) brightness(0.9) contrast(1.1)', minHeight: '400px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className={`transition-opacity duration-700 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />

                            {/* Map Overlay with Location Pin */}
                            <div className="absolute top-4 left-4 glass px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="w-3 h-3 bg-primary-400 rounded-full animate-pulse shadow-[0_0_10px_#749674]"></span>
                                <span className="text-sm font-medium text-primary-800">SalonFlow Studio</span>
                            </div>

                            {/* Directions Button */}
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-4 right-4 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-500 transition-all hover:scale-105 shadow-lg shadow-primary-600/30 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Contact Info Cards - 2x2 Grid */}
                    <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                        }`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer group flex flex-col justify-center border-2 bg-white/5 backdrop-blur-md ${activeCard === index
                                        ? 'border-primary-400/50 bg-white/10 shadow-[0_0_30px_rgba(116,150,116,0.2)] scale-[1.02]'
                                        : 'border-white/10 hover:bg-white/10 hover:border-primary-400/50'
                                        }`}
                                    onMouseEnter={() => setActiveCard(index)}
                                    onMouseLeave={() => setActiveCard(null)}
                                >
                                    <div className={`text-4xl mb-4 transition-transform duration-300 ${activeCard === index ? 'scale-125' : 'group-hover:scale-110'
                                        }`}>
                                        {info.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{info.title}</h3>
                                    <div className="space-y-1">
                                        {info.details.map((detail, i) => (
                                            <p key={i} className="text-white/70">{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        </section>
    );
}
