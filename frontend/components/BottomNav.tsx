'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Box, Typography } from '@mui/material'
import { Home, Utensils, ShoppingBag, User } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const t = translations[lang].nav

  // Hide bottom nav on admin pages and desktop (lg breakpoint and above)
  if (pathname?.startsWith('/admin') || pathname === '/login') {
    return null
  }

  const navItems = [
    { path: '/home', icon: Home, label: t.home },
    { path: '/menu', icon: Utensils, label: t.menu },
    { path: '/cart', icon: ShoppingBag, label: t.cart },
  ]

  const isActive = (path: string) => {
    if (path === '/home') return pathname === '/home' || pathname === '/'
    return pathname?.startsWith(path)
  }

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' }, // Hide on desktop
        bgcolor: 'background.paper',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom)', // Support for iOS notch
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
          px: 2,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Box
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flex: 1,
                gap: 0.5,
                color: active ? 'primary.main' : 'text.secondary',
                transition: 'all 0.2s ease',
                '&:active': { transform: 'scale(0.9)' },
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                style={{ opacity: active ? 1 : 0.7 }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.02em',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
