import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with optimized settings for faster loading
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Optimize auth settings for faster initial load
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Reduce storage access for faster startup
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-application-name': 'qazyen-ai',
    },
  },
  // Optimize realtime settings
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
});