import { createClient } from '@supabase/supabase-js';

// Hardcoding for the hackathon demo so it just works
const supabaseUrl = process.env.SUPABASE_URL || 'https://vdzhnlmeiicyypbolffr.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KLH7PMOPFlPJM5GeRHVwrQ_CTdrntkg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
