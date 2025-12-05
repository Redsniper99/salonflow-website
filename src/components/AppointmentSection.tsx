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
    { id: 'emma', name: 'Emma Wilson', specialty: 'Hair Coloring Expert', rating: 4.9, image: '👩‍🦰' },
    { id: 'james', name: 'James Chen', specialty: 'Precision Cuts', rating: 4.8, image: '👨‍🦱' },
    { id: 'sofia', name: 'Sofia Garcia', specialty: 'Bridal Specialist', rating: 5.0, image: '👩‍🦳' },
    { id: 'alex', name: 'Alex Johnson', specialty: 'Modern Styles', rating: 4.7, image: '🧑‍🦲' },
];

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function AppointmentSection() {
    const [currentStep, setCurrentStep] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
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

    // Setup ScrollTrigger pin like HorizontalScrollSection
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!sectionRef.current) return;

            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: `+=${steps.length * 500}`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const stepIndex = Math.floor(progress * steps.length);
                        const newStep = Math.min(Math.max(stepIndex + 1, 1), steps.length);
                        if (newStep !== currentStep) {
                            setCurrentStep(newStep);
                        }
                    },
                });
            }, sectionRef);

            return () => ctx.revert();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

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
                    <div className="w-full max-w-4xl mx-auto">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">Choose Your Service</h3>
                        <p className="text-white/60 mb-8 text-lg text-center">Select the perfect treatment for you</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${bookingData.service === service.id
                                            ? 'border-salon-accent bg-salon-accent/20 shadow-[0_0_30px_rgba(122,155,111,0.4)]'
                                            : 'border-white/10 bg-white/5 hover:border-salon-accent/50 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-4xl block mb-3">{service.icon}</span>
                                    <h4 className="font-bold text-white text-lg">{service.name}</h4>
                                    <p className="text-white/60 text-sm mt-1">{service.duration}</p>
                                    <p className="text-salon-accent font-bold mt-2 text-xl">{service.price}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="w-full max-w-3xl mx-auto">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">Select Your Stylist</h3>
                        <p className="text-white/60 mb-8 text-lg text-center">Choose from our expert team</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {stylists.map((stylist) => (
                                <button
                                    key={stylist.id}
                                    onClick={() => setBookingData({ ...bookingData, stylist: stylist.id })}
                                    className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${bookingData.stylist === stylist.id
                                            ? 'border-salon-accent bg-salon-accent/20 shadow-[0_0_30px_rgba(122,155,111,0.4)]'
                                            : 'border-white/10 bg-white/5 hover:border-salon-accent/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-6xl">{stylist.image}</span>
                                        <div>
                                            <h4 className="font-bold text-white text-xl">{stylist.name}</h4>
                                            <p className="text-white/60">{stylist.specialty}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <span className="text-yellow-400 text-lg">★</span>
                                                <span className="text-white font-medium">{stylist.rating}</span>
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
                    <div className="w-full max-w-2xl mx-auto">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">Pick Date & Time</h3>
                        <p className="text-white/60 mb-8 text-lg text-center">Choose your preferred slot</p>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-white/80 mb-3 font-medium text-lg">Select Date</label>
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-lg focus:border-salon-accent focus:outline-none focus:shadow-[0_0_20px_rgba(122,155,111,0.3)] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-3 font-medium text-lg">Select Time</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setBookingData({ ...bookingData, time })}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium text-lg ${bookingData.time === time
                                                    ? 'border-salon-accent bg-salon-accent text-white shadow-[0_0_20px_rgba(122,155,111,0.5)]'
                                                    : 'border-white/10 bg-white/5 text-white/80 hover:border-salon-accent/50'
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
                    <div className="w-full max-w-xl mx-auto">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">Your Details</h3>
                        <p className="text-white/60 mb-8 text-lg text-center">Tell us how to reach you</p>

                        <div className="space-y-5">
                            <input
                                type="text"
                                value={bookingData.name}
                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                placeholder="Full Name"
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-lg placeholder-white/30 focus:border-salon-accent focus:outline-none focus:shadow-[0_0_20px_rgba(122,155,111,0.3)] transition-all"
                            />
                            <input
                                type="email"
                                value={bookingData.email}
                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-lg placeholder-white/30 focus:border-salon-accent focus:outline-none focus:shadow-[0_0_20px_rgba(122,155,111,0.3)] transition-all"
                            />
                            <input
                                type="tel"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                placeholder="Phone Number"
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-lg placeholder-white/30 focus:border-salon-accent focus:outline-none focus:shadow-[0_0_20px_rgba(122,155,111,0.3)] transition-all"
                            />
                            <textarea
                                value={bookingData.notes}
                                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                placeholder="Special requests (optional)"
                                rows={3}
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-lg placeholder-white/30 focus:border-salon-accent focus:outline-none focus:shadow-[0_0_20px_rgba(122,155,111,0.3)] transition-all resize-none"
                            />
                        </div>
                    </div>
                );

            case 5:
                const selectedService = services.find(s => s.id === bookingData.service);
                const selectedStylist = stylists.find(s => s.id === bookingData.stylist);

                return (
                    <div className="w-full max-w-xl mx-auto text-center">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Confirm Booking</h3>
                        <p className="text-white/60 mb-8 text-lg">Review your appointment details</p>

                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4 mb-8 text-left">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Service</span>
                                <span className="text-white font-medium text-lg">{selectedService?.icon} {selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Stylist</span>
                                <span className="text-white font-medium text-lg">{selectedStylist?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Date & Time</span>
                                <span className="text-white font-medium">{bookingData.date} at {bookingData.time}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Contact</span>
                                <span className="text-white font-medium">{bookingData.name}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-white/60 text-lg">Total</span>
                                <span className="text-salon-accent font-bold text-3xl">{selectedService?.price}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="px-12 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-salon-accent to-salon-green text-white shadow-[0_0_30px_rgba(122,155,111,0.5)] hover:shadow-[0_0_50px_rgba(122,155,111,0.7)] hover:scale-105 transition-all duration-300"
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
            className="h-screen w-full bg-gradient-to-br from-[#1a1d17] via-[#2d3328] to-[#1a1d17] relative z-10"
        >
            <div ref={containerRef} className="h-full w-full flex">
                {/* Left Side - Vertical Stepper Roadmap */}
                <div className="hidden lg:flex w-80 xl:w-96 h-full items-center justify-center bg-black/20">
                    <div className="relative flex flex-col justify-center items-center h-[70vh] py-8">
                        {/* Background Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full" />

                        {/* Neon Progress Line */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-0 w-1 rounded-full transition-all duration-700"
                            style={{
                                height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                background: 'linear-gradient(180deg, #7a9b6f, #5d6c55)',
                                boxShadow: '0 0 20px #7a9b6f, 0 0 40px #7a9b6f',
                            }}
                        />

                        {/* Step Nodes */}
                        <div className="flex flex-col justify-between h-full">
                            {steps.map((step) => (
                                <div key={step.id} className="relative z-10 flex items-center gap-6">
                                    {/* Step Circle */}
                                    <div
                                        className={`w-16 h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center text-2xl xl:text-3xl transition-all duration-500 ${currentStep > step.id
                                                ? 'bg-salon-accent text-white shadow-[0_0_20px_rgba(122,155,111,0.5)]'
                                                : currentStep === step.id
                                                    ? 'bg-salon-accent text-white scale-110 shadow-[0_0_30px_#7a9b6f,0_0_60px_#7a9b6f]'
                                                    : 'bg-white/10 text-white/40'
                                            }`}
                                    >
                                        {currentStep > step.id ? '✓' : step.icon}
                                    </div>

                                    {/* Step Label */}
                                    <div className={`transition-all duration-300 ${currentStep >= step.id ? 'opacity-100' : 'opacity-40'
                                        }`}>
                                        <p className="text-white font-bold text-lg xl:text-xl">{step.title}</p>
                                        <p className="text-white/50 text-sm xl:text-base">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Stepper - Top */}
                <div className="lg:hidden absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl px-4 py-4 border-b border-white/10">
                    <div className="flex items-center justify-center gap-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${currentStep > step.id
                                            ? 'bg-salon-accent text-white'
                                            : currentStep === step.id
                                                ? 'bg-salon-accent text-white shadow-[0_0_20px_#7a9b6f] scale-110'
                                                : 'bg-white/10 text-white/40'
                                        }`}
                                >
                                    {currentStep > step.id ? '✓' : step.icon}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-1 mx-1 rounded-full transition-all ${currentStep > step.id
                                            ? 'bg-salon-accent shadow-[0_0_10px_#7a9b6f]'
                                            : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-white/60 text-sm mt-3">
                        {steps[currentStep - 1].title} - {steps[currentStep - 1].description}
                    </p>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 h-full flex items-center justify-center px-6 lg:px-12 pt-28 lg:pt-0 pb-8 overflow-y-auto">
                    <div
                        key={currentStep}
                        className="w-full animate-fade-in-up"
                    >
                        {renderStepContent()}

                        {/* Scroll hint */}
                        <div className="mt-8 text-center">
                            <p className="text-white/40 text-sm">Scroll to navigate steps</p>
                            <div className="mt-2 animate-bounce">
                                <svg className="w-6 h-6 mx-auto text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Title Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-12 z-40">
                <h2 className="text-xl lg:text-2xl font-bold gradient-text">Book Appointment</h2>
            </div>

            {/* Step Counter */}
            <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 z-40">
                <div className="glass px-4 py-2 rounded-full">
                    <span className="text-salon-accent font-bold">{currentStep}</span>
                    <span className="text-white/40"> / {steps.length}</span>
                </div>
            </div>
        </section>
    );
}
