'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Container, Typography, Button, Card, CardContent, Tabs, Tab,
  IconButton, Chip, Grid, Stack, useTheme, Skeleton
} from '@mui/material'
import { Plus, Star, ChevronLeft, Search, Utensils } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/components/Toast'
import MenuItemModal from '@/components/MenuItemModal'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

const MotionBox = motion(Box)
const MotionGrid = motion(Grid)

export default function MenuPage() {
  const theme = useTheme()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const t = translations[lang].menu
  const { addItem } = useCartStore()
  const { addToast } = useToast()

  const [menu, setMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(0)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      try {
        const response = await api.get('/menu')
        if (response.data && response.data.categories) {
          setMenu(response.data.categories)
          // Set active category to first available category with items
          const firstCategoryWithItems = response.data.categories.findIndex((cat: any) => 
            cat.menu_items && cat.menu_items.length > 0
          )
          if (firstCategoryWithItems !== -1) {
            setActiveCategory(firstCategoryWithItems)
          }
        } else {
          setMenu([])
        }
      } catch (e: any) {
        console.error('Error loading menu:', e)
        const errorMessage = e?.response?.data?.error || e?.response?.data?.detail || e?.message || 'Failed to load menu'
        addToast('error', errorMessage)
        setMenu([])
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [lang, addToast])

  const handleItemClick = (item: any) => {
    if (!item.is_available) {
      addToast('error', 'This item is currently unavailable')
      return
    }
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleAddToCart = (detailedItem: any) => {
    addItem(detailedItem)
    addToast('success', 'Added to cart!')
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Search & Category Header */}
      <Box sx={{
        position: 'sticky',
        top: { xs: 0, md: 72 },
        zIndex: 1000,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(20px)',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <IconButton
                aria-label={lang === 'en' ? 'Back' : 'पछाडि'}
                onClick={() => router.back()}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <ChevronLeft size={20} />
              </IconButton>
              <Typography variant="h2" sx={{ flexGrow: 1, fontSize: '1.5rem' }}>{t.categories}</Typography>
              <IconButton sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Search size={20} />
              </IconButton>
            </Stack>

            {menu && menu.length > 0 && (
              <Tabs
                value={Math.min(activeCategory, menu.length - 1)}
                onChange={(_, v) => setActiveCategory(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                  '& .MuiTab-root': {
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': { color: 'primary.main' }
                  }
                }}
              >
                {menu.map((cat) => <Tab key={cat.id} label={cat.name} />)}
              </Tabs>
            )}
          </Box>
        </Container>
      </Box>

      {/* Menu Grid */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AnimatePresence mode="wait">
          <MotionGrid
            key={activeCategory}
            container
            spacing={3}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
                </Grid>
              ))
            ) : menu && menu[activeCategory]?.menu_items && menu[activeCategory].menu_items.length > 0 ? (
              menu[activeCategory].menu_items.map((item: any, idx: number) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      onClick={() => handleItemClick(item)}
                      sx={{
                        cursor: item.is_available ? 'pointer' : 'default',
                        opacity: item.is_available ? 1 : 0.6,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardContent sx={{ p: 3, flexGrow: 1 }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Box sx={{
                            width: 64, height: 64,
                            borderRadius: 3,
                            bgcolor: 'rgba(0,0,0,0.03)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <CustomUtensils size={28} strokeWidth={1.5} style={{ opacity: 0.3 }} />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 0.5 }}>{item.name}</Typography>
                              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                                ${parseFloat(item.price).toFixed(2)}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{
                              fontSize: '0.8rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {item.description}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1}>
                            {idx < 1 && (
                              <Chip
                                label="Popular"
                                size="small"
                                icon={<Star size={12} />}
                                sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600 }}
                              />
                            )}
                            {!item.is_available && (
                              <Chip label="Sold Out" size="small" color="error" sx={{ height: 24, fontSize: '0.7rem' }} />
                            )}
                          </Stack>
                          <IconButton
                            disabled={!item.is_available}
                            onClick={(e) => {
                              e.stopPropagation() // Prevent card click
                              handleItemClick(item)
                            }}
                            sx={{
                              bgcolor: 'primary.main', color: 'white',
                              width: 36, height: 36,
                              '&:hover': { bgcolor: 'black' }
                            }}
                          >
                            <Plus size={18} />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  </MotionBox>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No items available in this category
                  </Typography>
                </Box>
              </Grid>
            )}
          </MotionGrid>
        </AnimatePresence>
      </Container>

      {/* Item Modal */}
      <MenuItemModal
        open={modalOpen}
        item={selectedItem}
        onClose={() => {
          setModalOpen(false)
          setSelectedItem(null)
        }}
        onAddToCart={handleAddToCart}
      />
    </Box>
  )
}

function CustomUtensils(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}
