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
  Stack,
  useTheme,
  Grid
} from '@mui/material'
import { ShoppingBag, Trash2, ChevronLeft, Plus, Minus, Clock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/components/Toast'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

export default function CartPage() {
  const theme = useTheme()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const t = translations[lang].cart
  const { items, removeItem, clearCart, getTotal, addItem } = useCartStore()
  const { addToast } = useToast()

  const groupedItems = items.reduce((acc: any, item: any, idx: number) => {
    const modifierKey = item.modifiers ? JSON.stringify(item.modifiers) : 'none'
    const key = `${item.id}-${modifierKey}`
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
      removeItem(item.indices[0])
    } else if (change > 0) {
      const { quantity, indices, ...cleanItem } = item
      addItem(cleanItem)
    }
  }

  const subtotal = getTotal()
  const tax = subtotal * 0.0825
  const total = subtotal + tax

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 20 }}>
      {/* Header */}
      <Box sx={{
        position: 'sticky', top: { xs: 0, md: 72 }, zIndex: 100,
        bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider',
        backdropFilter: 'blur(20px)'
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                aria-label={lang === 'en' ? 'Back' : 'पछाडि'}
                onClick={() => router.back()}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <ChevronLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>{t.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {items.length} {lang === 'en' ? 'items' : 'परिकार'}
                </Typography>
              </Box>
            </Stack>
            {items.length > 0 && (
              <Button
                onClick={clearCart}
                size="small"
                color="error"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t.clear}
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{ textAlign: 'center', py: 12 }}
                >
                  <Box sx={{
                    width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3
                  }}>
                    <ShoppingBag size={40} strokeWidth={1} />
                  </Box>
                  <Typography variant="h3" sx={{ mb: 1 }}>{t.emptyTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>{t.emptySubtitle}</Typography>
                  <Button variant="contained" onClick={() => router.push('/menu')}>{t.browseMenu}</Button>
                </MotionBox>
              ) : (
                <Stack spacing={2}>
                  {groupedItemsArray.map((item: any, idx) => (
                    <MotionCard
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                      sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" spacing={3}>
                          <Box sx={{
                            width: 80, height: 80, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.03)',
                            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <ShoppingBag size={32} strokeWidth={1} style={{ opacity: 0.2 }} />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                              <Typography variant="h3" sx={{ fontSize: '1.1rem' }}>{item.name}</Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(item)}
                                color="error"
                                aria-label={lang === 'en' ? 'Remove item' : 'हटाउनुहोस्'}
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </Stack>

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Stack direction="row" spacing={1}>
                                <IconButton onClick={() => handleQuantityChange(item, -1)} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                                  <Minus size={14} />
                                </IconButton>
                                <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</Typography>
                                <IconButton onClick={() => handleQuantityChange(item, 1)} size="small" sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                  <Plus size={14} />
                                </IconButton>
                              </Stack>
                              <Typography variant="h3" sx={{ color: 'primary.main' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </MotionCard>
                  ))}
                </Stack>
              )}
            </AnimatePresence>
          </Grid>

          {items.length > 0 && (
            <Grid item xs={12} md={4}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 160 } }}>
                <Card sx={{ bgcolor: 'rgba(0,0,0,0.02)', border: 'none', boxShadow: 'none', borderRadius: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h3" sx={{ mb: 3, fontSize: '1.25rem' }}>{t.summary}</Typography>

                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">{t.subtotal}</Typography>
                        <Typography sx={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">{t.tax}</Typography>
                        <Typography sx={{ fontWeight: 600 }}>${tax.toFixed(2)}</Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h3">{t.total}</Typography>
                        <Typography variant="h2" color="primary.main">${total.toFixed(2)}</Typography>
                      </Stack>
                    </Stack>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)' }}>
                          <Clock size={16} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>{t.pickupEstimate}</Typography>
                          <Typography variant="body2" color="text.secondary">12-15 {t.minutes}</Typography>
                        </Box>
                      </Stack>
                    </Stack>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      endIcon={<ArrowRight size={20} />}
                      onClick={() => router.push('/checkout')}
                      sx={{ py: 2, borderRadius: 3 }}
                    >
                      {t.checkout}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )

  function handleRemoveItem(item: any) {
    item.indices.forEach((i: number) => removeItem(i))
    addToast('info', 'Removed')
  }
}
