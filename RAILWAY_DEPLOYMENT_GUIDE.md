# Railway Deployment Guide

## Step-by-Step: Deploy Backend to Railway

### 1. Create Railway Account
Go to https://railway.app and sign up (use GitHub login for easier deployment)

### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub account
4. Select your repository: `nickd290/abt-warranty-portal`

### 3. Configure Root Directory
**IMPORTANT:** Your backend is in the `server/` folder, so you need to set the root directory:

1. After selecting the repo, Railway will create a service
2. Click on the service
3. Go to **Settings** tab
4. Find "Root Directory" setting
5. Set it to: `server`
6. Click "Save"

### 4. Add PostgreSQL Database
1. In your project dashboard, click "New"
2. Select "Database"
3. Choose "PostgreSQL"
4. Railway will automatically create the database and add `DATABASE_URL` to your environment

### 5. Configure Environment Variables
Click on your backend service → **Variables** tab → Add these:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=<generate-a-secure-random-string>
JWT_EXPIRES_IN=7d
SFTP_HOST=134.199.195.90
SFTP_PORT=22
SFTP_ROOT_PATH=/sftp
MAX_FILE_SIZE=52428800
CORS_ORIGIN=http://localhost:5000
```

**To generate a secure JWT_SECRET**, run this in your terminal:
```bash
openssl rand -hex 32
```

Copy the output and paste it as `JWT_SECRET` in Railway.

### 6. Verify Build Settings
1. Go to **Settings** tab
2. Under "Build" section, verify:
   - **Build Command:** `npm run build` (should be auto-detected)
   - **Start Command:** `npm start` (should be auto-detected)
3. If not set, add them manually

### 7. Deploy!
Railway will automatically deploy when you push to GitHub. For the initial deployment:

1. Click **"Deploy"** button (or it may auto-deploy)
2. Watch the build logs (click "View Logs")
3. Wait for "Build successful" message
4. You'll see a deployment URL like: `https://your-app.up.railway.app`

### 8. Run Database Migrations
After first deployment, you need to seed the database:

1. Click on your service
2. Go to **Settings** tab
3. Find "One-off Commands" or use the Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npm run db:seed
```

**OR** use Railway dashboard:
1. Click service → **Deployments** tab
2. Find latest deployment → **"..."** menu
3. Select "Shell"
4. Run:
```bash
npx prisma migrate deploy
npm run db:seed
```

### 9. Get Your API URL
1. Go to **Settings** tab
2. Scroll to "Domains" section
3. Copy the Railway-provided domain (e.g., `https://abt-warranty-portal-production.up.railway.app`)
4. This is your **VITE_API_URL** for the frontend!

### 10. Update CORS Origin (After Vercel Deployment)
Once you deploy the frontend to Vercel, come back here and update:
```env
CORS_ORIGIN=https://your-app.vercel.app
```

---

## Architecture

```
GitHub (main branch)
    ↓
Railway (Auto-deploys on push)
    ├─ Backend API (Express + Prisma)
    ├─ PostgreSQL Database
    └─ Connects to: DigitalOcean SFTP (134.199.195.90)
```

---

## Testing Your Deployment

### Test API Health
```bash
curl https://your-app.up.railway.app/health
```

You should see: `{"status":"ok"}`

### Test Login Endpoint
```bash
curl -X POST https://your-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@abtwarranty.com","password":"admin123"}'
```

You should receive a JWT token!

---

## Troubleshooting

### Build Fails
- Check that `server/` is set as root directory
- Verify `package.json` has correct scripts
- Check build logs for specific errors

### Database Connection Error
- Make sure PostgreSQL service is running
- Verify `DATABASE_URL` is automatically added to environment variables
- Check that migrations ran successfully

### Port Issues
- Railway automatically assigns a `PORT` environment variable
- Make sure your `server/src/index.ts` uses `process.env.PORT`

### CORS Errors (After Frontend Deployment)
- Update `CORS_ORIGIN` in Railway environment variables
- Redeploy the service after changing env vars

---

## Important Notes

1. **Auto-Deploy:** Every time you push to `main` branch, Railway will automatically redeploy
2. **Environment Variables:** Changes require manual redeploy (click "Redeploy")
3. **Database:** Railway PostgreSQL automatically backs up your data
4. **Logs:** Always available in the Logs tab for debugging
5. **Cost:** Railway Hobby plan is $5/month, includes 500 hours execution

---

## Next Steps

After backend is deployed:
1. ✅ Note your Railway API URL
2. → Deploy frontend to Vercel (use Railway URL as `VITE_API_URL`)
3. → Update `CORS_ORIGIN` in Railway with Vercel URL
4. → Test end-to-end: Vercel → Railway → DigitalOcean SFTP

Your backend will be live at: **https://your-app.up.railway.app**

Ready to deploy the frontend? See `VERCEL_DEPLOYMENT_GUIDE.md` (next!)
