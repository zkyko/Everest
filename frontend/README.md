# Everest Food Truck - Next.js Frontend

A modern, production-ready Next.js application for the Everest Food Truck ordering system.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── home/              # Home page
│   ├── menu/              # Menu page
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   ├── order-status/      # Order status page
│   ├── admin/             # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and stores
│   ├── api.ts            # API client
│   └── store.ts          # Zustand stores
└── public/               # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The `vercel.json` is already configured.

### Manual Deployment

```bash
npm run build
npm start
```

## Features

- ✅ Customer ordering flow
- ✅ Admin dashboard
- ✅ Real-time order status
- ✅ Stripe integration
- ✅ Mobile-first design
- ✅ TypeScript support
- ✅ Server-side rendering ready
