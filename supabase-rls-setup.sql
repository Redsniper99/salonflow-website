-- ============================================
-- SalonFlow Website - Supabase RLS Setup
-- ============================================
-- Run this in your Supabase Dashboard -> SQL Editor
-- This enables public access to required tables for the booking website
-- ============================================

-- ============================================
-- STEP 1: Enable Row Level Security on all tables
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylist_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylist_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Create RLS Policies for PUBLIC READ access
-- ============================================

-- Services: Public can view active services only
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services"
ON services FOR SELECT
TO anon
USING (is_active = true);

-- Staff/Stylists: Public can view active stylists only (for booking)
DROP POLICY IF EXISTS "Public can view active stylists" ON staff;
CREATE POLICY "Public can view active stylists"
ON staff FOR SELECT
TO anon
USING (is_active = true AND role = 'Stylist' AND is_emergency_unavailable = false);

-- Branches: Public can view active branches
DROP POLICY IF EXISTS "Public can view active branches" ON branches;
CREATE POLICY "Public can view active branches"
ON branches FOR SELECT
TO anon
USING (is_active = true);

-- Salon Settings: Public can view (read-only)
DROP POLICY IF EXISTS "Public can view salon settings" ON salon_settings;
CREATE POLICY "Public can view salon settings"
ON salon_settings FOR SELECT
TO anon
USING (true);

-- Stylist Breaks: Public can view (for availability calculation)
DROP POLICY IF EXISTS "Public can view stylist breaks" ON stylist_breaks;
CREATE POLICY "Public can view stylist breaks"
ON stylist_breaks FOR SELECT
TO anon
USING (true);

-- Stylist Unavailability: Public can view (for availability calculation)
DROP POLICY IF EXISTS "Public can view stylist unavailability" ON stylist_unavailability;
CREATE POLICY "Public can view stylist unavailability"
ON stylist_unavailability FOR SELECT
TO anon
USING (true);

-- Appointments: Public can view (limited) for availability checking
-- Only shows non-cancelled appointments for slot availability
DROP POLICY IF EXISTS "Public can view appointments for availability" ON appointments;
CREATE POLICY "Public can view appointments for availability"
ON appointments FOR SELECT
TO anon
USING (status NOT IN ('Cancelled', 'NoShow'));

-- ============================================
-- STEP 3: Create RLS Policies for PUBLIC INSERT access
-- ============================================

-- Customers: Public can create new customers (for booking)
DROP POLICY IF EXISTS "Public can create customers" ON customers;
CREATE POLICY "Public can create customers"
ON customers FOR INSERT
TO anon
WITH CHECK (true);

-- Customers: Public can lookup existing customer by phone
DROP POLICY IF EXISTS "Public can lookup customer by phone" ON customers;
CREATE POLICY "Public can lookup customer by phone"
ON customers FOR SELECT
TO anon
USING (true);

-- Appointments: Public can create new appointments (bookings)
DROP POLICY IF EXISTS "Public can create appointments" ON appointments;
CREATE POLICY "Public can create appointments"
ON appointments FOR INSERT
TO anon
WITH CHECK (status = 'Pending');

-- ============================================
-- VERIFICATION: Check that policies were created
-- ============================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
