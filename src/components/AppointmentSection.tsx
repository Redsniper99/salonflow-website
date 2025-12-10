'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';
import {
    fetchServices,
    fetchStylistsForService,
    fetchTimeSlots,
    fetchConsolidatedAvailability,
    createBooking,
    formatTime,
    getMinDate,
    type Service,
    type Stylist,
    type TimeSlot,
    type ConsolidatedSlot,
} from '@/lib/api';

interface BookingData {
    id: string;
    service: string;
    wantsStylist: 'yes' | 'no' | '';
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
    { id: 2, title: 'Preference', icon: '🤔', subtitle: 'Stylist preference' },
    { id: 3, title: 'Stylist', icon: '👩‍🦰', subtitle: 'Pick your expert' },
    { id: 4, title: 'Schedule', icon: '📅', subtitle: 'Select date & time' },
    { id: 5, title: 'Details', icon: '📝', subtitle: 'Your information' },
    { id: 6, title: 'Confirm', icon: '✓', subtitle: 'Review & Submit' },
];

const serviceCategories = [
    { id: 'all', name: 'All', icon: '✨' },
    { id: 'Hair', name: 'Hair', icon: '✂️' },
    { id: 'Spa', name: 'Skin & Spa', icon: '💆' },
    { id: 'Nails', name: 'Nails', icon: '💅' },
    { id: 'Bridal', name: 'Bridal', icon: '👰' },
];

