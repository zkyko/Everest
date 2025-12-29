'use client'

import { Box, Container, Typography, Stack, Button } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageToggle from './LanguageToggle'
import DarkModeToggle from './DarkModeToggle'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

export default function Header() {
    const pathname = usePathname()
    const { lang } = useLanguageStore()
    const t = translations[lang].nav

    const navItems = [
        { path: '/home', label: t.home },
        { path: '/menu', label: t.menu },
        { path: '/cart', label: t.cart },
    ]

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
                display: { xs: 'none', md: 'block' }, // Show only on desktop
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Typography
                            variant="h2"
                            component={Link}
                            href="/home"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            Everest
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            {navItems.map((item) => (
                                <Typography
                                    key={item.path}
                                    component={Link}
                                    href={item.path}
                                    sx={{
                                        textDecoration: 'none',
                                        color: pathname === item.path ? 'primary.main' : 'text.secondary',
                                        fontWeight: pathname === item.path ? 700 : 500,
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s ease',
                                        '&:hover': { color: 'primary.main' },
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LanguageToggle />
                        <DarkModeToggle />
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
