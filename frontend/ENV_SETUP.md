# Environment Variables Setup

This guide explains all environment variables needed for the Everest Food Truck app.

## 📋 Required Environment Variables

### For Local Development

Create a `.env.local` file in the `frontend/` directory with these variables:

```env
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

### For Vercel Deployment

Add these in **Vercel Dashboard → Settings → Environment Variables**:

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add each variable (see below for where to get values)

## 🔑 Where to Get Each Value

### Supabase Variables

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings → API**

**NEXT_PUBLIC_SUPABASE_URL:**
- Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)

**NEXT_PUBLIC_SUPABASE_ANON_KEY:**
- Copy **anon public** key (starts with `eyJhbGc...`)
- This is safe to expose in the browser

**SUPABASE_URL:**
- Same as `NEXT_PUBLIC_SUPABASE_URL` (your project URL)

**SUPABASE_SERVICE_ROLE_KEY:**
- Copy **service_role** key (starts with `eyJhbGc...`)
- ⚠️ **KEEP THIS SECRET!** Never expose in browser
- Only use in API routes (server-side)

### Stripe Variables

1. Go to https://dashboard.stripe.com/test/apikeys
2. Make sure you're in **Test mode**

**STRIPE_SECRET_KEY:**
- Copy **Secret key** (starts with `sk_test_...`)
- ⚠️ **KEEP THIS SECRET!** Never expose in browser

**STRIPE_WEBHOOK_SECRET:**
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. Set endpoint URL: `https://your-vercel-app.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
5. After creating, copy the **Signing secret** (starts with `whsec_...`)

### JWT Secret

Generate a secure random string (minimum 32 characters):

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**Using Python:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

## 🔒 Security Notes

### Public Variables (NEXT_PUBLIC_*)
- Safe to expose in browser
- Included in client-side JavaScript bundle
- Can be seen in browser DevTools

### Private Variables (No NEXT_PUBLIC_ prefix)
- ⚠️ **NEVER expose in browser**
- Only available in API routes (server-side)
- Keep these secret!

## 📝 Quick Setup Checklist

- [ ] Created Supabase project
- [ ] Got Supabase URL and keys
- [ ] Got Stripe test keys
- [ ] Set up Stripe webhook endpoint
- [ ] Generated JWT_SECRET
- [ ] Created `.env.local` for local development
- [ ] Added variables to Vercel dashboard

## 🧪 Testing Locally

1. Copy `.env.example` to `.env.local`:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Run development server:
   ```bash
   npm run dev
   ```

4. Test API routes:
   - http://localhost:3000/api/menu
   - http://localhost:3000/api/orders (POST)

## 🚀 Deploying to Vercel

1. Push code to GitHub
2. In Vercel dashboard, add all environment variables
3. Vercel will automatically redeploy
4. Test your deployed app

## ❓ Troubleshooting

**"Supabase client not initialized"**
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify values are correct (no extra spaces)

**"Stripe webhook verification failed"**
- Check `STRIPE_WEBHOOK_SECRET` matches the one in Stripe dashboard
- Verify webhook endpoint URL in Stripe matches your Vercel URL

**"Unauthorized" on admin routes**
- Check `JWT_SECRET` is set
- Verify token is being sent in Authorization header

**Build fails with "Module not found"**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

