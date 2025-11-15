# 🚂 Railway Deployment - Step by Step

## ✅ GitHub Done!
- Repository: https://github.com/annop07/doctora-full
- Code pushed successfully ✅

---

## 📝 Railway Deployment Steps

### Step 1: Create Railway Account (2 minutes)

1. **ไปที่:** https://railway.app
2. **คลิก:** "Login"
3. **เลือก:** "Sign in with GitHub"
4. **Authorize:** Railway App
5. ✅ **Done!** คุณจะเข้าสู่ Railway Dashboard

---

### Step 2: Create New Project (1 minute)

1. **คลิก:** "New Project"
2. **เลือก:** "Empty Project"
3. **ตั้งชื่อ:** `doctora` หรือ `doctor-booking`
4. ✅ **Done!** Project ถูกสร้างแล้ว

---

### Step 3: Deploy PostgreSQL Database (2 minutes)

1. **ใน Project คลิก:** "+ New"
2. **เลือก:** "Database"
3. **เลือก:** "Add PostgreSQL"
4. **รอ:** ~30 วินาที (Railway จะสร้าง database ให้)
5. ✅ **Done!** จะเห็น PostgreSQL service ใน project

**หมายเหตุ:** Railway จะสร้าง environment variables อัตโนมัติ:
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

---

### Step 4: Deploy Backend (Spring Boot) (7 minutes)

#### 4.1 Add Service
1. **คลิก:** "+ New"
2. **เลือก:** "GitHub Repo"
3. **เลือก:** `annop07/doctora-full`
4. Railway จะถาม: "This repository has multiple directories"
5. **เลือก:** `doctora-spring-boot`

#### 4.2 Configure Service
1. **คลิก:** Backend service ที่เพิ่งสร้าง
2. **ไปที่:** "Settings" tab
3. **ตรวจสอบ:**
   - Root Directory: `doctora-spring-boot` ✅
   - Builder: `Dockerfile` (auto-detected) ✅

#### 4.3 Add Environment Variables
1. **ไปที่:** "Variables" tab
2. **คลิก:** "+ New Variable"
3. **Copy-paste ทั้งหมดนี้:**

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

4. **เพิ่มตัวแปรต่อไปนี้ทีละตัว:**

**JWT_SECRET** - ต้อง generate ก่อน!

**วิธี generate JWT Secret:**
```bash
# รันในเครื่องคุณ:
openssl rand -base64 64

# หรือ:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Copy ผลลัพธ์แล้วเพิ่มใน Railway:
```
JWT_SECRET=<paste-generated-secret-here>
```

**ตัวแปรที่เหลือ:**
```
JWT_EXPIRATION=86400000
SERVER_PORT=8082
ALLOWED_ORIGINS=TEMP_WILL_UPDATE_LATER
SPRING_PROFILES_ACTIVE=prod
```

#### 4.4 Generate Public Domain
1. **ไปที่:** "Settings" tab
2. **ไปที่:** "Networking" section
3. **คลิก:** "Generate Domain"
4. **Copy URL** (เช่น: `https://doctora-backend-production.up.railway.app`)
5. **⚠️ เก็บ URL นี้ไว้!** จะใช้ใน Frontend

#### 4.5 Wait for Deployment
1. **ไปที่:** "Deployments" tab
2. จะเห็น deployment กำลัง build
3. **รอ:** ~5-7 นาที (Maven build + Docker)
4. **รอจน:** เห็น ✅ สีเขียว

**ดู Logs:**
- คลิก deployment → "View Logs"
- ควรเห็น: "Started DoctoraliaApplication"

---

### Step 5: Deploy Frontend (Next.js) (5 minutes)

#### 5.1 Add Service
1. **คลิก:** "+ New"
2. **เลือก:** "GitHub Repo"
3. **เลือก:** `annop07/doctora-full` (repo เดิม)
4. **เลือก:** `FrontendDoctora`

#### 5.2 Configure Service
1. **คลิก:** Frontend service
2. **ไปที่:** "Settings" tab
3. **ตรวจสอบ:**
   - Root Directory: `FrontendDoctora` ✅
   - Builder: `Dockerfile` (auto-detected) ✅

#### 5.3 Add Environment Variables
1. **ไปที่:** "Variables" tab
2. **เพิ่ม:**

```
NEXT_PUBLIC_API_BASE_URL=<BACKEND_URL_FROM_STEP_4.4>
NODE_ENV=production
```

**⚠️ สำคัญ!** แทนที่ `<BACKEND_URL_FROM_STEP_4.4>` ด้วย URL จริงจาก backend
ตัวอย่าง:
```
NEXT_PUBLIC_API_BASE_URL=https://doctora-backend-production.up.railway.app
```

#### 5.4 Generate Public Domain
1. **ไปที่:** "Settings" → "Networking"
2. **คลิก:** "Generate Domain"
3. **Copy Frontend URL** (เช่น: `https://doctora-frontend-production.up.railway.app`)
4. **⚠️ เก็บ URL นี้ไว้!** จะใช้อัพเดท Backend CORS

