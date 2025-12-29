export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    if (!body.order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      )
    }
    
    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', body.order_id)
      .single()
    
    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${order.id.slice(0, 8)}`,
            },
            unit_amount: Math.round(Number(order.total_amount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: body.success_url || `${request.nextUrl.origin}/order-status/${order.id}`,
      cancel_url: body.cancel_url || `${request.nextUrl.origin}/cart`,
      metadata: {
        order_id: order.id,
      },
    })
    
    // Save payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        stripe_session_id: session.id,
        amount: order.total_amount,
        status: 'PENDING',
      })
    
    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      // Don't fail the request, payment record can be created later
    }
    
    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
    })
  } catch (error: any) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

