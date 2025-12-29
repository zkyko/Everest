'use client'

import { useEffect, useRef } from 'react'
import { Dialog, Box, Typography, Button } from '@mui/material'
import { Bell, User, ShoppingBag, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface OrderAlertProps {
  open: boolean
  order: any
  onAcknowledge: () => void
}

export default function OrderAlert({ open, order, onAcknowledge }: OrderAlertProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  // Play triple beep alert sound
  const playAlertSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const audioContext = audioContextRef.current
      
      const beep = (frequency: number, duration: number, delay: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + delay)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration)
        
        oscillator.start(audioContext.currentTime + delay)
        oscillator.stop(audioContext.currentTime + delay + duration)
      }
      
      // Triple beep pattern - BEEP! (pause) BEEP! (pause) BEEP!
      beep(1000, 0.3, 0)    // First beep
      beep(1000, 0.3, 0.5)  // Second beep (0.5s delay)
      beep(1000, 0.3, 1.0)  // Third beep (1s delay)
    } catch (error) {
      console.error('Failed to play alert sound:', error)
    }
  }

  // Play sound when modal opens
  useEffect(() => {
    if (open && order) {
      playAlertSound()
    }
  }, [open, order])

  if (!order) return null

  // Calculate time since order
  const orderTime = new Date(order.created_at)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000)
  const timeAgo = diffMinutes === 0 ? 'Just now' : 
                  diffMinutes === 1 ? '1 minute ago' : 
                  `${diffMinutes} minutes ago`

  // Calculate item count
  const itemCount = order.order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) 
                    || order.items?.length 
                    || 1

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown // Prevent ESC key from closing
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'visible',
          position: 'relative',
        },
      }}
      BackdropProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.8)', // Darker backdrop
        },
      }}
    >
      {/* Pulsing border effect */}
      <MotionBox
        sx={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: 4,
          border: '4px solid',
          borderColor: 'error.main',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
        {/* Alert Icon */}
        <MotionBox
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'error.main',
            mb: 2,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Bell size={40} color="white" />
        </MotionBox>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'error.main',
            mb: 3,
            letterSpacing: '0.05em',
          }}
        >
          🔴 NEW ORDER RECEIVED!
        </Typography>

        {/* Order Number */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: '3rem',
            mb: 3,
            background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ORDER #{String(order.id).slice(-6)}
        </Typography>

        {/* Order Details */}
        <Box sx={{ 
          bgcolor: 'action.hover', 
          borderRadius: 2, 
          p: 3, 
          mb: 3,
          border: '2px solid',
          borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <User size={20} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {order.customer_name || 'Guest Customer'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingBag size={18} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
              ${parseFloat(order.total_amount || 0).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 4 }}>
          <Clock size={14} style={{ opacity: 0.6 }} />
          <Typography variant="caption" color="text.secondary">
            {timeAgo}
          </Typography>
        </Box>

        {/* Acknowledge Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onAcknowledge}
          startIcon={<Bell size={24} />}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'error.dark',
              transform: 'scale(1.02)',
            },
            transition: 'all 0.2s',
            boxShadow: 4,
          }}
        >
          ACKNOWLEDGE ORDER
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Click to acknowledge and continue
        </Typography>
      </Box>
    </Dialog>
  )
}

