'use client'

import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material'
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus, Clock, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/components/Toast'
import BottomNav from '@/components/BottomNav'
import PageInfo from '@/components/PageInfo'
import { statusColors } from '@/lib/theme'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, clearCart, getTotal, addItem } = useCartStore()
  const { addToast } = useToast()

  // Group items by ID and modifiers
  const groupedItems = items.reduce((acc: any, item: any, idx: number) => {
    // Create a unique key based on item ID and modifiers
    const modifierKey = item.modifiers 
      ? JSON.stringify(item.modifiers) 
      : 'no-modifiers'
    const key = `${item.id || item.cartId || idx}-${modifierKey}`
    
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 1, indices: [idx] }
    } else {
      acc[key].quantity += 1
      acc[key].indices.push(idx)
    }
    return acc
  }, {})

  const groupedItemsArray = Object.values(groupedItems)

  const handleQuantityChange = (item: any, change: number) => {
    if (change < 0 && item.quantity > 1) {
      // Decrease quantity
      if (item.indices.length > 0) {
        removeItem(item.indices[0])
      }
    } else if (change > 0) {
      // Increase quantity - add another item
      const newItem = { ...item }
      delete newItem.quantity
      delete newItem.indices
      delete newItem.cartId
      // Add to cart
      addItem(newItem)
    }
  }

  const handleRemoveItem = (item: any) => {
    item.indices.forEach((i: number) => removeItem(i))
    addToast('info', 'Item removed from cart')
  }

  const handleClearCart = () => {
    clearCart()
    addToast('info', 'Cart cleared')
  }

  // Parse modifiers for display
  const getModifiers = (item: any) => {
    if (!item.modifiers) return { spiceLevel: null, extras: [] }
    
    let spiceLevel: string | null = null
    const extras: string[] = []
    
    if (item.modifiers.spice_level && Array.isArray(item.modifiers.spice_level)) {
      spiceLevel = item.modifiers.spice_level[0]
    } else if (item.modifiers.spice_level) {
      spiceLevel = item.modifiers.spice_level
    }
    
    if (item.modifiers.add_ons && Array.isArray(item.modifiers.add_ons)) {
      extras.push(...item.modifiers.add_ons)
    } else if (item.modifiers.extras && Array.isArray(item.modifiers.extras)) {
      extras.push(...item.modifiers.extras)
    }
    
    return { spiceLevel, extras }
  }

  const subtotal = getTotal()
  const tax = subtotal * 0.0825 // 8.25% tax (Austin, TX)
  const total = subtotal + tax

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageInfo
        title="Shopping Cart"
        description="This is where customers review their order before checkout. Each item shows its customizations (spice level, extras) clearly. Customers can adjust quantities or remove items. The total includes tax calculation. When ready, they proceed to checkout to enter payment and delivery info."
        endpoints={[]}
        connections={[
          'Menu: Items are added here with all customizations',
          'Checkout: Proceed to payment and order submission',
          'Order Status: After checkout, customers can track their order'
        ]}
        pageType="customer"
      />
      {/* Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 40, 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Container maxWidth={false} sx={{ py: 2, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => router.back()}
                sx={{ 
                  bgcolor: 'grey.100',
                  '&:hover': { bgcolor: 'grey.200' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h1" sx={{ mb: 0.5 }}>
                  Cart
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Typography>
              </Box>
            </Box>
            {items.length > 0 && (
              <Button
                onClick={handleClearCart}
                size="small"
                sx={{ 
                  color: 'error.main',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'error.main15' }
                }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Cart Items */}
      <Container maxWidth={false} sx={{ py: 3, px: 3, pb: items.length > 0 ? 30 : 20 }}>
        {items.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              py: 12,
              textAlign: 'center',
              animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'grey.100', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 3
            }}>
              <ShoppingBag size={40} color={statusColors.medium} style={{ opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 280 }}>
              Start adding delicious items from our menu
            </Typography>
            <Button
              onClick={() => router.push('/menu')}
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Browse Menu
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groupedItemsArray.map((item: any, idx: number) => {
              const { spiceLevel, extras } = getModifiers(item)
              return (
                <Card
                  key={item.id || item.cartId || idx}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${idx * 0.05}s`,
                    animationFillMode: 'both',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        {item.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {item.description}
                          </Typography>
                        )}
                        
                        {/* Modifiers */}
                        {(spiceLevel || extras.length > 0) && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                            {spiceLevel && (
                              <Chip
                                label={`Spice: ${spiceLevel}`}
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: '0.7rem',
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
                                  height: 22,
                                  fontSize: '0.7rem',
                                  bgcolor: 'info.main15',
                                  color: 'info.main',
                                  fontWeight: 500
                                }}
                              />
                            ))}
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                            ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              onClick={() => handleQuantityChange(item, -1)}
                              size="small"
                              sx={{ 
                                bgcolor: 'grey.100',
                                '&:hover': { bgcolor: 'grey.200' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            >
                              <Minus size={16} />
                            </IconButton>
                            <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => handleQuantityChange(item, 1)}
                              size="small"
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            >
                              <Plus size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveItem(item)}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { 
                            color: 'error.main',
                            bgcolor: 'error.main15'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}
      </Container>

      {/* Checkout Summary */}
      {items.length > 0 && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 80, 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <Container maxWidth={false} sx={{ py: 3, px: 3 }}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Clock size={16} color={statusColors.medium} />
                  <Typography variant="body2" color="text.secondary">
                    Estimated pickup: 12-15 min
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Subtotal
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Tax (8.25%)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${tax.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  onClick={() => router.push('/checkout')}
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  endIcon={<ChevronRight size={20} />}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 4
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      )}

      <BottomNav />
    </Box>
  )
}
