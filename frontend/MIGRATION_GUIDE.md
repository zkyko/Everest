# Migration Guide: Vite React → Next.js

## What's Changed

### Project Structure
- **Old**: `src/pages/`, `src/components/`, `src/api/`
- **New**: `app/` (App Router), `components/`, `lib/`

### Routing
- **Old**: React Router (`/menu`, `/cart`)
- **New**: Next.js App Router (`app/menu/page.tsx`, `app/cart/page.tsx`)

### State Management
- **Old**: React useState + localStorage
- **New**: Zustand with persistence

### Styling
- **Old**: Custom CSS with CSS variables
- **New**: Tailwind CSS with utility classes

## Key Files Created

### Configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind configuration
- `vercel.json` - Vercel deployment config

### Core Files
- `app/layout.tsx` - Root layout with providers
- `app/globals.css` - Global styles with Tailwind
- `lib/api.ts` - API client (Axios)
- `lib/store.ts` - Zustand stores (cart, auth)

### Components
- `components/Toast.tsx` - Toast notification system
- `components/BottomNav.tsx` - Bottom navigation

### Pages
- `app/home/page.tsx` - Home page
- `app/menu/page.tsx` - Menu page
- `app/cart/page.tsx` - Cart page
- `app/checkout/page.tsx` - Checkout page
- `app/order-status/[orderId]/page.tsx` - Order status
- `app/admin/page.tsx` - Admin overview
- `app/admin/layout.tsx` - Admin sidebar layout

## Next Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Migrate Remaining Admin Pages**
   - Admin Orders (`app/admin/orders/page.tsx`)
   - Admin Payments (`app/admin/payments/page.tsx`)
   - Admin Integrations (`app/admin/integrations/page.tsx`)
   - Admin Settings (`app/admin/settings/page.tsx`)
   - Admin Menu (`app/admin/menu/page.tsx`)

5. **Deploy to Vercel**
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Deploy!

## Notes

- All pages are now client components (`'use client'`)
- API calls use the same backend endpoints
- Cart state persists using Zustand
- Toast notifications work the same way
- Admin layout uses Next.js nested layouts