const generateId = () => `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const createEmptyBooking = (): BookingData => ({
    id: generateId(),
    service: '',
    wantsStylist: '',
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

    // API Data States
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [consolidatedSlots, setConsolidatedSlots] = useState<ConsolidatedSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Booking States
    const [bookings, setBookings] = useState<BookingData[]>(() => [createEmptyBooking()]);
    const [currentBookingIndex, setCurrentBookingIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const currentBooking = bookings[currentBookingIndex] || bookings[0] || createEmptyBooking();

    const updateCurrentBooking = (updates: Partial<BookingData>) => {
        setBookings(prev => prev.map((b, i) =>
            i === currentBookingIndex ? { ...b, ...updates } : b
        ));
    };

    // Get selected service object
    const selectedService = services.find(s => s.id === currentBooking.service);

    // Navigation functions
    const goBack = () => {
        if (currentStep > 1) {
            if (currentStep === 4 && currentBooking.wantsStylist === 'no') {
                setCurrentStep(2); // Skip stylist step
            } else {
                setCurrentStep(currentStep - 1);
            }
        }
    };

    const goNext = () => {
        if (currentStep < steps.length) {
            if (currentStep === 2 && currentBooking.wantsStylist === 'no') {
                updateCurrentBooking({ stylist: 'any' });
                setCurrentStep(4); // Skip to schedule
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return !!currentBooking.service;
            case 2: return !!currentBooking.wantsStylist;
            case 3: return currentBooking.wantsStylist === 'no' || !!currentBooking.stylist;
            case 4: return !!currentBooking.date && !!currentBooking.time;
            case 5: return !!currentBooking.name && !!currentBooking.phone;
            default: return true;
        }
    };

    // Mount effects
    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch services on mount
    useEffect(() => {
        async function loadServices() {
            try {
                setLoading(true);
                const data = await fetchServices();
                setServices(data);
                setError(null);
            } catch (err) {
                console.error('Error loading services:', err);
                setError('Failed to load services. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    // Fetch stylists when service is selected (for preferred stylist flow)
    useEffect(() => {
        if (!currentBooking.service || currentBooking.wantsStylist !== 'yes') {
            return;
        }

        async function loadStylists() {
            try {
                setLoading(true);
                const data = await fetchStylistsForService(currentBooking.service, currentBooking.date);
                setStylists(data);
                setError(null);
            } catch (err) {
                console.error('Error loading stylists:', err);
                setError('Failed to load stylists.');
            } finally {
                setLoading(false);
            }
        }
        loadStylists();
    }, [currentBooking.service, currentBooking.wantsStylist, currentBooking.date]);

    // Fetch time slots - Different logic for preference vs no preference
    useEffect(() => {
        if (!currentBooking.date || !currentBooking.service) {
            setTimeSlots([]);
            setConsolidatedSlots([]);
            return;
        }

        const isNoPreference = currentBooking.wantsStylist === 'no' || currentBooking.stylist === 'any';

        async function loadAvailability() {
            try {
                setLoading(true);

                if (isNoPreference) {
                    // NO PREFERENCE: Use consolidated availability API
                    const data = await fetchConsolidatedAvailability(
                        currentBooking.service,
                        currentBooking.date,
                        selectedService?.duration || 30
                    );
                    setConsolidatedSlots(data.slots);
                    setTimeSlots([]);
                } else if (currentBooking.stylist && currentBooking.stylist !== 'any') {
                    // SPECIFIC STYLIST: Load their time slots
                    const data = await fetchTimeSlots(
                        currentBooking.stylist,
                        currentBooking.date,
                        selectedService?.duration || 30
                    );
                    setTimeSlots(data);
                    setConsolidatedSlots([]);
                }

                setError(null);
            } catch (err) {
                console.error('Error loading availability:', err);
                setError('Failed to load available times.');
            } finally {
                setLoading(false);
            }
        }
        loadAvailability();
    }, [currentBooking.service, currentBooking.date, currentBooking.stylist, currentBooking.wantsStylist, selectedService?.duration]);

    // ScrollTrigger for pinning
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
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    scrub: isMobile ? 1 : false,
                    onUpdate: isMobile ? (self) => {
                        const progress = self.progress;
                        const stepIndex = Math.floor(progress * steps.length);
                        const newStep = Math.min(Math.max(stepIndex + 1, 1), steps.length);
                        setCurrentStep(prev => prev !== newStep ? newStep : prev);
                    } : undefined,
                });
            }, section);
        }, 300);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, [isMounted, isMobile]);

    // Handle booking submission
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Determine stylist ID - use 'NO_PREFERENCE' for auto-assignment
            const isNoPreference = currentBooking.wantsStylist === 'no' || currentBooking.stylist === 'any';
            const stylistId = isNoPreference ? 'NO_PREFERENCE' : currentBooking.stylist;

            const result = await createBooking({
                customer: {
                    name: currentBooking.name,
                    phone: currentBooking.phone,
                    email: currentBooking.email || undefined,
                },
                appointment: {
                    service_id: currentBooking.service,
                    stylist_id: stylistId,
                    date: currentBooking.date,
                    time: currentBooking.time,
                    notes: currentBooking.notes || undefined,
                }
            });

            alert(`🎉 Appointment booked successfully!\n\nAppointment ID: ${result.appointmentId}\nDate: ${result.date}\nTime: ${formatTime(result.time)}`);

            // Reset
            setBookings([createEmptyBooking()]);
            setCurrentBookingIndex(0);
            setCurrentStep(1);
        } catch (err: any) {
            console.error('Error submitting booking:', err);
            setError(err.message || 'Failed to create appointment. Please try again.');
            alert('Failed to create appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter services by category
    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(s => s.category === selectedCategory);

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

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Service Selection
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Choose Your Service</h3>
                            <p className="text-white/60">Select a service to begin your booking</p>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {serviceCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? 'bg-primary-400 text-white'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                        }`}
                                >
                                    {cat.icon} {cat.name}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-white/60 mt-2">Loading services...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                {filteredServices.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => updateCurrentBooking({ service: service.id })}
                                        className={`p-4 rounded-xl text-left transition-all ${currentBooking.service === service.id
                                            ? 'bg-primary-400/30 border-2 border-primary-400'
                                            : 'bg-white/5 border-2 border-white/10 hover:border-primary-400/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-white">{service.name}</h4>
                                                <p className="text-sm text-white/60">{service.duration} mins</p>
                                            </div>
                                            <span className="text-primary-400 font-bold">Rs {service.price}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <NavButtons showBack={false} />
                    </div>
                );

            case 2: // Stylist Preference
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Stylist Preference</h3>
                            <p className="text-white/60">Would you like to choose a specific stylist?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <button
                                onClick={() => updateCurrentBooking({ wantsStylist: 'yes', stylist: '' })}
                                className={`p-6 rounded-xl text-center transition-all ${currentBooking.wantsStylist === 'yes'
                                    ? 'bg-primary-400/30 border-2 border-primary-400'
                                    : 'bg-white/5 border-2 border-white/10 hover:border-primary-400/50'
                                    }`}
                            >
                                <div className="text-4xl mb-3">👤</div>
                                <h4 className="font-semibold text-white">Yes, I have a preference</h4>
                                <p className="text-sm text-white/60 mt-1">Choose your favorite stylist</p>
                            </button>

                            <button
                                onClick={() => updateCurrentBooking({ wantsStylist: 'no', stylist: 'any' })}
                                className={`p-6 rounded-xl text-center transition-all ${currentBooking.wantsStylist === 'no'
                                    ? 'bg-primary-400/30 border-2 border-primary-400'
                                    : 'bg-white/5 border-2 border-white/10 hover:border-primary-400/50'
                                    }`}
                            >
                                <div className="text-4xl mb-3">👥</div>
                                <h4 className="font-semibold text-white">No preference</h4>
                                <p className="text-sm text-white/60 mt-1">Show all available stylists</p>
                            </button>
                        </div>
                        <NavButtons />
                    </div>
                );

            case 3: // Stylist Selection (only for "yes" preference)
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Select Your Stylist</h3>
                            <p className="text-white/60">Choose from our expert team</p>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-white/60 mt-2">Loading stylists...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {stylists.map(stylist => (
                                    <button
                                        key={stylist.id}
                                        onClick={() => updateCurrentBooking({ stylist: stylist.id })}
                                        className={`p-4 rounded-xl text-center transition-all ${currentBooking.stylist === stylist.id
                                            ? 'bg-primary-400/30 border-2 border-primary-400'
                                            : 'bg-white/5 border-2 border-white/10 hover:border-primary-400/50'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">👩‍🦰</div>
                                        <h4 className="font-semibold text-white">{stylist.name}</h4>
                                        <p className="text-xs text-white/60 mt-1">
                                            {stylist.skills?.map(s => s.name).join(', ').substring(0, 30)}...
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                        <NavButtons />
                    </div>
                );

            case 4: // Schedule - Date & Time
                const isNoPreference = currentBooking.wantsStylist === 'no' || currentBooking.stylist === 'any';

                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Select Date & Time</h3>
                            <p className="text-white/60">
                                {isNoPreference
                                    ? 'Choose from all available stylists'
                                    : 'Pick your preferred time slot'}
                            </p>
                        </div>

                        {/* Date Picker */}
                        <div className="max-w-md mx-auto">
                            <label className="block text-white/80 mb-2 text-sm font-medium">Select Date</label>
                            <input
                                type="date"
                                value={currentBooking.date}
                                onChange={(e) => updateCurrentBooking({ date: e.target.value, time: '' })}
                                min={getMinDate()}
                                className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white focus:border-primary-400 focus:outline-none transition-all"
                            />
                        </div>

                        {currentBooking.date && loading && (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-white/60 mt-2">Loading available slots...</p>
                            </div>
                        )}

                        {/* NO PREFERENCE: Show consolidated time slots grid */}
                        {currentBooking.date && isNoPreference && !loading && consolidatedSlots.length > 0 && (
                            <div className="max-w-md mx-auto">
                                <label className="block text-white/80 mb-2 text-sm font-medium">Select Time</label>
                                <p className="text-xs text-primary-400 mb-3">We&apos;ll assign the best available stylist</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {consolidatedSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => updateCurrentBooking({ time: slot.time })}
                                            disabled={!slot.available}
                                            className={`p-3 rounded-lg text-sm font-medium transition-all ${currentBooking.time === slot.time
                                                ? 'bg-primary-400 text-white'
                                                : slot.available
                                                    ? 'bg-white/10 text-white/80 hover:bg-primary-400/30'
                                                    : 'bg-red-900/20 text-red-400/50 cursor-not-allowed'
                                                }`}
                                            title={slot.available ? `${slot.availableStylists || 1} stylist(s) available` : slot.reason}
                                        >
                                            {formatTime(slot.time)}
                                            {!slot.available && <span className="block text-[9px]">Booked</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SPECIFIC STYLIST: Show only their slots */}
                        {currentBooking.date && !isNoPreference && !loading && timeSlots.length > 0 && (
                            <div className="max-w-md mx-auto">
                                <label className="block text-white/80 mb-2 text-sm font-medium">Select Time</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => updateCurrentBooking({ time: slot.time })}
                                            disabled={!slot.available}
                                            className={`p-3 rounded-lg text-sm font-medium transition-all ${currentBooking.time === slot.time
                                                ? 'bg-primary-400 text-white'
                                                : slot.available
                                                    ? 'bg-white/10 text-white/80 hover:bg-primary-400/30'
                                                    : 'bg-red-900/20 text-red-400/50 cursor-not-allowed'
                                                }`}
                                            title={slot.available ? 'Available' : slot.reason}
                                        >
                                            {formatTime(slot.time)}
                                            {!slot.available && <span className="block text-[9px]">Booked</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentBooking.date && !loading && consolidatedSlots.length === 0 && timeSlots.length === 0 && (
                            <div className="text-center py-8 text-white/60">
                                No availability found for this date. Please try another date.
                            </div>
                        )}

                        <NavButtons />
                    </div>
                );

            case 5: // Customer Details
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Your Details</h3>
                            <p className="text-white/60">Enter your contact information</p>
                        </div>

                        <div className="max-w-md mx-auto space-y-4">
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-medium">Name *</label>
                                <input
                                    type="text"
                                    value={currentBooking.name}
                                    onChange={(e) => updateCurrentBooking({ name: e.target.value })}
                                    placeholder="Your full name"
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:border-primary-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-medium">Phone *</label>
                                <input
                                    type="tel"
                                    value={currentBooking.phone}
                                    onChange={(e) => updateCurrentBooking({ phone: e.target.value })}
                                    placeholder="+94 77 123 4567"
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:border-primary-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-medium">Email (Optional)</label>
                                <input
                                    type="email"
                                    value={currentBooking.email}
                                    onChange={(e) => updateCurrentBooking({ email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:border-primary-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-2 text-sm font-medium">Notes (Optional)</label>
                                <textarea
                                    value={currentBooking.notes}
                                    onChange={(e) => updateCurrentBooking({ notes: e.target.value })}
                                    placeholder="Any special requests..."
                                    rows={3}
                                    className="w-full p-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/40 focus:border-primary-400 focus:outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                        <NavButtons />
                    </div>
                );

            case 6: // Confirmation
                const isNoPreferenceConfirm = currentBooking.wantsStylist === 'no' || currentBooking.stylist === 'any';
                const stylistName = isNoPreferenceConfirm
                    ? 'Any Available Stylist'
                    : (stylists.find(s => s.id === currentBooking.stylist)?.name || 'Selected Stylist');

                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Confirm Your Booking</h3>
                            <p className="text-white/60">Review and submit your appointment</p>
                        </div>

                        <div className="max-w-md mx-auto bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Service</span>
                                    <span className="text-white font-medium">{selectedService?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Stylist</span>
                                    <span className="text-white font-medium">{stylistName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Date</span>
                                    <span className="text-white font-medium">{currentBooking.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Time</span>
                                    <span className="text-white font-medium">{formatTime(currentBooking.time)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Duration</span>
                                    <span className="text-white font-medium">{selectedService?.duration} mins</span>
                                </div>
                                <hr className="border-white/10" />
                                <div className="flex justify-between">
                                    <span className="text-white/60">Customer</span>
                                    <span className="text-white font-medium">{currentBooking.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Phone</span>
                                    <span className="text-white font-medium">{currentBooking.phone}</span>
                                </div>
                                <hr className="border-white/10" />
                                <div className="flex justify-between text-lg">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-primary-400 font-bold">Rs {selectedService?.price}</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="max-w-md mx-auto bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-4 mt-6 max-w-md mx-auto">
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 rounded-full font-medium bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-[0_0_20px_rgba(116,150,116,0.4)] hover:scale-105 transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
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
            {/* Desktop Layout */}
            <div className={`h-full flex ${isMobile ? 'hidden' : ''}`}>
                {/* Left Sidebar - Steps */}
                <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-primary-400/20 p-6 flex flex-col">
                    <h2 className="text-2xl font-bold gradient-text mb-8">Book Appointment</h2>

                    <div className="flex-1">
                        {steps.map((s, index) => (
                            <div
                                key={s.id}
                                className={`flex items-center gap-4 p-4 rounded-xl mb-2 transition-all cursor-pointer ${currentStep === s.id
                                    ? 'bg-primary-400/20 border border-primary-400/50'
                                    : currentStep > s.id
                                        ? 'bg-white/5 border border-white/10'
                                        : 'opacity-50'
                                    }`}
                                onClick={() => currentStep > s.id && setCurrentStep(s.id)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${currentStep > s.id
                                    ? 'bg-primary-400 text-white'
                                    : currentStep === s.id
                                        ? 'bg-primary-400 text-white ring-2 ring-primary-400/50'
                                        : 'bg-white/10 text-white/40'
                                    }`}>
                                    {currentStep > s.id ? '✓' : s.icon}
                                </div>
                                <div>
                                    <p className={`font-medium ${currentStep >= s.id ? 'text-white' : 'text-white/40'}`}>
                                        {s.title}
                                    </p>
                                    <p className="text-xs text-white/50">{s.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Service Info */}
                    {selectedService && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p className="text-white/60 text-sm mb-1">Selected Service</p>
                            <p className="text-white font-semibold">{selectedService.name}</p>
                            <p className="text-primary-400 font-bold">Rs {selectedService.price}</p>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
                    <div className="w-full max-w-3xl">
                        {renderStepContent()}
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className={`h-full flex flex-col ${isMobile ? '' : 'hidden'}`}>
                {/* Mobile Header */}
                <div className="flex-shrink-0 bg-black/60 backdrop-blur-lg border-b border-primary-400/20 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold gradient-text">Book Appointment</h2>
                        <span className="text-white/50 text-xs">Step {currentStep}/{steps.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {steps.map(s => (
                            <div
                                key={s.id}
                                className={`flex-1 h-1 rounded-full transition-all ${currentStep >= s.id ? 'bg-primary-400' : 'bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {renderStepContent()}
                </div>
            </div>
        </section>
    );
}
