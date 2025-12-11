// API Service Layer for SalonFlow Backend
// This connects to the management system's public API endpoints

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/public').replace(/\/$/, '');

// Enable demo mode when backend is not available
let DEMO_MODE = false;

// Types matching API responses
export interface Service {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    duration: number;
    gender: 'Male' | 'Female' | 'Unisex';
}

export interface Stylist {
    id: string;
    name: string;
    workingDays: string[];
    workingHours: { start: string; end: string };
    skills: { id: string; name: string; category: string }[];
}

export interface TimeSlot {
    time: string;
    available: boolean;
    reason?: string;
}

// Raw slot from API (might have different property names or types)
interface RawTimeSlot {
    time: string;
    available?: boolean | string | number;
    isAvailable?: boolean | string | number;
    reason?: string;
    status?: string;
}

// Normalize a single slot to ensure `available` is a proper boolean
function normalizeSlot(slot: RawTimeSlot): TimeSlot {
    // Check for different property names the backend might use
    let isAvailable: boolean;

    if (typeof slot.available !== 'undefined') {
        // Handle string "true"/"false", numbers 0/1, or actual booleans
        isAvailable = slot.available === true || slot.available === 'true' || slot.available === 1;
    } else if (typeof slot.isAvailable !== 'undefined') {
        isAvailable = slot.isAvailable === true || slot.isAvailable === 'true' || slot.isAvailable === 1;
    } else if (slot.status) {
        // If backend uses status field
        isAvailable = slot.status.toLowerCase() === 'available';
    } else {
        // Default to true if no availability info
        isAvailable = true;
    }

    return {
        time: slot.time,
        available: isAvailable,
        reason: !isAvailable ? (slot.reason || 'Already booked') : undefined,
    };
}

// Normalize an array of slots
function normalizeSlots(slots: RawTimeSlot[]): TimeSlot[] {
    if (!Array.isArray(slots)) return [];
    return slots.map(normalizeSlot);
}

export interface StylistWithSlots {
    stylist: Stylist;
    skills: { id: string; name: string; category: string }[];
    slots: TimeSlot[];
    availableCount: number;
}

// Consolidated availability response (merged grid for "No Preference")
export interface ConsolidatedSlot {
    time: string;
    available: boolean;
    availableStylists?: number;
    reason?: string;
}

export interface ConsolidatedAvailabilityResponse {
    slots: ConsolidatedSlot[];
    service: Service;
    totalStylists: number;
    availableCount: number;
}

export interface BookingRequest {
    customer: {
        name: string;
        phone: string;
        email?: string;
        gender?: 'Male' | 'Female' | 'Other';
    };
    appointment: {
        service_id: string;
        stylist_id: string;
        date: string;
        time: string;
        notes?: string;
    };
}

// Demo data for testing when backend is not running
const DEMO_SERVICES: Service[] = [
    { id: 'haircut', name: 'Haircut & Styling', category: 'Hair', price: 1500, duration: 45, gender: 'Unisex' },
    { id: 'coloring', name: 'Hair Coloring', category: 'Hair', price: 3500, duration: 120, gender: 'Unisex' },
    { id: 'highlights', name: 'Hair Highlights', category: 'Hair', price: 4500, duration: 150, gender: 'Unisex' },
    { id: 'facial', name: 'Facial Treatment', category: 'Spa', price: 2500, duration: 60, gender: 'Unisex' },
    { id: 'massage', name: 'Body Massage', category: 'Spa', price: 3000, duration: 90, gender: 'Unisex' },
    { id: 'manicure', name: 'Manicure', category: 'Nails', price: 1000, duration: 45, gender: 'Female' },
    { id: 'pedicure', name: 'Pedicure', category: 'Nails', price: 1200, duration: 60, gender: 'Female' },
    { id: 'bridal', name: 'Bridal Package', category: 'Bridal', price: 25000, duration: 240, gender: 'Female' },
];

const DEMO_STYLISTS: Stylist[] = [
    { id: 'sarah', name: 'Sarah Johnson', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], workingHours: { start: '09:00', end: '18:00' }, skills: [{ id: 'haircut', name: 'Haircut', category: 'Hair' }, { id: 'coloring', name: 'Hair Coloring', category: 'Hair' }] },
    { id: 'emma', name: 'Emma Wilson', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], workingHours: { start: '10:00', end: '19:00' }, skills: [{ id: 'haircut', name: 'Haircut', category: 'Hair' }] },
    { id: 'james', name: 'James Chen', workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], workingHours: { start: '09:00', end: '17:00' }, skills: [{ id: 'haircut', name: 'Haircut', category: 'Hair' }] },
    { id: 'sofia', name: 'Sofia Garcia', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], workingHours: { start: '09:00', end: '18:00' }, skills: [{ id: 'facial', name: 'Facial', category: 'Spa' }] },
];

function generateDemoTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
        const isBooked = Math.random() > 0.7;
        slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: !isBooked,
            reason: isBooked ? 'Already booked' : undefined,
        });
        if (hour < 17) {
            const isBooked30 = Math.random() > 0.7;
            slots.push({
                time: `${hour.toString().padStart(2, '0')}:30`,
                available: !isBooked30,
                reason: isBooked30 ? 'Already booked' : undefined,
            });
        }
    }
    return slots;
}

// API helper function with error handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (DEMO_MODE) {
        throw new Error('DEMO_MODE');
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            console.warn(`⚠️ Backend returned ${response.status}. Switching to DEMO MODE.`);
            DEMO_MODE = true;
            throw new Error('DEMO_MODE');
        }

        const data = await response.json();

        if (!data.success) {
            console.warn('⚠️ Backend returned success:false. Switching to DEMO MODE.');
            DEMO_MODE = true;
            throw new Error('DEMO_MODE');
        }

        return data;
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            throw err;
        }
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
            console.warn('⚠️ Backend API not available. Switching to DEMO MODE.');
            DEMO_MODE = true;
            throw new Error('DEMO_MODE');
        }
        // Any other error also triggers demo mode
        console.warn('⚠️ Backend error:', err.message, '. Switching to DEMO MODE.');
        DEMO_MODE = true;
        throw new Error('DEMO_MODE');
    }
}

// ============================================
// API FUNCTIONS (with demo fallback)
// ============================================

/**
 * Get all active services
 */
export async function fetchServices(category?: string, gender?: string): Promise<Service[]> {
    try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (gender) params.append('gender', gender);

        const queryString = params.toString();
        const url = `/services${queryString ? `?${queryString}` : ''}`;

        console.log('📦 Fetching services from backend...');
        const response = await apiCall<{ data: Service[]; grouped: Record<string, Service[]> }>(url);
        console.log(`✅ Loaded ${response.data?.length || 0} services`);

        return response.data || [];
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            console.log('📦 Using DEMO services');
            return DEMO_SERVICES;
        }
        throw err;
    }
}

/**
 * Get stylists who can perform a specific service
 */
export async function fetchStylistsForService(serviceId: string, date?: string): Promise<Stylist[]> {
    try {
        const params = new URLSearchParams({ service_id: serviceId });
        if (date) params.append('date', date);

        console.log('👥 Fetching stylists for service:', serviceId);
        const response = await apiCall<{ data: Stylist[] }>(`/stylists?${params}`);
        console.log(`✅ Loaded ${response.data?.length || 0} stylists`);

        return response.data || [];
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            console.log('👥 Using DEMO stylists');
            return DEMO_STYLISTS;
        }
        throw err;
    }
}

/**
 * Get time slots for a specific stylist on a date
 */
export async function fetchTimeSlots(
    stylistId: string,
    date: string,
    duration: number
): Promise<TimeSlot[]> {
    try {
        const params = new URLSearchParams({
            stylist_id: stylistId,
            date,
            duration: duration.toString(),
        });

        console.log('🕐 Fetching time slots:', { stylistId, date, duration });
        const response = await apiCall<{ data: RawTimeSlot[]; availableCount: number }>(`/availability?${params}`);

        // Normalize slots to ensure proper boolean handling
        const normalizedSlots = normalizeSlots(response.data || []);
        console.log(`✅ Loaded ${normalizedSlots.length} slots (${normalizedSlots.filter(s => !s.available).length} booked)`);

        return normalizedSlots;
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            console.log('🕐 Using DEMO time slots');
            return generateDemoTimeSlots();
        }
        throw err;
    }
}

/**
 * Get consolidated availability for "no preference" booking flow
 * Returns a single merged time grid where a slot is available if ANY stylist can take it
 */
