'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack, IconButton, useTheme } from '@mui/material'
import { MapPin, Clock, ChevronRight, Star, Instagram, Phone, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { statusColors } from '@/lib/theme'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

const MotionBox = motion(Box)
const MotionTypography = motion(Typography)

export default function HomePage() {
  const theme = useTheme()
  const { lang } = useLanguageStore()
  const t = translations[lang].home
  const ts = translations[lang].status

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

  const [popularItems, setPopularItems] = useState<any[]>([])

  useEffect(() => {
    const loadPopularItems = async () => {
      try {
        const response = await api.get('/menu')
        if (response.data?.categories) {
          // Get popular items from menu (first few items from categories)
          const allItems: any[] = []
          response.data.categories.forEach((cat: any) => {
            if (cat.menu_items) {
              allItems.push(...cat.menu_items.slice(0, 2))
            }
          })
          setPopularItems(allItems.slice(0, 4))
        }
      } catch (e) {
        console.error('Error loading popular items:', e)
      }
    }
    loadPopularItems()
  }, [])

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'light' ? 'primary.main' : 'background.paper',
          color: 'primary.contrastText',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <MotionTypography
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                variant="h1"
                sx={{
                  mb: 2,
                  color: theme.palette.mode === 'light' ? 'primary.contrastText' : 'text.primary',
                  fontSize: { xs: '3.5rem', md: '5rem' },
                }}
              >
                {t.heroTitle}
              </MotionTypography>
              <MotionTypography
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variant="h6"
                sx={{
                  mb: 5,
                  opacity: 0.8,
                  fontWeight: 500,
                  color: theme.palette.mode === 'light' ? 'primary.contrastText' : 'text.primary',
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  maxWidth: '500px'
                }}
              >
                {t.heroSubtitle}
              </MotionTypography>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
              >
                <Button
                  component={Link}
                  href="/menu"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowUpRight size={20} />}
                  sx={{ px: 4, py: 2 }}
                >
                  {t.orderNow}
                </Button>
                <Button
                  component={Link}
                  href="/menu"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4, py: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'primary.contrastText',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  {t.viewMenu}
                </Button>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Info Strip */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container sx={{ py: 3 }}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 0 } }}>
              <Box sx={{ color: 'text.secondary' }}><MapPin size={24} /></Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.address}</Typography>
                <Typography variant="caption" color="text.secondary">{t.city}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 0 } }}>
              <Box sx={{ color: status.isOpen ? 'success.main' : 'error.main' }}>
                <Clock size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {status.isOpen ? t.open : t.closed}
                </Typography>
                <Typography variant="caption" color="text.secondary">{t.pickupOnly}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: getWaitTimeColor(status.waitTimeLevel) }}>
                <Utensils size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{status.waitTime} {t.waitTime}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {ts[status.waitTimeLevel.toLowerCase() as keyof typeof ts]} Load
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Popular Items */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
          <Typography variant="h2">{t.popularItems}</Typography>
          <Button
            component={Link}
            href="/menu"
            endIcon={<ChevronRight size={18} />}
            sx={{ fontWeight: 700, p: 0 }}
          >
            {t.seeAll}
          </Button>
        </Box>
        <Grid container spacing={3}>
          {popularItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    pt: '75%',
                    position: 'relative',
                    bgcolor: 'rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Utensils size={40} strokeWidth={1} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }} />
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h3" sx={{ mb: 1, fontSize: '1.1rem' }}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, fontSize: '0.85rem' }}>
                      {item.description}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                        ${item.price}
                      </Typography>
                      <IconButton
                        component={Link}
                        href="/menu"
                        aria-label={t.seeAll}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'black' }
                        }}
                      >
                        <ChevronRight size={18} />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Social Footer */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center">
            <Stack direction="row" spacing={3}>
              <IconButton aria-label="Instagram" sx={{ border: '1px solid', borderColor: 'divider' }}><Instagram size={20} /></IconButton>
              <IconButton aria-label="Reviews" sx={{ border: '1px solid', borderColor: 'divider' }}><Star size={20} /></IconButton>
              <IconButton aria-label="Contact" sx={{ border: '1px solid', borderColor: 'divider' }}><Phone size={20} /></IconButton>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t.footerCredit}
            </Typography>
            <Link
              href="/admin"
              style={{
                textDecoration: 'none',
                fontSize: '0.65rem',
                color: 'transparent',
                cursor: 'default',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'inherit')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'transparent')}
            >
              •
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

function Utensils(props: any) {
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
