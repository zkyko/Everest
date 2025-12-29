# Quick Start Guide - Next.js + Supabase

## 🚀 Get Started in 5 Steps

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `everest-food-truck`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Wait 2-3 minutes for setup

### Step 2: Set Up Database (2 minutes)

1. In Supabase dashboard → **SQL Editor**
2. Open `SUPABASE_SCHEMA.sql` from this repo
3. Copy entire SQL and paste
4. Click **Run** ✅

### Step 3: Get Credentials (1 minute)

1. **Settings → API**:
   - Copy **Project URL**
   - Copy **anon public** key
   - Copy **service_role** key (keep secret!)

2. **Settings → Database**:
   - Copy **Connection string** (URI)

### Step 4: Create Admin User (1 minute)

Run this in Supabase SQL Editor (replace hash with bcrypt hash of "admin123"):

```sql
INSERT INTO admin_users (email, password_hash) VALUES
  ('admin@everest.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING;
```

Or generate hash at: https://bcrypt-generator.com/

### Step 5: Add Environment Variables

**For Local Development** (`frontend/.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-secret-key-min-32-chars
```

**For Vercel** (Dashboard → Settings → Environment Variables):

Add the same variables above.

## ✅ Test Locally

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

## 📝 Next Steps

1. Add menu items in Supabase Table Editor
2. Test ordering flow
3. Deploy to Vercel
4. Set up Stripe webhook endpoint

## 🆘 Troubleshooting

**"Supabase client not initialized"**
→ Check environment variables are set correctly

**"Unauthorized" on admin routes**
→ Verify JWT token is being sent in Authorization header

**Database errors**
→ Make sure you ran `SUPABASE_SCHEMA.sql` successfully

## 📚 Full Documentation

See `MIGRATION_TO_SUPABASE.md` for detailed information.

