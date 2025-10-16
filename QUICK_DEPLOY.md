# Quick Deployment Guide - ABT Warranty Portal

Your local development environment is running! Now let's deploy to production.

## ✅ Local Development - RUNNING
- **Backend**: http://localhost:3001 ✓
- **Frontend**: http://localhost:5000 ✓
- **Database**: SQLite with seeded data ✓
- **Test Login**: admin@abtwarranty.com / admin123

---

## 🚀 Deploy to Production (2 Steps)

### Step 1: Deploy Backend to Railway (5 minutes)

1. **Go to Railway**: https://railway.app/new
2. **Click "Deploy from GitHub repo"**
3. **Select**: `nickd290/abt-warranty-portal`
4. **Root Directory**: Click "Add variables" → Set `ROOT_DIRECTORY` = `server`
5. **Add PostgreSQL**: Click "+ New" → "Database" → "PostgreSQL"
6. **Add these Environment Variables**:

```env
NODE_ENV=production
PORT=3001

# Copy these exactly (already generated for you):
JWT_SECRET=04bdc3e3bc31db64a5972990b0b9690d405116cacb99fb60285ef2dcf501fef8
JWT_EXPIRES_IN=7d

# File storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=52428800

# CORS - UPDATE AFTER STEP 2!
CORS_ORIGIN=https://abt-warranty-portal.vercel.app

# SFTP (DigitalOcean VPS)
SFTP_HOST=134.199.195.90
SFTP_PORT=22
SFTP_ROOT_PATH=/sftp

# SFTP API Key (already generated):
SFTP_API_KEY=381b218a473eddf8f37041afd69e8554c123f6024deff7b852f13a78f1896fcf
```

7. **Add Railway Volume**:
   - Settings → Volumes → New Volume
   - Mount path: `/app/uploads`
   - Size: 5GB

8. **Get your Railway URL**:
   - Settings → Networking → Generate Domain
   - Save this URL! (e.g., `abt-warranty.up.railway.app`)

9. **Run Database Migration**:
   - Settings → Deploy → Custom Start Command:
   ```bash
   npx prisma migrate deploy && npx prisma generate && node dist/index.js
   ```
   OR deploy first, then use Railway shell:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

---

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**: `nickd290/abt-warranty-portal`
3. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `.` (leave as root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
```env
VITE_API_URL=https://[YOUR-RAILWAY-URL]
VITE_SFTP_HOST=134.199.195.90
VITE_SFTP_PORT=22
```
Replace `[YOUR-RAILWAY-URL]` with your Railway domain from Step 1.

5. **Deploy**!

6. **Get your Vercel URL** (e.g., `abt-warranty-portal.vercel.app`)

---

### Step 3: Update CORS (1 minute)

Go back to Railway and update the `CORS_ORIGIN` variable:
```env
CORS_ORIGIN=https://[YOUR-VERCEL-URL]
```

Railway will auto-redeploy.

---

## 🎉 You're Live!

**Your Production URLs:**
- Frontend: `https://[YOUR-VERCEL-URL]`
- Backend API: `https://[YOUR-RAILWAY-URL]`

**Test Login:**
- Email: `admin@abtwarranty.com`
- Password: `admin123`

---

## 📋 Post-Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database added
- [ ] Volume mounted at `/app/uploads`
- [ ] Database migrated and seeded
- [ ] Frontend deployed to Vercel
- [ ] CORS_ORIGIN updated with Vercel URL
- [ ] Test login at frontend URL
- [ ] Change admin password in production!

---

## 🔧 Alternative: Deploy via CLI

If you prefer using the command line:

### Railway:
```bash
railway login
cd server
railway link  # or create new project
railway up
```

### Vercel:
```bash
npx vercel login
npx vercel --prod
```

---

## 🚨 Important Notes

1. **Schema Change**: We switched to SQLite for local dev. For Railway production, it uses PostgreSQL (configured in server/.env.production)

2. **SFTP Server**: The app is configured to use an external SFTP server at IP `134.199.195.90`. You'll need to set this up separately following `PRODUCTION_SETUP.md`.

3. **Security**: The JWT_SECRET and SFTP_API_KEY have been generated and are ready to use. These are production secrets - keep them safe!

4. **Frontend Port**: Local dev runs on port 5000 (not 3000) because Vite auto-selected an available port.

---

## 💰 Cost

- Railway: $5-20/month (includes PostgreSQL + hosting)
- Vercel: Free tier (perfect for this app)
- **Total: $5-20/month**

---

## 🔗 Resources

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Your GitHub Repo: https://github.com/nickd290/abt-warranty-portal

---

Need help? Check the detailed guides:
- `DEPLOYMENT.md` - Full deployment options
- `PRODUCTION_SETUP.md` - SFTP server setup
- `RAILWAY_DEPLOYMENT_GUIDE.md` - Railway specifics
