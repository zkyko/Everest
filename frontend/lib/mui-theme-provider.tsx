'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeModeProvider } from './theme-context'

export default function MUIThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeModeProvider>
      <CssBaseline />
      {children}
    </ThemeModeProvider>
  )
}