#### 5.5 Wait for Deployment
1. **ไปที่:** "Deployments" tab
2. **รอ:** ~3-5 นาที (Next.js build)
3. **รอจน:** เห็น ✅ สีเขียว

---

### Step 6: Update Backend CORS (3 minutes)

#### 6.1 Update ALLOWED_ORIGINS
1. **กลับไปที่:** Backend service
2. **ไปที่:** "Variables" tab
3. **หา:** `ALLOWED_ORIGINS`
4. **แก้เป็น:** Frontend URL จาก Step 5.4

```
ALLOWED_ORIGINS=https://doctora-frontend-production.up.railway.app
```

**⚠️ ระวัง:**
- ไม่มี trailing slash (/)
- ต้องมี https://
- Copy URL ให้ถูกต้อง

#### 6.2 Redeploy
- Backend จะ redeploy อัตโนมัติ
- **รอ:** ~2-3 นาที
- **รอจน:** ✅ สีเขียวอีกครั้ง

---

### Step 7: Test Your Deployment! 🎉 (5 minutes)

#### 7.1 Test Backend Health
**เปิด browser หรือใช้ curl:**

```bash
curl https://<your-backend-url>.up.railway.app/api/health
```

**ควรได้:**
```json
{
  "status": "UP",
  "database": "UP",
  "service": "Doctora Backend API",
  "version": "1.0.0",
  "timestamp": "..."
}
```

#### 7.2 Test Backend API
```bash
curl https://<your-backend-url>.up.railway.app/api/specialties
```

**ควรได้:** JSON array ของ specialties

#### 7.3 Test Frontend
1. **เปิด browser:**
```
https://<your-frontend-url>.up.railway.app
```

2. **Check:**
- ✅ Page loads
- ✅ Specialties display
- ✅ Images load
- ✅ No console errors (F12)

#### 7.4 Test Full Flow
1. **Register:** สร้าง account ใหม่
2. **Login:** เข้าสู่ระบบ
3. **Browse Doctors:** ดู doctors
4. **Book Appointment:** ลองจองนัด

---

## 🎉 Success! Your App is Live!

### Your URLs:
- **Frontend:** https://doctora-frontend-production.up.railway.app
- **Backend:** https://doctora-backend-production.up.railway.app
- **GitHub:** https://github.com/annop07/doctora-full

### Share These:
- Frontend URL สำหรับ user ใช้งาน
- GitHub สำหรับ code review

---

## 🐛 Troubleshooting

### Backend fails to start

**Check Logs:**
1. Backend service → Deployments → Latest → View Logs

**Common Issues:**

**Error: "Cannot connect to database"**
- ✅ Fix: Check DB_* variables use `${{Postgres.PGHOST}}` format
- ✅ Fix: Make sure PostgreSQL service is running

**Error: "JWT secret not found"**
- ✅ Fix: Add JWT_SECRET variable

**Error: "Port 8080 is already in use"**
- ✅ Fix: Railway auto-assigns ports, make sure SERVER_PORT=8082

### Frontend shows blank page

**Check Browser Console (F12):**

**Error: "Failed to fetch"**
- ✅ Fix: Check NEXT_PUBLIC_API_BASE_URL is correct
- ✅ Fix: Check backend is running

**Error: "CORS policy"**
- ✅ Fix: Update ALLOWED_ORIGINS in backend
- ✅ Fix: Make sure URL matches exactly (no trailing /)

### Database connection failed

**Check:**
1. PostgreSQL service is running (green checkmark)
2. Backend can see database variables
3. Database migrations completed

**View Logs:**
- Look for "Flyway" in backend logs
- Should see: "Successfully applied X migrations"

---

## 💰 Cost & Usage

**Free Tier:**
- $5 credit per month
- ~500 execution hours
- Good for development/demo

**Monitor Usage:**
1. Railway Dashboard
2. Click "Usage" tab
3. Watch execution hours

**Tips to save credits:**
- Stop services when not demoing
- Use sleep feature (Hobby plan)

---

## 🔄 Auto-Deploy Setup

**Already configured!**
- Any push to `main` branch = auto deploy
- Railway watches your GitHub repo
- Rebuilds affected services automatically

**Test it:**
```bash
# Make a change
git add .
git commit -m "Update feature"
git push origin main

# Watch Railway → Deployments
# Automatic rebuild starts!
```

---

## 📊 Your Deployment Summary

```
✅ GitHub: https://github.com/annop07/doctora-full
✅ Database: PostgreSQL on Railway
✅ Backend: Spring Boot (Java 21)
✅ Frontend: Next.js 15
✅ Auto-deploy: Enabled
✅ Health checks: Working
✅ Total time: ~20 minutes
```

---

## 🎓 Next Steps

1. ✅ Share frontend URL with friends
2. ✅ Test all features
3. ⏳ Add custom domain (optional)
4. ⏳ Set up monitoring
5. ⏳ Add more features!

---

**Congratulations! 🎉**

Your full-stack application is now live and ready to use!

**Support:**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check RAILWAY_DEPLOYMENT.md for more details
