# 🏔️ Everest Food Truck — Modern Online Ordering System

**Production-ready food truck ordering platform** built with Next.js, Supabase, and Stripe. Customers can browse the menu, place orders, make secure payments, and track their orders in real-time.

> **Current Status**: Deployed on Vercel | Database on Supabase | Payments via Stripe  
> **Architecture**: Simplified from multi-tenant SaaS to single-tenant for production focus

---

## 🎯 What This Is

A complete, working online ordering system for **Everest Food Truck** in Austin, TX. This is not a demo or prototype—it's a production application with:

- ✅ Real Stripe payments
- ✅ Real-time order tracking
- ✅ Admin kitchen management
- ✅ Mobile-first responsive design
- ✅ Bilingual support (English/Nepali)
- ✅ Live deployment on Vercel

---

## 🏗️ Current Architecture

**Migration Complete**: Transitioned from Docker + FastAPI backend to serverless Next.js API routes.

```
Customer (Web/Mobile)
        ↓
Next.js Frontend (Vercel)
        ↓
Next.js API Routes (/app/api/*)
        ↓
Supabase PostgreSQL
        ↓
Stripe Checkout → Webhooks
        ↓
Admin Dashboard (Real-time)
```

### Key Design Decisions

1. **Monolithic Next.js App**: All frontend + API logic in one deployment
2. **Supabase**: Managed PostgreSQL (no database ops)
3. **Vercel**: Zero-config deployment with edge functions
4. **Stripe**: Secure checkout sessions + webhook-based order confirmation

---

## 🧱 Tech Stack

| Layer               | Technology                                   |
| ------------------- | -------------------------------------------- |
| **Frontend**        | Next.js 14 (App Router), React 18            |
| **Styling**         | Material-UI (MUI) v5, Tailwind CSS           |
| **State Management**| Zustand (cart, language, theme)              |
| **API Layer**       | Next.js API Routes (serverless functions)    |
| **Database**        | Supabase (PostgreSQL 15)                     |
| **Payments**        | Stripe Checkout + Webhooks                   |
| **Auth**            | JWT (admin-only, custom implementation)      |
| **Deployment**      | Vercel (production)                          |
| **Languages**       | TypeScript (frontend), Node.js (API routes)  |

---

## ✨ Features

### Customer Experience (No Login Required)

- 🍜 **Browse Menu**: Categories, items with descriptions, prices
- 🛒 **Shopping Cart**: Add items with quantity and modifiers
- 💳 **Secure Checkout**: Stripe-hosted payment (PCI compliant)
- 📱 **Order Tracking**: Real-time status updates (NEW → PREP → READY → COMPLETED)
- 🌐 **Bilingual**: Switch between English and Nepali
- 🌙 **Dark Mode**: Light/dark theme toggle
- ⏱️ **Wait Time Indicator**: Real-time kitchen load visibility

### Admin Dashboard (Login Required)

- 📦 **Order Management**: View all orders, update status
- 📋 **Menu Management**: Add/edit items, mark sold out
- 💰 **Payment Tracking**: View payment status
- 📊 **Kitchen Metrics**: Order volume and activity
- 🔄 **Auto-refresh**: Dashboard polls for new orders every 10s

### System Features

- 🔒 **Order Snapshotting**: Prices/items locked at order time
- 🔔 **Webhook-based Updates**: Stripe payment confirmation
- 📲 **Mobile-first Design**: Optimized for phones, scales to desktop
- ⚡ **Real-time Sync**: Client polls order status every 3s
- 🎨 **Modern UI**: Gradient accents, smooth animations, responsive nav

---

## 📦 Project Structure

```
Everest-1/
├── frontend/                      # Next.js application
│   ├── app/                       # App Router pages
│   │   ├── api/                   # API routes (serverless functions)
│   │   │   ├── orders/           # Order creation & tracking
│   │   │   ├── checkout/         # Stripe checkout session
│   │   │   ├── webhooks/         # Stripe webhook handler
│   │   │   └── admin/            # Admin endpoints (auth, orders, menu)
│   │   ├── home/                 # Landing page
│   │   ├── menu/                 # Menu browsing
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout form
│   │   ├── order-status/         # Order tracking
│   │   ├── admin/                # Admin dashboard
│   │   └── login/                # Admin login
│   ├── components/               # React components
│   │   ├── Header.tsx           # Desktop navigation
│   │   ├── BottomNav.tsx        # Mobile navigation
│   │   ├── MenuItemModal.tsx    # Item detail modal
│   │   └── OrderDetailModal.tsx # Admin order detail
│   ├── lib/                      # Utilities & clients
│   │   ├── api.ts               # Axios client
│   │   ├── supabase.ts          # Supabase client
│   │   ├── stripe.ts            # Stripe client
│   │   ├── auth.ts              # JWT utilities
│   │   ├── theme.ts             # MUI theme config
│   │   ├── store.ts             # Zustand stores (cart)
│   │   └── translations.ts      # i18n strings
│   └── package.json
├── SUPABASE_SCHEMA.sql           # Database schema
├── ORDER_FLOW.md                 # Order sync documentation
├── MIGRATION_TO_SUPABASE.md      # Migration guide
└── README.md                     # This file
```

