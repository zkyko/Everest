# Vercel Deployment Fix - Complete Checklist

## ✅ Step 1: API Routes Fixed (DONE)

All API routes now have `export const dynamic = 'force-dynamic'` at the top.

This tells Next.js to NOT pre-render these routes at build time.

**Routes updated:**
- ✅ `/api/admin/auth`
- ✅ `/api/admin/orders`
- ✅ `/api/admin/orders/[orderId]/status`
- ✅ `/api/admin/menu`
- ✅ `/api/webhooks/stripe`
- ✅ `/api/checkout`
- ✅ `/api/orders`
- ✅ `/api/orders/[orderId]`
- ✅ `/api/menu`
- ✅ `/api/metrics/volume`

---

## 🔧 Step 2: Verify Supabase Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Required Variables:

```bash
# Supabase (PUBLIC - client-side)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase (SECRET - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth
SECRET_KEY=your-32-character-secret-key-here
```

### ⚠️ CRITICAL: Check These

1. **`SUPABASE_SERVICE_ROLE_KEY`** must exist
   - ❌ NO `NEXT_PUBLIC_` prefix
   - ✅ Server-only
   - Find it: Supabase Dashboard → Settings → API → service_role key

2. **All variables must be set for ALL environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

3. **After adding/changing variables:**
   - Go to: Deployments tab
   - Click "..." on latest deployment
   - Click **"Redeploy"**
   - ⚠️ Environment variables don't apply retroactively!

---

## 🔍 Step 3: Verify Supabase Client Setup

Check that server-side code uses the correct key:

### ✅ Correct (Server-side - Admin APIs):

```typescript
// frontend/lib/supabase.ts
export function createServerClient() {
  const serverUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(serverUrl, serverKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
```

### ❌ Wrong (Don't do this on server):

```typescript
// DON'T use anon key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ❌ Wrong for server
)
```

---

## 📋 Step 4: How to Get Supabase Keys

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

---

## 🚀 Step 5: Redeploy on Vercel

After fixing environment variables:

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Find latest deployment
4. Click **"..."** menu
5. Click **"Redeploy"**
6. Wait for build to complete

---

## ✅ Expected Result

After these fixes, your build should:

1. ✅ Complete successfully
2. ✅ No "Dynamic server usage" errors
3. ✅ No "Invalid API key" errors
4. ✅ Admin login works
5. ✅ Orders load correctly
6. ✅ Menu displays properly

---

## 🐛 Still Having Issues?

### If you see "Invalid API key":

1. Double-check `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
2. Make sure it's the **service_role** key, not anon key
3. Verify it's set for **Production** environment
4. Redeploy after adding it

### If you see "Dynamic server usage":

1. Check that ALL API routes have `export const dynamic = 'force-dynamic'`
2. Make sure it's the FIRST line after any comments
3. Must be BEFORE imports

### If build succeeds but app doesn't work:

1. Check browser console for errors
2. Check Vercel logs: Dashboard → Deployments → Click deployment → Functions tab
3. Verify all environment variables are correct (no typos)

---

## 📚 Why This Happens

### Local Development:
- Everything runs dynamically
- No static optimization
- Works fine

### Vercel Production:
- Next.js tries to optimize everything
- API routes with `request.headers`, `request.body`, etc. can't be static
- Must explicitly opt-out with `force-dynamic`

**This is normal and expected for authenticated APIs!**

---

## 🎯 Summary

1. ✅ Added `force-dynamic` to all API routes (DONE - commit f1397ff)
2. ⏳ Verify Supabase environment variables in Vercel
3. ⏳ Redeploy on Vercel
4. ✅ Test the deployment

---

## 📞 Need Help?

If you're still stuck after following this checklist:

1. Check Vercel build logs for specific errors
2. Check Vercel function logs (Runtime Logs)
3. Verify Supabase project is active and accessible
4. Make sure database tables exist (run SUPABASE_SCHEMA.sql)
5. Populate menu data (run MENU_DATA.sql)

---

**Last Updated**: December 28, 2024  
**Commit**: f1397ff - All API routes now have force-dynamic

