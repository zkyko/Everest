'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Box, Badge } from '@mui/material'
import { Home, UtensilsCrossed, ShoppingBag, Grid3x3 } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useThemeMode } from '@/lib/theme-context'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { items } = useCartStore()
  const { mode } = useThemeMode()
  const cartCount = items.length

  // Hide bottom nav on admin pages
  if (pathname?.startsWith('/admin') || pathname === '/login') {
    return null
  }

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/menu', icon: UtensilsCrossed, label: 'Menu' },
    { path: '/cart', icon: ShoppingBag, label: 'Cart' },
    { path: '/admin', icon: Grid3x3, label: 'More' },
  ]

  const isActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/home' || pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        maxWidth: 500,
        mx: 'auto',
        bgcolor: mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid',
        borderColor: mode === 'dark' ? 'rgba(244, 162, 97, 0.3)' : 'rgba(244, 162, 97, 0.2)',
        boxShadow: mode === 'dark' 
          ? '0 -4px 20px rgba(0, 0, 0, 0.5)' 
          : '0 -4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          py: 1.5,
          px: 2,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          const isCart = item.path === '/cart'

          return (
            <Box
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                cursor: 'pointer',
                position: 'relative',
                flex: 1,
                py: 1,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: active 
                    ? 'transparent' 
                    : mode === 'dark' 
                      ? 'rgba(244, 162, 97, 0.1)' 
                      : 'rgba(244, 162, 97, 0.08)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              {/* Active indicator background */}
              {active && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '100%',
                    bgcolor: 'secondary.main',
                    bgcolor: 'rgba(244, 162, 97, 0.15)',
                    borderRadius: 3,
                    zIndex: 0,
                  }}
                />
              )}

              {/* Icon container */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {isCart ? (
                  <Badge
                    badgeContent={cartCount}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: '#EF4444',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        padding: '0 4px',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                      },
                    }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={active ? 2.5 : 2}
                      color={active ? '#F4A261' : mode === 'dark' ? '#B0B0B0' : '#6B6B6B'}
                      fill={active ? 'rgba(244, 162, 97, 0.2)' : 'none'}
                    />
                  </Badge>
                ) : (
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.5 : 2}
                    color={active ? '#F4A261' : mode === 'dark' ? '#B0B0B0' : '#6B6B6B'}
                    fill={active ? 'rgba(244, 162, 97, 0.2)' : 'none'}
                  />
                )}
              </Box>

              {/* Label */}
              <Box
                component="span"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: active ? 700 : 500,
                  color: active 
                    ? '#F4A261' 
                    : mode === 'dark' 
                      ? '#B0B0B0' 
                      : '#6B6B6B',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                  letterSpacing: active ? '0.02em' : '0',
                }}
              >
                {item.label}
              </Box>

              {/* Active indicator dot */}
              {active && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    boxShadow: '0 0 8px rgba(244, 162, 97, 0.6)',
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>

      {/* Decorative accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #F4A261, transparent)',
          opacity: 0.3,
        }}
      />
    </Box>
  )
}
