import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://ttojsmjktgafkjzaczdb.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0b2pzbWprdGdhZmtqemFjemRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzU1MjIsImV4cCI6MjA4MzQ1MTUyMn0._8xUa1qFTrMD6LLwHWHfjyvmiXhzQKyKv9nkGVRDbz4';

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
      'x-application-name': 'JARVIS-ai',
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