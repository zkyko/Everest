'use client'

import { Button, Typography } from '@mui/material'
import { Languages } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/languageStore'

export default function LanguageToggle() {
    const { lang, toggleLanguage } = useLanguageStore()

    return (
        <Button
            onClick={toggleLanguage}
            aria-label={lang === 'en' ? 'Switch to Nepali' : 'Switch to English'}
            startIcon={<Languages size={18} />}
            sx={{
                borderRadius: '50px',
                px: 2,
                py: 0.5,
                minWidth: 'auto',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'text.secondary',
                },
            }}
        >
            <Typography variant="caption" sx={{ fontWeight: 700, ml: 0.5 }}>
                {lang === 'en' ? 'नेपाली' : 'EN'}
            </Typography>
        </Button>
    )
}
