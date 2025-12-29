'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Button, Card, CardContent, Grid, Chip, IconButton } from '@mui/material'
import { MapPin, Clock, ChevronRight, Star, Instagram, Phone } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import BottomNav from '@/components/BottomNav'
import DarkModeToggle from '@/components/DarkModeToggle'
import { statusColors } from '@/lib/theme'

export default function HomePage() {
  const [status, setStatus] = useState({
    isOpen: true,
    kitchenLoad: 'LOW',
    estimatedTime: '12-15 min',
    waitTime: '12-15 min',
    waitTimeLevel: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH'
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/metrics/volume')
        const loadState = response.data?.load_state || 'LOW'
        const waitTime = loadState === 'LOW' ? '12-15 min' : loadState === 'MEDIUM' ? '18-22 min' : '25-30 min'
        setStatus(prev => ({
          ...prev,
          waitTime,
          waitTimeLevel: loadState
        }))
      } catch (error) {
        // Use default wait time
        setStatus(prev => ({
          ...prev,
          waitTime: '12-15 min',
          waitTimeLevel: 'LOW'
        }))
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getWaitTimeColor = (level: string) => {
    switch (level) {
      case 'LOW': return statusColors.low
      case 'MEDIUM': return statusColors.medium
      case 'HIGH': return statusColors.high
      default: return statusColors.low
    }
  }

  const popularItems = [
    { name: "Chicken Chow Mein", description: "6 oz noodles, fresh vegetables, 3 oz chicken", price: 12.99, id: 'chow-mein' },
    { name: "Chicken Momo", description: "Traditional Nepalese dumplings", price: 12.99, id: 'momo' },
    { name: "Chatpate", description: "Nepali amilo piro chat pat", price: 6.99, id: 'chatpate' },
    { name: "Chicken Curry", description: "Farm fresh chicken, authentic Nepali style", price: 13.99, id: 'curry' }
  ]

  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 500 }, mx: 'auto', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Status Bar - Sticky */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth={false} sx={{ py: 1.5, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: status.isOpen ? statusColors.low : statusColors.veryHigh 
              }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {status.isOpen ? 'Open' : 'Closed'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={14} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: getWaitTimeColor(status.waitTimeLevel) }}>
                {status.waitTime}
              </Typography>
            </Box>
            <DarkModeToggle />
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText', 
          py: 8, 
          px: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1, 
              color: 'primary.contrastText',
              animation: 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              animationDelay: '0.1s',
              animationFillMode: 'both'
            }}
          >
            Everest
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              animation: 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}
          >
            Authentic Nepalese Street Food
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              component={Link}
              href="/menu"
              variant="contained"
              color="secondary"
              fullWidth
              endIcon={<ChevronRight size={20} />}
            >
              Order Takeout
            </Button>
            <Button
              component={Link}
              href="/menu"
              variant="outlined"
              fullWidth
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'primary.contrastText',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              View Menu
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Location & Hours */}
      <Box sx={{ bgcolor: 'background.paper', py: 3, px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 2, 
            bgcolor: 'secondary.main',
            bgcolor: `${statusColors.medium}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={24} color={statusColors.medium} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
              1310 West Howard Lane
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Austin, TX 78728
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Clock size={14} />
              <Typography variant="body2" color="text.secondary">
                Open until 12:00 AM
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Pickup only — no dine-in reservations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Popular Items */}
      <Container maxWidth={false} sx={{ py: 4, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h2">Popular Items</Typography>
          <Button
            component={Link}
            href="/menu"
            endIcon={<ChevronRight size={16} />}
            sx={{ color: 'secondary.main', fontWeight: 600 }}
          >
            See All
          </Button>
        </Box>
        <Grid container spacing={2}>
          {popularItems.map((item, idx) => (
            <Grid item xs={6} key={item.id}>
              <Card
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'both',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ 
                    aspectRatio: '1', 
                    bgcolor: 'grey.100', 
                    borderRadius: 2, 
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h3">🍜</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1.5
                  }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      ${item.price}
                    </Typography>
                    <IconButton
                      component={Link}
                      href="/menu"
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <ChevronRight size={16} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.50', py: 4, px: 3, mt: 'auto', mb: 10 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Instagram size={20} />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Star size={20} />
            </IconButton>
            <IconButton size="small" component="a" href="tel:+1234567890" sx={{ color: 'text.secondary' }}>
              <Phone size={20} />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" align="center">
            Powered by Everest Food Truck OS
          </Typography>
        </Box>
      </Box>

      <BottomNav />
    </Box>
  )
}
