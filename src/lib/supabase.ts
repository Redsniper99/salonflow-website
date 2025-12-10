import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gajoxzwbtrbtdlfubucy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdham94endidHJidGRsZnVidWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjg1NjYsImV4cCI6MjA3OTc0NDU2Nn0.Nuk32AMK7ZYR3fhe_2A8AVwkxe3v-CceTnA2ng1Rxyk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
