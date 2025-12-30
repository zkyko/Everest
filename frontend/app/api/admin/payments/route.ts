export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) return authError

    const supabase = supabaseAdmin

    // Fetch all payments from Stripe webhook data
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders (
          id,
          total,
          status,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(payments || [])
  } catch (error: any) {
    console.error('Payments API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments', details: error.message },
      { status: 500 }
    )
  }
}




