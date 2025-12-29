'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material'
import { CheckCircle2, Clock, Package, ArrowLeft, RefreshCw, MapPin } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import BottomNav from '@/components/BottomNav'
import { statusColors } from '@/lib/theme'
import { supabasePublic } from '@/lib/supabase-public'


export default function OrderStatusPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const orderId = (params?.orderId as string) || ''
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [orderStartTime] = useState(() => {
    // Get start time from localStorage or use current time
    const stored = typeof window !== 'undefined' ? localStorage.getItem(`order_${orderId}_start`) : null
    if (stored) {
      return new Date(stored)
    }
    const start = new Date()
    if (typeof window !== 'undefined') {
      localStorage.setItem(`order_${orderId}_start`, start.toISOString())
    }
    return start
  })

  useEffect(() => {
    if (!orderId) return
    
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`)
        setOrder(response.data)
      } catch (error) {
        console.error('Error fetching order:', error)
        addToast('error', 'Order not found')
        // Redirect to home after showing error
        setTimeout(() => router.push('/home'), 2000)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
      
      // Set up Supabase Realtime subscription for instant status updates
      const channel = supabasePublic
        .channel(`customer-order-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE', // Listen only to updates
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}` // Only listen to this specific order
          },
          (payload) => {
            console.log('🔥 Realtime order status update:', payload)
            // Update order immediately when status changes
            setOrder((prev: any) => ({
              ...prev,
              ...payload.new
            }))
          }
        )
        .subscribe()
      
      // Keep polling as fallback (every 30 seconds instead of 3)
      const interval = setInterval(fetchOrder, 30000)
      
      return () => {
        channel.unsubscribe()
        clearInterval(interval)
      }
    }
  }, [orderId, addToast, router])

  const getStatusSteps = () => {
    const statuses = ['NEW', 'PREP', 'READY', 'COMPLETED']
    const currentIndex = statuses.indexOf(order?.status || 'NEW')
    
    return statuses.map((status, index) => {
      const isCompleted = index < currentIndex
      const isActive = index === currentIndex
      const isPending = index > currentIndex

      let label = ''
      let description = ''
      let icon = <Package size={20} />

      switch (status) {
        case 'NEW':
          label = 'Order Received'
          description = 'Your order has been received and confirmed'
          icon = <Package size={20} />
          break
        case 'PREP':
          label = 'In Preparation'
          description = 'Our kitchen is preparing your order'
          icon = <Clock size={20} />
          break
        case 'READY':
          label = 'Ready for Pickup'
          description = 'Your order is ready! Come pick it up at 1310 West Howard Lane'
          icon = <CheckCircle2 size={20} />
          break
        case 'COMPLETED':
          label = 'Order Completed'
          description = 'Thank you for your order!'
          icon = <CheckCircle2 size={20} />
          break
      }

      return {
        status,
        label,
        description,
        icon,
        isCompleted,
        isActive,
        isPending
      }
    })
  }

  const steps = getStatusSteps()
  const activeStep = steps.findIndex(s => s.isActive)

  if (loading) {
    return (
      <Box sx={{ maxWidth: { xs: '100%', sm: 500 }, mx: 'auto', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 500 }, mx: 'auto', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 40, 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth={false} sx={{ py: 2, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <IconButton
              onClick={() => router.push('/home')}
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h1" sx={{ mb: 0.5 }}>
                Order Status
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Order #{String(orderId).slice(-8)}
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 500)
              }}
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <RefreshCw size={18} />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Status Timeline */}
      <Container maxWidth={false} sx={{ py: 3, px: 3, pb: 20 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.status} completed={step.isCompleted} active={step.isActive}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: step.isCompleted ? statusColors.low : step.isActive ? statusColors.medium : 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700
                      }}>
                        {step.isCompleted ? <CheckCircle2 size={20} /> : step.icon}
                      </Box>
                    )}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    {step.status === 'READY' && (
                      <Box sx={{ 
                        bgcolor: `${statusColors.low}15`, 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}>
                        <MapPin size={18} color={statusColors.low} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            1310 West Howard Lane
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Austin, TX 78728
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Order Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {order.items && order.items.map((item: any, idx: number) => {
                  const { spiceLevel, extras } = (() => {
                    if (!item.modifiers) return { spiceLevel: null, extras: [] }
                    let sl = item.modifiers.spice_level || (Array.isArray(item.modifiers.spice_level) ? item.modifiers.spice_level[0] : null)
                    const ex = item.modifiers.extras || item.modifiers.add_ons || []
                    return { spiceLevel: sl, extras: Array.isArray(ex) ? ex : [] }
                  })()
                  
                  return (
                    <Box key={item.id || idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {item.name || item.item_name}
                          </Typography>
                          {(spiceLevel || extras.length > 0) && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {spiceLevel && (
                                <Chip
                                  label={`Spice: ${spiceLevel}`}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: 'warning.main15',
                                    color: 'warning.main',
                                    fontWeight: 600
                                  }}
                                />
                              )}
                              {extras.map((extra: string, i: number) => (
                                <Chip
                                  key={i}
                                  label={extra}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: 'info.main15',
                                    color: 'info.main',
                                    fontWeight: 500
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                          ${(parseFloat(item.price || item.item_price || 0) * (item.quantity || 1)).toFixed(2)}
                        </Typography>
                      </Box>
                      {idx < order.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  )
                })}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    ${parseFloat(order.total_amount || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.push('/home')}
          >
            Back to Home
          </Button>
          {order?.status === 'READY' && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => {
                addToast('success', 'Order marked as completed!')
                if (order) {
                  setOrder({ ...order, status: 'COMPLETED' })
                }
              }}
            >
              I&apos;ve Picked Up My Order
            </Button>
          )}
        </Box>
      </Container>

      <BottomNav />
    </Box>
  )
}
