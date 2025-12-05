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
    { id: 1, title: 'Service', icon: '✂️', subtitle: 'Choose your treatment' },
    { id: 2, title: 'Stylist', icon: '👩‍🦰', subtitle: 'Pick your expert' },
    { id: 3, title: 'Schedule', icon: '📅', subtitle: 'Select date & time' },
    { id: 4, title: 'Details', icon: '📝', subtitle: 'Your information' },
    { id: 5, title: 'Confirm', icon: '✓', subtitle: 'Complete booking' },
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

    // Mobile Step Content with full-screen layout
    const renderMobileStepContent = () => {
        const step = steps[currentStep - 1];

        return (
            <div className="h-full flex flex-col">
                {/* Step Header */}
                <div className="text-center pt-4 pb-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-2xl mb-3 shadow-[0_0_30px_rgba(116,150,116,0.5)]">
                        {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    <p className="text-white/60 text-sm">{step.subtitle}</p>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-2 gap-2">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${bookingData.service === service.id
                                            ? 'border-primary-400 bg-primary-400/10 shadow-[0_0_15px_rgba(116,150,116,0.3)]'
                                            : 'border-white/10 bg-white/5'
                                        }`}
                                >
                                    <span className="text-2xl block mb-1">{service.icon}</span>
                                    <h4 className="font-bold text-white text-xs">{service.name}</h4>
                                    <p className="text-white/50 text-[10px]">{service.duration}</p>
                                    <p className="text-primary-400 font-bold text-sm mt-1">{service.price}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 gap-3">
                            {stylists.map((stylist) => (
                                <button
                                    key={stylist.id}
                                    onClick={() => setBookingData({ ...bookingData, stylist: stylist.id })}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${bookingData.stylist === stylist.id
                                            ? 'border-primary-400 bg-primary-400/10 shadow-[0_0_15px_rgba(116,150,116,0.3)]'
                                            : 'border-white/10 bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{stylist.image}</span>
                                        <div className="flex-1 text-left">
                                            <h4 className="font-bold text-white text-base">{stylist.name}</h4>
                                            <p className="text-white/60 text-xs">{stylist.specialty}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                                            <span className="text-yellow-400 text-sm">★</span>
                                            <span className="text-white text-sm font-medium">{stylist.rating}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-medium">Select Date</label>
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base focus:border-primary-400 focus:outline-none focus:shadow-[0_0_15px_rgba(116,150,116,0.3)] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-medium">Select Time</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setBookingData({ ...bookingData, time })}
                                            className={`p-3 rounded-lg text-xs font-medium transition-all ${bookingData.time === time
                                                    ? 'bg-primary-400 text-white shadow-[0_0_15px_rgba(116,150,116,0.5)]'
                                                    : 'border border-white/10 bg-white/5 text-white/80'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={bookingData.name}
                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                placeholder="Full Name"
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none focus:shadow-[0_0_15px_rgba(116,150,116,0.3)] transition-all"
                            />
                            <input
                                type="email"
                                value={bookingData.email}
                                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none focus:shadow-[0_0_15px_rgba(116,150,116,0.3)] transition-all"
                            />
                            <input
                                type="tel"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                placeholder="Phone Number"
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none focus:shadow-[0_0_15px_rgba(116,150,116,0.3)] transition-all"
                            />
                            <textarea
                                value={bookingData.notes}
                                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                placeholder="Special requests (optional)"
                                rows={3}
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none focus:shadow-[0_0_15px_rgba(116,150,116,0.3)] transition-all resize-none"
                            />
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="text-center">
                            {(() => {
                                const selectedService = services.find(s => s.id === bookingData.service);
                                const selectedStylist = stylists.find(s => s.id === bookingData.stylist);

                                return (
                                    <>
                                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 border border-primary-400/20 space-y-3 mb-5 text-left shadow-[0_0_30px_rgba(116,150,116,0.1)]">
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <span className="text-white/50 text-sm">Service</span>
                                                <span className="text-white font-medium">{selectedService?.icon} {selectedService?.name || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <span className="text-white/50 text-sm">Stylist</span>
                                                <span className="text-white font-medium">{selectedStylist?.name || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <span className="text-white/50 text-sm">Date & Time</span>
                                                <span className="text-white font-medium text-sm">{bookingData.date || '-'} • {bookingData.time || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <span className="text-white/50 text-sm">Name</span>
                                                <span className="text-white font-medium">{bookingData.name || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-white/50 text-sm">Total</span>
                                                <span className="text-primary-400 font-bold text-2xl">{selectedService?.price || '-'}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            className="w-full py-4 rounded-full font-bold text-base bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_30px_rgba(116,150,116,0.5)] hover:shadow-[0_0_50px_rgba(116,150,116,0.7)] active:scale-95 transition-all"
                                        >
                                            ✓ Confirm Booking
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Desktop Stepper
    const DesktopStepper = () => (
        <div className="hidden lg:flex w-64 xl:w-80 h-full items-center justify-center bg-black/20">
            <div className="relative flex flex-col justify-center items-center h-[60vh] py-8">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full" />
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-1 rounded-full transition-all duration-500"
                    style={{
                        height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        background: 'linear-gradient(180deg, #749674, #567856)',
                        boxShadow: '0 0 15px #749674',
                    }}
                />
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
                                <p className="text-white/50 text-xs">{step.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Desktop Step Content
    const renderDesktopStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="w-full animate-fade-in-up">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Choose Your Service</h3>
                        <p className="text-white/60 mb-6 text-center">Select the perfect treatment</p>
                        <div className="grid grid-cols-3 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                                    className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${bookingData.service === service.id
                                            ? 'border-primary-400 bg-primary-400/20 shadow-[0_0_20px_rgba(116,150,116,0.3)]'
                                            : 'border-white/10 bg-white/5 hover:border-primary-400/50'
                                        }`}
                                >
                                    <span className="text-3xl block mb-2">{service.icon}</span>
                                    <h4 className="font-bold text-white text-base">{service.name}</h4>
                                    <p className="text-white/60 text-xs">{service.duration}</p>
                                    <p className="text-primary-400 font-bold mt-1 text-lg">{service.price}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="w-full animate-fade-in-up">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Select Your Stylist</h3>
                        <p className="text-white/60 mb-6 text-center">Choose from our experts</p>
                        <div className="grid grid-cols-2 gap-4">
                            {stylists.map((stylist) => (
                                <button
                                    key={stylist.id}
                                    onClick={() => setBookingData({ ...bookingData, stylist: stylist.id })}
                                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${bookingData.stylist === stylist.id
                                            ? 'border-primary-400 bg-primary-400/20 shadow-[0_0_20px_rgba(116,150,116,0.3)]'
                                            : 'border-white/10 bg-white/5 hover:border-primary-400/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl">{stylist.image}</span>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{stylist.name}</h4>
                                            <p className="text-white/60 text-sm">{stylist.specialty}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-yellow-400">★</span>
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
                    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Pick Date & Time</h3>
                        <p className="text-white/60 mb-6 text-center">Choose your slot</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-white/80 mb-2 font-medium">Select Date</label>
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white focus:border-primary-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 font-medium">Select Time</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setBookingData({ ...bookingData, time })}
                                            className={`p-3 rounded-lg text-sm font-medium transition-all ${bookingData.time === time
                                                    ? 'bg-primary-400 text-white'
                                                    : 'border border-white/10 bg-white/5 text-white/80 hover:border-primary-400/50'
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
                    <div className="w-full max-w-md mx-auto animate-fade-in-up">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Your Details</h3>
                        <p className="text-white/60 mb-6 text-center">Tell us about you</p>
                        <div className="space-y-4">
                            <input type="text" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} placeholder="Full Name" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                            <input type="email" value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} placeholder="Email Address" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                            <input type="tel" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} placeholder="Phone Number" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                            <textarea value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} placeholder="Special requests" rows={3} className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all resize-none" />
                        </div>
                    </div>
                );
            case 5:
                const selectedService = services.find(s => s.id === bookingData.service);
                const selectedStylist = stylists.find(s => s.id === bookingData.stylist);
                return (
                    <div className="w-full max-w-md mx-auto text-center animate-fade-in-up">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">Confirm Booking</h3>
                        <p className="text-white/60 mb-6">Review your details</p>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4 mb-6 text-left">
                            <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-white/60">Service</span><span className="text-white font-medium">{selectedService?.icon} {selectedService?.name}</span></div>
                            <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-white/60">Stylist</span><span className="text-white font-medium">{selectedStylist?.name}</span></div>
                            <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-white/60">When</span><span className="text-white font-medium">{bookingData.date} • {bookingData.time}</span></div>
                            <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-white/60">Contact</span><span className="text-white font-medium">{bookingData.name}</span></div>
                            <div className="flex justify-between pt-2"><span className="text-white/60">Total</span><span className="text-primary-400 font-bold text-2xl">{selectedService?.price}</span></div>
                        </div>
                        <button onClick={handleSubmit} className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_20px_rgba(116,150,116,0.4)] hover:scale-105 transition-all">Confirm Booking ✓</button>
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
            className="h-screen w-full bg-gradient-to-br from-primary-950 via-[#0a1a0a] to-primary-950 relative z-10 overflow-hidden"
        >
            {/* Mobile Layout */}
            {isMobile ? (
                <div className="h-full flex flex-col">
                    {/* Mobile Top Stepper Bar */}
                    <div className="flex-shrink-0 bg-black/60 backdrop-blur-lg border-b border-primary-400/20 px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-bold gradient-text">Book Appointment</h2>
                            <span className="text-white/50 text-xs">Step {currentStep}/{steps.length}</span>
                        </div>
                        {/* Horizontal Step Indicators */}
                        <div className="flex items-center justify-center gap-2">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep > step.id
                                                ? 'bg-primary-400 text-white'
                                                : currentStep === step.id
                                                    ? 'bg-primary-400 text-white ring-2 ring-primary-400/50 ring-offset-2 ring-offset-black'
                                                    : 'bg-white/10 text-white/40'
                                            }`}
                                    >
                                        {currentStep > step.id ? '✓' : index + 1}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-4 h-0.5 mx-1 rounded-full transition-all duration-300 ${currentStep > step.id ? 'bg-primary-400' : 'bg-white/10'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Content Area */}
                    <div className="flex-1 overflow-hidden" key={currentStep}>
                        {renderMobileStepContent()}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex-shrink-0 py-2 text-center bg-black/40">
                        <p className="text-white/30 text-[10px]">↓ Scroll to continue ↓</p>
                    </div>
                </div>
            ) : (
                /* Desktop Layout */
                <div className="h-full w-full flex">
                    <DesktopStepper />
                    <div className="flex-1 flex items-center justify-center px-12 py-4">
                        <div className="w-full max-w-3xl">
                            {renderDesktopStepContent()}
                            <div className="mt-6 text-center">
                                <p className="text-white/30 text-xs">Scroll to navigate steps</p>
                                <div className="mt-1 animate-bounce">
                                    <svg className="w-4 h-4 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Desktop Title */}
                    <div className="absolute top-6 right-8 z-40">
                        <h2 className="text-xl font-bold gradient-text">Book Appointment</h2>
                    </div>
                    {/* Desktop Step Counter */}
                    <div className="absolute bottom-6 right-6 z-40">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-sm">
                            <span className="text-primary-400 font-bold">{currentStep}</span>
                            <span className="text-white/40"> / {steps.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
