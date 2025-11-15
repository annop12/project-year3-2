# 🎨 Render Deployment Guide - FREE Forever!

## ✅ GitHub Done!
- Repository: https://github.com/annop07/doctora-full
- Code pushed successfully ✅

---

## 🎯 Render Deployment Steps

**Total Time:** ~25-30 นาที
**Cost:** $0 (FREE Forever!)

---

## Step 1: Create Render Account (2 minutes)

1. **ไปที่:** https://render.com
2. **คลิก:** "Get Started"
3. **เลือก:** "Sign up with GitHub"
4. **Authorize:** Render
5. ✅ **Done!** เข้าสู่ Render Dashboard

---

## Step 2: Deploy PostgreSQL Database (3 minutes)

### 2.1 Create Database
1. **คลิก:** "New +" (มุมขวาบน)
2. **เลือก:** "PostgreSQL"
3. **ตั้งค่า:**
   - **Name:** `doctora-db`
   - **Database:** `doctorbook`
   - **User:** `doctora` (หรืออะไรก็ได้)
   - **Region:** Singapore (ใกล้ที่สุด)
   - **Plan:** **Free** ✅
4. **คลิก:** "Create Database"
5. **รอ:** ~1-2 นาที

### 2.2 Copy Database Credentials
1. **เลื่อนลง** ไปที่ "Connections"
2. **Copy ค่าเหล่านี้เก็บไว้:**
   - **Internal Database URL** (สำคัญ!)
   - **Hostname**
   - **Port**
   - **Database**
   - **Username**
   - **Password**

**หรือ** Copy แค่ **Internal Database URL** ก็พอ:
```
postgresql://doctora:xxx@xxx.internal:5432/doctorbook
```

✅ **Done!** Database พร้อมแล้ว

---

## Step 3: Deploy Backend (Spring Boot) (10 minutes)

### 3.1 Create Web Service
1. **คลิก:** "New +" → "Web Service"
2. **Connect Repository:**
   - คลิก "Connect account" (ถ้ายังไม่ได้เชื่อม)
   - เลือก `annop07/doctora-full`
   - คลิก "Connect"

### 3.2 Configure Service
**ตั้งค่าดังนี้:**

- **Name:** `doctora-backend`
- **Region:** Singapore
- **Branch:** `main`
- **Root Directory:** `doctora-spring-boot` ⚠️ สำคัญ!
- **Runtime:** `Docker` ✅ (Render จะ detect Dockerfile)
- **Plan:** **Free** ✅

### 3.3 Add Environment Variables
**เลื่อนลงไปที่ "Environment Variables"**

**คลิก "Add Environment Variable"** แล้วเพิ่มทีละตัว:

#### Option 1: ใช้ตัวแปรแยก (แนะนำ - ไม่ต้องแก้ code!)

```
DB_HOST=<hostname-from-step-2.2>
DB_PORT=5432
DB_NAME=doctorbook
DB_USERNAME=<username-from-step-2.2>
DB_PASSWORD=<password-from-step-2.2>

JWT_SECRET=<generate-below>
JWT_EXPIRATION=86400000

SERVER_PORT=8082

ALLOWED_ORIGINS=WILL_UPDATE_LATER

SPRING_PROFILES_ACTIVE=prod
```

#### Generate JWT Secret:
```bash
# รันในเครื่องคุณ:
openssl rand -base64 64

# หรือ:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Copy ผลลัพธ์แล้วใส่ใน JWT_SECRET
```

#### Option 2: ใช้ DATABASE_URL (ง่ายกว่า!)

**ถ้าไม่อยากใส่ทีละตัว:**

แก้ไข `application.properties` เพิ่ม:
```properties
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/doctorbook}
```

แล้วใน Render ใส่แค่:
```
DATABASE_URL=<Internal-Database-URL-from-step-2.2>
JWT_SECRET=<your-generated-secret>
JWT_EXPIRATION=86400000
SERVER_PORT=8082
ALLOWED_ORIGINS=WILL_UPDATE_LATER
SPRING_PROFILES_ACTIVE=prod
```

**แนะนำ Option 2** - ง่ายกว่า!

