/**
 * DEPRECATED: This file is kept for backward compatibility only.
 * 
 * Use these instead:
 * - @/lib/supabase-public  (for client-side and public API routes)
 * - @/lib/supabase-admin   (for admin API routes)
 */

import { createClient } from '@supabase/supabase-js'

// Re-export public client for backward compatibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

