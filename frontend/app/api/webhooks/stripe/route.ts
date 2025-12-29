import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }
  
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id
      
      if (!orderId) {
        console.error('No order_id in session metadata')
        return NextResponse.json({ received: true })
      }
      
      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'COMPLETED',
          stripe_payment_intent_id: session.payment_intent as string || null,
        })
        .eq('stripe_session_id', session.id)
      
      if (paymentError) {
        console.error('Error updating payment:', paymentError)
      }
      
      // Update order status from NEW to ACCEPTED
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'ACCEPTED' })
        .eq('id', orderId)
        .eq('status', 'NEW')
      
      if (orderError) {
        console.error('Error updating order:', orderError)
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Find payment by payment_intent_id and mark as failed
      const { error } = await supabase
        .from('payments')
        .update({ status: 'FAILED' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
      
      if (error) {
        console.error('Error updating failed payment:', error)
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

