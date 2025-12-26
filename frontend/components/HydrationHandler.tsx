'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/store'

export default function HydrationHandler() {
  const { items } = useCartStore()
  const { isAdmin } = useAuthStore()

  useEffect(() => {
    // Hydrate stores after client-side mount
    useCartStore.persist.rehydrate()
    useAuthStore.persist.rehydrate()
  }, [])

  return null
}

