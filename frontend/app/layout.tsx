import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Poppins } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import MUIThemeProvider from '@/lib/mui-theme-provider'
import HydrationHandler from '@/components/HydrationHandler'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { Box } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })
export const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas'
})
export const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Everest Food Truck - Taste that connects you to Nepal',
  description: 'Experience authentic Nepalese flavors from Everest Food Truck in Austin, TX. Taste that connects you to Nepal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={`${inter.className} ${bebasNeue.variable} ${poppins.variable}`} style={{ scrollBehavior: 'smooth' }}>
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

