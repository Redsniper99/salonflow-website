-- ============================================
-- SalonFlow Website - Authenticated RLS Policies
-- ============================================
-- Run this AFTER setting up OTP authentication
-- This updates RLS policies to use auth.uid() for protected operations
-- ============================================

-- ============================================
-- UPDATE: Appointments - Only authenticated users can create
-- ============================================

-- Drop old policy
DROP POLICY IF EXISTS "Public can create appointments" ON appointments;

-- Authenticated users can create appointments
CREATE POLICY "Authenticated users can create appointments"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (status = 'Pending');

-- Authenticated users can view their own appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments"
ON appointments FOR SELECT
TO authenticated
USING (
    customer_id IN (
        SELECT id FROM customers 
        WHERE phone = (SELECT phone FROM auth.users WHERE id = auth.uid())
        OR phone = REPLACE((SELECT phone FROM auth.users WHERE id = auth.uid()), '+', '')
    )
);

-- ============================================
-- UPDATE: Customers - Authenticated users can create/update
-- ============================================

-- Drop old policy
DROP POLICY IF EXISTS "Public can create customers" ON customers;

-- Authenticated users can create customers
CREATE POLICY "Authenticated users can create customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can view/update their own customer record
DROP POLICY IF EXISTS "Users can view own customer record" ON customers;
CREATE POLICY "Users can view own customer record"
ON customers FOR SELECT
TO authenticated
USING (
    phone = (SELECT phone FROM auth.users WHERE id = auth.uid())
    OR phone = REPLACE((SELECT phone FROM auth.users WHERE id = auth.uid()), '+', '')
);

DROP POLICY IF EXISTS "Users can update own customer record" ON customers;
CREATE POLICY "Users can update own customer record"
ON customers FOR UPDATE
TO authenticated
USING (
    phone = (SELECT phone FROM auth.users WHERE id = auth.uid())
    OR phone = REPLACE((SELECT phone FROM auth.users WHERE id = auth.uid()), '+', '')
);

-- ============================================
-- Keep public read access for services, stylists, etc.
-- (Already set up in supabase-rls-setup.sql)
-- ============================================

-- Verification query
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('appointments', 'customers')
ORDER BY tablename, policyname;
