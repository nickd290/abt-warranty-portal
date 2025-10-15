# Production Deployment Guide - Vercel + Railway

Complete guide for deploying ABT Warranty Portal to production.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│  Customer's Computer                        │
│  - FileZilla/WinSCP/Cyberduck              │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ SFTP (Port 2222)
┌─────────────────────────────────────────────┐
│  Railway (Backend)                          │
│  ├─ Express API (Port 3001)                │
│  ├─ SFTP Server (Port 2222)                │
│  ├─ PostgreSQL Database                    │
│  └─ Volume: /app/uploads (Persistent)      │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ HTTPS/API Calls
┌─────────────────────────────────────────────┐
│  Vercel (Frontend)                          │
│  - React App (Port 443)                    │
│  - Static Assets                            │
└─────────────────────────────────────────────┘
```

---

## 📦 Option A: Railway with Built-in SFTP (Recommended)

### Pros:
✅ Single deployment (API + SFTP together)
✅ Built-in persistent storage (Railway Volumes)
✅ Automatic SSL for API
✅ Simpler architecture
✅ Cost-effective ($5-10/month)

### Cons:
⚠️ SFTP uses custom port (2222) not standard port 22
⚠️ Railway networking required

---

## 🚀 Deployment Steps

### Step 1: Prepare Backend for Railway

```bash
cd server

# Update package.json
# Add to scripts:
"start": "node dist/index.js",
"build": "tsc"
```

### Step 2: Set Up Railway

1. **Create Railway Account**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Connect GitHub**: Link your repo
4. **Select Service**: Choose `server` directory

### Step 3: Configure Environment Variables

In Railway dashboard, add these variables:

```env
# Database (Railway provides this automatically)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server
PORT=3001
NODE_ENV=production

# JWT (CHANGE THIS!)
JWT_SECRET="your-super-secret-production-key-change-me"
JWT_EXPIRES_IN=7d

# SFTP
SFTP_ENABLED=true
SFTP_PORT=2222
SFTP_HOST=0.0.0.0

# File Storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=52428800

# CORS (Update after deploying Vercel)
CORS_ORIGIN=https://your-app.vercel.app
```

### Step 4: Add PostgreSQL Database

1. In Railway dashboard: **New** → **Database** → **PostgreSQL**
2. Railway automatically connects it via `DATABASE_URL`

### Step 5: Create Persistent Volume

```bash
# In Railway dashboard:
# Settings → Volumes → New Volume
# Mount Path: /app/uploads
# Size: 5GB (or as needed)
```

### Step 6: Expose SFTP Port

Railway automatically exposes one port. For SFTP, you need to:

1. **Settings** → **Networking**
2. **Public Networking** → **Add Port**
3. Add port: `2222`
4. Get your Railway domain: `your-app.up.railway.app`

### Step 7: Deploy Backend

```bash
# Push to GitHub
git add .
git commit -m "Add Railway config"
git push origin main

# Railway auto-deploys from GitHub
```

Your backend will be at:
- API: `https://your-app.up.railway.app`
- SFTP: `your-app.up.railway.app:2222`

---

## 🎨 Deploy Frontend to Vercel

### Step 1: Prepare Frontend

```bash
cd abt-warranty-portal

# Update .env
echo "VITE_API_URL=https://your-app.up.railway.app" > .env.production

# Update package.json build script (already correct)
"build": "tsc -b && vite build"
```

### Step 2: Deploy to Vercel

1. **Create Vercel Account**: https://vercel.com
2. **Import Project** → Select GitHub repo
3. **Configure**:
   - Framework: Vite
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-app.up.railway.app
   VITE_SFTP_HOST=your-app.up.railway.app
   VITE_SFTP_PORT=2222
   ```

5. **Deploy**!

### Step 3: Update Backend CORS

Go back to Railway and update `CORS_ORIGIN`:
```env
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 📦 Option B: Separate SFTP Server (More Complex)

If Railway SFTP doesn't work well, use a separate VPS:

### Architecture:
```
Frontend (Vercel) → API (Railway) → Database (Railway)
                      ↑
                      │
Customer → SFTP (DigitalOcean VPS $5/mo)
```

