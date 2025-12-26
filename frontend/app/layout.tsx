import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import MUIThemeProvider from '@/lib/mui-theme-provider'
import HydrationHandler from '@/components/HydrationHandler'

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
            {children}
          </ToastProvider>
        </MUIThemeProvider>
      </body>
    </html>
  )
}

