'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

interface BookingData {
    id: string;
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
    { id: 5, title: 'Confirm', icon: '✓', subtitle: 'Review & Submit' },
];

const services = [
    { id: 'haircut', name: 'Haircut & Styling', price: 45, duration: '45 min', icon: '✂️' },
    { id: 'coloring', name: 'Hair Coloring', price: 120, duration: '2 hrs', icon: '🎨' },
    { id: 'spa', name: 'Spa Treatment', price: 85, duration: '1 hr', icon: '💆' },
    { id: 'nails', name: 'Nail Care', price: 55, duration: '1 hr', icon: '💅' },
    { id: 'makeup', name: 'Makeup', price: 75, duration: '1 hr', icon: '💄' },
    { id: 'bridal', name: 'Bridal Package', price: 350, duration: '4 hrs', icon: '👰' },
];

const stylists = [
    { id: 'emma', name: 'Emma Wilson', specialty: 'Hair Coloring', rating: 4.9, image: '👩‍🦰' },
    { id: 'james', name: 'James Chen', specialty: 'Precision Cuts', rating: 4.8, image: '👨‍🦱' },
    { id: 'sofia', name: 'Sofia Garcia', specialty: 'Bridal Specialist', rating: 5.0, image: '👩‍🦳' },
    { id: 'alex', name: 'Alex Johnson', specialty: 'Modern Styles', rating: 4.7, image: '🧑‍🦲' },
];

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

let bookingIdCounter = 1;
const generateId = () => `booking-${bookingIdCounter++}`;

const createEmptyBooking = (): BookingData => ({
    id: generateId(),
    service: '',
    stylist: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
});

