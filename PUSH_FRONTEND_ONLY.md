# Push Frontend Only to GitHub

## Quick Commands

```bash
# Make sure you're in the Everest directory
cd C:\Users\nisc-\Desktop\Everest

# Add only frontend files (backend is excluded in .gitignore)
git add .

# Commit
git commit -m "Frontend only: Everest Food Truck Ordering System"

# Add remote (if not already added)
git remote add origin https://github.com/zkyko/Everest.git

# Or update existing remote
git remote set-url origin https://github.com/zkyko/Everest.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## What's Excluded

- ✅ Backend folder (excluded in .gitignore)
- ✅ GitHub Actions workflow (removed for now)
- ✅ node_modules and build artifacts

## What's Included

- ✅ Complete Next.js frontend
- ✅ All pages and components
- ✅ Order status tracking with progression
- ✅ Admin dashboard with info popups
- ✅ Dummy data for demo
- ✅ README and documentation

## Note

GitHub Actions is disabled for now. You can enable it later in repository settings if needed.

