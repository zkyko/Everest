import { createClient } from '@supabase/supabase-js'

/**
 * PUBLIC Supabase client - Safe for browser and API routes that only read public data
 * Uses ANON key with Row Level Security (RLS)
 * 
 * Use this for:
 * - /api/menu (public menu data)
 * - /api/orders/[orderId] (customer order status lookup)
 * - Client-side components
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Safety check - log if keys are missing (will show in Vercel logs)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ MISSING PUBLIC SUPABASE KEYS:', {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey
  })
}

export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)



