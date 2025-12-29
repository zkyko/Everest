export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  // 🔍 DEBUG: Verify env var is present (check Vercel Function logs)
  console.log('🔑 SERVICE ROLE KEY PRESENT:', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY))
  console.log('🔑 SUPABASE URL PRESENT:', Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL))
  
  try {
    const supabase = supabaseAdmin
    
    // Get active orders (NEW and ACCEPTED)
    const { data: activeOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, order_items (quantity)')
      .in('status', ['NEW', 'ACCEPTED'])
    
    if (ordersError) {
      console.error('Error fetching active orders:', ordersError)
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      )
    }
    
    // Calculate metrics
    const activeOrderCount = activeOrders?.length || 0
    const totalItems = activeOrders?.reduce((sum, order) => {
      const items = order.order_items || []
      return sum + items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 1), 0)
    }, 0) || 0
    
    // Determine load state
    let loadState = 'LOW'
    let estimatedWaitMinutes = 5
    
    if (activeOrderCount >= 10 || totalItems >= 30) {
      loadState = 'VERY_HIGH'
      estimatedWaitMinutes = 45
    } else if (activeOrderCount >= 6 || totalItems >= 20) {
      loadState = 'HIGH'
      estimatedWaitMinutes = 30
    } else if (activeOrderCount >= 3 || totalItems >= 10) {
      loadState = 'MEDIUM'
      estimatedWaitMinutes = 15
    }
    
    return NextResponse.json({
      load_state: loadState,
      active_orders: activeOrderCount,
      total_items_pending: totalItems,
      estimated_wait_minutes: estimatedWaitMinutes,
    })
  } catch (error: any) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

