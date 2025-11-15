# 🚀 Cat Tinder Development Setup Guide

คู่มือติดตั้งและเริ่มใช้งานโปรเจค Cat Tinder สำหรับเพื่อนที่จะมาช่วยพัฒนาต่อ

## 📋 Prerequisites (สิ่งที่ต้องติดตั้งก่อน)

### 1. Node.js และ npm
```bash
# ตรวจสอบ version
node --version  # ควรเป็น v18 ขึ้นไป
npm --version

# ถ้ายังไม่มี download ที่: https://nodejs.org/
```

### 2. MongoDB
```bash
# macOS (ใช้ Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# หรือ download ที่: https://www.mongodb.com/try/download/community
```

### 3. Expo CLI
```bash
npm install -g @expo/cli
```

### 4. Git
```bash
git --version
# ถ้ายังไม่มี: https://git-scm.com/downloads
```

## 🔽 การ Clone และ Setup

### 1. Clone Repository
```bash
# Clone โปรเจค
git clone [YOUR_REPO_URL]
cd cat-tinder

# ตรวจสอบโครงสร้าง
ls -la
# ควรเห็น: backend_cat-tinder/, front_cat-tinder/, README.md
```

### 2. Setup Backend
```bash
cd backend_cat-tinder

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env
cp .env.example .env

# แก้ไขไฟล์ .env (ใช้ text editor ที่ถนัด)
nano .env
# หรือ
code .env
```

**แก้ไขไฟล์ .env:**
```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/cat_tinder
JWT_SECRET=super-secret-key-change-this-in-production
JWT_EXPIRES=7d
CORS_ORIGIN=http://localhost:19006,http://localhost:8081,http://localhost:3000
```

### 3. Setup Frontend
```bash
# เปิด terminal ใหม่
cd front_cat-tinder

# ติดตั้ง dependencies
npm install
```

## 🗄 Database Setup

### 1. เริ่ม MongoDB
```bash
# เริ่ม MongoDB service
brew services start mongodb/brew/mongodb-community

# หรือเริ่มแบบ manual
mongod

# ตรวจสอบว่า MongoDB ทำงาน
mongosh
# ควรเข้าไปใน MongoDB shell ได้
```

### 2. สร้าง Database (อัตโนมัติ)
MongoDB จะสร้าง database อัตโนมัติเมื่อมีการเชื่อมต่อครั้งแรก

## 🚀 การรันโปรเจค

### 1. เริ่ม Backend (Terminal 1)
```bash
cd backend_cat-tinder
npm run dev

# ควรเห็น:
# 🚀 API is running on http://localhost:4000
# MongoDB connected successfully
```

### 2. ทดสอบ Backend
```bash
# เปิด browser หรือใช้ curl
curl http://localhost:4000/health

# ควรได้ response:
# {"ok": true, "message": "API is running 🚀"}
```

### 3. เริ่ม Frontend (Terminal 2)
```bash
cd front_cat-tinder
npm start

# หรือ
npx expo start
```

### 4. เปิดแอป
- **📱 Phone:** ติดตั้ง Expo Go app และสแกน QR code
- **💻 iOS Simulator:** กด `i` ใน terminal
- **🤖 Android Emulator:** กด `a` ใน terminal
- **🌐 Web Browser:** กด `w` ใน terminal

## ✅ การตรวจสอบว่าทุกอย่างทำงาน

### Backend Checklist
- [ ] `npm run dev` ทำงานไม่มี error
- [ ] เข้า `http://localhost:4000/health` ได้
- [ ] MongoDB เชื่อมต่อสำเร็จ
- [ ] ไม่มี error ใน console

### Frontend Checklist
- [ ] `npm start` ทำงานไม่มี error
- [ ] QR code แสดงใน terminal
- [ ] เปิดแอปใน Expo Go ได้
- [ ] เห็นหน้า "Welcome to ReState"

## 🐛 Troubleshooting

### Backend ไม่ทำงาน

**MongoDB Connection Error:**
```bash
# ตรวจสอบ MongoDB ทำงานมั้ย
brew services list | grep mongodb

# เริ่ม MongoDB ใหม่
brew services restart mongodb/brew/mongodb-community
```

**Port Already in Use:**
```bash
# หา process ที่ใช้ port 4000
lsof -i :4000

# ฆ่า process (แทน PID ด้วยเลขที่ได้)
kill -9 [PID]
```

### Frontend ไม่ทำงาน

**Metro Bundler Issues:**
```bash
# Clear cache
npx expo start --clear

# หรือ
rm -rf node_modules/.cache
npm start
```

**Network Issues:**
```bash
# ใช้ tunnel mode
npx expo start --tunnel
```

**NativeWind ไม่แสดงผล:**
```bash
# ทดสอบใน web ก่อน
npx expo start --web
```

## 📂 โครงสร้างการทำงาน

### Git Workflow
```bash
# ดู branch ปัจจุบัน
git branch

# สร้าง feature branch
git checkout -b feature/your-feature-name

# เวลา commit
git add .
git commit -m "Add: your feature description"

# Push branch
git push origin feature/your-feature-name
```

## 🎯 ขั้นตอนถัดไป

1. **อ่าน README ในแต่ละโฟลเดอร์**
   - [Backend README](./backend_cat-tinder/README.md)
   - [Frontend README](./front_cat-tinder/README.md)

2. **เลือก feature ที่จะทำ**
   - Authentication screens
   - Cat profile management
   - Swipe interface
   - Chat functionality

3. **เริ่มพัฒนา**
   - สร้าง branch ใหม่
   - เขียนโค้ด
   - Test
   - Commit และ Push

## 📞 ขอความช่วยเหลือ

หากติดปัญหา:
1. ตรวจสอบ [Troubleshooting](#-troubleshooting) ก่อน
2. ดูใน Issues ของ GitHub repo
3. สร้าง Issue ใหม่พร้อมรายละเอียดปัญหา

## 🎉 เสร็จแล้ว!

ถ้าทุกอย่างทำงานแล้ว คุณพร้อมเริ่มพัฒนา Cat Tinder แล้ว! 🐱✨