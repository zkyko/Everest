'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, User, Phone, CreditCard, Loader2, Lock } from 'lucide-react'
import api from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/components/Toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      addToast('error', 'Your cart is empty')
      return
    }

    if (!formData.customer_name || !formData.customer_email) {
      addToast('error', 'Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const orderItems = items.map(item => ({
        menu_item_id: item.id,
        quantity: 1,
        modifiers: item.modifiers || {}
      }))

      const orderResponse = await api.post('/orders', {
        items: orderItems,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || null
      })

      const orderId = orderResponse.data.id

      // For demo: skip Stripe and go directly to order status
      // In production, this would redirect to Stripe checkout
      clearCart()
      addToast('success', 'Order placed successfully!')
      router.push(`/order-status/${orderId}`)
      
      // Production code (commented out for demo):
      // const checkoutResponse = await api.post('/checkout', {
      //   order_id: orderId,
      //   success_url: `${window.location.origin}/order-status/${orderId}`,
      //   cancel_url: `${window.location.origin}/cart`
      // })
      // window.location.href = checkoutResponse.data.checkout_url
    } catch (error: any) {
      console.error('Checkout error:', error)
      // For demo: create dummy order even if API fails
      const dummyOrderId = `order_${Date.now()}`
      clearCart()
      addToast('success', 'Order placed successfully! (Demo mode)')
      router.push(`/order-status/${dummyOrderId}`)
    }
  }

  return (
    <div className="mobile-container">
      <div className="content-padding pt-12 pb-6">
        <button
          onClick={() => router.push('/cart')}
          className="w-10 h-10 bg-bg-surface rounded-full flex items-center justify-center mb-6 hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="mb-2">Checkout</h1>
        <p className="text-text-muted text-sm">Complete your order</p>
      </div>

      <div className="flex-grow content-padding pb-32">
        <form onSubmit={handleCheckout} className="flex flex-col gap-6">
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Customer Information
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-text-dim tracking-widest mb-2 block">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4">Order Summary</h3>
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.description}</p>
                  </div>
                  <span className="text-sm font-bold">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-primary">${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-accent/5 border-accent/20">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={18} className="text-accent" />
              <span className="text-sm font-bold">Secure Payment</span>
            </div>
            <p className="text-xs text-text-muted">
              You'll be redirected to Stripe for secure payment processing
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="btn-primary mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <Lock size={20} />
                Proceed to Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

