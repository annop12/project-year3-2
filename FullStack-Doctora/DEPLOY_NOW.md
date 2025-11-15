# 🚀 Deploy Now - Quick Start Guide

## ✅ Pre-Deployment Checklist

- [x] Environment files created
- [x] Docker configuration ready
- [x] Database migrations complete
- [x] Health check endpoints added
- [x] Documentation complete
- [x] Code ready for deployment

---

## 📝 Step-by-Step Deployment

### Step 1: Push to GitHub (5 minutes)

#### 1.1 Check Git Status
```bash
cd /Users/annopsangsila/Desktop/Project\ year\ 3_1/FullStack-Doctora
git status
```

#### 1.2 Initialize Git (if not already)
```bash
git init
```

#### 1.3 Add All Files
```bash
git add .
```

#### 1.4 Commit
```bash
git commit -m "Ready for Railway deployment

- Added environment configuration files
- Created Dockerfiles for backend and frontend
- Added health check endpoints
- Updated CORS configuration
- Added database migrations (V12)
- Created comprehensive documentation
- Ready for production deployment"
```

#### 1.5 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `doctora-booking` (or your choice)
3. **Keep it Public** (for free deployment)
4. **DO NOT** initialize with README
5. Click "Create repository"

#### 1.6 Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/doctora-booking.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint:** Your code is now on GitHub!

---

### Step 2: Setup Railway (3 minutes)

#### 2.1 Create Account
1. Go to https://railway.app
2. Click **"Login"**
3. **Sign in with GitHub** (recommended)
4. Authorize Railway to access your repositories

#### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Empty Project"**
3. Name it: `doctora` or `doctor-booking`
4. Click **"Create"**

✅ **Checkpoint:** Railway project created!

---

### Step 3: Deploy Database (2 minutes)

#### 3.1 Add PostgreSQL
1. In your project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Wait ~30 seconds for provisioning

#### 3.2 Note Database Variables
1. Click on the **PostgreSQL service**
2. Go to **"Variables"** tab
3. You'll see (automatically created):
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

**Note:** You don't need to copy these! Railway will auto-reference them.

✅ **Checkpoint:** Database is ready!

---

### Step 4: Deploy Backend (5 minutes)

#### 4.1 Add Backend Service
1. Click **"+ New"**
2. Select **"GitHub Repo"**
3. Find and select your repository
4. Railway detects it's a monorepo, select **"doctora-spring-boot"**

#### 4.2 Configure Backend
1. Click on the backend service
2. Go to **"Settings"** tab
3. Set **Root Directory**: `doctora-spring-boot`
4. **Builder** should auto-detect: `Dockerfile`

#### 4.3 Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these variables:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

JWT_SECRET=REPLACE-THIS-WITH-STRONG-SECRET-FROM-BELOW
JWT_EXPIRATION=86400000

SERVER_PORT=8082

ALLOWED_ORIGINS=WILL-UPDATE-AFTER-FRONTEND-DEPLOYED

SPRING_PROFILES_ACTIVE=prod
```

**Generate Strong JWT Secret:**
```bash
# Run this in your terminal:
openssl rand -base64 64

# Or:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Copy the output and replace JWT_SECRET value above
```

#### 4.4 Generate Domain
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. **Copy the URL** (e.g., `https://doctora-backend-production.up.railway.app`)
4. **Save this URL!** You'll need it for frontend

#### 4.5 Wait for Deployment
- Watch the **"Deployments"** tab
- Backend will build (~5-7 minutes)
- Look for ✅ green checkmark

✅ **Checkpoint:** Backend deploying!

---

### Step 5: Deploy Frontend (5 minutes)

#### 5.1 Add Frontend Service
1. Click **"+ New"**
2. Select **"GitHub Repo"**
3. Select your repository again
4. Choose **"FrontendDoctora"**

#### 5.2 Configure Frontend
1. Click on the frontend service
2. Go to **"Settings"** tab
3. Set **Root Directory**: `FrontendDoctora`
4. **Builder** should auto-detect: `Dockerfile`

#### 5.3 Add Environment Variables
1. Go to **"Variables"** tab
2. Add:

```
NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND-URL.up.railway.app

NODE_ENV=production
```

**Replace** `YOUR-BACKEND-URL` with the backend URL from Step 4.4

#### 5.4 Generate Domain
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. **Copy the frontend URL** (e.g., `https://doctora-frontend-production.up.railway.app`)

#### 5.5 Wait for Deployment
- Frontend will build (~3-5 minutes)
- Look for ✅ green checkmark

✅ **Checkpoint:** Frontend deploying!

---

### Step 6: Update Backend CORS (2 minutes)

#### 6.1 Update ALLOWED_ORIGINS
1. Go back to **Backend service**
2. Click **"Variables"** tab
3. Find **ALLOWED_ORIGINS**
4. Update to your frontend URL:
```
ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app
```

#### 6.2 Redeploy Backend
- Backend will automatically redeploy
- Wait ~2-3 minutes

✅ **Checkpoint:** CORS configured!

---

### Step 7: Test Your Deployment! (5 minutes)

#### 7.1 Test Backend
```bash
# Replace with your backend URL
curl https://your-backend-url.up.railway.app/api/health

# Should return:
{
  "status": "UP",
  "database": "UP",
  "service": "Doctora Backend API"
}
```

#### 7.2 Test Frontend
1. Open: `https://your-frontend-url.up.railway.app`
2. Check:
   - ✅ Page loads
   - ✅ Specialties display
   - ✅ No console errors
   - ✅ Can view doctors

#### 7.3 Test Full Flow
1. Register new account
2. Login
3. Browse doctors
4. Try to book appointment

✅ **Success!** Your app is live!

---

## 🎉 Your App is Deployed!

### URLs
- **Frontend:** https://your-frontend-url.up.railway.app
- **Backend:** https://your-backend-url.up.railway.app

### Next Steps
1. ✅ Share frontend URL with others
2. ✅ Test all features
3. ⏳ Add custom domain (optional)
4. ⏳ Set up monitoring

---

## 🐛 Troubleshooting

### Backend won't start
1. Check **Deployments** tab → **View Logs**
2. Common issues:
   - Database not connected → Check `DB_*` variables
   - JWT secret missing → Add `JWT_SECRET`
   - Build failed → Check Dockerfile

### Frontend shows errors
1. Check browser console (F12)
2. Common issues:
   - Can't connect to backend → Check `NEXT_PUBLIC_API_BASE_URL`
   - CORS error → Update backend `ALLOWED_ORIGINS`

### Database connection failed
1. Make sure Database service is running (green checkmark)
2. Check backend uses `${{Postgres.PGHOST}}` format

---

## 💰 Cost

**Free Tier:**
- $5 credit per month
- ~500 hours execution time
- Perfect for demo/development

**Monitor usage:**
- Railway Dashboard → "Usage"

---

## 📞 Need Help?

1. Check logs in Railway → Service → Deployments → View Logs
2. See RAILWAY_DEPLOYMENT.md for detailed troubleshooting
3. Railway Discord: https://discord.gg/railway

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Database deployed and running
- [ ] Backend deployed with environment variables
- [ ] Backend domain generated
- [ ] Frontend deployed with backend URL
- [ ] Frontend domain generated
- [ ] Backend CORS updated with frontend URL
- [ ] Health check passes
- [ ] Frontend loads correctly
- [ ] Can register/login
- [ ] All features work

---

**Good luck! 🚀**
