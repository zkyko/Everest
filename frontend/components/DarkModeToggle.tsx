'use client'

import { IconButton, Tooltip } from '@mui/material'
import { Moon, Sun } from 'lucide-react'
import { useThemeMode } from '@/lib/theme-context'

export default function DarkModeToggle() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </IconButton>
    </Tooltip>
  )
}


