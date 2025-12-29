# Migration to Next.js API Routes + Supabase

This document explains the migration from FastAPI backend to Next.js API routes with Supabase.

## What Changed

### Before (FastAPI Backend)
- Separate Python/FastAPI backend server
- PostgreSQL database (local or hosted)
- Multi-tenant architecture
- Complex deployment (two services)

### After (Next.js + Supabase)
- All API logic in Next.js API routes
- Supabase for database (managed PostgreSQL)
- Single deployment (Vercel)
- Simplified architecture (single food truck)

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create new project: `everest-food-truck`
3. Save your database password
4. Wait 2-3 minutes for setup

### 2. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open `SUPABASE_SCHEMA.sql`
3. Copy and paste the entire SQL
4. Click **Run**

This creates all necessary tables.

### 3. Get Supabase Credentials

1. Go to **Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep secret!)

3. Go to **Settings → Database**
4. Copy **Connection string** (URI format)

### 4. Set Environment Variables in Vercel

Add these in **Vercel Dashboard → Settings → Environment Variables**:

```
# Supabase (Public - safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Supabase (Server-side - keep secret!)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT (for admin auth)
JWT_SECRET=your-secret-key-min-32-chars
```

### 5. Create Admin User

You need to create an admin user with a hashed password. Run this in Supabase SQL Editor:

```sql
-- Password: admin123
-- Hash it using: https://bcrypt-generator.com/ or Node.js
INSERT INTO admin_users (email, password_hash) VALUES
  ('admin@everest.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING;
```

Or use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
```

### 6. Seed Menu Data (Optional)

Add sample menu items in Supabase dashboard:
- Go to **Table Editor**
- Add categories and items manually
- Or use SQL INSERT statements

## API Routes Created

### Public Routes
- `GET /api/menu` - Get menu with categories and items
- `POST /api/orders` - Create new order
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/metrics/volume` - Get kitchen volume metrics

### Admin Routes
- `POST /api/admin/auth` - Admin login
- `GET /api/admin/orders` - List orders (requires auth)
- `PATCH /api/admin/orders?id=xxx` - Update order status (requires auth)
- `POST /api/admin/menu/item?id=xxx&action=soldout` - Mark item sold out (requires auth)

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhook

## What Was Removed

- `backend/` folder (no longer needed)
- Multi-tenant complexity
- Python/FastAPI dependencies
- Separate backend deployment

## Testing Locally

1. Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-secret-key
```

2. Run development server:
```bash
cd frontend
npm run dev
```

3. Test API routes:
- http://localhost:3000/api/menu
- http://localhost:3000/api/orders (POST)

## Deployment

1. Push code to GitHub
2. Vercel will auto-deploy
3. Add environment variables in Vercel dashboard
4. Test your deployed app

## Troubleshooting

### "Supabase client not initialized"
- Check environment variables are set
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "Stripe webhook verification failed"
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Verify webhook endpoint URL in Stripe dashboard

### "Unauthorized" on admin routes
- Check JWT token is being sent in Authorization header
- Verify `JWT_SECRET` matches the one used to sign tokens

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Add environment variables
4. ✅ Create admin user
5. ✅ Seed menu data
6. ✅ Test locally
7. ✅ Deploy to Vercel

