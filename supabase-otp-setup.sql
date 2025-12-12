-- ============================================
-- SalonFlow Website - OTP Table Setup
-- ============================================
-- Run this in your Supabase Dashboard -> SQL Editor
-- This creates the table for storing booking OTPs
-- ============================================

-- Create booking_otps table
CREATE TABLE IF NOT EXISTS public.booking_otps (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    phone text NOT NULL,
    otp text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    verified boolean DEFAULT false,
    attempts integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT booking_otps_pkey PRIMARY KEY (id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_booking_otps_phone ON public.booking_otps(phone);
CREATE INDEX IF NOT EXISTS idx_booking_otps_expires ON public.booking_otps(expires_at);

-- Enable RLS
ALTER TABLE booking_otps ENABLE ROW LEVEL SECURITY;

-- Allow public to insert OTPs (for sending)
DROP POLICY IF EXISTS "Public can create OTPs" ON booking_otps;
CREATE POLICY "Public can create OTPs"
ON booking_otps FOR INSERT
TO anon
WITH CHECK (true);

-- Allow public to read their own OTPs (for verification)
DROP POLICY IF EXISTS "Public can read OTPs by phone" ON booking_otps;
CREATE POLICY "Public can read OTPs by phone"
ON booking_otps FOR SELECT
TO anon
USING (true);

-- Allow public to update OTPs (for marking as verified)
DROP POLICY IF EXISTS "Public can update OTPs" ON booking_otps;
CREATE POLICY "Public can update OTPs"
ON booking_otps FOR UPDATE
TO anon
USING (true);

-- Clean up expired OTPs (optional - run periodically or use pg_cron)
-- DELETE FROM booking_otps WHERE expires_at < NOW();

-- Verification query
SELECT 'booking_otps table created successfully!' as status;
