# AWS Amplify Deployment Guide

## Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/derma-india-main.git
git push -u origin main
```

### 1.2 Make Sure `.env.local` is NOT committed
Check `.gitignore` contains `*.local` ✓ (already added)

---

## Step 2: Create AWS Account & Amplify App

1. Go to https://console.aws.amazon.com/
2. Sign up if you don't have AWS account
3. Search for **"AWS Amplify"** in services
4. Click **"Create app"** or **"New app"** → **"Host web app"**

---

## Step 3: Connect GitHub Repository

1. Select **"GitHub"** as source
2. Sign in with GitHub
3. Select your repository: `derma-india-main`
4. Select branch: `main`
5. Click **"Next"**

---

## Step 4: Configure Build Settings

1. Amplify will auto-detect your build settings
2. You should see:
   - **Build command:** `npm run build`
   - **Base directory:** `dist`
3. These should match `amplify.yml` ✓

---

## Step 5: Add Environment Variables ⭐ IMPORTANT

1. In Amplify console, go to **"Environment variables"**
2. Add these variables:
   ```
   API_KEY = Your_Valid_Gemini_API_Key
   ```
3. Get your API key from: https://aistudio.google.com/apikey

> ⚠️ **DO NOT add `.env.local` to git!** Use Amplify's environment variables instead.

---

## Step 6: Deploy

1. Click **"Save and deploy"**
2. Wait for build to complete (takes 2-5 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://main.xxxxx.amplifyapp.com
   ```

---

## Step 7: Verify Deployment

1. Click the deployment URL
2. Test the app
3. If you see blank screen, check:
   - **CloudWatch Logs** in Amplify console
   - API key is valid and has quota

---

## Troubleshooting

### Build Fails
- Check **Build logs** in Amplify console
- Make sure all dependencies are listed in `package.json`

### Blank Screen in Production
1. Open **DevTools** (F12)
2. Go to **Console** tab
3. Check for errors
4. Check **Amplify Logs** → **Build/Hosting**

### API Key Not Working
1. Verify `API_KEY` is set in Amplify env variables
2. Check if API key has quota remaining
3. Add billing to Google account if needed

---

## Auto Deployment

Any push to `main` branch will trigger automatic deployment! 🚀

```bash
git add .
git commit -m "your changes"
git push origin main
# Amplify will automatically build and deploy
```

---

## Environment Variables Setup (After First Deployment)

If you need to update API key later:
1. Go to Amplify console
2. Select your app
3. **Environment** → **Environment variables**
4. Update `API_KEY`
5. Redeploy (trigger new build)

---

## Need Help?
- Amplify Docs: https://docs.amplify.aws/
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html