'use client'

import { Card, CardContent, Box, Typography, Chip, Divider } from '@mui/material'
import { Clock, User, MessageSquare, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

interface OrderItem {
  id: string
  name?: string
  item_name?: string
  quantity: number
  price?: number
  item_price?: number
  modifiers?: any
  order_item_modifiers?: any[]
}

interface KitchenOrderCardProps {
  order: any
  onStatusUpdate: (orderId: string, currentStatus: string) => void
}

export default function KitchenOrderCard({ order, onStatusUpdate }: KitchenOrderCardProps) {
  // Parse order items
  const orderItems: OrderItem[] = order.order_items || order.items || []
  
  // Calculate time since order
  const orderTime = new Date(order.created_at)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000)
  const timeAgo = diffMinutes === 0 ? 'Just now' : 
                  diffMinutes === 1 ? '1 min ago' : 
                  `${diffMinutes} min ago`

  // Get status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'NEW':
        return {
          color: '#F4A261',
          bgColor: 'rgba(244, 162, 97, 0.15)',
          label: 'NEW ORDER',
          action: 'TAP TO ACCEPT'
        }
      case 'PREP':
        return {
          color: '#2196F3',
          bgColor: 'rgba(33, 150, 243, 0.15)',
          label: 'PREPARING',
          action: 'TAP WHEN READY'
        }
      case 'READY':
        return {
          color: '#4CAF50',
          bgColor: 'rgba(76, 175, 80, 0.15)',
          label: 'READY',
          action: 'TAP TO COMPLETE'
        }
      case 'COMPLETED':
        return {
          color: '#9E9E9E',
          bgColor: 'rgba(158, 158, 158, 0.15)',
          label: 'COMPLETED',
          action: ''
        }
      default:
        return {
          color: '#F4A261',
          bgColor: 'rgba(244, 162, 97, 0.15)',
          label: status,
          action: ''
        }
    }
  }

  const statusConfig = getStatusConfig(order.status)
  const isCompleted = order.status === 'COMPLETED'

  // Parse modifiers for display
  const parseModifiers = (item: OrderItem) => {
    const modifiers: { spiceLevel?: string; extras: string[] } = { extras: [] }
    
    // Handle order_item_modifiers array (from API)
    if (item.order_item_modifiers && Array.isArray(item.order_item_modifiers)) {
      item.order_item_modifiers.forEach((mod: any) => {
        const modName = mod.modifier_name || mod.name
        if (modName.toLowerCase().includes('spice') || 
            modName.toLowerCase().includes('hot') || 
            modName.toLowerCase().includes('mild') ||
            modName.toLowerCase().includes('medium')) {
          modifiers.spiceLevel = modName
        } else {
          modifiers.extras.push(modName)
        }
      })
    }
    // Handle modifiers object
    else if (item.modifiers) {
      if (item.modifiers.spice_level) {
        modifiers.spiceLevel = item.modifiers.spice_level
      }
      if (item.modifiers.extras && Array.isArray(item.modifiers.extras)) {
        modifiers.extras = item.modifiers.extras
      }
      // Handle selectedModifiers array
      if (Array.isArray(item.modifiers)) {
        item.modifiers.forEach((mod: any) => {
          if (mod.name) {
            modifiers.extras.push(mod.name)
          }
        })
      }
    }
    
    return modifiers
  }

  // Get special instructions
  const specialInstructions = order.special_instructions || order.notes || null

  return (
    <MotionCard
      onClick={() => !isCompleted && onStatusUpdate(order.id, order.status)}
      whileTap={!isCompleted ? { scale: 0.97 } : {}}
      sx={{
        cursor: isCompleted ? 'default' : 'pointer',
        borderLeft: `6px solid ${statusConfig.color}`,
        bgcolor: statusConfig.bgColor,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': !isCompleted ? {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        } : {},
        '&:active': !isCompleted ? {
          transform: 'scale(0.98)',
        } : {},
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 900, 
                fontSize: '1.75rem',
                mb: 0.5,
                color: statusConfig.color
              }}
            >
              #{String(order.id).slice(-6)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={14} style={{ opacity: 0.6 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {order.customer_name || 'Guest'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={statusConfig.label}
              size="small"
              sx={{
                bgcolor: statusConfig.color,
                color: 'white',
                fontWeight: 800,
                fontSize: '0.7rem',
                mb: 0.5
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
              <Clock size={12} style={{ opacity: 0.5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {timeAgo}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Order Items */}
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          {orderItems.map((item: OrderItem, idx: number) => {
            const itemName = item.item_name || item.name || 'Unknown Item'
            const modifiers = parseModifiers(item)
            
            return (
              <Box key={item.id || idx} sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box
                    sx={{
                      minWidth: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: statusConfig.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}
                  >
                    {item.quantity}×
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    {itemName}
                  </Typography>
                </Box>
                
                {/* Modifiers */}
                {(modifiers.spiceLevel || modifiers.extras.length > 0) && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 4.5 }}>
                    {modifiers.spiceLevel && (
                      <Chip
                        icon={<span style={{ fontSize: '0.9rem' }}>🌶️</span>}
                        label={modifiers.spiceLevel}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: 'warning.main',
                          color: 'white',
                          '& .MuiChip-icon': {
                            ml: 0.5
                          }
                        }}
                      />
                    )}
                    {modifiers.extras.map((extra: string, i: number) => (
                      <Chip
                        key={i}
                        label={extra}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          bgcolor: 'info.main',
                          color: 'white'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>

        {/* Special Instructions */}
        {specialInstructions && (
          <>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}>
              <MessageSquare size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                "{specialInstructions}"
              </Typography>
            </Box>
          </>
        )}

        {/* Action Footer */}
        {!isCompleted && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 1.5,
                borderRadius: 2,
                bgcolor: statusConfig.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <ChefHat size={18} />
              <Typography variant="body1" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
                {statusConfig.action}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </MotionCard>
  )
}

