# Push to GitHub - Quick Guide

## Step 1: Add and Commit Files

```bash
# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Everest Food Truck Ordering System with order tracking"
```

## Step 2: Connect to GitHub

```bash
# Add remote (if not already added)
git remote add origin https://github.com/zkyko/Everest.git

# Or if already exists, update it
git remote set-url origin https://github.com/zkyko/Everest.git
```

## Step 3: Push to GitHub

```bash
# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to https://github.com/zkyko/Everest
2. Click **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. Your site will be available at: `https://zkyko.github.io/Everest/`

## What's Included

✅ Complete frontend with Material UI
✅ Order status tracking with automatic progression
✅ Admin dashboard with informational popups
✅ Dummy data for demo
✅ GitHub Actions workflow for auto-deployment
✅ Responsive design with dark mode

