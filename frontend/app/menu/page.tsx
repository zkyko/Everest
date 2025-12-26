'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Box, Container, Typography, Button, Card, CardContent, Tabs, Tab, 
  IconButton, Chip, Badge 
} from '@mui/material'
import { Plus, Star, ChevronLeft } from 'lucide-react'
import api from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { useToast } from '@/components/Toast'
import BottomNav from '@/components/BottomNav'
import MenuItemModal from '@/components/MenuItemModal'
import DarkModeToggle from '@/components/DarkModeToggle'
import PageInfo from '@/components/PageInfo'
import { statusColors } from '@/lib/theme'

export default function MenuPage() {
  const router = useRouter()
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
      // Show fallback data immediately for better UX
      const fallbackData = [
          {
            id: '1',
            name: 'Nepalese Food Items',
            items: [
              { id: '1', name: 'Chicken Chow Mein', description: '6 ounces of spaghetti noodles onion chopped garlic ginger fresh vegetables, 3 ounces of chicken customer choice.', price: 12.99, is_available: true },
              { id: '2', name: 'Chicken Momo', description: 'Chicken dumplings.', price: 12.99, is_available: true },
              { id: '3', name: 'Chicken Jhol Momo', description: 'Traditional Nepalese dumplings filled with chicken in a flavorful broth.', price: 12.99, is_available: true },
              { id: '4', name: 'Veg Momos', description: 'Steamed dumplings filled with vegetables.', price: 11.99, is_available: true },
              { id: '5', name: 'Mix Buff Sukuti & Fried Chicken Momo (5 pcs)', description: 'Buff suki chow mein with 5 pieces of fried chicken momo.', price: 15.99, is_available: true },
            ]
          },
          {
            id: '2',
            name: 'Indian Food',
            items: [
              { id: '6', name: 'Chicken Curry', description: 'Farm fresh chicken, made with authentic Nepali style, and chef recipe.', price: 13.99, is_available: true },
              { id: '7', name: 'Paneer Tikka Masala', description: 'Paneer marinated with authentic herbs, yogurt, spices, and a vegan dish.', price: 13.00, is_available: true },
              { id: '8', name: 'Goat Curry with Side Basmati Rice', description: 'Tender goat in a rich and flavorful curry served with basmati rice.', price: 15.99, is_available: true },
            ]
          },
          {
            id: '3',
            name: 'Snacks',
            items: [
              { id: '9', name: 'Chatpate', description: 'Nepali amilo piro chat pat.', price: 6.99, is_available: true },
              { id: '10', name: 'Samosa', description: 'Nepali and Indian is a famous vegan dish, is come with mint chutney.', price: 5.99, is_available: true },
            ]
          },
          {
            id: '4',
            name: 'Drinks',
            items: [
              { id: '11', name: 'Chiya', description: 'Himalayan tea, milk cloves ginger black paper cardamom cinnamon, and sugar.', price: 3.50, is_available: true },
            ]
          }
        ]
      
      // Set fallback data immediately
      setMenu(fallbackData)
      setLoading(false)

      // Then try to fetch from API in background
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 2000)
        )
        const response = await Promise.race([
          api.get('/menu'),
          timeoutPromise
        ]) as any
        if (response.data && response.data.categories && response.data.categories.length > 0) {
          setMenu(response.data.categories)
        }
      } catch (e) {
        console.log('Using fallback menu data:', e)
        // Already using fallback data, no need to update
      }
    }
    fetchMenu()
  }, [])

  const handleItemClick = (item: any) => {
    if (!item.is_available) {
      addToast('error', 'This item is currently unavailable')
      return
    }
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleAddToCart = (item: any, modifiers: Record<string, string[]>) => {
    // Calculate total price with modifiers
    let totalPrice = parseFloat(item.price || 0)
    
    // Add modifier prices (simplified - in real app, fetch from API)
    const defaultModifiers = [
      {
        id: 'spice',
        options: [
          { id: 'mild', price_modifier: 0 },
          { id: 'medium', price_modifier: 0 },
          { id: 'hot', price_modifier: 0 },
          { id: 'extra-hot', price_modifier: 0 },
        ],
      },
      {
        id: 'extras',
        options: [
          { id: 'extra-rice', price_modifier: 2.00 },
          { id: 'extra-meat', price_modifier: 3.00 },
          { id: 'extra-veggies', price_modifier: 1.50 },
          { id: 'extra-sauce', price_modifier: 0.50 },
        ],
      },
    ]

    Object.entries(modifiers).forEach(([groupId, optionIds]) => {
      defaultModifiers.forEach((group) => {
        if (group.id === groupId) {
          optionIds.forEach((optionId) => {
            const option = group.options.find((opt) => opt.id === optionId)
            if (option) {
              totalPrice += parseFloat(String(option.price_modifier || 0))
            }
          })
        }
      })
    })

    const itemWithModifiers = {
      ...item,
      price: totalPrice,
      modifiers,
      originalPrice: item.price,
    }

    addItem(itemWithModifiers)
    addToast('success', 'Added to cart!')
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Loading menu...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageInfo
        title="Menu Browsing"
        description="Customers browse the full menu organized by categories (Nepalese Food, Indian Food, etc.). Click any item to customize it - select spice level (Mild to Extra Hot) and add extras like extra rice, meat, or sauce. All customizations are saved with the item when added to cart."
        endpoints={['GET /api/menu']}
        connections={[
          'Cart: Customized items are added with all modifications',
          'Home: Popular items link back to full menu',
          'Admin Menu: Owners can edit items, prices, and availability here'
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
        borderColor: 'divider'
      }}>
        <Container maxWidth={false} sx={{ py: 2, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => router.back()}
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <Typography variant="h1" sx={{ flexGrow: 1 }}>Menu</Typography>
            <DarkModeToggle />
          </Box>

          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onChange={(_, newValue) => setActiveCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 2,
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            {menu.map((cat) => (
              <Tab key={cat.id} label={cat.name} />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Menu Items */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 3, 
          px: 3, 
          pb: 20,
          scrollBehavior: 'smooth',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {menu[activeCategory]?.items && menu[activeCategory].items.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {menu[activeCategory].items.map((item: any, idx: number) => (
              <Card 
                key={item.id}
                sx={{ 
                  cursor: item.is_available ? 'pointer' : 'default',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animationDelay: `${idx * 0.05}s`,
                  animationFillMode: 'both',
                  '&:hover': item.is_available ? { 
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  } : {},
                  '&:active': item.is_available ? {
                    transform: 'translateY(-1px) scale(0.98)'
                  } : {}
                }}
                onClick={() => handleItemClick(item)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        {idx < 2 && (
                          <Chip
                            icon={<Star size={12} fill="currentColor" />}
                            label="Popular"
                            size="small"
                            sx={{ 
                              height: 20,
                              fontSize: '0.7rem',
                              color: 'secondary.main',
                              bgcolor: `${statusColors.medium}15`
                            }}
                          />
                        )}
                        {!item.is_available && (
                          <Chip
                            label="Sold Out"
                            size="small"
                            color="error"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                      {item.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                          ${parseFloat(item.price).toFixed(2)}
                        </Typography>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleItemClick(item)
                          }}
                          disabled={!item.is_available}
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.dark' },
                            '&.Mui-disabled': { bgcolor: 'grey.300' }
                          }}
                        >
                          <Plus size={20} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No items in this category</Typography>
          </Box>
        )}
      </Container>

      <BottomNav />

      {/* Menu Item Modal */}
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
