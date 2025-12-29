export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) return authError

    // Return integration status
    const integrations = {
      stripe: {
        connected: !!process.env.STRIPE_SECRET_KEY,
        mode: process.env.STRIPE_SECRET_KEY?.includes('test') ? 'test' : 'live',
      },
      supabase: {
        connected: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
    }

    return NextResponse.json(integrations)
  } catch (error: any) {
    console.error('Integrations API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integrations', details: error.message },
      { status: 500 }
    )
  }
}

