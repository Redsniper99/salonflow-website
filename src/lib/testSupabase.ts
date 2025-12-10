import { supabase } from './supabase';

// Simple test to check Supabase connection
export async function testSupabaseConnection() {
    console.log('=== SUPABASE CONNECTION TEST ===');

    try {
        // Test 1: Basic connection
        console.log('\n1️⃣  Testing basic connection...');
        const { data: testData, error: testError } = await supabase
            .from('services')
            .select('count');

        if (testError) {
            console.error('❌ Connection error:', testError);
            return false;
        }
        console.log('✅ Connection successful!');

        // Test 2: Count services
        console.log('\n2️⃣  Counting services...');
        const { count, error: countError } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Count error:', countError);
        } else {
            console.log(`✅ Total services in database: ${count}`);
        }

        // Test 3: Fetch all services (no filters)
        console.log('\n3️⃣  Fetching all services...');
        const { data: allServices, error: allError } = await supabase
            .from('services')
            .select('*');

        if (allError) {
            console.error('❌ Fetch error:', allError);
            console.error('   Details:', {
                message: allError.message,
                code: allError.code,
                hint: allError.hint
            });
        } else {
            console.log(`✅ Fetched ${allServices?.length || 0} services`);
            if (allServices && allServices.length > 0) {
                console.log('   First service:', allServices[0]);
            }
        }

        // Test 4: Fetch active services only
        console.log('\n4️⃣  Fetching active services...');
        const { data: activeServices, error: activeError } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true);

        if (activeError) {
            console.error('❌ Active fetch error:', activeError);
        } else {
            console.log(`✅ Active services: ${activeServices?.length || 0}`);
        }

        console.log('\n=== TEST COMPLETE ===\n');
        return true;

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        return false;
    }
}
