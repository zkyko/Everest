'use client'

import { Box, Container, Typography, Stack, Badge } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Utensils, ShoppingBag } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
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
                    <Link href="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: 60,
                                width: 140,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <Image
                                src="/hero-background.png"
                                alt="Everest Food Truck"
                                fill
                                sizes="140px"
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </Box>
                    </Link>

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
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
