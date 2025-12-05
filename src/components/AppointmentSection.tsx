'use client';

import { useState, useEffect, useRef } from 'react';

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
    { id: 1, title: 'Service', description: 'Choose your service' },
    { id: 2, title: 'Stylist', description: 'Select your stylist' },
    { id: 3, title: 'Date & Time', description: 'Pick your slot' },
    { id: 4, title: 'Details', description: 'Your information' },
    { id: 5, title: 'Confirm', description: 'Review & book' },
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
    const [isVisible, setIsVisible] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
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

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Booking submitted:', bookingData);
        alert('Appointment booked successfully! 🎉');
        setCurrentStep(1);
        setBookingData({
            service: '',
            stylist: '',
            date: '',
            time: '',
            name: '',
            email: '',
            phone: '',
            notes: '',
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Choose Your Service</h3>
                        <p className="text-white/60 mb-8">Select the treatment that suits you best</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${bookingData.service === service.id
                                            ? 'border-salon-accent bg-salon-accent/20 shadow-lg shadow-salon-accent/20'
                                            : 'border-white/10 bg-white/5 hover:border-salon-accent/50 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-4xl">{service.icon}</span>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white text-lg">{service.name}</h4>
                                            <p className="text-white/60 text-sm mt-1">{service.duration}</p>
                                            <p className="text-salon-accent font-bold mt-2">{service.price}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${bookingData.service === service.id
                                                ? 'border-salon-accent bg-salon-accent'
                                                : 'border-white/30'
                                            }`}>
                                            {bookingData.service === service.id && (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Select Your Stylist</h3>
                        <p className="text-white/60 mb-8">Choose from our expert team</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stylists.map((stylist) => (
                                <button
                                    key={stylist.id}
                                    onClick={() => setBookingData({ ...bookingData, stylist: stylist.id })}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${bookingData.stylist === stylist.id
                                            ? 'border-salon-accent bg-salon-accent/20 shadow-lg shadow-salon-accent/20'
                                            : 'border-white/10 bg-white/5 hover:border-salon-accent/50 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl">{stylist.image}</span>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white text-lg">{stylist.name}</h4>
                                            <p className="text-white/60 text-sm">{stylist.specialty}</p>
                                            <div className="flex items-center gap-1 mt-2">
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
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Pick Date & Time</h3>
                        <p className="text-white/60 mb-8">Choose your preferred appointment slot</p>

                        <div className="mb-8">
                            <label className="block text-white/80 mb-3 font-medium">Select Date</label>
                            <input
                                type="date"
                                value={bookingData.date}
                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white focus:border-salon-accent focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 mb-3 font-medium">Select Time</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setBookingData({ ...bookingData, time })}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium ${bookingData.time === time
                                                ? 'border-salon-accent bg-salon-accent text-white shadow-lg shadow-salon-accent/30'
                                                : 'border-white/10 bg-white/5 text-white/80 hover:border-salon-accent/50'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Details</h3>
                        <p className="text-white/60 mb-8">Tell us how to reach you</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/80 mb-2 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    value={bookingData.name}
                                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-salon-accent focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 font-medium">Email</label>
                                <input
                                    type="email"
                                    value={bookingData.email}
                                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-salon-accent focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 font-medium">Phone</label>
                                <input
                                    type="tel"
                                    value={bookingData.phone}
                                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-salon-accent focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 font-medium">Special Requests (Optional)</label>
                                <textarea
                                    value={bookingData.notes}
                                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                    placeholder="Any special requirements..."
                                    rows={3}
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-salon-accent focus:outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                const selectedService = services.find(s => s.id === bookingData.service);
                const selectedStylist = stylists.find(s => s.id === bookingData.stylist);

                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Confirm Booking</h3>
                        <p className="text-white/60 mb-8">Review your appointment details</p>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Service</span>
                                <span className="text-white font-medium flex items-center gap-2">
                                    {selectedService?.icon} {selectedService?.name}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Stylist</span>
                                <span className="text-white font-medium">{selectedStylist?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Date</span>
                                <span className="text-white font-medium">{bookingData.date}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Time</span>
                                <span className="text-white font-medium">{bookingData.time}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Name</span>
                                <span className="text-white font-medium">{bookingData.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/60">Total</span>
                                <span className="text-salon-accent font-bold text-2xl">{selectedService?.price}</span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return !!bookingData.service;
            case 2: return !!bookingData.stylist;
            case 3: return !!bookingData.date && !!bookingData.time;
            case 4: return !!bookingData.name && !!bookingData.email && !!bookingData.phone;
            case 5: return true;
            default: return false;
        }
    };

    return (
        <section
            ref={sectionRef}
            id="appointment"
            className={`min-h-screen py-20 px-4 relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="container mx-auto max-w-7xl h-full">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text drop-shadow-sm">
                        Book Appointment
                    </h2>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        Schedule your visit in just a few steps
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Vertical Stepper - Desktop */}
                    <div className="hidden lg:block lg:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="relative">
                                {/* Progress Line Background */}
                                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-white/10" />

                                {/* Active Progress Line */}
                                <div
                                    className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-salon-accent to-salon-green transition-all duration-500"
                                    style={{
                                        height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                        boxShadow: '0 0 20px rgba(122, 155, 111, 0.5)',
                                    }}
                                />

                                {/* Steps */}
                                <div className="space-y-8">
                                    {steps.map((step, index) => (
                                        <div key={step.id} className="flex items-center gap-4 relative">
                                            {/* Step Circle */}
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 z-10 ${currentStep > step.id
                                                        ? 'bg-salon-accent text-white shadow-lg shadow-salon-accent/50'
                                                        : currentStep === step.id
                                                            ? 'bg-salon-accent text-white shadow-lg shadow-salon-accent/50 ring-4 ring-salon-accent/30 animate-pulse'
                                                            : 'bg-white/10 text-white/40'
                                                    }`}
                                                style={currentStep === step.id ? { boxShadow: '0 0 30px rgba(122, 155, 111, 0.6)' } : {}}
                                            >
                                                {currentStep > step.id ? (
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : step.id}
                                            </div>

                                            {/* Step Text */}
                                            <div className={`transition-all duration-300 ${currentStep >= step.id ? 'opacity-100' : 'opacity-40'
                                                }`}>
                                                <h4 className="font-semibold text-white">{step.title}</h4>
                                                <p className="text-white/60 text-sm">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Stepper - Horizontal */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center justify-between relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
                            <div
                                className="absolute top-5 left-0 h-0.5 bg-salon-accent transition-all duration-500"
                                style={{
                                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                    boxShadow: '0 0 10px rgba(122, 155, 111, 0.5)',
                                }}
                            />

                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${currentStep > step.id
                                                ? 'bg-salon-accent text-white'
                                                : currentStep === step.id
                                                    ? 'bg-salon-accent text-white ring-4 ring-salon-accent/30'
                                                    : 'bg-white/10 text-white/40'
                                            }`}
                                    >
                                        {currentStep > step.id ? '✓' : step.id}
                                    </div>
                                    <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-white/40'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/10 min-h-[500px]">
                            {/* Step Content with Animation */}
                            <div
                                key={currentStep}
                                className="animate-fade-in-up"
                            >
                                {renderStepContent()}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${currentStep === 1
                                            ? 'opacity-0 pointer-events-none'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    ← Back
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={!canProceed()}
                                        className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${canProceed()
                                                ? 'bg-salon-accent text-white hover:shadow-lg hover:shadow-salon-accent/30 hover:scale-105'
                                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                                            }`}
                                    >
                                        Next →
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-8 py-3 rounded-full font-medium bg-gradient-to-r from-salon-accent to-salon-green text-white hover:shadow-lg hover:shadow-salon-accent/30 hover:scale-105 transition-all duration-300"
                                    >
                                        Confirm Booking ✓
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
