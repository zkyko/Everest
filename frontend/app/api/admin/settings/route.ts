export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) return authError

    // Return default settings (can be extended to store in DB)
    const settings = {
      restaurantName: 'Everest Food Truck',
      currency: 'USD',
      timezone: 'America/Chicago',
      isOpen: true,
      notificationsEnabled: true,
      autoAcceptOrders: false,
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) return authError

    const body = await request.json()

    // In a real app, you'd store these in the database
    // For now, just return the updated settings
    return NextResponse.json(body)
  } catch (error: any) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    )
  }
}




