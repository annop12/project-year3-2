# 🐱 Cat Tinder - Full Stack Application 2

แอปพลิเคชันจับคู่แมว ที่ช่วยให้เจ้าของแมวค้นหาคู่ครองหรือเพื่อนสำหรับแมวของตน

## 📁 โครงสร้างโปรเจค

```
cat-tinder/
├── backend_cat-tinder/     # Express.js + MongoDB API
├── front_cat-tinder/       # React Native + Expo App
└── README.md               # เอกสารนี้
```

## 🚀 Quick Start

### ขั้นตอนการติดตั้งทั้งหมด

1. **Clone โปรเจค**
```bash
git clone <your-repo-url>
cd cat-tinder
```

2. **เริ่ม Backend**
```bash
cd backend_cat-tinder
npm install
npm run dev
```

3. **เริ่ม Frontend** (Terminal ใหม่)
```bash
cd front_cat-tinder
npm install
npm start
```

4. **เปิดแอป**
   - สแกน QR code ด้วย Expo Go
   - หรือกด `i` สำหรับ iOS Simulator
   - หรือกด `a` สำหรับ Android Emulator

## 🛠 เทคโนโลยีที่ใช้

### Backend
- **Node.js** + **Express.js** - Web Framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

### Frontend
- **React Native** + **Expo** - Mobile Framework
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based Navigation
- **TypeScript** - Type Safety

## 📱 Features

### ✅ พร้อมใช้งาน
- โครงสร้างโปรเจคสมบูรณ์
- NativeWind + TailwindCSS setup
- Express API server
- MongoDB models
- JWT Authentication setup

### 🚧 กำลังพัฒนา
- [ ] Authentication UI
- [ ] Cat profile management
- [ ] Swipe interface
- [ ] Match system
- [ ] Chat functionality

## 🎯 Development Roadmap

### Week 1: Authentication
- [x] Backend API structure
- [x] JWT authentication setup
- [ ] Login/Register screens
- [ ] User profile management

### Week 2: Cat Management
- [ ] Add cat profile screens
- [ ] Photo upload functionality
- [ ] Cat listing/editing
- [ ] Backend API integration

### Week 3: Core Features
- [ ] Swipe interface (like Tinder)
- [ ] Like/Pass functionality
- [ ] Match detection
- [ ] Basic messaging

### Week 4: Polish & Deploy
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Performance optimization
- [ ] Deployment setup

## 📊 Database Schema

### 🐱 Cat Model
```javascript
{
  ownerId: ObjectId,
  name: String,
  gender: 'male' | 'female',
  ageMonths: Number,
  breed: String,
  purpose: ['mate', 'friend', 'foster'],
  photos: [String],
  location: { province, district, lat, lng },
  active: Boolean
}
```

### 👤 Owner Model
```javascript
{
  email: String,
  passwordHash: String,
  displayName: String,
  avatarUrl: String,
  location: Object,
  contact: { lineId, phone, facebookUrl }
}
```

## 🔧 Development Setup

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local หรือ MongoDB Atlas)
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** หรือ **Android Emulator** (optional)

### Environment Variables

Backend ต้องมีไฟล์ `.env`:
```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/cat_tinder
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES=7d
CORS_ORIGIN=http://localhost:19006,http://localhost:8081
```

## 🚨 Common Issues & Solutions

### Backend ไม่เริ่ม
```bash
# ตรวจสอบ MongoDB ว่าทำงานมั้ย
mongosh cat_tinder

# ตรวจสอบ port ว่าว่างมั้ย
lsof -i :4000
```

### Frontend ไม่เชื่อมต่อ Backend
```bash
# ตรวจสอบ network ใน Expo
# ใช้ tunnel mode ถ้าจำเป็น
npx expo start --tunnel
```

### NativeWind ไม่ทำงาน
```bash
# Clear Metro cache
npx expo start --clear

# ทดสอบใน web browser ก่อน
npx expo start --web
```

## 🤝 การทำงานร่วมกัน

### Git Workflow
```bash
# สร้าง feature branch
git checkout -b feature/auth-screen

# Commit changes
git add .
git commit -m "Add login screen"

# Push และสร้าง PR
git push origin feature/auth-screen
```

### Code Style
- **Backend:** JavaScript (ES6+)
- **Frontend:** TypeScript + React Native
- **Styling:** NativeWind (Tailwind CSS)
- **Naming:** camelCase for variables, PascalCase for components

## 📚 เอกสารเพิ่มเติม

### Backend
- [Backend README](./backend_cat-tinder/README.md) - API documentation และ setup guide
- [API Endpoints](./backend_cat-tinder/README.md#api-endpoints)
- [Database Models](./backend_cat-tinder/README.md#database-models)

### Frontend
- [Frontend README](./front_cat-tinder/README.md) - React Native app documentation
- [Component Structure](./front_cat-tinder/README.md#component-structure)
- [Development Guide](./front_cat-tinder/README.md#development-guide)

## 👥 Team

- **Backend Developer:** รับผิดชอบ API, Database, Authentication
- **Frontend Developer:** รับผิดชอบ UI/UX, Mobile App, Integration
- **Full Stack:** รับผิดชอบทั้งคู่

