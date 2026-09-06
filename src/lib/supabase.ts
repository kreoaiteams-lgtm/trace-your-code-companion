import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' ? process.env.SUPABASE_URL : undefined) || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = (typeof process !== 'undefined' ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined) || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env");
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");
