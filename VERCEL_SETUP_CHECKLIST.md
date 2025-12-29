# Vercel Deployment Checklist

Quick checklist to ensure your project is ready for Vercel deployment.

## ✅ Pre-Deployment Checklist

### 1. Vercel Project Configuration

- [ ] Repository connected to Vercel
- [ ] **Root Directory** set to `frontend` in Vercel project settings
- [ ] Framework preset: Next.js (auto-detected)

### 2. Environment Variables

Add these in **Vercel Dashboard → Settings → Environment Variables**:

- [ ] `NEXT_PUBLIC_API_URL` = Your backend API URL (e.g., `https://your-backend.com/api`)
  - **Important**: Must include `/api` at the end
  - **Important**: Must start with `NEXT_PUBLIC_` to be available in browser
  - Use HTTPS in production

**Note**: Stripe keys are configured on the backend, not in Vercel. See `ENVIRONMENT_VARIABLES.md` for backend setup.

### 3. Backend CORS Configuration

Ensure your backend allows requests from your Vercel domain:

- [ ] Add Vercel domain to `CORS_ORIGINS` in backend:
  ```
  CORS_ORIGINS=https://your-project.vercel.app,https://yourdomain.com
  ```

### 4. Code Verification

- [ ] `next.config.js` - No static export (removed for Vercel)
- [ ] `vercel.json` - Configured correctly
- [ ] `.vercelignore` - Excludes backend files
- [ ] Build works locally: `cd frontend && npm run build`

### 5. Test Locally

```bash
cd frontend
npm install
npm run build
npm start
```

If this works, Vercel deployment should work too.

## 🚀 Deployment Steps

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

2. **Deploy in Vercel**
   - Go to Vercel dashboard
   - Click "Deploy" or wait for automatic deployment
   - Monitor build logs

3. **Verify Deployment**
   - Check build succeeded
   - Visit your Vercel URL
   - Test API connections
   - Check browser console for errors

## 🔧 Common Issues

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check TypeScript errors

### API Not Working
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is accessible via HTTPS
- Check browser console for errors

### Images Not Loading
- Add image domains to `next.config.js` if using external images
- Vercel optimizes images automatically

## 📝 Quick Reference

**Environment Variable Format:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

**Backend CORS Example:**
```python
CORS_ORIGINS=https://your-project.vercel.app,https://yourdomain.com
```

**Vercel Project Settings:**
- Root Directory: `frontend`
- Framework: Next.js
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)

## 🎯 Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure preview deployments
3. Set up monitoring/analytics
4. Configure backend webhooks to point to production frontend URL

