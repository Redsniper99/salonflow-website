'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from '@/utils/gsapConfig';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
    alwaysVisible?: boolean;
}

export default function Navbar({ alwaysVisible = false }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hideForAppointment, setHideForAppointment] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // If alwaysVisible, skip scroll handling
        if (alwaysVisible) {
            setIsVisible(true);
            setHideForAppointment(false);
            return;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            // Update scroll state
            setIsScrolled(scrollPosition > 20);

            // Check if we're in the appointment section on mobile
            const appointmentSection = document.getElementById('appointment');
            if (appointmentSection && isMobile) {
                const rect = appointmentSection.getBoundingClientRect();
                const isInSection = rect.top <= 100 && rect.bottom >= window.innerHeight / 2;
                setHideForAppointment(isInSection);
            } else {
                setHideForAppointment(false);
            }

            // Show navbar when scrolling
            setIsVisible(true);

            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Hide navbar after scroll stops (only if scrolled down past hero)
            if (scrollPosition > 100) {
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsVisible(false);
                }, 2000);
            }

            lastScrollY.current = scrollPosition;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [isMobile, alwaysVisible]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.from('.mobile-menu-item', {
                opacity: 0,
                y: -10,
                stagger: 0.05,
                duration: 0.4,
                ease: 'power2.out',
            });
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    // Determine visibility - hide for appointment on mobile (unless alwaysVisible)
    const shouldHide = !alwaysVisible && ((hideForAppointment && isMobile) || !isVisible);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${(isScrolled || alwaysVisible)
                ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 py-3'
                : 'bg-transparent py-6'
                } ${shouldHide ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
            onMouseEnter={() => !hideForAppointment && setIsVisible(true)}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="#home" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 relative transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src="/logo.svg"
                                alt="SalonFlow Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold gradient-text font-display tracking-wide">
                            SalonFlow
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-white/90 hover:text-salon-accent transition-colors duration-300 font-medium text-sm tracking-wide uppercase"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link href="/booking" className="btn-primary text-sm px-6 py-2.5 shadow-lg shadow-salon-green/20">
                            Book Appointment
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 shadow-2xl">
                        <div className="flex flex-col py-6 px-6 space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="mobile-menu-item text-white/90 hover:text-salon-accent hover:bg-white/5 transition-all duration-300 font-medium py-3 px-4 rounded-xl flex items-center justify-between group"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-salon-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            ))}
                            <div className="pt-4 mt-2 border-t border-white/10">
                                <Link
                                    href="/booking"
                                    className="btn-primary w-full py-3 text-base shadow-lg block text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Book Appointment
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
