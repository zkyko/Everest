'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Typography, CircularProgress, IconButton, Fade
} from '@mui/material'
import { X } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import KitchenOrderCard from '@/components/KitchenOrderCard'
import OrderAlert from '@/components/OrderAlert'

export default function KitchenScreen() {
  const router = useRouter()
  const { addToast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [alertOrder, setAlertOrder] = useState<any>(null)
  const previousOrderCount = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const completedOrdersRef = useRef<Set<string>>(new Set())
  const acknowledgedOrders = useRef<Set<string>>(new Set())

  // Function to play notification sound
  const playNotificationSound = useCallback(() => {
    // Try to play audio element first
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback: Generate beep using Web Audio API
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 800 // 800 Hz
          oscillator.type = 'sine'
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
        } catch (error) {
          console.log('Audio notification failed:', error)
        }
      })
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/admin/orders')
      const allOrders = response.data || []
      
      // Filter to show only active orders (NEW, PREP, READY)
      // Keep COMPLETED orders for 30 seconds
      const now = Date.now()
      const activeOrders = allOrders.filter((order: any) => {
        if (order.status === 'COMPLETED') {
          const completedTime = new Date(order.updated_at || order.created_at).getTime()
          const timeSinceCompleted = now - completedTime
          return timeSinceCompleted < 30000 // Keep for 30 seconds
        }
        return ['NEW', 'PREP', 'READY'].includes(order.status)
      })
      
      setOrders(activeOrders)
      
      // Check for new unacknowledged orders
      const newOrders = activeOrders.filter((o: any) => 
        o.status === 'NEW' && 
        !acknowledgedOrders.current.has(o.id)
      )
      
      // Show alert for first unacknowledged order
      if (newOrders.length > 0 && !alertOrder) {
        setAlertOrder(newOrders[0])
      }
      
      previousOrderCount.current = activeOrders.filter((o: any) => o.status === 'NEW').length
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }, [playNotificationSound, alertOrder])

  useEffect(() => {
    fetchData()
    // Faster polling for kitchen screen (5 seconds)
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const statusFlow: { [key: string]: string } = {
      'NEW': 'PREP',
      'PREP': 'READY',
      'READY': 'COMPLETED'
    }
    
    const newStatus = statusFlow[currentStatus]
    if (!newStatus) return

    try {
      await api.post(`/admin/orders/${orderId}/status`, { status: newStatus })
      
      const statusMessages: { [key: string]: string } = {
        'PREP': 'Order accepted - Now preparing',
        'READY': 'Order ready for pickup',
        'COMPLETED': 'Order completed'
      }
      
      addToast('success', statusMessages[newStatus] || 'Status updated')
      
      // If completed, add to completed set for fade-out tracking
      if (newStatus === 'COMPLETED') {
        completedOrdersRef.current.add(orderId)
      }
      
      fetchData()
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Failed to update status')
    }
  }

  const handleExit = () => {
    router.push('/admin/orders')
  }

  const handleAcknowledgeAlert = () => {
    if (alertOrder) {
      acknowledgedOrders.current.add(alertOrder.id)
      setAlertOrder(null)
      addToast('success', 'Order acknowledged')
    }
  }

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      p: { xs: 2, sm: 3, md: 4 },
      position: 'relative'
    }}>
      {/* Order Alert Modal */}
      <OrderAlert 
        open={!!alertOrder} 
        order={alertOrder} 
        onAcknowledge={handleAcknowledgeAlert}
      />

      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/new-order.mp3" type="audio/mpeg" />
        {/* Fallback: Generate beep using Web Audio API if mp3 not found */}
      </audio>

      {/* Exit Button */}
      <IconButton
        onClick={handleExit}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: 'background.paper',
          boxShadow: 2,
          opacity: 0.6,
          transition: 'opacity 0.2s',
          '&:hover': {
            opacity: 1,
            bgcolor: 'background.paper',
          }
        }}
      >
        <X size={24} />
      </IconButton>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900, 
            mb: 1,
            background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Kitchen Display
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tap cards to advance order status
        </Typography>
      </Box>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 10,
          opacity: 0.5 
        }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            No Active Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New orders will appear here automatically
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(320px, 1fr))',
            lg: 'repeat(auto-fit, minmax(380px, 1fr))'
          },
          gap: 3,
          maxWidth: 1600,
          mx: 'auto'
        }}>
          {orders.map((order: any, idx: number) => {
            const isCompleted = order.status === 'COMPLETED'
            
            return (
              <Fade 
                key={order.id} 
                in={true} 
                timeout={500}
                style={{ 
                  transitionDelay: `${idx * 50}ms`,
                  opacity: isCompleted ? 0.4 : 1,
                  transition: 'opacity 0.5s'
                }}
              >
                <div>
                  <KitchenOrderCard
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
              </Fade>
            )
          })}
        </Box>
      )}

      {/* Auto-refresh indicator */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 16, 
        left: '50%', 
        transform: 'translateX(-50%)',
        bgcolor: 'background.paper',
        px: 2,
        py: 0.5,
        borderRadius: 2,
        boxShadow: 1,
        opacity: 0.7
      }}>
        <Typography variant="caption" color="text.secondary">
          Auto-refresh: 5s
        </Typography>
      </Box>
    </Box>
  )
}

