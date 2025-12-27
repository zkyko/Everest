# Enable GitHub Pages - Step by Step

## After Pushing the Code

1. **Go to your repository**: https://github.com/zkyko/Everest

2. **Enable GitHub Pages**:
   - Click **Settings** (top menu)
   - Scroll down to **Pages** (left sidebar)
   - Under **Source**, select **GitHub Actions**
   - Save

3. **Check GitHub Actions**:
   - Click **Actions** tab
   - You should see "Deploy to GitHub Pages" workflow running
   - Wait for it to complete (usually 2-3 minutes)

4. **Access Your Site**:
   - Once deployment completes, your site will be at:
   - **https://zkyko.github.io/Everest/**

## If Workflow Fails

1. Check the Actions tab for error messages
2. Common issues:
   - Node version mismatch (should be 18+)
   - Missing dependencies (run `npm install` locally first)
   - Build errors (check the build log)

## Manual Deployment (Alternative)

If GitHub Actions doesn't work:

1. Build locally:
```bash
cd frontend
npm install
npm run build
```

2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Branch: `gh-pages`
5. Folder: `/frontend/out`

Then push the `out` folder to a `gh-pages` branch.


