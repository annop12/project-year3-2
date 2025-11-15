# 🎨 Deploy to Render - Quick Guide (FREE!)

## ✅ GitHub Ready!
https://github.com/annop07/doctora-full

---

## 🚀 Quick Steps (~25 minutes)

### 1️⃣ Create Render Account (2 min)
1. ไป: **https://render.com**
2. คลิก **"Get Started"**
3. **"Sign up with GitHub"**
4. Authorize

---

### 2️⃣ Create Database (3 min)
1. **"New +"** → **"PostgreSQL"**
2. Name: `doctora-db`
3. Region: **Singapore**
4. Plan: **FREE** ✅
5. **Create**
6. **⚠️ Copy "Internal Database URL"** จากหน้า Connections

ตัวอย่าง:
```
postgresql://doctora:xxx@xxx.internal:5432/doctorbook
```

---

### 3️⃣ Deploy Backend (10 min)

#### Create Service:
1. **"New +"** → **"Web Service"**
2. Connect: `annop07/doctora-full`
3. ตั้งค่า:
   - Name: `doctora-backend`
   - Region: Singapore
   - Branch: `main`
   - **Root Directory:** `doctora-spring-boot` ⚠️
   - Runtime: **Docker** ✅
   - Plan: **FREE** ✅

#### Environment Variables:
เลือก **1 ใน 2 ตัวเลือก:**

**Option A: ใช้ DATABASE_URL (ง่ายกว่า!)** ⭐ แนะนำ

**ก่อนอื่น - แก้ไฟล์เดียว:**
เปิด `doctora-spring-boot/src/main/resources/application.properties`

เพิ่มบรรทัดนี้ (ด้านบนสุด):
```properties
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:doctorbook}}
```

**แล้ว commit + push:**
```bash
cd /Users/annopsangsila/Desktop/Project\ year\ 3_1/FullStack-Doctora
git add doctora-spring-boot/src/main/resources/application.properties
git commit -m "Add DATABASE_URL support for Render"
git push origin main
```

**แล้วใน Render ใส่:**
```
DATABASE_URL=<paste-Internal-Database-URL-here>
JWT_SECRET=<generate-below>
JWT_EXPIRATION=86400000
SERVER_PORT=8082
ALLOWED_ORIGINS=TEMP
SPRING_PROFILES_ACTIVE=prod
```

**Option B: ใช้ตัวแปรแยก (ไม่ต้องแก้ code)**
```
DB_HOST=<from-database-hostname>
DB_PORT=5432
DB_NAME=doctorbook
DB_USERNAME=<from-database>
DB_PASSWORD=<from-database>
JWT_SECRET=<generate-below>
JWT_EXPIRATION=86400000
SERVER_PORT=8082
ALLOWED_ORIGINS=TEMP
SPRING_PROFILES_ACTIVE=prod
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 64
# หรือ
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

#### Deploy:
1. **"Create Web Service"**
2. รอ ~7-10 นาที
3. **Copy backend URL** เมื่อเสร็จ

---

### 4️⃣ Deploy Frontend (8 min)

1. **"New +"** → **"Web Service"**
2. Connect: `annop07/doctora-full`
3. ตั้งค่า:
   - Name: `doctora-frontend`
   - Region: Singapore
   - Branch: `main`
   - **Root Directory:** `FrontendDoctora` ⚠️
   - Runtime: **Docker** ✅
   - Plan: **FREE** ✅

#### Environment Variables:
```
NEXT_PUBLIC_API_BASE_URL=<backend-url-from-step-3>
NODE_ENV=production
```

**ตัวอย่าง:**
```
NEXT_PUBLIC_API_BASE_URL=https://doctora-backend.onrender.com
```

4. **"Create Web Service"**
5. รอ ~5-7 นาที
6. **Copy frontend URL**

---

### 5️⃣ Update CORS (2 min)

1. กลับไป **Backend service**
2. **"Environment"** tab
3. แก้ `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://doctora-frontend.onrender.com
```
4. **"Manual Deploy"** → **"Deploy latest commit"**

---

### 6️⃣ Test! (2 min)

**Backend:**
```
https://doctora-backend.onrender.com/api/health
```

**Frontend:**
```
https://doctora-frontend.onrender.com
```

**⚠️ หมายเหตุ:** อาจช้าครั้งแรก ~30 วินาที (wake from sleep)

---

## 🎉 เสร็จแล้ว!

### URLs:
- Frontend: `https://doctora-frontend.onrender.com`
- Backend: `https://doctora-backend.onrender.com`

### ฟรี! 💰
- $0/month
- No credit card
- Forever!

---

## 💡 Tips

### Sleep Mode:
- Services sleep หลัง 15 นาที
- Wake up: ~30 วินาที
- ก่อน demo: เปิด URL ล่วงหน้า

### Keep Awake (FREE):
1. https://uptimerobot.com
2. Add monitor: `https://doctora-backend.onrender.com/api/health`
3. Interval: 5 minutes
4. Done!

---

## 🐛 ปัญหา?

**Backend ไม่ขึ้น:**
- ดู Logs tab
- เช็ค DATABASE_URL ถูกต้องมั้ย

**Frontend error:**
- F12 → Console
- เช็ค NEXT_PUBLIC_API_BASE_URL

**Sleep mode:**
- รอ 30 วินาที
- Refresh อีกครั้ง

---

**ไฟล์เต็ม:** RENDER_DEPLOYMENT.md

**Good luck! 🚀**
