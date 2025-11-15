# 🔧 Backend Environment Variables - Step by Step

## ขั้นตอนที่คุณอยู่: กำลังตั้งค่า Backend

---

## 📋 Environment Variables ที่ต้องใส่ (ทั้งหมด 10 ตัว)

### ขั้นตอน:
1. **อยู่ที่หน้า "Create Web Service"**
2. **เลื่อนลงมาจนเจอ "Environment Variables"**
3. **คลิก "Add Environment Variable"**
4. **กรอกทีละตัวตามด้านล่าง**

---

## 1️⃣ Database Variables (5 ตัว)

### วิธีหาค่า:
**เปิดหน้าต่างใหม่** → ไปที่ **Dashboard** → คลิก **Database ที่สร้างไว้** → เลื่อนลงหา **"Connections"**

จะเห็น:
```
PGHOST:     dpg-xxxxx-a.singapore-postgres.render.com
PGPORT:     5432
PGDATABASE: doctorbook
PGUSER:     doctora_xxxxx
PGPASSWORD: xxxxxxxxxxxxxxxxxx
```

### ใส่ใน Render:

#### ตัวที่ 1:
```
Key:   DB_HOST
Value: (copy จาก PGHOST)
```
**ตัวอย่าง:** `dpg-ct5abcde12345-a.singapore-postgres.render.com`

#### ตัวที่ 2:
```
Key:   DB_PORT
Value: 5432
```
**พิมพ์ตัวเลข:** `5432`

#### ตัวที่ 3:
```
Key:   DB_NAME
Value: doctorbook
```
**พิมพ์:** `doctorbook`

#### ตัวที่ 4:
```
Key:   DB_USERNAME
Value: (copy จาก PGUSER)
```
**ตัวอย่าง:** `doctora_user_abcd`

#### ตัวที่ 5:
```
Key:   DB_PASSWORD
Value: (copy จาก PGPASSWORD)
```
**ตัวอย่าง:** รหัสยาวๆ เช่น `xkP9mN2lQ5wR8...`

---

## 2️⃣ JWT Secret (1 ตัว)

### Generate JWT Secret:

**เปิด Terminal ในเครื่องคุณ และรันคำสั่งนี้:**

**Mac/Linux:**
```bash
openssl rand -base64 64
```

**หรือใช้ Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

**จะได้ผลลัพธ์แบบนี้:**
```
8vYl9K3mN7pQ2rS5tU6wX8zA1bC4dE7fG9hI2jK5lM8nO0pQ3rS6tU9vX2yZ5aB8cD1eF4gH7iJ0kL3mN6oP9qRsT2uVwXyZ
```

#### ตัวที่ 6:
```
Key:   JWT_SECRET
Value: (paste ค่าที่ generate ได้)
```

---

## 3️⃣ JWT Expiration (1 ตัว)

#### ตัวที่ 7:
```
Key:   JWT_EXPIRATION
Value: 86400000
```
**พิมพ์ตัวเลข:** `86400000` (= 24 ชั่วโมง)

---

## 4️⃣ Server Port (1 ตัว)

#### ตัวที่ 8:
```
Key:   SERVER_PORT
Value: 8082
```
**พิมพ์ตัวเลข:** `8082`

---

## 5️⃣ CORS (1 ตัว - จะแก้ทีหลัง)

#### ตัวที่ 9:
```
Key:   ALLOWED_ORIGINS
Value: TEMP
```
**พิมพ์:** `TEMP` (จะมาแก้ทีหลังหลัง frontend deploy เสร็จ)

---

## 6️⃣ Spring Profile (1 ตัว)

#### ตัวที่ 10:
```
Key:   SPRING_PROFILES_ACTIVE
Value: prod
```
**พิมพ์:** `prod`

---

## ✅ Checklist ก่อนกด Create

ตรวจสอบว่าใส่ครบ **10 ตัว:**

- [ ] DB_HOST (จาก PGHOST)
- [ ] DB_PORT (5432)
- [ ] DB_NAME (doctorbook)
- [ ] DB_USERNAME (จาก PGUSER)
- [ ] DB_PASSWORD (จาก PGPASSWORD)
- [ ] JWT_SECRET (generate ใหม่)
- [ ] JWT_EXPIRATION (86400000)
- [ ] SERVER_PORT (8082)
- [ ] ALLOWED_ORIGINS (TEMP)
- [ ] SPRING_PROFILES_ACTIVE (prod)

---

## 🚀 พร้อมแล้ว?

1. **เลื่อนลงล่างสุด**
2. **คลิก "Create Web Service"**
3. **Render จะเริ่ม build** (~7-10 นาที)

---

## 📊 ดูความคืบหน้า

หลังกด Create:

1. **จะเปลี่ยนไปหน้า Service Dashboard**
2. **คลิก "Logs" tab** (ด้านบน)
3. **ดู build progress:**
   - `Downloading dependencies...`
   - `Building with Maven...`
   - `Creating Docker image...`
   - `Starting application...`
   - **สำเร็จ:** `Started DoctoraliaApplication`

---

## ⏱️ ระยะเวลาโดยประมาณ

- **Download dependencies:** ~3 นาที
- **Maven build:** ~3 นาที
- **Docker build:** ~2 นาที
- **Start application:** ~1 นาที

**รวม:** ~7-10 นาที ☕

---

## 🐛 ถ้ามี Error

**ดูที่ Logs:**

**Error: "Cannot connect to database"**
- ✅ เช็ค DB_HOST, DB_USERNAME, DB_PASSWORD
- ✅ ใช้ค่าจาก **PGHOST** (ไม่ใช่ External Host)

**Error: "JWT secret not found"**
- ✅ เช็คว่าใส่ JWT_SECRET แล้ว

**Error: "Build timeout"**
- ✅ รอต่อ อาจใช้เวลานานกว่าปกติ (free tier)

---

## ✅ เมื่อ Deploy สำเร็จ

1. **จะเห็น "Live" สีเขียว** ด้านบนซ้าย
2. **จะมี URL** เช่น: `https://doctora-backend.onrender.com`
3. **Copy URL นี้เก็บไว้!** จะใช้ใน Frontend

**ทดสอบ:**
```
https://doctora-backend.onrender.com/api/health
```

ควรได้:
```json
{
  "status": "UP",
  "database": "UP"
}
```

---

## 📝 หลังจากนี้

**ขั้นตอนถัดไป:**
1. ✅ Backend deployed
2. ⏳ Deploy Frontend
3. ⏳ Update CORS
4. ⏳ Test!

---

**มีคำถามไหม? หรือพร้อมกด Create แล้ว?** 🚀
