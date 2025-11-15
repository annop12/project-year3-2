# 🚂 Railway Deployment Guide - Step by Step

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Git installed locally
- Your code pushed to GitHub

---

## 🎯 Overview

We'll deploy:
1. **PostgreSQL Database** (managed by Railway)
2. **Spring Boot Backend** (from Dockerfile)
3. **Next.js Frontend** (from Dockerfile)

**Total estimated cost:** Free tier ($5 credit) or ~$10-20/month

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push to GitHub** (if not already)
```bash
cd /Users/annopsangsila/Desktop/Project\ year\ 3_1/FullStack-Doctora

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

---

### Step 2: Create Railway Project

1. **Go to Railway** → [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with GitHub
3. Click **"New Project"**
4. Select **"Empty Project"**
5. Give it a name: `doctora` or `doctor-booking`

---

### Step 3: Deploy PostgreSQL Database

1. **In your project**, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create the database automatically
4. Click on the **PostgreSQL service**
5. Go to **"Variables"** tab
6. **Copy these values** (you'll need them later):
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

---

### Step 4: Deploy Backend (Spring Boot)

1. **In your project**, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select your repository
4. Railway will detect multiple directories, select **"doctora-spring-boot"**

#### Configure Backend Service

1. **Click on the backend service** → **"Settings"**

2. **Root Directory** (if needed):
   - Set: `doctora-spring-boot`

3. **Build Settings**:
   - Builder: `Dockerfile` (auto-detected)

4. **Go to "Variables" tab** and add:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

JWT_SECRET=your-super-strong-secret-key-min-256-bits-change-this-now
JWT_EXPIRATION=86400000

SERVER_PORT=8082

ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app

SPRING_PROFILES_ACTIVE=prod
```

**Important:**
- Replace `JWT_SECRET` with a strong random string
- We'll update `ALLOWED_ORIGINS` after frontend is deployed

5. **Generate Domain**:
   - Go to **"Settings"** → **"Networking"**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://doctora-backend-production.up.railway.app`)

---

### Step 5: Deploy Frontend (Next.js)

1. **In your project**, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select your repository again
4. Select **"FrontendDoctora"**

#### Configure Frontend Service

1. **Click on the frontend service** → **"Settings"**

2. **Root Directory**:
   - Set: `FrontendDoctora`

3. **Build Settings**:
   - Builder: `Dockerfile` (auto-detected)

4. **Go to "Variables" tab** and add:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.up.railway.app

NODE_ENV=production
```

**Replace** `your-backend-url.up.railway.app` with your actual backend URL from Step 4

5. **Generate Domain**:
   - Go to **"Settings"** → **"Networking"**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://doctora-frontend-production.up.railway.app`)

---

### Step 6: Update Backend CORS

1. **Go back to Backend service**
2. **"Variables" tab**
3. **Update** `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app
```

4. Backend will automatically redeploy

---

### Step 7: Wait for Deployments

- **Watch the logs** in each service
- Backend takes ~5-10 minutes (Maven build)
- Frontend takes ~3-5 minutes (npm build)
- Database is instant

**Check deployment status:**
- Look for ✅ green checkmark on each service
- No error indicators ❌

---

### Step 8: Verify Deployment

#### Test Backend API

```bash
# Health check
curl https://your-backend-url.up.railway.app/api/health

# Should return:
{
  "status": "UP",
  "database": "UP",
  "service": "Doctora Backend API"
}

# Get specialties
curl https://your-backend-url.up.railway.app/api/specialties
```

#### Test Frontend

1. Open: `https://your-frontend-url.up.railway.app`
2. Check:
   - ✅ Page loads
   - ✅ Specialties display
   - ✅ Can view doctors
   - ✅ Can register/login

---

## 🔍 Troubleshooting

### Backend Deployment Failed

1. **Check Logs**:
   - Click service → "Deployments" → Latest deployment → "View Logs"

2. **Common Issues**:

   **Error: "Cannot connect to database"**
   - Check database is running (green checkmark)
   - Verify `DB_*` variables are set correctly
   - Use Railway's magic variables: `${{Postgres.PGHOST}}`

   **Error: "Port already in use"**
   - Railway automatically assigns ports
   - Remove any hardcoded port bindings

   **Error: "Maven build failed"**
   - Check Java version (should be 21)
   - Look for dependency errors in logs

