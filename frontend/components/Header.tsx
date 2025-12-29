'use client'

import { Box, Container, Typography, Stack, Badge } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, ShoppingBag } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
import DarkModeToggle from './DarkModeToggle'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'
import { useCartStore } from '@/lib/store'

export default function Header() {
    const pathname = usePathname()
    const { lang } = useLanguageStore()
    const t = translations[lang].nav
    const items = useCartStore((state) => state.items)

    const navItems = [
        { path: '/home', label: t.home, icon: Home },
        { path: '/menu', label: t.menu, icon: Utensils },
        { path: '/cart', label: t.cart, icon: ShoppingBag, badge: items.length },
    ]

    const isActive = (path: string) => {
        if (path === '/home') return pathname === '/home' || pathname === '/'
        return pathname?.startsWith(path)
    }

    return (
        <Box
            component="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: { xs: 'none', md: 'block' },
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ 
                    height: 80, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                }}>
                    {/* Logo */}
                    <Typography
                        variant="h2"
                        component={Link}
                        href="/home"
                        sx={{
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Everest
                    </Typography>

                    {/* Navigation */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.path)
                            
                            return (
                                <Box
                                    key={item.path}
                                    component={Link}
                                    href={item.path}
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 2.5,
                                        py: 1.5,
                                        borderRadius: 3,
                                        textDecoration: 'none',
                                        color: active ? 'primary.main' : 'text.secondary',
                                        bgcolor: active ? 'rgba(244, 162, 97, 0.1)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: active ? 'rgba(244, 162, 97, 0.3)' : 'transparent',
                                        fontWeight: active ? 700 : 500,
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'rgba(244, 162, 97, 0.08)',
                                            borderColor: 'rgba(244, 162, 97, 0.2)',
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                >
                                    <Badge 
                                        badgeContent={item.badge} 
                                        color="error"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.65rem',
                                                height: 16,
                                                minWidth: 16,
                                                fontWeight: 700,
                                            }
                                        }}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                    </Badge>
                                    <Typography 
                                        component="span" 
                                        sx={{ 
                                            fontSize: 'inherit', 
                                            fontWeight: 'inherit',
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            )
                        })}
                    </Stack>

                    {/* Settings */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LanguageToggle />
                        <DarkModeToggle />
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
