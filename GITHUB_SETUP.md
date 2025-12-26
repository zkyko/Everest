# GitHub Setup Instructions

## Initial Setup

1. **Initialize Git Repository** (if not already done):
```bash
git init
git branch -M main
```

2. **Add All Files**:
```bash
git add .
```

3. **Create Initial Commit**:
```bash
git commit -m "Initial commit: Everest Food Truck Ordering System"
```

4. **Add Remote Repository**:
```bash
git remote add origin https://github.com/zkyko/Everest.git
```

5. **Push to GitHub**:
```bash
git push -u origin main
```

## If Repository Already Exists

If you've already created the repository on GitHub:

```bash
git remote set-url origin https://github.com/zkyko/Everest.git
git push -u origin main
```

## GitHub Pages Deployment

The project is already configured for GitHub Pages:

1. **Enable GitHub Actions** in repository settings
2. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Source: "GitHub Actions"
   - The workflow will automatically deploy on every push to `main`

3. **Access Your Site**:
   - `https://zkyko.github.io/Everest/`

## Project Structure

```
Everest/
├── frontend/          # Next.js frontend (deployed to GitHub Pages)
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   └── lib/          # Utilities and stores
└── backend/          # FastAPI backend (optional)
```

## Notes

- The frontend is configured for static export
- Dummy data is included for demo purposes
- All admin pages have informational popups explaining the system
- Order status tracking includes automatic progression simulation

