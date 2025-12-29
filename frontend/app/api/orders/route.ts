export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    console.log('📥 Received order request:', {
      items_count: body.items?.length,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone
    })
    
    // Validate required fields
    if (!body.items || body.items.length === 0) {
      console.error('❌ Validation failed: No items')
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }
    
    if (!body.customer_name || !body.customer_email) {
      console.error('❌ Validation failed: Missing customer info', {
        has_name: !!body.customer_name,
        has_email: !!body.customer_email
      })
      return NextResponse.json(
        { error: 'Customer name and email are required' },
        { status: 400 }
      )
    }
    
    // Calculate total amount
    const totalAmount = body.items.reduce((sum: number, item: any) => {
      return sum + (item.item_price * item.quantity)
    }, 0)
    
    console.log('💰 Calculated total:', totalAmount)
    
    // Create order
    const orderId = uuidv4()
    console.log('🆔 Generated order ID:', orderId)
    
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
      console.error('❌ Error creating order:', orderError)
      console.error('Order error details:', JSON.stringify(orderError, null, 2))
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError.message },
        { status: 500 }
      )
    }
    
    console.log('✅ Order created successfully:', order)
    
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
    
    console.log('📦 Creating order items:', orderItems.length)
    console.log('📦 Order items data:', JSON.stringify(orderItems, null, 2))
    
    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()
    
    if (itemsError) {
      console.error('❌ Error creating order items:', itemsError)
      console.error('Items error details:', JSON.stringify(itemsError, null, 2))
      console.error('Error code:', itemsError.code)
      console.error('Error hint:', itemsError.hint)
      console.error('Error message:', itemsError.message)
      
      // Try to delete the order if items fail
      await supabase.from('orders').delete().eq('id', orderId)
      
      return NextResponse.json(
        { 
          error: 'Failed to create order items', 
          details: itemsError.message,
          code: itemsError.code,
          hint: itemsError.hint 
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Order items created successfully:', insertedItems?.length)
    
    console.log('✅ Order items created successfully')
    
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
        console.log('🔧 Creating modifiers:', modifierInserts.length)
        const { error: modError } = await supabase.from('order_item_modifiers').insert(modifierInserts)
        if (modError) {
          console.error('❌ Error creating modifiers:', modError)
        } else {
          console.log('✅ Modifiers created successfully')
        }
      }
    }
    
    console.log('🎉 Order complete! Returning order:', order.id)
    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('❌ Orders API error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

