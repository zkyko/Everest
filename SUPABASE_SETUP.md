# Supabase Setup Guide

This guide will help you set up Supabase as your database for the Everest Food Truck backend.

## Why Supabase?

- **PostgreSQL Compatible**: Supabase uses PostgreSQL, so your existing code works without changes
- **Managed Database**: No need to set up or maintain PostgreSQL yourself
- **Free Tier**: Generous free tier for development
- **Easy Integration**: Simple connection string setup
- **Works with Vercel**: Perfect for serverless deployments

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `everest-food-truck` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to be created

## Step 2: Get Connection String

1. In your Supabase project, go to **Settings → Database**
2. Scroll down to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## Step 3: Convert to Async Connection String

Supabase provides a standard PostgreSQL connection string, but we need to convert it for asyncpg:

**Original Supabase string:**
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Convert to asyncpg format:**
```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Key changes:**
- Change `postgresql://` to `postgresql+asyncpg://`
- Replace `[YOUR-PASSWORD]` with your actual database password
- Keep everything else the same

## Step 4: Update Environment Variables

### For Local Development

Update `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

### For Production (Vercel/Render/etc.)

Add to your hosting platform's environment variables:

```
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

## Step 5: Run Migrations

After setting up the connection string, run your migrations:

```bash
cd backend
alembic upgrade head
```

This will create all your tables in Supabase.

## Step 6: Seed the Database

Run the seed script to create demo data:

```bash
python -m app.scripts.seed
```

This creates:
- Everest Food Truck tenant
- Admin user: `admin@everest.com` / `admin123`
- Sample menu items

## Connection Pooling (Optional but Recommended)

For production, Supabase recommends using connection pooling. Get the pooled connection string:

1. Go to **Settings → Database**
2. Find **"Connection pooling"** section
3. Copy the **"Session mode"** connection string
4. Use it the same way (with `postgresql+asyncpg://`)

**Pooled connection format:**
```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:6543/postgres
```

Note: Port changes from `5432` to `6543` for pooled connections.

## Security Best Practices

1. **Never commit passwords**: Keep `.env` files out of git
2. **Use environment variables**: Store connection strings in your hosting platform
3. **Rotate passwords**: Change database password if exposed
4. **Use connection pooling**: For production workloads
5. **Enable Row Level Security**: In Supabase dashboard (if needed)

## Supabase Dashboard Features

- **Table Editor**: View/edit data directly in Supabase dashboard
- **SQL Editor**: Run SQL queries
- **API Docs**: Auto-generated REST API (optional, you're using FastAPI)
- **Database Backups**: Automatic backups on paid plans

## Troubleshooting

### Connection Timeout

- Check your IP is allowed (Supabase allows all by default)
- Verify password is correct
- Check connection string format

### Migration Errors

- Ensure you're using the correct database password
- Check that migrations haven't been run already
- Verify connection string format

### SSL Connection Issues

Supabase requires SSL. If you get SSL errors, add `?sslmode=require`:

```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

## Free Tier Limits

Supabase free tier includes:
- 500 MB database storage
- 2 GB bandwidth
- Unlimited API requests
- Perfect for development and small projects

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Get connection string
3. ✅ Update `.env` file
4. ✅ Run migrations
5. ✅ Seed database
6. ✅ Deploy backend with Supabase connection string

Your backend is now ready to use Supabase! 🎉

