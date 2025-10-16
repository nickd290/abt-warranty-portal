# 🎯 Final Deployment Steps - Copy & Paste Ready!

## ⚡ STEP 1: Configure Railway (2 minutes)

### 1.1 Open Railway Project
**Click this link:** https://railway.com/project/73ebf38b-9521-4dec-ba0d-558280a576b5

### 1.2 Click on your Service
You'll see a service in the project - click on it.

### 1.3 Go to Variables Tab
Click the **Variables** tab at the top.

### 1.4 Add These Variables (Copy & Paste Each One)

**Click "+ New Variable" and paste these one by one:**

```
Name: NODE_ENV
Value: production
```

```
Name: PORT
Value: 3001
```

```
Name: JWT_SECRET
Value: 04bdc3e3bc31db64a5972990b0b9690d405116cacb99fb60285ef2dcf501fef8
```

```
Name: JWT_EXPIRES_IN
Value: 7d
```

```
Name: UPLOAD_DIR
Value: /app/uploads
```

```
Name: MAX_FILE_SIZE
Value: 52428800
```

```
Name: CORS_ORIGIN
Value: https://abt-warranty-portal.vercel.app
```

```
Name: SFTP_HOST
Value: 134.199.195.90
```

```
Name: SFTP_PORT
Value: 22
```

```
Name: SFTP_ROOT_PATH
Value: /sftp
```

```
Name: SFTP_API_KEY
Value: 381b218a473eddf8f37041afd69e8554c123f6024deff7b852f13a78f1896fcf
```

### 1.5 Get Your Railway URL
1. Click **Settings** tab
2. Scroll to **Networking**
3. Click **Generate Domain** (if not already generated)
4. **COPY YOUR URL** (something like `abt-warranty-xxxxx.up.railway.app`)
5. **SAVE IT** - you'll need it in Step 2!

---

## ⚡ STEP 2: Deploy to Vercel (3 minutes)

### 2.1 Open Vercel
**Click this link:** https://vercel.com/new

### 2.2 Import Repository
1. Click **"Add New..."** → **"Project"**
2. Find **"nickd290/abt-warranty-portal"** in the list
3. Click **"Import"**

### 2.3 Configure Project
**Framework Preset:** Select **"Vite"** from dropdown

**Root Directory:** Leave as **"."** (root)

**Build Command:** Should auto-fill as `npm run build` ✓

**Output Directory:** Should auto-fill as `dist` ✓

### 2.4 Add Environment Variables

Click **"Environment Variables"** section and add these 3 variables:

```
Name: VITE_API_URL
Value: https://[YOUR-RAILWAY-URL-FROM-STEP-1]
```
⚠️ Replace `[YOUR-RAILWAY-URL-FROM-STEP-1]` with the Railway URL you copied!

Example: `https://abt-warranty-xxxxx.up.railway.app`

```
Name: VITE_SFTP_HOST
Value: 134.199.195.90
```

```
Name: VITE_SFTP_PORT
Value: 22
```

### 2.5 Deploy!
Click **"Deploy"** button and wait 2-3 minutes.

### 2.6 Get Your Vercel URL
Once deployed, Vercel will show your URL (e.g., `abt-warranty-portal.vercel.app`)

**COPY THIS URL!**

---

## ⚡ STEP 3: Update CORS (30 seconds)

### 3.1 Go Back to Railway
Return to: https://railway.com/project/73ebf38b-9521-4dec-ba0d-558280a576b5

### 3.2 Update CORS Variable
1. Click your service → **Variables** tab
2. Find **CORS_ORIGIN** variable
3. Click to edit it
4. Change value to: `https://[YOUR-VERCEL-URL]`

   Example: `https://abt-warranty-portal.vercel.app`

5. Save - Railway will automatically redeploy (takes 1-2 minutes)

---

## 🎉 STEP 4: Test Your Production App!

### 4.1 Visit Your Vercel URL
Go to: `https://[YOUR-VERCEL-URL]`

### 4.2 Login
```
Email: admin@abtwarranty.com
Password: admin123
```

### 4.3 Test It Works
- Click around the dashboard
- Try creating a new job
- Test file upload

### 4.4 ⚠️ IMPORTANT - Change Admin Password!
1. Go to Settings/Profile
2. Change the admin password from `admin123` to something secure!

---

## 📊 Your Production URLs

After completing these steps, your app will be live at:

- **Frontend:** `https://[your-vercel-url].vercel.app`
- **Backend API:** `https://[your-railway-url].up.railway.app`
- **Railway Dashboard:** https://railway.com/project/73ebf38b-9521-4dec-ba0d-558280a576b5
- **GitHub:** https://github.com/nickd290/abt-warranty-portal

---

## 🆘 Troubleshooting

### Frontend shows "Network Error"
- Check Railway deployment is running (green status)
- Verify VITE_API_URL is set correctly in Vercel
- Check Railway logs for errors

### Can't login
- Database should have been seeded automatically
- Check Railway logs to confirm seed ran
- Try: `admin@abtwarranty.com` / `admin123`

### CORS errors in browser console
- Make sure CORS_ORIGIN in Railway matches your Vercel URL exactly
- Include `https://` in the URL
- Wait 1-2 minutes for Railway to redeploy after changing variables

---

## ✅ Checklist

- [ ] Added all 11 environment variables to Railway
- [ ] Generated Railway domain and copied URL
- [ ] Deployed frontend to Vercel
- [ ] Added 3 environment variables to Vercel
- [ ] Copied Vercel URL
- [ ] Updated CORS_ORIGIN in Railway with Vercel URL
- [ ] Waited for Railway to redeploy
- [ ] Tested login at Vercel URL
- [ ] Changed admin password

---

## 💡 Pro Tips

1. **Bookmark these URLs:**
   - Railway project
   - Vercel dashboard
   - Your production app

2. **Monitor logs:**
   - Railway: Click service → Deployments → View logs
   - Vercel: Click deployment → View function logs

3. **Future updates:**
   - Just push to GitHub main branch
   - Railway and Vercel will auto-deploy!

---

That's it! Your app is now live in production! 🚀
