import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  description?: string
  price: number
  is_available?: boolean
  cartId?: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, { ...item, cartId: Date.now() }] 
      })),
      removeItem: (index) => set((state) => ({
        items: state.items.filter((_, i) => i !== index)
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const items = get().items
        return items.reduce((sum, item) => sum + (item.price || 0), 0)
      }
    }),
    {
      name: 'everest-cart-storage',
      skipHydration: true, // Skip hydration for SSR compatibility
    }
  )
)

interface AuthStore {
  isAdmin: boolean
  setAdmin: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      setAdmin: (value) => set({ isAdmin: value })
    }),
    {
      name: 'everest-auth-storage',
      skipHydration: true, // Skip hydration for SSR compatibility
    }
  )
)
