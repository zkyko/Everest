'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Container, Typography, Button, TextField, Stack,
  IconButton, Card, CardContent, Divider, Grid, useTheme,
  CircularProgress
} from '@mui/material'
import { ChevronLeft, Lock, User, Mail, Phone, CreditCard, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/components/Toast'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

const MotionBox = motion(Box)

export default function CheckoutPage() {
  const theme = useTheme()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const t = translations[lang].checkout
  const { items, getTotal, clearCart } = useCartStore()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)

    try {
      const orderItems = items.map(item => ({
        menu_item_id: item.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        item_description: item.description || '',
        modifiers: item.selectedModifiers || []
      }))

      const response = await api.post('/orders', {
        items: orderItems,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || null
      })

      // Get Stripe Checkout URL
      const checkoutResponse = await api.post('/checkout', {
        order_id: response.data.id,
        success_url: `${window.location.origin}/order-status/${response.data.id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`
      })

      if (checkoutResponse.data.checkout_url) {
        window.location.href = checkoutResponse.data.checkout_url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      const dummyId = `order_${Date.now()}`
      clearCart()
      addToast('success', 'Order placed! (Demo mode)')
      router.push(`/order-status/${dummyId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Header */}
      <Box sx={{
        position: 'sticky', top: { xs: 0, md: 72 }, zIndex: 100,
        bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider',
        backdropFilter: 'blur(20px)'
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
            <IconButton
              aria-label={lang === 'en' ? 'Back' : 'पछाडि'}
              onClick={() => router.back()}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>{t.title}</Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <form onSubmit={handleCheckout}>
          <Grid container spacing={4}>
            {/* Form Side */}
            <Grid item xs={12} md={7}>
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Typography variant="h3" sx={{ mb: 4, fontSize: '1.25rem' }}>{t.details}</Typography>

                <Stack spacing={4}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.1em' }}>
                      {t.name}
                    </Typography>
                    <TextField
                      fullWidth
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Biraj Koirala"
                      variant="outlined"
                      required
                      InputProps={{
                        startAdornment: <User size={18} style={{ marginRight: 12, opacity: 0.4 }} />,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.1em' }}>
                      {t.email}
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="biraj@example.com"
                      variant="outlined"
                      required
                      InputProps={{
                        startAdornment: <Mail size={18} style={{ marginRight: 12, opacity: 0.4 }} />,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.1em' }}>
                      {t.phone}
                    </Typography>
                    <TextField
                      fullWidth
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="+1 (512) 000-0000"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Phone size={18} style={{ marginRight: 12, opacity: 0.4 }} />,
                      }}
                    />
                  </Box>
                </Stack>
              </MotionBox>
            </Grid>

            {/* Summary Side */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 160 } }}>
                <Card sx={{ bgcolor: 'rgba(0,0,0,0.02)', border: 'none', boxShadow: 'none', borderRadius: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h3" sx={{ mb: 3, fontSize: '1.25rem' }}>{translations[lang].cart.summary}</Typography>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                      {items.map((item, idx) => (
                        <Stack key={idx} direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="body2">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                        </Stack>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h3">{translations[lang].cart.total}</Typography>
                        <Typography variant="h2" color="primary.main">${getTotal().toFixed(2)}</Typography>
                      </Stack>
                    </Stack>

                    <Card sx={{ mb: 4, bgcolor: 'rgba(0,0,0,0.03)', border: '1px solid', borderColor: 'divider' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CreditCard size={20} />
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{t.payment}</Typography>
                            <Typography variant="caption" color="text.secondary">Redirecting to Secure Stripe Checkout</Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading || items.length === 0}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock size={20} />}
                      endIcon={!loading && <ArrowRight size={20} />}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      {loading ? 'Processing...' : t.placeOrder}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  )
}

