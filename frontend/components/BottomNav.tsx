'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Box, Typography, Drawer, IconButton, Stack, Divider, Badge } from '@mui/material'
import { Home, Utensils, ShoppingBag, Settings2, X } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'
import LanguageToggle from '@/components/LanguageToggle'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const t = translations[lang].nav
  const [settingsOpen, setSettingsOpen] = useState(false)
  const items = useCartStore((state) => state.items)

  // Hide bottom nav on admin pages and desktop
  if (pathname?.startsWith('/admin') || pathname === '/login') {
    return null
  }

  const navItems = [
    { path: '/home', icon: Home, label: t.home },
    { path: '/menu', icon: Utensils, label: t.menu },
    { path: '/cart', icon: ShoppingBag, label: t.cart, badge: items.length },
    { path: '__settings__', icon: Settings2, label: 'Settings' },
  ]

  const isActive = (path: string) => {
    if (path === '/home') return pathname === '/home' || pathname === '/'
    return pathname?.startsWith(path)
  }

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: { xs: 'block', md: 'none' },
          bgcolor: 'background.paper',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: 72,
            px: 1,
            position: 'relative',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Box
                key={item.path}
                onClick={() => {
                  if (item.path === '__settings__') {
                    setSettingsOpen(true)
                    return
                  }
                  router.push(item.path)
                }}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flex: 1,
                  gap: 0.5,
                  py: 1.5,
                  px: 1,
                  borderRadius: 2,
                  color: active ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:active': { 
                    transform: 'scale(0.92)',
                  },
                }}
              >
                {/* Active indicator background */}
                {active && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '85%',
                      height: '70%',
                      bgcolor: 'rgba(244, 162, 97, 0.12)',
                      borderRadius: 2.5,
                      zIndex: 0,
                    }}
                  />
                )}
                
                {/* Icon with badge */}
                <Badge 
                  badgeContent={item.badge} 
                  color="error"
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                      fontWeight: 700,
                      border: '2px solid',
                      borderColor: 'background.paper',
                    }
                  }}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    style={{ 
                      opacity: active ? 1 : 0.7,
                    }}
                  />
                </Badge>
                
                {/* Label */}
                <Typography
                  variant="caption"
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '0.68rem',
                    fontWeight: active ? 700 : 500,
                    letterSpacing: '0.015em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Typography>

                {/* Active indicator dot */}
                {active && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Settings Drawer */}
      <Drawer
        anchor="bottom"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            pb: 'env(safe-area-inset-bottom)',
            background: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                Settings
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Customize your experience
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setSettingsOpen(false)} 
              aria-label="Close settings"
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <X size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Language Setting */}
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
            spacing={2}
            sx={{ py: 1.5 }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                Language
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Switch between English and Nepali
              </Typography>
            </Box>
            <LanguageToggle />
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}