### Setup:

1. **Get VPS**: DigitalOcean, Linode, Vultr ($5/month)
2. **Install OpenSSH**: `sudo apt install openssh-server`
3. **Configure Users**: Create SFTP users
4. **Point to Railway**: SFTP server calls Railway API to register uploads

**Cost**: $5/month extra for VPS

---

## 📦 Option C: AWS S3 + Lambda (Serverless SFTP)

Most scalable but complex:

1. **AWS Transfer Family**: Managed SFTP service
2. **S3 Bucket**: File storage
3. **Lambda**: Process uploads
4. **Railway**: API only

**Cost**: ~$20/month AWS Transfer Family + storage

---

## 🎯 My Recommendation

**Use Option A: Railway with built-in SFTP**

### Why:
✅ Simplest setup
✅ Single deployment
✅ Lowest cost
✅ Railway handles everything

### Customer Connection:
```
Host: your-app.up.railway.app
Port: 2222
Username: [from web portal]
Password: [from web portal]
Protocol: SFTP
```

---

## 🔧 Railway-Specific SFTP Configuration

Create a working SFTP server that runs on Railway:

### Update `server/src/index.ts`:

I'll create a Railway-compatible SFTP implementation...

---

## 📋 Post-Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Volume mounted at `/app/uploads`
- [ ] Environment variables configured
- [ ] SFTP port (2222) exposed
- [ ] Frontend deployed to Vercel
- [ ] CORS updated with Vercel URL
- [ ] Database seeded with initial data
- [ ] Test API health check
- [ ] Test SFTP connection from FileZilla
- [ ] Test web portal login
- [ ] Create first production SFTP credential
- [ ] Send test credentials to yourself
- [ ] Test file upload via SFTP
- [ ] Verify files appear in portal

---

## 🧪 Testing Production

### Test API:
```bash
curl https://your-app.up.railway.app/health
```

### Test SFTP:
```bash
sftp -P 2222 username@your-app.up.railway.app
```

### Test Frontend:
```
Visit: https://your-app.vercel.app
Login: admin@abtwarranty.com / admin123
```

---

## 💰 Cost Breakdown

### Railway (Backend + SFTP + DB):
- Hobby Plan: $5/month
- Pro Plan: $20/month (recommended for production)
- Includes: 512MB RAM, PostgreSQL, 1GB storage

### Vercel (Frontend):
- Free tier: Perfect for this project!
- Pro: $20/month (if you need more)

### **Total: $5-20/month** 🎉

---

## 🔒 Security for Production

1. **Change all default passwords**
2. **Use strong JWT_SECRET** (generate with `openssl rand -hex 32`)
3. **Enable HTTPS only** (automatic on Vercel/Railway)
4. **Restrict CORS** to your domain only
5. **Regular database backups** (Railway provides this)
6. **Monitor logs** regularly
7. **Set up alerting** for failed logins
8. **Rotate SFTP passwords** quarterly

---

## 🚨 Troubleshooting

### SFTP Not Connecting:
- Check Railway port 2222 is exposed
- Verify SFTP_ENABLED=true in env vars
- Check server logs in Railway dashboard
- Test with `telnet your-app.up.railway.app 2222`

### CORS Errors:
- Verify CORS_ORIGIN matches Vercel URL exactly
- Check for trailing slash in URL
- Redeploy backend after changing

### Database Connection:
- Railway auto-provides DATABASE_URL
- Check PostgreSQL service is running
- Run migrations: `npx prisma migrate deploy`

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- Railway Discord: https://discord.gg/railway
- ABT Portal Issues: [Your GitHub repo]

---

## 🎉 You're Done!

Your ABT Warranty Portal is now live in production with:
- ✅ Secure SFTP file uploads
- ✅ Full web portal
- ✅ Database persistence
- ✅ Automatic deployments
- ✅ SSL/HTTPS everywhere

**Customer SFTP Access:**
```
Host: your-app.up.railway.app
Port: 2222
Username: [managed in portal]
Password: [managed in portal]
```

Deploy and test! 🚀
