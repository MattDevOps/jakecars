# Deploy to GitHub Pages - Quick Guide

Your repository is already set up at: https://github.com/MattDevOps/jakecars

## Steps to Deploy:

### 1. Add and commit your files:

```bash
git add index.html README.md .gitignore
git commit -m "Add car comparison website for GitHub Pages"
git push origin master
```

### 2. Enable GitHub Pages:

1. Go to: https://github.com/MattDevOps/jakecars/settings/pages
2. Under "Source", select:
   - Branch: `master` (or `main` if that's your default)
   - Folder: `/ (root)`
3. Click "Save"

### 3. Your site will be live at:

**https://mattdevops.github.io/jakecars/**

(It may take 1-2 minutes to deploy)

## Alternative: Use Netlify (Even Easier!)

If you prefer, you can also use Netlify:

1. Go to https://app.netlify.com/drop
2. Drag and drop your `index.html` file
3. Done! You'll get an instant URL

## Updating Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Update website"
git push origin master
```

GitHub Pages will automatically update your site within 1-2 minutes!
