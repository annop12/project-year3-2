# 🎯 แผนการพัฒนาโปรเจกต์ Cat Tinder ทั้งหมด

## 📊 สถานะปัจจุบัน
- ✅ Database Models ครบทุก Model (Owner, Cat, Swipe, Match, Message)
- ✅ โครงสร้างโปรเจกต์พื้นฐาน + Environment Config
- ✅ NativeWind + Expo Router Setup
- ⚠️ Controllers, Routes, Middlewares ยังว่างหมด
- ⚠️ Frontend ยังมีแค่ Welcome screen

---

## 🏗️ แผนการพัฒนาแบ่งเป็น 4 Phase

### **PHASE 1: Backend API Foundation** (Week 1-2)

#### 1.1 Middlewares
- สร้าง CORS middleware ([src/middlewares/cors.js](backend_cat-tinder/src/middlewares/cors.js))
- สร้าง Error Handler middleware ([src/middlewares/error.js](backend_cat-tinder/src/middlewares/error.js))
- สร้าง JWT Auth middleware ([src/middlewares/auth.js](backend_cat-tinder/src/middlewares/auth.js))

#### 1.2 Authentication System
- **Controller:** auth.controller.js
  - `POST /register` - สมัครสมาชิก (hash password ด้วย bcrypt)
  - `POST /login` - เข้าสู่ระบบ (return JWT token)
  - `GET /profile` - ดูโปรไฟล์ (ต้อง auth)
  - `PUT /profile` - แก้ไขโปรไฟล์
- **Routes:** auth.routes.js - เชื่อม endpoints กับ controller
- **Update:** server.js - ใช้ middlewares + routes

#### 1.3 Cat Management API
- **Controller:** cats.controller.js
  - `POST /cats` - เพิ่มแมวใหม่
  - `GET /cats/my` - ดูแมวของตัวเอง
  - `GET /cats/feed` - ดูแมวสำหรับ swipe (filter: gender, location, purpose)
  - `PUT /cats/:id` - แก้ไขข้อมูลแมว
  - `DELETE /cats/:id` - ลบแมว (set active=false)
  - `POST /cats/:id/photos` - อัปโหลดรูป (ใช้ Cloudinary หรือ local storage)
- **Routes:** cats.routes.js

#### 1.4 Swipe & Match System
- **Controller:** swipes.controller.js
  - `POST /swipes` - บันทึกการ swipe (like/pass) + ตรวจสอบ match
  - `GET /swipes/history` - ประวัติการ swipe
- **Controller:** matches.controller.js
  - `GET /matches` - ดู matches ทั้งหมด
  - `GET /matches/:id` - ดูรายละเอียด match + ข้อมูลติดต่อ
  - `POST /matches/:id/messages` - ส่งข้อความ
  - `GET /matches/:id/messages` - ดูข้อความทั้งหมด
- **Routes:** swipes.routes.js, matches.routes.js

#### 1.5 Seed Script & Testing
- แก้ไข seed.js ให้ hash password ด้วย bcrypt
- เพิ่มข้อมูลทดสอบหลากหลาย (หลายแมว, หลาย owner)
- ทดสอบ API ทุก endpoint ด้วย Postman/Thunder Client

---

### **PHASE 2: Frontend Foundation** (Week 2-3)

#### 2.1 Project Structure Setup
- สร้างโฟลเดอร์:
  - `services/api/` - API client + endpoints
  - `contexts/` - React Context (AuthContext)
  - `components/` - Reusable components
  - `types/` - TypeScript interfaces
  - `utils/` - Helper functions
  - `constants/` - Constants (API URL, colors)

#### 2.2 API Integration
- **services/api/client.ts** - Axios instance + JWT interceptor
- **services/api/auth.ts** - Auth APIs (login, register, profile)
- **services/api/cats.ts** - Cat APIs
- **services/api/swipes.ts** - Swipe APIs
- **services/api/matches.ts** - Match APIs
- **types/index.ts** - TypeScript interfaces สำหรับ API responses

#### 2.3 Authentication Context
- **contexts/AuthContext.tsx**
  - State: user, token, isAuthenticated, isLoading
  - Methods: login(), register(), logout(), updateProfile()
  - AsyncStorage สำหรับเก็บ token

#### 2.4 Navigation Structure
```
app/
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── _layout.tsx       # Tab Navigator
│   ├── home.tsx          # Swipe Screen
│   ├── matches.tsx       # Matches List
│   ├── cats.tsx          # My Cats Management
│   └── profile.tsx       # User Profile
├── cat/
│   ├── add.tsx           # Add Cat Screen
│   └── [id]/edit.tsx     # Edit Cat Screen
├── chat/[matchId].tsx    # Chat Screen
├── _layout.tsx           # Root Layout + AuthContext
└── index.tsx             # Redirect logic
```

