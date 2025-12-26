'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material'
import { X, Receipt } from 'lucide-react'
import { statusColors } from '@/lib/theme'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  modifiers?: {
    spice_level?: string
    extras?: string[]
  }
}

interface OrderDetailModalProps {
  open: boolean
  order: any
  onClose: () => void
}

export default function OrderDetailModal({ open, order, onClose }: OrderDetailModalProps) {
  if (!order) return null

  // Parse order items - handle both API format and mock data
  const orderItems: OrderItem[] = order.items?.map((item: any) => {
    // Parse modifiers from backend format (OrderItemModifier array)
    let spiceLevel: string | undefined
    const extras: string[] = []
    
    if (item.modifiers && Array.isArray(item.modifiers)) {
      item.modifiers.forEach((mod: any) => {
        if (mod.modifier_group_name === 'Spice Level' || mod.modifier_group_name === 'spice') {
          spiceLevel = mod.modifier_option_name
        } else {
          extras.push(mod.modifier_option_name)
        }
      })
    } else if (item.modifiers) {
      // Handle direct modifiers object
      spiceLevel = item.modifiers.spice_level
      if (item.modifiers.extras) {
        extras.push(...item.modifiers.extras)
      }
    }

    return {
      id: item.id || item.menu_item_id || Math.random().toString(),
      name: item.name || item.item_name || item.menu_item_name || 'Unknown Item',
      quantity: item.quantity || 1,
      price: parseFloat(item.price || item.item_price || item.unit_price || 0),
      modifiers: {
        spice_level: spiceLevel,
        extras: extras
      }
    }
  }) || []

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.0825 // 8.25% tax (Austin, TX)
  const total = subtotal + tax

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return statusColors.medium
      case 'PREP': return statusColors.high
      case 'READY': return statusColors.low
      case 'COMPLETED': return '#9B9B9B'
      default: return statusColors.medium
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt size={24} color={statusColors.medium} />
            <Typography variant="h2">Order Receipt</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Order Header */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Order #{String(order.id).slice(-6)}
              </Typography>
              <Chip
                label={order.status}
                size="small"
                sx={{
                  bgcolor: `${getStatusColor(order.status)}15`,
                  color: getStatusColor(order.status),
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {order.customer_name || 'Guest Customer'}
            </Typography>
            {order.created_at && (
              <Typography variant="caption" color="text.secondary">
                {new Date(order.created_at).toLocaleString()}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Restaurant Info */}
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Everest Food Truck
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1310 West Howard Lane
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Austin, TX 78728
            </Typography>
          </Box>

          <Divider />

          {/* Order Items */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Order Items
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orderItems.map((item, idx) => (
                <Box key={item.id || idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      {item.modifiers?.spice_level && (
                        <Chip
                          label={`Spice: ${item.modifiers.spice_level}`}
                          size="small"
                          sx={{
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: 'warning.main15',
                            color: 'warning.main',
                            fontWeight: 600
                          }}
                        />
                      )}
                      {item.modifiers?.extras && item.modifiers.extras.length > 0 && (
                        <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.modifiers.extras.map((extra: string, i: number) => (
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
                    <Box sx={{ textAlign: 'right', ml: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  {idx < orderItems.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Totals */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Tax (8.25%)
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                ${tax.toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Payment Info */}
          {order.payment_status && (
            <>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Payment Status
                </Typography>
                <Chip
                  label={order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  size="small"
                  color={order.payment_status === 'paid' ? 'success' : 'warning'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Thank you for your order!
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