export default function AppointmentSection() {
    const [currentStep, setCurrentStep] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [bookings, setBookings] = useState<BookingData[]>(() => [createEmptyBooking()]);
    const [currentBookingIndex, setCurrentBookingIndex] = useState(0);

    const currentBooking = bookings[currentBookingIndex] || bookings[0] || createEmptyBooking();

    const updateCurrentBooking = (updates: Partial<BookingData>) => {
        setBookings(prev => prev.map((b, i) =>
            i === currentBookingIndex ? { ...b, ...updates } : b
        ));
    };

    // Navigation functions
    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Check if can proceed to next step
    const canProceed = () => {
        switch (currentStep) {
            case 1: return !!currentBooking.service;
            case 2: return !!currentBooking.stylist;
            case 3: return !!currentBooking.date && !!currentBooking.time;
            case 4: return !!currentBooking.name && !!currentBooking.email && !!currentBooking.phone;
            default: return true;
        }
    };

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMounted || !sectionRef.current) return;

        let ctx: gsap.Context | null = null;

        const timer = setTimeout(() => {
            const section = sectionRef.current;
            if (!section) return;

            ctx = gsap.context(() => {
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
        }, 300);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, [isMounted]);

    const addAnotherBooking = () => {
        const newBooking = createEmptyBooking();
        newBooking.name = bookings[0]?.name || '';
        newBooking.email = bookings[0]?.email || '';
        newBooking.phone = bookings[0]?.phone || '';
        setBookings(prev => [...prev, newBooking]);
        setCurrentBookingIndex(bookings.length);
        setCurrentStep(1);
    };

    const removeBooking = (index: number) => {
        if (bookings.length <= 1) return;
        const newBookings = bookings.filter((_, i) => i !== index);
        setBookings(newBookings);
        if (currentBookingIndex >= newBookings.length) {
            setCurrentBookingIndex(Math.max(0, newBookings.length - 1));
        }
    };

    const calculateTotal = () => {
        return bookings.reduce((total, booking) => {
            const service = services.find(s => s.id === booking.service);
            return total + (service?.price || 0);
        }, 0);
    };

    const isBookingComplete = (booking: BookingData) => {
        return booking.service && booking.stylist && booking.date && booking.time;
    };

    const completedBookings = bookings.filter(isBookingComplete);

    const handleSubmit = () => {
        console.log('=== Submitting Bookings ===');
        completedBookings.forEach((booking, index) => {
            console.log(`Booking ${index + 1}:`, {
                ...booking,
                serviceName: services.find(s => s.id === booking.service)?.name,
                stylistName: stylists.find(s => s.id === booking.stylist)?.name,
            });
        });

        alert(`🎉 ${completedBookings.length} appointment${completedBookings.length > 1 ? 's' : ''} booked successfully!`);

        bookingIdCounter = 1;
        setBookings([createEmptyBooking()]);
        setCurrentBookingIndex(0);
        setCurrentStep(1);
    };

    const step = steps[currentStep - 1];

    // Navigation Buttons Component
    const NavButtons = ({ showBack = true, showNext = true }: { showBack?: boolean; showNext?: boolean }) => (
        <div className="flex items-center justify-between gap-4 mt-6">
            {showBack && currentStep > 1 ? (
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            ) : (
                <div />
            )}
            {showNext && currentStep < steps.length && (
                <button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${canProceed()
                            ? 'bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_20px_rgba(116,150,116,0.4)] hover:scale-105'
                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );

    return (
        <section
            ref={sectionRef}
            id="appointment"
            className="h-screen w-full bg-gradient-to-br from-primary-950 via-[#0a1a0a] to-primary-950 relative z-10 overflow-hidden"
        >
            {/* Mobile Layout */}
            <div className={`h-full flex flex-col ${isMobile ? '' : 'hidden'}`}>
                {/* Mobile Top Stepper Bar */}
                <div className="flex-shrink-0 bg-black/60 backdrop-blur-lg border-b border-primary-400/20 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold gradient-text">Book Appointment</h2>
                        <span className="text-white/50 text-xs">Step {currentStep}/{steps.length}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        {steps.map((s, index) => (
                            <div key={s.id} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep > s.id
                                            ? 'bg-primary-400 text-white'
                                            : currentStep === s.id
                                                ? 'bg-primary-400 text-white ring-2 ring-primary-400/50 ring-offset-2 ring-offset-black'
                                                : 'bg-white/10 text-white/40'
                                        }`}
                                >
                                    {currentStep > s.id ? '✓' : index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-4 h-0.5 mx-1 rounded-full transition-all duration-300 ${currentStep > s.id ? 'bg-primary-400' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    {bookings.length > 1 && (
                        <div className="text-center mt-2">
                            <span className="text-primary-400 text-xs bg-primary-400/10 px-2 py-1 rounded-full">
                                🛒 {completedBookings.length} appointment{completedBookings.length !== 1 ? 's' : ''} in cart
                            </span>
                        </div>
                    )}
                </div>

                {/* Mobile Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {/* Step Header */}
                    <div className="text-center pt-4 pb-3 px-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-2xl mb-3 shadow-[0_0_30px_rgba(116,150,116,0.5)]">
                            {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <p className="text-white/60 text-sm">{step.subtitle}</p>
                        {bookings.length > 1 && currentStep < 5 && (
                            <p className="text-primary-400 text-xs mt-1">Booking {currentBookingIndex + 1} of {bookings.length}</p>
                        )}
                    </div>

                    {/* Step Content */}
                    <div className="px-4 pb-4">
                        {/* Step 1: Services */}
                        <div className={currentStep === 1 ? '' : 'hidden'}>
                            <div className="grid grid-cols-2 gap-2">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => updateCurrentBooking({ service: service.id })}
                                        className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${currentBooking.service === service.id
                                                ? 'border-primary-400 bg-primary-400/10 shadow-[0_0_15px_rgba(116,150,116,0.3)]'
                                                : 'border-white/10 bg-white/5'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{service.icon}</span>
                                        <h4 className="font-bold text-white text-xs">{service.name}</h4>
                                        <p className="text-white/50 text-[10px]">{service.duration}</p>
                                        <p className="text-primary-400 font-bold text-sm mt-1">${service.price}</p>
                                    </button>
                                ))}
                            </div>
                            <NavButtons showBack={false} />
                        </div>

                        {/* Step 2: Stylists */}
                        <div className={currentStep === 2 ? '' : 'hidden'}>
                            <div className="grid grid-cols-1 gap-3">
                                {stylists.map((stylist) => (
                                    <button
                                        key={stylist.id}
                                        onClick={() => updateCurrentBooking({ stylist: stylist.id })}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${currentBooking.stylist === stylist.id
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
                            <NavButtons />
                        </div>

                        {/* Step 3: Schedule */}
                        <div className={currentStep === 3 ? '' : 'hidden'}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white/80 mb-2 text-sm font-medium">Select Date</label>
                                    <input
                                        type="date"
                                        value={currentBooking.date}
                                        onChange={(e) => updateCurrentBooking({ date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base focus:border-primary-400 focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-2 text-sm font-medium">Select Time</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => updateCurrentBooking({ time })}
                                                className={`p-3 rounded-lg text-xs font-medium transition-all ${currentBooking.time === time
                                                        ? 'bg-primary-400 text-white'
                                                        : 'border border-white/10 bg-white/5 text-white/80'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <NavButtons />
                        </div>

                        {/* Step 4: Details */}
                        <div className={currentStep === 4 ? '' : 'hidden'}>
                            <div className="space-y-3">
                                <input type="text" value={currentBooking.name} onChange={(e) => updateCurrentBooking({ name: e.target.value })} placeholder="Full Name" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                                <input type="email" value={currentBooking.email} onChange={(e) => updateCurrentBooking({ email: e.target.value })} placeholder="Email Address" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                                <input type="tel" value={currentBooking.phone} onChange={(e) => updateCurrentBooking({ phone: e.target.value })} placeholder="Phone Number" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                                <textarea value={currentBooking.notes} onChange={(e) => updateCurrentBooking({ notes: e.target.value })} placeholder="Special requests (optional)" rows={3} className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white text-base placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all resize-none" />
                            </div>
                            <NavButtons />
                        </div>

                        {/* Step 5: Confirm */}
                        <div className={currentStep === 5 ? '' : 'hidden'}>
                            <div className="space-y-4">
                                {completedBookings.map((booking, index) => {
                                    const service = services.find(s => s.id === booking.service);
                                    const stylist = stylists.find(s => s.id === booking.stylist);
                                    return (
                                        <div key={booking.id} className="bg-white/5 rounded-xl p-3 border border-white/10 relative">
                                            {bookings.length > 1 && (
                                                <button onClick={() => removeBooking(index)} className="absolute top-2 right-2 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400 text-xs transition-colors">✕</button>
                                            )}
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{service?.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white text-sm">{service?.name}</h4>
                                                    <p className="text-white/50 text-xs">with {stylist?.name}</p>
                                                    <p className="text-white/50 text-xs">{booking.date} • {booking.time}</p>
                                                </div>
                                                <span className="text-primary-400 font-bold">${service?.price}</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button onClick={addAnotherBooking} className="w-full py-3 rounded-xl border-2 border-dashed border-primary-400/50 text-primary-400 font-medium hover:bg-primary-400/10 transition-all flex items-center justify-center gap-2">
                                    <span className="text-xl">+</span> Add Another
                                </button>

                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                    <p className="text-white/50 text-xs mb-1">Customer</p>
                                    <p className="text-white font-medium text-sm">{bookings[0]?.name || '-'}</p>
                                    <p className="text-white/60 text-xs">{bookings[0]?.email} • {bookings[0]?.phone}</p>
                                </div>

                                <div className="flex justify-between items-center py-3 border-t border-white/10">
                                    <span className="text-white/60">Total ({completedBookings.length})</span>
                                    <span className="text-primary-400 font-bold text-2xl">${calculateTotal()}</span>
                                </div>

                                {/* Back and Submit buttons */}
                                <div className="flex gap-3">
                                    <button onClick={goBack} className="flex-1 py-3 rounded-full border-2 border-white/20 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        Back
                                    </button>
                                    <button onClick={handleSubmit} disabled={completedBookings.length === 0} className="flex-[2] py-3 rounded-full font-bold text-base bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_30px_rgba(116,150,116,0.5)] active:scale-95 transition-all disabled:opacity-50">
                                        ✓ Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 py-2 text-center bg-black/40">
                    <p className="text-white/30 text-[10px]">↓ Scroll to continue ↓</p>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className={`h-full w-full flex ${isMobile ? 'hidden' : ''}`}>
                {/* Desktop Stepper */}
                <div className="w-64 xl:w-80 h-full flex items-center justify-center bg-black/20">
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
                            {steps.map((s) => (
                                <div key={s.id} className="relative z-10 flex items-center gap-4">
                                    <div className={`w-12 h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center text-lg xl:text-xl transition-all duration-500 ${currentStep > s.id ? 'bg-primary-400 text-white shadow-[0_0_15px_rgba(116,150,116,0.5)]'
                                            : currentStep === s.id ? 'bg-primary-400 text-white scale-110 shadow-[0_0_25px_#749674]'
                                                : 'bg-white/10 text-white/40'
                                        }`}>
                                        {currentStep > s.id ? '✓' : s.icon}
                                    </div>
                                    <div className={`transition-opacity duration-300 ${currentStep >= s.id ? 'opacity-100' : 'opacity-40'}`}>
                                        <p className="text-white font-bold text-sm xl:text-base">{s.title}</p>
                                        <p className="text-white/50 text-xs">{s.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Content */}
                <div className="flex-1 flex items-center justify-center px-12 py-4 overflow-y-auto">
                    <div className="w-full max-w-3xl">
                        {/* Step 1 */}
                        <div className={currentStep === 1 ? 'animate-fade-in-up' : 'hidden'}>
                            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Choose Your Service</h3>
                            <p className="text-white/60 mb-6 text-center">Select the perfect treatment</p>
                            <div className="grid grid-cols-3 gap-4">
                                {services.map((service) => (
                                    <button key={service.id} onClick={() => updateCurrentBooking({ service: service.id })} className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${currentBooking.service === service.id ? 'border-primary-400 bg-primary-400/20' : 'border-white/10 bg-white/5 hover:border-primary-400/50'}`}>
                                        <span className="text-3xl block mb-2">{service.icon}</span>
                                        <h4 className="font-bold text-white text-base">{service.name}</h4>
                                        <p className="text-white/60 text-xs">{service.duration}</p>
                                        <p className="text-primary-400 font-bold mt-1 text-lg">${service.price}</p>
                                    </button>
                                ))}
                            </div>
                            <NavButtons showBack={false} />
                        </div>

                        {/* Step 2 */}
                        <div className={currentStep === 2 ? 'animate-fade-in-up' : 'hidden'}>
                            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Select Your Stylist</h3>
                            <p className="text-white/60 mb-6 text-center">Choose from our experts</p>
                            <div className="grid grid-cols-2 gap-4">
                                {stylists.map((stylist) => (
                                    <button key={stylist.id} onClick={() => updateCurrentBooking({ stylist: stylist.id })} className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${currentBooking.stylist === stylist.id ? 'border-primary-400 bg-primary-400/20' : 'border-white/10 bg-white/5 hover:border-primary-400/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl">{stylist.image}</span>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{stylist.name}</h4>
                                                <p className="text-white/60 text-sm">{stylist.specialty}</p>
                                                <div className="flex items-center gap-1 mt-1"><span className="text-yellow-400">★</span><span className="text-white font-medium">{stylist.rating}</span></div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <NavButtons />
                        </div>

                        {/* Step 3 */}
                        <div className={currentStep === 3 ? 'animate-fade-in-up max-w-lg mx-auto' : 'hidden'}>
                            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Pick Date & Time</h3>
                            <p className="text-white/60 mb-6 text-center">Choose your slot</p>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white/80 mb-2 font-medium">Select Date</label>
                                    <input type="date" value={currentBooking.date} onChange={(e) => updateCurrentBooking({ date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white focus:border-primary-400 focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-2 font-medium">Select Time</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {timeSlots.map((time) => (
                                            <button key={time} onClick={() => updateCurrentBooking({ time })} className={`p-3 rounded-lg text-sm font-medium transition-all ${currentBooking.time === time ? 'bg-primary-400 text-white' : 'border border-white/10 bg-white/5 text-white/80 hover:border-primary-400/50'}`}>{time}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <NavButtons />
                        </div>

                        {/* Step 4 */}
                        <div className={currentStep === 4 ? 'animate-fade-in-up max-w-md mx-auto' : 'hidden'}>
                            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Your Details</h3>
                            <p className="text-white/60 mb-6 text-center">Tell us about you</p>
                            <div className="space-y-4">
                                <input type="text" value={currentBooking.name} onChange={(e) => updateCurrentBooking({ name: e.target.value })} placeholder="Full Name" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                                <input type="email" value={currentBooking.email} onChange={(e) => updateCurrentBooking({ email: e.target.value })} placeholder="Email Address" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                                <input type="tel" value={currentBooking.phone} onChange={(e) => updateCurrentBooking({ phone: e.target.value })} placeholder="Phone Number" className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all" />
                                <textarea value={currentBooking.notes} onChange={(e) => updateCurrentBooking({ notes: e.target.value })} placeholder="Special requests" rows={3} className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-primary-400 focus:outline-none transition-all resize-none" />
                            </div>
                            <NavButtons />
                        </div>

                        {/* Step 5 */}
                        <div className={currentStep === 5 ? 'animate-fade-in-up max-w-2xl mx-auto' : 'hidden'}>
                            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Review Your Bookings</h3>
                            <p className="text-white/60 mb-6 text-center">{completedBookings.length} appointment{completedBookings.length !== 1 ? 's' : ''} to confirm</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {completedBookings.map((booking, index) => {
                                    const service = services.find(s => s.id === booking.service);
                                    const stylist = stylists.find(s => s.id === booking.stylist);
                                    return (
                                        <div key={booking.id} className="bg-white/5 rounded-xl p-4 border border-white/10 relative">
                                            {completedBookings.length > 1 && (
                                                <button onClick={() => removeBooking(index)} className="absolute top-3 right-3 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400 text-xs transition-colors">✕</button>
                                            )}
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-3xl">{service?.icon}</span>
                                                <div><h4 className="font-bold text-white">{service?.name}</h4><p className="text-white/50 text-sm">with {stylist?.name}</p></div>
                                            </div>
                                            <div className="text-white/60 text-sm space-y-1"><p>📅 {booking.date}</p><p>🕐 {booking.time}</p></div>
                                            <p className="text-primary-400 font-bold text-xl mt-3">${service?.price}</p>
                                        </div>
                                    );
                                })}

                                <button onClick={addAnotherBooking} className="border-2 border-dashed border-primary-400/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-primary-400/10 hover:border-primary-400 transition-all group min-h-[180px]">
                                    <span className="text-4xl text-primary-400/60 group-hover:text-primary-400 transition-colors">+</span>
                                    <span className="text-primary-400/60 group-hover:text-primary-400 font-medium transition-colors">Add Another</span>
                                </button>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10"><span className="text-white/60">Customer</span><span className="text-white font-medium">{bookings[0]?.name} • {bookings[0]?.email}</span></div>
                                <div className="flex justify-between items-center"><span className="text-white/60">Total</span><span className="text-primary-400 font-bold text-3xl">${calculateTotal()}</span></div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={goBack} className="flex-1 py-4 rounded-full border-2 border-white/20 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    Back
                                </button>
                                <button onClick={handleSubmit} disabled={completedBookings.length === 0} className="flex-[2] py-4 rounded-full font-bold bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_20px_rgba(116,150,116,0.4)] hover:scale-105 transition-all disabled:opacity-50">
                                    Confirm {completedBookings.length > 1 ? `All ${completedBookings.length} Bookings` : 'Booking'} ✓
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-white/30 text-xs">Scroll to navigate steps</p>
                            <div className="mt-1 animate-bounce">
                                <svg className="w-4 h-4 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop overlays */}
                <div className="absolute top-6 right-8 z-40">
                    <h2 className="text-xl font-bold gradient-text">Book Appointment</h2>
                    {bookings.length > 1 && <p className="text-primary-400 text-xs mt-1">🛒 {completedBookings.length} in cart</p>}
                </div>
                <div className="absolute bottom-6 right-6 z-40">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-sm">
                        <span className="text-primary-400 font-bold">{currentStep}</span>
                        <span className="text-white/40"> / {steps.length}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