3. **Manual Redeploy**:
   - Click "Deployments" → "⋯" → "Redeploy"

### Frontend Deployment Failed

1. **Check Logs**:
   - Look for build errors

2. **Common Issues**:

   **Error: "NEXT_PUBLIC_API_BASE_URL not set"**
   - Add variable in Railway dashboard
   - Must start with `NEXT_PUBLIC_`

   **Error: "Cannot connect to backend"**
   - Check backend URL is correct
   - Check CORS is configured properly
   - Verify backend is running

   **Error: "Build out of memory"**
   - Railway free tier has memory limits
   - May need to upgrade plan

### CORS Errors

If you see CORS errors in browser console:

1. **Check Backend CORS Configuration**:
   ```bash
   # View backend variables
   # In Railway: Backend service → Variables
   ```

2. **Ensure ALLOWED_ORIGINS includes frontend URL**
   - Should match exactly: `https://your-frontend.up.railway.app`
   - No trailing slash
   - Include protocol (https://)

3. **Redeploy Backend** after changing CORS

---

## 💰 Cost Management

### Free Tier
- $5 credit per month
- ~500 hours execution time
- Good for development/demo

### Monitor Usage
1. Railway Dashboard → "Usage"
2. Watch:
   - Execution hours
   - Memory usage
   - Network bandwidth

### Optimize Costs
- **Stop services** when not in use
- **Use sleep mode** for non-production
- **Upgrade** to Hobby plan ($5/month per service) if needed

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway will automatically:
# 1. Detect changes
# 2. Rebuild affected services
# 3. Deploy new version
```

**Monitor in Railway:**
- Go to "Deployments" tab
- See deployment progress
- View logs

---

## 🔒 Security Checklist

After deployment:

- [ ] Change JWT_SECRET to strong value
- [ ] Verify CORS only allows your frontend
- [ ] Check database is not publicly accessible
- [ ] Enable "Private Networking" in Railway (if available)
- [ ] Review environment variables (no sensitive data exposed)
- [ ] Set up monitoring/alerts
- [ ] Configure backup for database

---

## 📊 Monitoring

### View Logs
1. Click service → "Deployments"
2. Select deployment
3. "View Logs"
4. Real-time streaming

### Metrics
1. Click service → "Metrics"
2. View:
   - CPU usage
   - Memory usage
   - Request count

### Alerts
- Railway will email you if:
  - Service crashes
  - Running out of credits
  - Deployment fails

---

## 🔧 Advanced Configuration

### Custom Domain

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **In Railway**:
   - Service → "Settings" → "Networking"
   - Click "Custom Domain"
   - Add your domain
3. **Add DNS records** at your domain provider:
   ```
   Type: CNAME
   Name: @ or www
   Value: [Railway provides this]
   ```

### Environment-Specific Deployments

**Production:**
- Branch: `main`
- Auto-deploy: Enabled

**Staging:**
- Branch: `develop`
- Create separate Railway project
- Different environment variables

### Database Backups

**Manual Backup:**
```bash
# Get database URL from Railway
railway connect postgres

# Or use pg_dump
pg_dump $DATABASE_URL > backup.sql
```

**Automated Backups:**
- Upgrade to Pro plan
- Railway provides automatic backups

---

## 🆘 Getting Help

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Railway Discord:** [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues:** Create issue in your repo

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] Environment files configured
- [ ] Docker builds locally
- [ ] Railway account created

During deployment:
- [ ] Database created and running
- [ ] Backend deployed with correct variables
- [ ] Frontend deployed with correct API URL
- [ ] CORS configured properly
- [ ] All services have generated domains

After deployment:
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can create appointment
- [ ] Check all major features work

---

## 🎉 Success!

Your app should now be live at:
- **Frontend:** https://your-frontend.up.railway.app
- **Backend API:** https://your-backend.up.railway.app/api

Share the frontend URL with anyone to test!

---

**Next Steps:**
1. Test all features thoroughly
2. Set up custom domain
3. Configure monitoring
4. Set up automated backups
5. Document known issues

**Need help?** Check the troubleshooting section or create an issue!
