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

// 🔍 DETAILED DEBUG LOGGING (will show in Vercel Function logs)
console.log('🔧 SUPABASE ADMIN CLIENT INIT:', {
  'URL exists': !!supabaseUrl,
  'URL value': supabaseUrl || 'UNDEFINED',
  'SERVICE_ROLE_KEY exists': !!supabaseServiceRoleKey,
  'SERVICE_ROLE_KEY prefix': supabaseServiceRoleKey ? supabaseServiceRoleKey.substring(0, 20) + '...' : 'UNDEFINED',
  'All env vars': Object.keys(process.env).filter(k => k.includes('SUPABASE')),
})

// Safety check - log if keys are missing
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ MISSING ADMIN SUPABASE KEYS - CLIENT WILL FAIL!')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

