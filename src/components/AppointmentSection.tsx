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
    { id: 1, title: 'Service', icon: '✂️', description: 'Choose treatment' },
    { id: 2, title: 'Stylist', icon: '👩‍🦰', description: 'Select expert' },
    { id: 3, title: 'Schedule', icon: '📅', description: 'Pick date & time' },
    { id: 4, title: 'Details', icon: '📝', description: 'Your info' },
    { id: 5, title: 'Confirm', icon: '✓', description: 'Book now' },
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
                    end: `+=${steps.length * 400}`,
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
        switch (currentStep) {
            case 1:
                return (
                    <div className="w-full">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">Choose Your Service</h3>
                        <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base text-center">Select the perfect treatment</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                                    className={`p-3 sm:p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left ${bookingData.service === service.id
                                        ? 'border-primary-400 bg-primary-400/20 shadow-[0_0_20px_rgba(116,150,116,0.3)]'
                                        : 'border-white/10 bg-white/5 hover:border-primary-400/50'
                                        }`}
                                >
                                    <span className="text-2xl sm:text-3xl block mb-1 sm:mb-2">{service.icon}</span>
                                    <h4 className="font-bold text-white text-xs sm:text-sm md:text-base leading-tight">{service.name}</h4>
                                    <p className="text-white/60 text-[10px] sm:text-xs mt-0.5">{service.duration}</p>
                                    <p className="text-primary-400 font-bold mt-1 text-sm sm:text-base md:text-lg">{service.price}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="w-full">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">Select Your Stylist</h3>
                        <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base text-center">Choose from our experts</p>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            {stylists.map((stylist) => (
                                <button
                                    key={stylist.id}
                                    onClick={() => setBookingData({ ...bookingData, stylist: stylist.id })}
                                    className={`p-3 sm:p-4 md:p-6 rounded-xl border-2 transition-all duration-300 text-left ${bookingData.stylist === stylist.id
                                        ? 'border-primary-400 bg-primary-400/20 shadow-[0_0_20px_rgba(116,150,116,0.3)]'
                                        : 'border-white/10 bg-white/5 hover:border-primary-400/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="text-3xl sm:text-4xl md:text-5xl">{stylist.image}</span>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-white text-sm sm:text-base md:text-lg truncate">{stylist.name}</h4>
                                            <p className="text-white/60 text-[10px] sm:text-xs md:text-sm truncate">{stylist.specialty}</p>
                                            <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                                                <span className="text-yellow-400 text-xs sm:text-sm">★</span>
                                                <span className="text-white text-xs sm:text-sm font-medium">{stylist.rating}</span>
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
                    <div className="w-full max-w-lg mx-auto">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">Pick Date & Time</h3>
                        <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base text-center">Choose your slot</p>

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-white/80 mb-2 font-medium text-sm sm:text-base">Select Date</label>
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-sm sm:text-base focus:border-primary-400 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2 font-medium text-sm sm:text-base">Select Time</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setBookingData({ ...bookingData, time })}
                                            className={`p-2 sm:p-3 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all ${bookingData.time === time
                                                ? 'border-primary-400 bg-primary-400 text-white'
                                                : 'border-white/10 bg-white/5 text-white/80 hover:border-primary-400/50'
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
                    <div className="w-full max-w-md mx-auto">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">Your Details</h3>
                        <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base text-center">Tell us about you</p>

                        <div className="space-y-3 sm:space-y-4">
                            <input
                                type="text"
                                value={bookingData.name}
                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                placeholder="Full Name"
                                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-sm sm:text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all"
                            />
                            <input
                                type="email"
                                value={bookingData.email}
                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-sm sm:text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all"
                            />
                            <input
                                type="tel"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                placeholder="Phone Number"
                                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-sm sm:text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all"
                            />
                            <textarea
                                value={bookingData.notes}
                                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                placeholder="Special requests (optional)"
                                rows={2}
                                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-sm sm:text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                );

            case 5:
                const selectedService = services.find(s => s.id === bookingData.service);
                const selectedStylist = stylists.find(s => s.id === bookingData.stylist);

                return (
                    <div className="w-full max-w-md mx-auto text-center">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">Confirm Booking</h3>
                        <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">Review your details</p>

                        <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 space-y-3 mb-4 sm:mb-6 text-left text-sm sm:text-base">
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-white/60">Service</span>
                                <span className="text-white font-medium">{selectedService?.icon} {selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-white/60">Stylist</span>
                                <span className="text-white font-medium">{selectedStylist?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-white/60">When</span>
                                <span className="text-white font-medium text-xs sm:text-sm">{bookingData.date} • {bookingData.time}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-white/60">Contact</span>
                                <span className="text-white font-medium truncate ml-2">{bookingData.name}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-white/60">Total</span>
                                <span className="text-primary-400 font-bold text-xl sm:text-2xl">{selectedService?.price}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_20px_rgba(116,150,116,0.4)] hover:scale-105 transition-all"
                        >
                            Confirm Booking ✓
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <section
            ref={sectionRef}
            id="appointment"
            className="h-screen w-full bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 relative z-10"
        >
            <div className="h-full w-full flex flex-col lg:flex-row">
                {/* Left Side - Vertical Stepper (Desktop) */}
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

                {/* Mobile Stepper - Top */}
                <div className="lg:hidden flex-shrink-0 bg-black/40 backdrop-blur-md px-3 py-3 border-b border-white/10">
                    <div className="flex items-center justify-center gap-1">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${currentStep > step.id
                                            ? 'bg-primary-400 text-white'
                                            : currentStep === step.id
                                                ? 'bg-primary-400 text-white shadow-[0_0_15px_#749674] scale-110'
                                                : 'bg-white/10 text-white/40'
                                        }`}
                                >
                                    {currentStep > step.id ? '✓' : step.icon}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-4 sm:w-6 h-0.5 mx-0.5 rounded-full ${currentStep > step.id ? 'bg-primary-400' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-white/60 text-xs mt-2">
                        {steps[currentStep - 1].title} - Scroll to navigate
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-8 lg:px-12 py-4 overflow-y-auto">
                    <div key={currentStep} className="w-full max-w-3xl animate-fade-in-up">
                        {renderStepContent()}

                        {/* Scroll hint */}
                        <div className="mt-4 sm:mt-6 text-center">
                            <p className="text-white/30 text-xs">Scroll to navigate steps</p>
                            <div className="mt-1 animate-bounce">
                                <svg className="w-4 h-4 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-8 z-40">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold gradient-text">Book Appointment</h2>
            </div>

            {/* Step Counter */}
            <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 z-40">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                    <span className="text-primary-400 font-bold">{currentStep}</span>
                    <span className="text-white/40"> / {steps.length}</span>
                </div>
            </div>
        </section>
    );
}
