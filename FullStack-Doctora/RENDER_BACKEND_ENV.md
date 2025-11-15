# 🔑 Backend Environment Variables - Render

## เลือก 1 ใน 2 วิธี:

---

## ✅ วิธีที่ 1: ใช้ตัวแปรแยก (ไม่ต้องแก้ code!) - แนะนำ!

**ใช้ได้เลย ไม่ต้อง commit อะไรเพิ่ม**

### ใน Render → Environment Variables → Add:

```
DB_HOST=<PGHOST-from-database>
DB_PORT=5432
DB_NAME=doctorbook
DB_USERNAME=<PGUSER-from-database>
DB_PASSWORD=<PGPASSWORD-from-database>

JWT_SECRET=<generate-below>
JWT_EXPIRATION=86400000

SERVER_PORT=8082

ALLOWED_ORIGINS=TEMP

SPRING_PROFILES_ACTIVE=prod
```

### วิธีหาค่า:
1. กลับไปที่หน้า Database
2. ดู "Connections" section
3. Copy ค่าจาก:
   - PGHOST → ใส่ใน DB_HOST
   - PGUSER → ใส่ใน DB_USERNAME
   - PGPASSWORD → ใส่ใน DB_PASSWORD

---

## ⚡ วิธีที่ 2: ใช้ DATABASE_URL (ง่ายกว่า!)

**ต้องแก้ไฟล์เดียว แล้ว commit**

### ขั้นตอน:

#### 1. แก้ไฟล์ application.properties

เปิดไฟล์:
```
doctora-spring-boot/src/main/resources/application.properties
```

เพิ่มบรรทัดนี้ **หลัง line 4** (หรือแทนที่ line 5):

```properties
# Database Configuration - Support DATABASE_URL
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5435}/${DB_NAME:doctorbook}}
```

**ไฟล์จะเป็น:**
```properties
# Server Configuration
server.port=${SERVER_PORT:8082}

# Database Configuration - Support DATABASE_URL
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5435}/${DB_NAME:doctorbook}}
spring.datasource.username=${DB_USERNAME:admin}
spring.datasource.password=${DB_PASSWORD:password}
```

#### 2. Commit และ Push

```bash
cd /Users/annopsangsila/Desktop/Project\ year\ 3_1/FullStack-Doctora

git add doctora-spring-boot/src/main/resources/application.properties

git commit -m "Add DATABASE_URL support for Render deployment"

git push origin main
```

#### 3. ใน Render ใส่แค่:

```
DATABASE_URL=<Internal-Database-URL-from-Render>

JWT_SECRET=<generate-below>
JWT_EXPIRATION=86400000

SERVER_PORT=8082

ALLOWED_ORIGINS=TEMP

SPRING_PROFILES_ACTIVE=prod
```

**ตัวอย่าง DATABASE_URL:**
```
postgresql://doctora_user:xxxx@dpg-xxxx-a.singapore-postgres.render.com/doctorbook
```

---

## 🔐 Generate JWT_SECRET

**รันคำสั่งนี้ในเครื่องคุณ:**

```bash
openssl rand -base64 64
```

**หรือ:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

**จะได้ผลลัพธ์แบบนี้:**
```
8vYl9K3mN7pQ2rS5tU6wX8zA1bC4dE7fG9hI2jK5lM8nO0pQ3rS6tU9vX2yZ5aB8cD1eF4gH7iJ0kL3mN6oP9
```

**Copy แล้วใส่ใน JWT_SECRET**

---

## 📋 สรุป

### วิธีที่ 1: ไม่ต้องแก้ code
✅ ใช้ได้ทันที
✅ ไม่ต้อง commit
❌ ต้องกรอก 5 ตัวแปร (DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD)

### วิธีที่ 2: แก้ไฟล์เดียว
✅ กรอกแค่ 1 ตัวแปร (DATABASE_URL)
✅ ง่ายกว่า
❌ ต้อง commit + push (1 นาที)

---

## 💡 คำแนะนำ

**สำหรับคุณ:**

→ **ใช้วิธีที่ 1** ถ้ารีบมาก (ไม่ต้องแก้อะไร)

→ **ใช้วิธีที่ 2** ถ้าอยากง่าย (แก้แค่บรรทัดเดียว)

---

## ✅ หลังใส่ Environment Variables

1. เลื่อนลงล่างสุด
2. คลิก **"Create Web Service"**
3. รอ ~7-10 นาที
4. ดู Logs tab เพื่อติดตามความคืบหน้า

---

**ต้องการความช่วยเหลือเพิ่มเติม?**
- ติดปัญหา → บอกได้เลย!
- พร้อมแล้ว → ไปขั้นตอนต่อไป!
