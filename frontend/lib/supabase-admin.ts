import { createClient } from '@supabase/supabase-js'

/**
 * ADMIN Supabase client - Server-side only, bypasses RLS
 * Uses SERVICE ROLE key (DO NOT expose to browser!)
 * 
 * Use this for:
 * - /api/admin/* (all admin routes)
 * - /api/metrics/volume (kitchen load metrics)
 * - /api/orders (creating orders)
 * - /api/checkout (payment processing)
 * - /api/webhooks/stripe (webhook handlers)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Safety check - log if keys are missing (will show in Vercel logs)
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ MISSING ADMIN SUPABASE KEYS:', {
    url: !!supabaseUrl,
    serviceRoleKey: !!supabaseServiceRoleKey,
    serviceRoleKeyPrefix: supabaseServiceRoleKey?.substring(0, 10) + '...'
  })
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