---

## 🗄️ Database Schema

**Managed by Supabase** — SQL schema in `SUPABASE_SCHEMA.sql`

### Core Tables

| Table                    | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `orders`                 | Order records with status tracking           |
| `order_items`            | Line items (snapshotted from menu)           |
| `order_item_modifiers`   | Modifiers (e.g., spice level, extras)        |
| `menu_categories`        | Categories (Appetizers, Mains, etc.)         |
| `menu_items`             | Menu items with prices                       |
| `modifier_groups`        | Modifier groups (e.g., Spice Level)          |
| `modifier_options`       | Individual options (Mild, Hot, etc.)         |
| `payments`               | Stripe payment records                       |
| `admin_users`            | Admin login credentials (hashed)             |

**Key Design**: Menu items are **snapshotted** into orders to preserve historical accuracy.

---

## 🔄 Order Flow

### 1. Customer Places Order

```
Menu → Cart → Checkout Form → Stripe Checkout → Order Created (status: NEW)
```

### 2. Admin Sees Order

- Admin dashboard polls `/api/admin/orders` every 10 seconds
- New orders appear automatically

### 3. Admin Updates Status

```
NEW → PREP → READY → COMPLETED
```

Admin clicks status dropdown → API updates order → Client sees change within 3 seconds

### 4. Customer Tracks Order

- Client polls `/api/orders/[orderId]` every 3 seconds
- Visual stepper shows current status
- Updates automatically when admin changes status

**See `ORDER_FLOW.md` for detailed flow documentation.**

---

## 🚀 Deployment

### Current Production Setup

- **Frontend**: https://everest-foodtruck.vercel.app (Vercel)
- **Database**: Supabase (managed PostgreSQL)
- **Payments**: Stripe (sandbox/production mode)

### Environment Variables (Vercel)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth
SECRET_KEY=your-32-character-secret-key
```

### Deployment Process

1. Push to GitHub (main branch)
2. Vercel auto-deploys
3. Environment variables managed in Vercel dashboard
4. Database migrations run manually in Supabase SQL editor

---

## 🧪 Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Setup

```bash
# Clone repository
git clone https://github.com/zkyko/Everest.git
cd Everest-1/frontend

# Install dependencies
npm install

# Create .env file (see frontend/.env.example)
cp .env.example .env

# Run development server
npm run dev

# Open http://localhost:3000
```

### Database Setup

1. Create Supabase project
2. Copy SQL from `SUPABASE_SCHEMA.sql`
3. Run in Supabase SQL Editor
4. Update `.env` with Supabase credentials

### Stripe Setup (Local Webhooks)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret to .env
```

---

## 🔐 Authentication

### Customer (Public)

- No login required
- Orders identified by order ID
- Payment handled by Stripe (PCI compliant)

### Admin

- Login: `/login`
- Credentials stored in `admin_users` table (bcrypt hashed)
- JWT token issued on login
- Token includes: `user_id`, `role`, `exp`
- All `/api/admin/*` routes require valid token

**Default Admin** (change in production!):
- Email: `admin@everest.com`
- Password: `admin123`

---

## 🌍 Internationalization

Currently supports:
- **English** (en)
- **Nepali** (ne)

Translations stored in `frontend/lib/translations.ts`

User preference persists in localStorage.

---

## 🎨 UI/UX Design

### Design System

- **Primary Color**: Orange (`#F4A261`)
- **Secondary Color**: Terracotta (`#E76F51`)
- **Typography**: Inter (Google Fonts)
- **Spacing**: 8px base unit
- **Border Radius**: 8-16px (rounded corners)

### Navigation

- **Desktop**: Header with gradient logo, icon pills, cart badge
- **Mobile**: Bottom navigation with settings drawer
- **Responsive**: `xs` breakpoint at 600px

### Animations

- Framer Motion for page transitions
- Spring animations on buttons
- Smooth hover effects
- Loading states with spinners

---

## 📱 Mobile Optimization

**Mobile-first approach**:
- Bottom navigation (not header) on phones
- Large touch targets (48px minimum)
- Swipeable modals
- Settings in drawer (not header)
- Cart badge on nav icon
- Safe area support (iOS notch)

