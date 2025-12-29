export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

// Helper to verify admin token
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    const payload = await verifyToken(token)
    return payload
  } catch {
    return null
  }
}

// GET /api/admin/orders - List orders
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        payments (*)
      `)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: orders, error } = await query
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(orders || [])
  } catch (error: any) {
    console.error('Admin orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