### 3.4 Create Service
1. **เลื่อนลงล่าง**
2. **คลิก:** "Create Web Service"
3. **รอ:** ~7-10 นาที (Maven build)

**ดู Logs:**
- ไปที่ "Logs" tab
- ควรเห็น:
  - `Downloading dependencies...`
  - `Building with Maven...`
  - `Started DoctoraliaApplication`

### 3.5 Copy Backend URL
1. **เมื่อ deploy สำเร็จ** (เห็น "Live")
2. **Copy URL** ที่ด้านบน (เช่น: `https://doctora-backend.onrender.com`)
3. **⚠️ เก็บ URL นี้ไว้!** จะใช้ใน Frontend

✅ **Done!** Backend live แล้ว!

---

## Step 4: Deploy Frontend (Next.js) (8 minutes)

### 4.1 Create Web Service
1. **คลิก:** "New +" → "Web Service"
2. **เลือก:** `annop07/doctora-full`
3. **คลิก:** "Connect"

### 4.2 Configure Service
**ตั้งค่า:**

- **Name:** `doctora-frontend`
- **Region:** Singapore
- **Branch:** `main`
- **Root Directory:** `FrontendDoctora` ⚠️ สำคัญ!
- **Runtime:** `Docker` ✅
- **Plan:** **Free** ✅

### 4.3 Add Environment Variables
```
NEXT_PUBLIC_API_BASE_URL=<backend-url-from-step-3.5>

NODE_ENV=production
```

**ตัวอย่าง:**
```
NEXT_PUBLIC_API_BASE_URL=https://doctora-backend.onrender.com
```

### 4.4 Create Service
1. **คลิก:** "Create Web Service"
2. **รอ:** ~5-7 นาที (Next.js build)

**ดู Logs:**
- ควรเห็น:
  - `npm install...`
  - `Building Next.js...`
  - `Server running on port 3000`

### 4.5 Copy Frontend URL
1. **เมื่อ deploy สำเร็จ**
2. **Copy URL** (เช่น: `https://doctora-frontend.onrender.com`)

✅ **Done!** Frontend live แล้ว!

---

## Step 5: Update Backend CORS (3 minutes)

### 5.1 Update Environment Variable
1. **กลับไปที่ Backend service**
2. **ไปที่ "Environment" tab**
3. **หา** `ALLOWED_ORIGINS`
4. **แก้เป็น:** Frontend URL

```
ALLOWED_ORIGINS=https://doctora-frontend.onrender.com
```

**⚠️ ระวัง:**
- ไม่มี trailing slash (/)
- ใช้ https://
- Copy URL ให้ถูกต้อง

### 5.2 Redeploy
1. **ไปที่ "Manual Deploy" ด้านบน**
2. **คลิก:** "Deploy latest commit"
3. **รอ:** ~2-3 นาที

✅ **Done!** CORS configured!

---

## Step 6: Test Your Deployment! 🎉 (5 minutes)

### 6.1 Test Backend Health
**เปิด browser:**
```
https://doctora-backend.onrender.com/api/health
```

**ควรได้:**
```json
{
  "status": "UP",
  "database": "UP",
  "service": "Doctora Backend API"
}
```

**⚠️ หมายเหตุ:** ถ้า backend sleep อยู่ อาจใช้เวลา ~30 วินาทีในการ wake up

### 6.2 Test Backend API
```
https://doctora-backend.onrender.com/api/specialties
```

**ควรได้:** JSON array ของ specialties

### 6.3 Test Frontend
**เปิด browser:**
```
https://doctora-frontend.onrender.com
```

**Check:**
- ✅ Page loads (อาจช้านิดหนึ่งครั้งแรก)
- ✅ Specialties display
- ✅ Images load
- ✅ No console errors (F12)

### 6.4 Test Full Flow
1. **Register** new account
2. **Login**
3. **Browse doctors**
4. **Book appointment**

✅ **Success!** App is live!

---

## 🎉 Your App is Deployed!

### Your URLs:
- **Frontend:** https://doctora-frontend.onrender.com
- **Backend:** https://doctora-backend.onrender.com
- **GitHub:** https://github.com/annop07/doctora-full