---

### **PHASE 3: Core Features Development** (Week 3-5)

#### 3.1 Authentication UI
- **login.tsx** - Login form + validation
- **register.tsx** - Register form + validation
- **profile.tsx** - View/Edit profile, Logout button
- แสดง loading states, error messages

#### 3.2 Cat Management UI
- **cats.tsx** - List แมวของตัวเอง (cards)
- **cat/add.tsx** - Form เพิ่มแมว (ชื่อ, เพศ, อายุ, สายพันธุ์, วัตถุประสงค์, รูป)
- **cat/[id]/edit.tsx** - Form แก้ไขแมว
- **Photo Upload** - Image picker + upload to backend

#### 3.3 Swipe Interface
- **home.tsx (Swipe Screen)**
  - แสดงข้อมูลแมว (รูป, ชื่อ, อายุ, สายพันธุ์, วัตถุประสงค์, ระยะห่าง)
  - ปุ่ม Pass (❌) และ Like (❤️)
  - Animation เมื่อ swipe
  - Filter: เพศ, พื้นที่, วัตถุประสงค์
  - แจ้งเตือนเมื่อ match (modal/toast)

#### 3.4 Match & Chat System
- **matches.tsx** - List matches (cards พร้อมรูปแมว + ชื่อ)
- **chat/[matchId].tsx**
  - แสดงข้อความทั้งหมด (scrollable)
  - Input box + ส่งข้อความ
  - แสดงเวลาส่ง, read status
  - Real-time updates (polling หรือ WebSocket)
- แสดงข้อมูลติดต่อของ owner (Line, Phone, Facebook)

---

### **PHASE 4: Polish & Advanced Features** (Week 5-6)

#### 4.1 UI/UX Improvements
- Loading skeletons
- Error boundaries
- Empty states (ไม่มีแมวเหลือให้ swipe, ไม่มี matches)
- Success/Error toasts
- Pull-to-refresh
- Animations (fade, slide, scale)

#### 4.2 Advanced Features
- **Location-based filtering**
  - ใช้ Expo Location API
  - คำนวณระยะห่างระหว่างแมว
  - Filter by distance radius
- **Search & Filters**
  - ค้นหาตามสายพันธุ์, อายุ
  - Advanced filters (vaccinated, neutered)
- **Push Notifications**
  - แจ้งเตือนเมื่อมี match ใหม่
  - แจ้งเตือนเมื่อมีข้อความใหม่
  - ใช้ Expo Notifications

#### 4.3 Performance Optimization
- Image optimization (lazy loading, caching)
- API response caching
- Debounce/Throttle สำหรับ search
- Pagination สำหรับ feed/matches

#### 4.4 Testing & QA
- Test ทุก user flow
- Test error cases (network error, invalid input)
- Test บนหลาย devices/platforms
- Fix bugs

---

## 📦 Dependencies ที่ต้องติดตั้งเพิ่ม

### Backend
```bash
# Photo upload (ถ้าใช้ Cloudinary)
npm install cloudinary multer

# Input validation
npm install joi express-validator
```

### Frontend
```bash
# HTTP Client
npm install axios

# Storage
npm install @react-native-async-storage/async-storage

# Image Picker
npm install expo-image-picker

# Location
npm install expo-location

# Notifications
npm install expo-notifications

# Additional UI
npm install react-native-toast-message
npm install react-native-gesture-handler react-native-reanimated
```

---

## 🎯 Milestones & Timeline

- **Week 1-2:** Backend API ทั้งหมด + Testing
- **Week 2-3:** Frontend Structure + Auth UI
- **Week 3-4:** Cat Management + Swipe Interface
- **Week 4-5:** Match & Chat System
- **Week 5-6:** Polish + Advanced Features + Testing

---

## ✅ Definition of Done
- [ ] ทุก API endpoint ทำงานได้และมี error handling
- [ ] Authentication flow สมบูรณ์ (register → login → auto-login)
- [ ] CRUD แมวได้ พร้อมอัปโหลดรูป
- [ ] Swipe interface ทำงานได้ + detect match
- [ ] Chat system ทำงานได้ real-time
- [ ] แสดงข้อมูลติดต่อเมื่อ match
- [ ] มี loading/error states ทุกหน้า
- [ ] ทำงานบน iOS, Android, Web
- [ ] Code clean, มี comments, follow best practices