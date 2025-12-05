'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

interface BookingData {
    service: string;
    stylist: string;
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
}

const steps = [
    { id: 1, title: 'Service', icon: '✂️', description: 'Choose your treatment' },
    { id: 2, title: 'Stylist', icon: '👩‍🦰', description: 'Select your expert' },
    { id: 3, title: 'Schedule', icon: '📅', description: 'Pick date & time' },
    { id: 4, title: 'Details', icon: '📝', description: 'Your information' },
    { id: 5, title: 'Confirm', icon: '✓', description: 'Book appointment' },
];

const services = [
    { id: 'haircut', name: 'Haircut & Styling', price: '$45', duration: '45 min', icon: '✂️' },
    { id: 'coloring', name: 'Hair Coloring', price: '$120', duration: '2 hrs', icon: '🎨' },
    { id: 'spa', name: 'Spa Treatment', price: '$85', duration: '1 hr', icon: '💆' },
    { id: 'nails', name: 'Nail Care', price: '$55', duration: '1 hr', icon: '💅' },
    { id: 'makeup', name: 'Makeup', price: '$75', duration: '1 hr', icon: '💄' },
    { id: 'bridal', name: 'Bridal Package', price: '$350', duration: '4 hrs', icon: '👰' },
];

const stylists = [
    { id: 'emma', name: 'Emma Wilson', specialty: 'Hair Coloring', rating: 4.9, image: '👩‍🦰' },
    { id: 'james', name: 'James Chen', specialty: 'Precision Cuts', rating: 4.8, image: '👨‍🦱' },
    { id: 'sofia', name: 'Sofia Garcia', specialty: 'Bridal Specialist', rating: 5.0, image: '👩‍🦳' },
    { id: 'alex', name: 'Alex Johnson', specialty: 'Modern Styles', rating: 4.7, image: '🧑‍🦲' },
];

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function AppointmentSection() {
    const [currentStep, setCurrentStep] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [bookingData, setBookingData] = useState<BookingData>({
        service: '',
        stylist: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMounted || !sectionRef.current) return;

        const timer = setTimeout(() => {
            const section = sectionRef.current;
            if (!section) return;

            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: `+=${steps.length * 500}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const stepIndex = Math.floor(progress * steps.length);
                        const newStep = Math.min(Math.max(stepIndex + 1, 1), steps.length);
                        setCurrentStep(prev => prev !== newStep ? newStep : prev);
                    },
                });
            }, section);

            return () => ctx.revert();
        }, 300);

        return () => clearTimeout(timer);
    }, [isMounted]);

    const handleSubmit = () => {
        alert('🎉 Appointment booked successfully!');
        setCurrentStep(1);
        setBookingData({
            service: '', stylist: '', date: '', time: '',
            name: '', email: '', phone: '', notes: '',
        });
    };

    const renderStepContent = () => {
        const isFromLeft = currentStep % 2 === 1;
        const animationClass = isMobile
            ? `animate-slide-${isFromLeft ? 'left' : 'right'}`
            : 'animate-fade-in-up';

        switch (currentStep) {
            case 1:
                return (
                    <div className={`w-full ${animationClass}`}>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">Choose Your Service</h3>
                        <p className="text-white/60 mb-3 sm:mb-4 text-xs sm:text-sm text-center">Select the perfect treatment</p>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left ${bookingData.service === service.id
                                        ? 'border-[#00ff88] bg-[#00ff88]/20 shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                                        : 'border-white/10 bg-white/5 hover:border-[#00ff88]/50'
                                        }`}
                                >
                                    <span className="text-xl sm:text-2xl block mb-1">{service.icon}</span>
                                    <h4 className="font-bold text-white text-[10px] sm:text-xs leading-tight">{service.name}</h4>
                                    <p className="text-white/60 text-[8px] sm:text-[10px]">{service.duration}</p>
                                    <p className="text-[#00ff88] font-bold mt-0.5 text-xs sm:text-sm">{service.price}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className={`w-full ${animationClass}`}>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">Select Your Stylist</h3>
                        <p className="text-white/60 mb-3 sm:mb-4 text-xs sm:text-sm text-center">Choose from our experts</p>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {stylists.map((stylist) => (
                                <button
                                    key={stylist.id}
                                    onClick={() => setBookingData({ ...bookingData, stylist: stylist.id })}
                                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left ${bookingData.stylist === stylist.id
                                        ? 'border-[#00ff88] bg-[#00ff88]/20 shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                                        : 'border-white/10 bg-white/5 hover:border-[#00ff88]/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl sm:text-3xl">{stylist.image}</span>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{stylist.name}</h4>
                                            <p className="text-white/60 text-[8px] sm:text-[10px] truncate">{stylist.specialty}</p>
                                            <div className="flex items-center gap-0.5">
                                                <span className="text-yellow-400 text-[10px]">★</span>
                                                <span className="text-white text-[10px]">{stylist.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className={`w-full max-w-sm mx-auto ${animationClass}`}>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 text-center">Pick Date & Time</h3>
                        <p className="text-white/60 mb-3 text-xs sm:text-sm text-center">Choose your slot</p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-white/80 mb-1.5 text-xs sm:text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-2.5 rounded-lg bg-white/5 border-2 border-white/10 text-white text-sm focus:border-[#00ff88] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-1.5 text-xs sm:text-sm font-medium">Time</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setBookingData({ ...bookingData, time })}
                                            className={`p-1.5 sm:p-2 rounded text-[10px] sm:text-xs font-medium transition-all ${bookingData.time === time
                                                ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                                                : 'border border-white/10 bg-white/5 text-white/80 hover:border-[#00ff88]/50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className={`w-full max-w-sm mx-auto ${animationClass}`}>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 text-center">Your Details</h3>
                        <p className="text-white/60 mb-3 text-xs sm:text-sm text-center">Tell us about you</p>

                        <div className="space-y-2.5">
                            <input
                                type="text"
                                value={bookingData.name}
                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                placeholder="Full Name"
                                className="w-full p-2.5 rounded-lg bg-white/5 border-2 border-white/10 text-white text-sm placeholder-white/30 focus:border-[#00ff88] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                            />
                            <input
                                type="email"
                                value={bookingData.email}
                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full p-2.5 rounded-lg bg-white/5 border-2 border-white/10 text-white text-sm placeholder-white/30 focus:border-[#00ff88] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                            />
                            <input
                                type="tel"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                placeholder="Phone Number"
                                className="w-full p-2.5 rounded-lg bg-white/5 border-2 border-white/10 text-white text-sm placeholder-white/30 focus:border-[#00ff88] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                            />
                            <textarea
                                value={bookingData.notes}
                                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                placeholder="Special requests (optional)"
                                rows={2}
                                className="w-full p-2.5 rounded-lg bg-white/5 border-2 border-white/10 text-white text-sm placeholder-white/30 focus:border-[#00ff88] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all resize-none"
                            />
                        </div>
                    </div>
                );

            case 5:
                const selectedService = services.find(s => s.id === bookingData.service);
                const selectedStylist = stylists.find(s => s.id === bookingData.stylist);

                return (
                    <div className={`w-full max-w-sm mx-auto text-center ${animationClass}`}>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Confirm Booking</h3>
                        <p className="text-white/60 mb-3 text-xs sm:text-sm">Review your details</p>

                        <div className="bg-white/5 rounded-xl p-3 border border-[#00ff88]/30 space-y-2 mb-4 text-left text-xs sm:text-sm shadow-[0_0_20px_rgba(0,255,136,0.1)]">
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-white/60">Service</span>
                                <span className="text-white font-medium text-right">{selectedService?.icon} {selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-white/60">Stylist</span>
                                <span className="text-white font-medium">{selectedStylist?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-white/60">When</span>
                                <span className="text-white font-medium text-[10px] sm:text-xs">{bookingData.date || '-'} • {bookingData.time || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-white/60">Contact</span>
                                <span className="text-white font-medium truncate ml-2">{bookingData.name || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-white/60">Total</span>
                                <span className="text-[#00ff88] font-bold text-lg sm:text-xl">{selectedService?.price || '-'}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 rounded-full font-bold text-sm bg-[#00ff88] text-black shadow-[0_0_30px_rgba(0,255,136,0.5)] hover:shadow-[0_0_40px_rgba(0,255,136,0.7)] hover:scale-105 transition-all"
                        >
                            Confirm Booking ✓
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    // Mobile Vertical Roadmap Component
    const MobileRoadmap = () => (
        <div className="fixed left-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
            {/* Neon glow background line */}
            <div className="absolute w-0.5 h-full bg-white/10 rounded-full" />

            {/* Neon progress line */}
            <div
                className="absolute w-0.5 rounded-full transition-all duration-500 top-0"
                style={{
                    height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    background: 'linear-gradient(180deg, #00ff88, #00cc6a)',
                    boxShadow: '0 0 20px #00ff88, 0 0 40px #00ff88',
                }}
            />

            {/* Step nodes */}
            <div className="relative flex flex-col gap-8">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-center">
                        {/* Node */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${currentStep > step.id
                                    ? 'bg-[#00ff88] text-black shadow-[0_0_20px_#00ff88]'
                                    : currentStep === step.id
                                        ? 'bg-[#00ff88] text-black scale-125 shadow-[0_0_30px_#00ff88,0_0_60px_#00ff88]'
                                        : 'bg-white/10 text-white/40 border border-white/20'
                                }`}
                        >
                            {currentStep > step.id ? '✓' : step.icon}
                        </div>

                        {/* Label (only show for current step) */}
                        {currentStep === step.id && (
                            <div className="absolute left-10 whitespace-nowrap animate-fade-in">
                                <p className="text-[#00ff88] font-bold text-xs drop-shadow-[0_0_10px_#00ff88]">{step.title}</p>
                                <p className="text-white/50 text-[10px]">{step.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Desktop Vertical Stepper
    const DesktopStepper = () => (
        <div className="hidden lg:flex w-64 xl:w-80 h-full items-center justify-center bg-black/20">
            <div className="relative flex flex-col justify-center items-center h-[60vh] py-8">
                {/* Background Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full" />

                {/* Progress Line */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-1 rounded-full transition-all duration-500"
                    style={{
                        height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        background: 'linear-gradient(180deg, #749674, #567856)',
                        boxShadow: '0 0 15px #749674',
                    }}
                />

                {/* Step Nodes */}
                <div className="flex flex-col justify-between h-full">
                    {steps.map((step) => (
                        <div key={step.id} className="relative z-10 flex items-center gap-4">
                            <div
                                className={`w-12 h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center text-lg xl:text-xl transition-all duration-500 ${currentStep > step.id
                                        ? 'bg-primary-400 text-white shadow-[0_0_15px_rgba(116,150,116,0.5)]'
                                        : currentStep === step.id
                                            ? 'bg-primary-400 text-white scale-110 shadow-[0_0_25px_#749674]'
                                            : 'bg-white/10 text-white/40'
                                    }`}
                            >
                                {currentStep > step.id ? '✓' : step.icon}
                            </div>
                            <div className={`transition-opacity duration-300 ${currentStep >= step.id ? 'opacity-100' : 'opacity-40'}`}>
                                <p className="text-white font-bold text-sm xl:text-base">{step.title}</p>
                                <p className="text-white/50 text-xs">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            id="appointment"
            className="h-screen w-full bg-gradient-to-br from-primary-950 via-[#0a1a0a] to-primary-950 relative z-10 overflow-hidden"
        >
            {/* Mobile Roadmap */}
            {isMobile && <MobileRoadmap />}

            <div className="h-full w-full flex flex-col lg:flex-row">
                {/* Desktop Stepper */}
                <DesktopStepper />

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-12 sm:px-6 lg:px-12 py-6 lg:py-4">
                    <div key={currentStep} className="w-full max-w-md lg:max-w-3xl">
                        {renderStepContent()}

                        {/* Scroll hint */}
                        <div className="mt-4 text-center">
                            <p className="text-white/30 text-[10px] sm:text-xs">Scroll to navigate</p>
                            <div className="mt-1 animate-bounce">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-6 lg:right-8 z-40">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold gradient-text">Book Appointment</h2>
            </div>

            {/* Step Counter - Mobile: Bottom Center, Desktop: Bottom Right */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 z-40">
                <div className="bg-black/40 backdrop-blur-sm border border-[#00ff88]/30 lg:border-white/10 px-4 py-2 rounded-full text-xs sm:text-sm shadow-[0_0_15px_rgba(0,255,136,0.2)] lg:shadow-none">
                    <span className="text-[#00ff88] lg:text-primary-400 font-bold">{currentStep}</span>
                    <span className="text-white/40"> / {steps.length}</span>
                </div>
            </div>

            {/* Neon accent lines - Mobile only */}
            {isMobile && (
                <>
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent" />
                </>
            )}
        </section>
    );
}