### Share:
- Frontend URL for users
- GitHub for code review
- **FREE Forever!** 🎉

---

## 💡 Important: Render Free Tier Limits

### Sleep Mode
- **Services sleep after 15 minutes of inactivity**
- **Cold start:** ~30 seconds to wake up
- **Solution:** First request might be slow

### How to Handle:
1. **For Demo:** Wake up services before presentation
   - Open backend URL
   - Open frontend URL
   - Wait 30 seconds

2. **Keep Awake (Free):**
   - Use UptimeRobot (https://uptimerobot.com)
   - Ping your app every 14 minutes
   - **Free tier:** 50 monitors

3. **Upgrade to Paid:** $7/month per service (no sleep)

---

## 🐛 Troubleshooting

### Backend fails to start

**Check Logs:** Backend service → Logs

**Common Issues:**

1. **Database connection failed**
   - ✅ Check DB variables are correct
   - ✅ Use **Internal Database URL** (not External)
   - ✅ Make sure database is in same region

2. **JWT secret missing**
   - ✅ Add JWT_SECRET variable

3. **Build timeout**
   - ✅ Normal for free tier
   - ✅ Wait a bit longer (10-15 minutes)

### Frontend shows errors

**Check Browser Console (F12):**

1. **"Failed to fetch"**
   - ✅ Check NEXT_PUBLIC_API_BASE_URL
   - ✅ Wait for backend to wake up

2. **"CORS error"**
   - ✅ Update ALLOWED_ORIGINS in backend
   - ✅ Redeploy backend

### Services are sleeping

**Wake them up:**
1. Visit backend URL first
2. Wait ~30 seconds
3. Visit frontend URL
4. Wait ~30 seconds
5. Try again

---

## 🚀 Auto-Deploy Setup

**Already configured!**
- Push to `main` = auto deploy
- Render watches your GitHub repo
- Rebuilds automatically

**Test:**
```bash
git add .
git commit -m "Update"
git push origin main

# Watch Render → Events
# Auto deploy starts!
```

---

## 💰 Cost Breakdown

```
PostgreSQL: FREE (1GB storage)
Backend: FREE (with sleep mode)
Frontend: FREE (with sleep mode)
Total: $0/month forever! 🎉
```

**Compare with Railway:**
```
Railway: $5 credit (500 hours)
Then: $5-10/month
```

**Render = Save money!** 💰

---

## 🔄 Handling Sleep Mode

### Option 1: Accept It (Free)
- Good for: Portfolio, demos, low-traffic
- First request: ~30s
- After that: Fast!

### Option 2: Keep Awake (Free with UptimeRobot)
1. Go to https://uptimerobot.com
2. Add monitors:
   - `https://doctora-backend.onrender.com/api/health`
   - `https://doctora-frontend.onrender.com`
3. Set interval: 5 minutes
4. Done! Always awake

### Option 3: Upgrade ($7/month per service)
- No sleep mode
- Always fast
- Better for production

---

## 📊 Deployment Summary

```
✅ GitHub: https://github.com/annop07/doctora-full
✅ Database: PostgreSQL on Render (FREE)
✅ Backend: Spring Boot @ Render (FREE)
✅ Frontend: Next.js @ Render (FREE)
✅ Auto-deploy: Enabled
✅ Total cost: $0/month
✅ Sleep mode: Yes (15 min)
✅ Code changes: NONE needed!
```

---

## 🎓 Next Steps

1. ✅ Share frontend URL
2. ✅ Test all features
3. ✅ Set up UptimeRobot (keep awake)
4. ⏳ Add custom domain (optional)
5. ⏳ Monitor usage

---

## 🆚 Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| **Cost** | FREE forever ✅ | $5 credit |
| **Sleep** | Yes (15 min) | No |
| **Setup** | 25 min | 20 min |
| **Code changes** | NONE ✅ | NONE ✅ |

**You chose wisely!** 🎉

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Status:** https://status.render.com

---

**Congratulations! 🎉**

Your app is deployed on Render - **FREE Forever!**

No credit card required. No time limits. Just free hosting! 🚀