**Desktop enhancements**:
- Full header with all controls
- Wider content (max 1200px)
- Hover states
- Multi-column layouts

---

## 🔧 API Endpoints

### Public Routes

| Method | Endpoint                   | Purpose                      |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/api/menu`               | Fetch menu with categories   |
| POST   | `/api/orders`             | Create new order             |
| GET    | `/api/orders/[orderId]`   | Get order status             |
| POST   | `/api/checkout`           | Create Stripe session        |
| POST   | `/api/webhooks/stripe`    | Handle Stripe events         |
| GET    | `/api/metrics/volume`     | Kitchen activity level       |

### Admin Routes (Auth Required)

| Method | Endpoint                           | Purpose                      |
| ------ | ---------------------------------- | ---------------------------- |
| POST   | `/api/admin/auth`                 | Admin login                  |
| GET    | `/api/admin/orders`               | List all orders              |
| POST   | `/api/admin/orders/[id]/status`   | Update order status          |
| GET    | `/api/admin/menu`                 | List menu items              |
| POST   | `/api/admin/menu`                 | Create menu item             |
| PATCH  | `/api/admin/menu/[id]`            | Update menu item             |

---

## 📈 Recent Changes (Migration History)

### December 2024 - Major Architecture Simplification

**Removed**:
- ❌ Docker (docker-compose, Dockerfiles)
- ❌ FastAPI backend (Python)
- ❌ PostgreSQL container
- ❌ Multi-tenant architecture
- ❌ VPS deployment scripts

**Added**:
- ✅ Supabase (managed PostgreSQL)
- ✅ Next.js API routes (replaced FastAPI)
- ✅ Vercel deployment
- ✅ Serverless architecture
- ✅ Cart item badges on navigation
- ✅ Enhanced mobile navigation with settings drawer
- ✅ Modern gradient UI design

**Why**: Simplified deployment, reduced ops overhead, faster iteration.

---

## 🐛 Known Issues

### Current Bugs

1. **Dynamic Route Warning**: API routes need `export const dynamic = 'force-dynamic'`
2. **Supabase Key Validation**: Environment variables must be set correctly in Vercel

### Workarounds in Place

- Dummy data fallback in admin dashboard (if API fails)
- Order simulation in tracking page (if order not found)
- Error boundaries for graceful degradation

---

## 🔮 Future Enhancements

### Short-term (Next Sprint)

- [ ] Push notifications (when order ready)
- [ ] SMS alerts via Twilio
- [ ] Order history for customers
- [ ] Receipt generation (PDF)
- [ ] Inventory tracking

### Long-term (Product Roadmap)

- [ ] Multiple locations support
- [ ] Delivery integration (DoorDash, Uber Eats)
- [ ] Loyalty program
- [ ] Analytics dashboard
- [ ] Mobile apps (React Native)
- [ ] Multi-tenant SaaS (reintroduce)

---

## 📚 Documentation

- **`ORDER_FLOW.md`**: Detailed order lifecycle documentation
- **`MIGRATION_TO_SUPABASE.md`**: Migration guide from FastAPI
- **`SUPABASE_SCHEMA.sql`**: Complete database schema
- **`QUICK_START.md`**: Fast setup guide
- **`VERCEL_DEPLOYMENT.md`**: Vercel deployment checklist

---

## 🤝 Contributing

This is a working production system. If you want to contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Private project — not open source.

---

## 👤 Author

**Everest Food Truck Team**  
Austin, TX

Built with Cursor AI, Next.js, and ☕

---

## 🆘 Troubleshooting

### Build Fails on Vercel

**Error**: `Dynamic server usage: Route couldn't be rendered statically`  
**Fix**: Add `export const dynamic = 'force-dynamic'` to all API route files

### Supabase Connection Fails

**Error**: `Invalid API key`  
**Fix**: 
1. Check environment variables in Vercel
2. Verify keys in Supabase dashboard → Settings → API
3. Ensure `NEXT_PUBLIC_` prefix for client-side keys

### Stripe Webhook Not Working

**Error**: Webhook signature verification failed  
**Fix**:
1. Get webhook secret from Stripe Dashboard → Developers → Webhooks
2. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
3. Redeploy

### Order Status Not Updating

**Check**:
1. Admin token is valid (login again)
2. Status values match backend (`NEW`, `PREP`, `READY`, `COMPLETED`)
3. Network tab shows successful API calls
4. Supabase table has correct status

---

## 📞 Support

For issues or questions:
- Open GitHub issue
- Contact: support@everestfoodtruck.com (if available)

---

**Last Updated**: December 28, 2024  
**Current Version**: 2.0 (Supabase + Vercel)  
**Status**: ✅ Production Deployed
