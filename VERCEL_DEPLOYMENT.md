# 🚀 Vercel Deployment Guide

This guide will help you deploy HealthScan to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. GitHub/GitLab/Bitbucket account (for connecting your repository)
3. Environment variables ready (see below)

## Step 1: Prepare Your Repository

1. **Commit all changes** to your repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Ensure your code is pushed** to GitHub/GitLab/Bitbucket

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your repository
4. Vercel will auto-detect Vite configuration
5. Configure environment variables (see Step 3)
6. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables

```env
# Gemini AI API Key (for ChatBot and report generation)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Google Fit OAuth (Optional - only if using Google Fit integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/auth/google/callback

# Session Secret (for secure sessions)
SESSION_SECRET=your_random_secret_string_here

# Frontend URL (for OAuth redirects)
FRONTEND_URL=https://your-domain.vercel.app
```

### How to Add Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `VITE_GEMINI_API_KEY`)
   - **Value**: Variable value
   - **Environment**: Select `Production`, `Preview`, and/or `Development`
4. Click **Save**

## Step 4: Update Google OAuth Redirect URI

If you're using Google Fit integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add your Vercel URL to **Authorized redirect URIs**:
   ```
   https://your-domain.vercel.app/auth/google/callback
   ```
5. Save changes

## Step 5: Verify Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test the following features:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ API endpoints respond (`/api/body-temperature`)
   - ✅ Google Fit integration (if configured)
   - ✅ ChatBot (if Gemini API key is set)

## API Endpoints

Your API endpoints will be available at:
- `https://your-domain.vercel.app/api/body-temperature`
- `https://your-domain.vercel.app/api/generate-report`
- `https://your-domain.vercel.app/api/google-fit/auth`
- `https://your-domain.vercel.app/api/google-fit/data/:type`
- `https://your-domain.vercel.app/auth/google/callback`

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Verify Node.js version**: Vercel uses Node 18.x by default
3. **Check for TypeScript errors**: Run `npm run build` locally first

### API Routes Not Working

1. **Verify environment variables** are set correctly
2. **Check CORS headers** in API functions
3. **Review function logs** in Vercel dashboard under "Functions"

### Google Fit Integration Issues

1. **Verify redirect URI** matches your Vercel domain
2. **Check environment variables** (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
3. **Ensure OAuth consent screen** is configured in Google Cloud Console

### Environment Variables Not Working

- **Vite variables**: Must be prefixed with `VITE_` to be accessible in frontend
- **Server variables**: Don't need `VITE_` prefix (used in API functions)
- **Redeploy** after adding new environment variables

## Custom Domain (Optional)

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` and `GOOGLE_REDIRECT_URI` environment variables

## Continuous Deployment

Vercel automatically deploys when you push to:
- **Production**: `main` or `master` branch
- **Preview**: Any other branch or pull request

## Project Structure

```
HealthScan/
├── api/                    # Vercel serverless functions
│   ├── body-temperature.js
│   ├── generate-report.js
│   └── google-fit/
│       ├── auth.js
│       ├── callback.js
│       └── data/
│           └── [type].js
├── src/                   # Frontend React app
├── vercel.json            # Vercel configuration
├── .vercelignore          # Files to ignore in deployment
└── package.json
```

## Support

For issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check function logs for API errors

---

**Happy Deploying! 🎉**

