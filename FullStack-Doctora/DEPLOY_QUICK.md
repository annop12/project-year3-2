# 🚀 Deploy Quick Guide - Copy & Paste

## ✅ Git Ready! ต่อไปทำตามนี้:

### 1️⃣ สร้าง GitHub Repository (2 นาที)

1. ไปที่: https://github.com/new
2. ตั้งชื่อ: `doctora-booking` หรืออะไรก็ได้
3. **Public** ✅ (สำคัญ! สำหรับ Railway free tier)
4. **อย่าติ้ก** "Add README"
5. คลิก "Create repository"

### 2️⃣ Push Code (1 นาที)

**Copy คำสั่งนี้** แล้ว **แก้ YOUR_USERNAME** ให้เป็น GitHub username ของคุณ:

```bash
cd /Users/annopsangsila/Desktop/Project\ year\ 3_1/FullStack-Doctora

git remote add origin https://github.com/YOUR_USERNAME/doctora-booking.git

git push -u origin main
```

✅ **เสร็จ!** Code อยู่บน GitHub แล้ว

---

### 3️⃣ Deploy บน Railway (15 นาที)

#### A. สร้าง Account
1. ไป: https://railway.app
2. คลิก **"Login"** → **"Sign in with GitHub"**
3. Authorize Railway

#### B. สร้าง Project
1. คลิก **"New Project"** → **"Empty Project"**
2. ตั้งชื่อ: `doctora`

#### C. เพิ่ม Database
1. คลิก **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. รอ 30 วินาที ✅

#### D. Deploy Backend
1. คลิก **"+ New"** → **"GitHub Repo"**
2. เลือก repo ของคุณ
3. เลือก **"doctora-spring-boot"**
4. ไปที่ **"Variables"** tab
5. **Copy-paste ทั้งหมดนี้:**

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=CHANGE_THIS_TO_YOUR_GENERATED_SECRET
JWT_EXPIRATION=86400000
SERVER_PORT=8082
ALLOWED_ORIGINS=WILL_UPDATE_LATER
SPRING_PROFILES_ACTIVE=prod
```

6. **Generate JWT_SECRET:**
   - รันคำสั่งนี้ใน terminal:
   ```bash
   openssl rand -base64 64
   ```
   - Copy ผลลัพธ์
   - แก้ `JWT_SECRET=` ใน Railway

7. **Generate Domain:**
   - ไปที่ **Settings** → **Networking**
   - คลิก **"Generate Domain"**
   - **Copy URL** (เช่น `https://doctora-backend-production.up.railway.app`)
   - **เก็บไว้!**

8. รอ build (~5-7 นาที) ☕

#### E. Deploy Frontend
1. คลิก **"+ New"** → **"GitHub Repo"**
2. เลือก repo เดิม
3. เลือก **"FrontendDoctora"**
4. ไปที่ **"Variables"** tab
5. เพิ่ม:

```env
NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND-URL-FROM-STEP-D7.up.railway.app
NODE_ENV=production
```

**แก้ URL** ให้ตรงกับ backend ที่ copy ไว้!

6. **Generate Domain:**
   - Settings → Networking → Generate Domain
   - **Copy frontend URL**

7. รอ build (~3-5 นาที) ☕

#### F. อัพเดท CORS
1. กลับไปที่ **Backend service**
2. **Variables** tab
3. แก้ `ALLOWED_ORIGINS=` ให้เป็น frontend URL:
```
ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app
```

4. Backend จะ redeploy อัตโนมัติ (~2 นาที)

---

### 4️⃣ Test! (2 นาที)

#### Test Backend:
```bash
curl https://your-backend-url.up.railway.app/api/health
```

ควรได้:
```json
{
  "status": "UP",
  "database": "UP"
}
```

#### Test Frontend:
เปิด browser: `https://your-frontend-url.up.railway.app`

---

## 🎉 เสร็จแล้ว!

**URLs ของคุณ:**
- Frontend: https://your-frontend.up.railway.app
- Backend: https://your-backend.up.railway.app

**แชร์ frontend URL ได้เลย!**

---

## 🐛 ถ้ามีปัญหา

### Backend ไม่ขึ้น:
1. คลิก backend service → Deployments → View Logs
2. หา error message
3. มักเป็น:
   - Database ไม่เชื่อม → เช็ค DB_* variables
   - JWT_SECRET ไม่ได้ใส่ → เพิ่มให้ครบ

### Frontend ไม่โหลด:
1. เปิด browser console (F12)
2. ดู error
3. มักเป็น:
   - ไม่เจอ backend → เช็ค NEXT_PUBLIC_API_BASE_URL
   - CORS error → เช็ค ALLOWED_ORIGINS ใน backend

### ถามได้ที่:
- Railway Discord: https://discord.gg/railway
- ดูเอกสารเต็ม: RAILWAY_DEPLOYMENT.md

---

## 📋 Checklist

- [ ] GitHub repo สร้างแล้ว
- [ ] Code push แล้ว
- [ ] Railway account มีแล้ว
- [ ] Database deployed ✅
- [ ] Backend deployed ✅
- [ ] Backend domain generated และ copy แล้ว
- [ ] Frontend deployed ✅
- [ ] Frontend domain generated
- [ ] Backend CORS updated
- [ ] Health check passed
- [ ] Frontend loads
- [ ] ลองสมัครสมาชิก
- [ ] **เสร็จ!** 🎉

---

**Total time: ~20-25 นาที**

**Good luck! 🚀**
