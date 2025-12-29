import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (public, safe for browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes - uses service role for admin operations)
export function createServerClient() {
  const serverUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(serverUrl, serverKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

