import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }
    
    if (!body.customer_name || !body.customer_email) {
      return NextResponse.json(
        { error: 'Customer name and email are required' },
        { status: 400 }
      )
    }
    
    // Calculate total amount
    const totalAmount = body.items.reduce((sum: number, item: any) => {
      return sum + (item.item_price * item.quantity)
    }, 0)
    
    // Create order
    const orderId = uuidv4()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        status: 'NEW',
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone || null,
        total_amount: totalAmount,
      })
      .select()
      .single()
    
    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    // Create order items (with snapshots)
    const orderItems = body.items.map((item: any) => ({
      id: uuidv4(),
      order_id: orderId,
      menu_item_id: item.menu_item_id || null,
      item_name: item.item_name,
      item_description: item.item_description || null,
      item_price: item.item_price,
      quantity: item.quantity || 1,
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Try to delete the order if items fail
      await supabase.from('orders').delete().eq('id', orderId)
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }
    
    // If modifiers exist, create order item modifiers
    if (body.items.some((item: any) => item.modifiers && item.modifiers.length > 0)) {
      const modifierInserts: any[] = []
      body.items.forEach((item: any, itemIndex: number) => {
        if (item.modifiers && item.modifiers.length > 0) {
          const orderItem = orderItems[itemIndex]
          item.modifiers.forEach((modifier: any) => {
            modifierInserts.push({
              id: uuidv4(),
              order_item_id: orderItem.id,
              modifier_option_id: modifier.id || null,
              modifier_name: modifier.name,
              modifier_price: modifier.price || 0,
            })
          })
        }
      })
      
      if (modifierInserts.length > 0) {
        await supabase.from('order_item_modifiers').insert(modifierInserts)
      }
    }
    
    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

