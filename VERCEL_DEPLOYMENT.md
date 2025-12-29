# Vercel Deployment Guide

This guide will help you deploy the Everest Food Truck frontend to Vercel.

## Prerequisites

- GitHub repository with your code
- Vercel account (free tier works)
- Backend API URL (where your FastAPI backend is hosted)

## Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 2: Configure Project Settings

### Root Directory

Since your frontend is in the `frontend/` subdirectory:

1. In project settings, go to **Settings → General**
2. Set **Root Directory** to `frontend`
3. Click **Save**

Alternatively, you can configure this during initial import by clicking **"Configure Project"** and setting the root directory.

### Framework Preset

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

## Step 3: Environment Variables

In **Settings → Environment Variables**, add:

### Required Variables

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
```

Replace `https://your-backend-api-url.com` with your actual backend API URL.

**Note**: Stripe API keys are configured on your backend server, not in Vercel. See `ENVIRONMENT_VARIABLES.md` for complete backend configuration including your Stripe test keys.

### Example Backend URLs

- **Local development**: `http://localhost:8000/api`
- **Production**: `https://api.everestfoodtruck.com/api`
- **Render/Railway**: `https://everest-backend.onrender.com/api`
- **Fly.io**: `https://everest-backend.fly.dev/api`

### Environment-Specific Variables

You can set different values for:
- **Production**: Your production backend URL
- **Preview**: Your staging/development backend URL
- **Development**: `http://localhost:8000/api`

## Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build your Next.js app
   - Deploy to a global CDN
3. Your app will be live at: `https://your-project.vercel.app`

## Step 5: Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificates

## Environment Variables Reference

### `NEXT_PUBLIC_API_URL`

The base URL for your backend API. This should include the `/api` path.

**Important**: 
- Must start with `NEXT_PUBLIC_` to be available in the browser
- Should use HTTPS in production
- No trailing slash

**Examples**:
```
✅ NEXT_PUBLIC_API_URL=https://api.example.com/api
✅ NEXT_PUBLIC_API_URL=https://backend.railway.app/api
❌ NEXT_PUBLIC_API_URL=https://api.example.com/api/  (trailing slash)
❌ NEXT_PUBLIC_API_URL=http://api.example.com/api     (use HTTPS in production)
```

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Verify Node.js version**: Vercel uses Node 18+ by default
3. **Check for TypeScript errors**: Run `npm run build` locally first
4. **Verify dependencies**: Ensure `package.json` is correct

### API Calls Fail

1. **Check CORS settings** on your backend:
   - Add your Vercel domain to `CORS_ORIGINS`
   - Example: `CORS_ORIGINS=https://your-project.vercel.app,https://yourdomain.com`

2. **Verify environment variable**:
   - Check it's set in Vercel dashboard
   - Ensure it starts with `NEXT_PUBLIC_`
   - Redeploy after adding/changing variables

3. **Check network tab** in browser DevTools:
   - Look for CORS errors
   - Verify the API URL is correct

### Images Not Loading

- Next.js Image Optimization is enabled by default on Vercel
- If using external images, add domains to `next.config.js`:
  ```js
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-image-domain.com',
      },
    ],
  },
  ```

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main`/`master` branch
- **Preview**: Every push to other branches and pull requests

## Manual Deployment

You can trigger manual deployments:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on any deployment
3. Or use Vercel CLI: `vercel --prod`

## Vercel CLI (Optional)

Install Vercel CLI for local testing:

```bash
npm i -g vercel
vercel login
vercel dev  # Test locally with Vercel's environment
```

## Project Structure

Vercel will:
- Look for `package.json` in the root directory (or configured root)
- Run `npm install` (or your install command)
- Run `npm run build` (or your build command)
- Serve from `.next` directory

## Backend Deployment

This guide covers frontend deployment only. For backend:

- **Render**: https://render.com
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io
- **Heroku**: https://heroku.com

Make sure your backend:
- Has CORS configured for your Vercel domain
- Is accessible via HTTPS
- Has environment variables set correctly

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- Check build logs in Vercel dashboard for specific errors

