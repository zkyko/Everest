# ✅ Supabase API Key Fix Deployed

## What Was Fixed

The **"Invalid API key"** 500 errors were caused by using a single Supabase client with fallback logic that could result in `undefined` keys.

## Changes Made

### ✅ Created Two Separate Clients

**1. `frontend/lib/supabase-public.ts`** (Public/Anon Key)
- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Safe for browser and public API routes
- **Used in:**
  - `/api/menu` (fetch menu items)
  - `/api/orders/[orderId]` (customer order status)

**2. `frontend/lib/supabase-admin.ts`** (Service Role Key)
- Uses `SUPABASE_SERVICE_ROLE_KEY`
- Server-side only, bypasses RLS
- **Used in:**
  - `/api/admin/*` (all admin routes)
  - `/api/orders` (create orders)
  - `/api/checkout` (payment processing)
  - `/api/metrics/volume` (kitchen metrics)
  - `/api/webhooks/stripe` (Stripe webhooks)

### ✅ Updated All API Routes

Every API route now explicitly imports the correct client:
- ✅ 10 routes updated
- ✅ Safety logging added (logs missing keys to Vercel Function logs)

---

## 🚨 REQUIRED: Verify Vercel Environment Variables

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

### Required Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
```

### Where to Find These Values

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** (gear icon) → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon** **public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (⚠️ secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Add to Vercel

1. Paste each variable in Vercel
2. Make sure they're enabled for **Production**, **Preview**, **Development**
3. **DO NOT** add quotes around the values

---

## 🔄 Redeploy

Vercel will auto-deploy from the GitHub push. If not:

1. Go to **Deployments** tab
2. Click **3 dots** on latest deployment → **Redeploy**

---

## ✅ Verification

After redeployment, check:

1. **No more 500 errors** on `/api/menu`, `/api/metrics/volume`, etc.
2. **Vercel Function Logs** (if errors persist):
   - Go to **Deployment** → **Functions** tab
   - Look for console logs showing which keys are missing

### Expected Log Output (if keys exist)

No error logs should appear. The safety checks will only log if a key is undefined.

### What to Do If Errors Persist

1. **Check Function Logs** for the exact error
2. **Verify env var names** match exactly:
   - `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_SERVICE_KEY`)
3. **Redeploy** after fixing env vars

---

## 📋 Summary

| Route | Client Used | Key Type |
|-------|-------------|----------|
| `/api/menu` | `supabasePublic` | Anon Key |
| `/api/orders/[orderId]` | `supabasePublic` | Anon Key |
| `/api/admin/*` | `supabaseAdmin` | Service Role |
| `/api/orders` (POST) | `supabaseAdmin` | Service Role |
| `/api/checkout` | `supabaseAdmin` | Service Role |
| `/api/metrics/volume` | `supabaseAdmin` | Service Role |
| `/api/webhooks/stripe` | `supabaseAdmin` | Service Role |

---

**Commit:** `462e181`  
**Status:** ✅ Pushed to GitHub, awaiting Vercel deployment