export async function fetchConsolidatedAvailability(
    serviceId: string,
    date: string,
    duration?: number
): Promise<ConsolidatedAvailabilityResponse> {
    try {
        const params = new URLSearchParams({
            service_id: serviceId,
            date,
        });
        if (duration) params.append('duration', duration.toString());

        console.log('📅 Fetching consolidated availability...');
        const response = await apiCall<any>(`/consolidated-availability?${params}`);

        // Debug: Log the actual response structure
        console.log('📦 Raw API response:', JSON.stringify(response, null, 2));

        // Backend returns: { success, service, data: [array of slots], availableSlots, qualifiedStylistCount }
        // Note: 'data' IS the array of slots directly (not an object with 'slots' property)
        const slots = Array.isArray(response.data) ? response.data : [];
        const service = response.service;
        const totalStylists = response.qualifiedStylistCount || 0;
        const availableCount = response.availableSlots || slots.filter((s: any) => s.available).length;

        const result: ConsolidatedAvailabilityResponse = {
            slots: slots.map((slot: any) => ({
                time: slot.time,
                available: slot.available === true,
                availableStylists: slot.availableStylistCount || 0,
                reason: slot.available ? undefined : 'No stylists available',
            })),
            service: service,
            totalStylists: totalStylists,
            availableCount: availableCount,
        };

        console.log(`✅ Loaded consolidated availability: ${result.availableCount} available slots from ${result.totalStylists} stylists`);

        // Debug: Show availability breakdown
        const availableSlots = result.slots.filter(s => s.available);
        const unavailableSlots = result.slots.filter(s => !s.available);

        console.log(`📊 AVAILABILITY BREAKDOWN:`);
        console.log(`   ✅ Available slots (${availableSlots.length}):`, availableSlots.map(s => s.time).join(', '));
        console.log(`   ❌ Unavailable/Booked slots (${unavailableSlots.length}):`, unavailableSlots.length > 0 ? unavailableSlots.map(s => `${s.time} (${s.reason})`).join(', ') : 'NONE - All slots showing as available!');

        if (unavailableSlots.length === 0) {
            console.warn('⚠️ WARNING: No booked slots detected! The backend may not be checking appointments correctly.');
            console.warn('   This could be a Row Level Security (RLS) issue - backend anon key cannot see appointments table.');
        }

        return result;
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            console.log('📅 Using DEMO consolidated availability');
            const slots = generateDemoTimeSlots();
            return {
                slots: slots.map(s => ({ ...s, availableStylists: s.available ? Math.floor(Math.random() * 3) + 1 : 0 })),
                service: DEMO_SERVICES[0],
                totalStylists: DEMO_STYLISTS.length,
                availableCount: slots.filter(s => s.available).length,
            };
        }
        throw err;
    }
}

/**
 * Get ALL available stylists with their time slots 
 * Used for "no preference" booking flow (legacy - prefer fetchConsolidatedAvailability)
 */
export async function fetchAllStylistsWithAvailability(
    serviceId: string,
    date: string,
    duration?: number
): Promise<StylistWithSlots[]> {
    try {
        const params = new URLSearchParams({
            service_id: serviceId,
            date,
        });
        if (duration) params.append('duration', duration.toString());

        console.log('📅 Fetching ALL stylists with availability...');
        const response = await apiCall<{
            data: Array<{
                stylist: Stylist;
                skills: { id: string; name: string; category: string }[];
                slots: RawTimeSlot[];
                availableCount: number;
            }>;
            service: Service;
            totalStylists: number;
        }>(`/available-stylists?${params}`);

        // Normalize slots for each stylist to ensure proper boolean handling
        const normalizedData: StylistWithSlots[] = (response.data || []).map(item => ({
            stylist: item.stylist,
            skills: item.skills,
            slots: normalizeSlots(item.slots),
            availableCount: item.slots.filter(s => {
                const available = s.available ?? s.isAvailable;
                return available === true || available === 'true' || available === 1;
            }).length,
        }));

        console.log(`✅ Loaded ${response.totalStylists} stylists with availability`);
        normalizedData.forEach(item => {
            const bookedCount = item.slots.filter(s => !s.available).length;
            console.log(`   - ${item.stylist.name}: ${item.slots.length} slots (${bookedCount} booked)`);
        });

        return normalizedData;
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            console.log('📅 Using DEMO stylists with availability');
            return DEMO_STYLISTS.map(stylist => {
                const slots = generateDemoTimeSlots();
                return {
                    stylist,
                    skills: stylist.skills,
                    slots,
                    availableCount: slots.filter(s => s.available).length,
                };
            });
        }
        throw err;
    }
}

/**
 * Create a new booking
 */
export async function createBooking(booking: BookingRequest): Promise<{
    appointmentId: string;
    date: string;
    time: string;
    status: string;
    service: { name: string; duration: number; price: number };
    stylist: { name: string };
}> {
    try {
        console.log('📝 Creating booking...');

        const response = await apiCall<{
            data: {
                appointmentId: string;
                date: string;
                time: string;
                status: string;
                service: { name: string; duration: number; price: number };
                stylist: { name: string };
            };
        }>('/book', {
            method: 'POST',
            body: JSON.stringify(booking),
        });

        console.log('✅ Booking created:', response.data.appointmentId);

        return response.data;
    } catch (err: any) {
        if (err.message === 'DEMO_MODE') {
            console.log('📝 DEMO booking created');
            const service = DEMO_SERVICES.find(s => s.id === booking.appointment.service_id);
            const stylist = DEMO_STYLISTS.find(s => s.id === booking.appointment.stylist_id);
            return {
                appointmentId: `DEMO-${Date.now()}`,
                date: booking.appointment.date,
                time: booking.appointment.time,
                status: 'Pending',
                service: { name: service?.name || 'Service', duration: service?.duration || 30, price: service?.price || 0 },
                stylist: { name: stylist?.name || 'Stylist' },
            };
        }
        throw err;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format time to 12-hour format
 */
export function formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format date to readable format
 */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get minimum bookable date (today)
 */
export function getMinDate(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
    return DEMO_MODE;
}
