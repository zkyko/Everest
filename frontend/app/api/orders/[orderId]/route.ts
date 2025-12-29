export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = supabasePublic
    const { orderId } = params
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Fetch order with items and modifiers
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          order_item_modifiers (*)
        ),
        payments (*)
      `)
      .eq('id', orderId)
      .single()
    
    if (orderError) {
      console.error('Error fetching order:', orderError)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Transform data for frontend
    const transformedOrder = {
      ...order,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        name: item.item_name,
        description: item.item_description,
        quantity: item.quantity,
        price: item.item_price,
        modifiers: item.order_item_modifiers?.map((mod: any) => ({
          id: mod.modifier_option_id,
          name: mod.modifier_name,
          price: mod.modifier_price,
        })) || [],
      })) || [],
      payment_status: order.payments?.[0]?.status || 'pending',
    }
    
    delete transformedOrder.order_items
    
    return NextResponse.json(transformedOrder)
  } catch (error: any) {
    console.error('Order fetch API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

