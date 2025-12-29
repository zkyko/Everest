# Environment Variables Reference

This document lists all environment variables needed for deployment.

## Frontend (Vercel)

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://your-backend.com/api` | Must include `/api` at the end |

**Add in Vercel Dashboard → Settings → Environment Variables**

## Backend (Your Hosting Platform)

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://user:pass@host:5432/dbname` | Use `postgresql+asyncpg://` driver |
| | **Supabase**: | `postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres` | See `SUPABASE_SETUP.md` |
| | **Local**: | `postgresql+asyncpg://user:pass@localhost:5432/dbname` | For local development |
| `SECRET_KEY` | JWT secret key | `your-secret-key-min-32-chars` | Generate secure random string |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` | See below |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` | See below |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` | Get from Stripe Dashboard |

### Optional Variables

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `ALGORITHM` | JWT algorithm | `HS256` | Usually don't change |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiry | `30` | Token lifetime in minutes |
| `CORS_ORIGINS` | Allowed CORS origins | `*` | Comma-separated list for production |
| `ENVIRONMENT` | Environment name | `development` | `development` or `production` |

## Stripe Test Keys (Sandbox)

### Getting Your Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)
4. Add them to your `.env` file or hosting platform environment variables

**⚠️ Never commit API keys to git!** Always use environment variables.

**Webhook Secret:** ⚠️ **You need to set this up** (see below)

### Setting Up Stripe Webhook Secret

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks
2. **Add Endpoint**: Click "Add endpoint"
3. **Endpoint URL**: `https://your-backend-url.com/api/webhooks/stripe`
4. **Events to listen to**: Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. **Copy Signing Secret**: After creating, copy the "Signing secret" (starts with `whsec_`)
6. **Add to Backend**: Set `STRIPE_WEBHOOK_SECRET` environment variable

## Quick Setup Guide

### For Vercel (Frontend)

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.com/api
   ```

### For Backend (Render/Railway/Fly.io/Supabase)

1. Go to your backend hosting platform
2. Add environment variables:
   ```
   # For Supabase (recommended):
   DATABASE_URL = postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres
   
   # Or for local/other PostgreSQL:
   DATABASE_URL = postgresql+asyncpg://user:pass@host:5432/dbname
   
   SECRET_KEY = (generate secure random string)
   STRIPE_SECRET_KEY = sk_test_... (get from Stripe Dashboard)
   STRIPE_PUBLISHABLE_KEY = pk_test_... (get from Stripe Dashboard)
   STRIPE_WEBHOOK_SECRET = whsec_... (get from Stripe Dashboard)
   CORS_ORIGINS = https://your-vercel-app.vercel.app
   ENVIRONMENT = production
   ```

## Generating SECRET_KEY

For JWT authentication, generate a secure random key:

**Using Python:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to git
- Use different keys for test and production
- Rotate keys if they're exposed
- Use HTTPS in production
- Restrict CORS origins in production (don't use `*`)

## Testing Stripe

### Test Card Numbers

Use these in Stripe Checkout for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any:
- Future expiry date
- Any 3-digit CVC
- Any ZIP code

### Stripe Dashboard

- **Test Mode Dashboard**: https://dashboard.stripe.com/test
- **View Test Payments**: https://dashboard.stripe.com/test/payments
- **Webhooks**: https://dashboard.stripe.com/test/webhooks

