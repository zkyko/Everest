import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import MUIThemeProvider from '@/lib/mui-theme-provider'
import HydrationHandler from '@/components/HydrationHandler'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { Box } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Everest Food Truck - Authentic Nepalese Street Food',
  description: 'Order authentic Nepalese street food from Everest Food Truck in Austin, TX',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={inter.className} style={{ scrollBehavior: 'smooth' }}>
        <MUIThemeProvider>
          <ToastProvider>
            <HydrationHandler />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1, pb: { xs: 8, md: 0 } }}>
                {children}
              </Box>
              <BottomNav />
            </Box>
          </ToastProvider>
        </MUIThemeProvider>
      </body>
    </html>
  )
}

