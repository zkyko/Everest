import { ReactNode } from 'react'

export default function KitchenLayout({ children }: { children: ReactNode }) {
  // Bypass admin layout - render children directly without sidebar/header
  return <>{children}</>
}

