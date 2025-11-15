# 📱 Cat Tinder Frontend Guide

## ✅ สิ่งที่สร้างเสร็จแล้ว

### 1. Foundation
- ✅ TypeScript types ([types/index.ts](types/index.ts))
- ✅ API Client ([services/api/](services/api/))
- ✅ AuthContext ([contexts/AuthContext.tsx](contexts/AuthContext.tsx))
- ✅ Constants & Config ([constants/config.ts](constants/config.ts))

### 2. Screens
- ✅ **Owner Selection** ([app/index.tsx](app/index.tsx))
- ✅ **Home/Swipe Screen** ([app/(tabs)/home.tsx](app/(tabs)/home.tsx))
- ✅ **Matches List** ([app/(tabs)/matches.tsx](app/(tabs)/matches.tsx))
- ✅ **Profile** ([app/(tabs)/profile.tsx](app/(tabs)/profile.tsx))
- ✅ **Chat** ([app/chat/[id].tsx](app/chat/[id].tsx))

### 3. Navigation
- ✅ Tab Navigator with 3 tabs (Swipe, Matches, Profile)
- ✅ Modal navigation for Chat screen

---

## 🚀 วิธีรันแอป

### ขั้นตอนที่ 1: เริ่ม Backend (ต้องรันก่อน!)

```bash
# Terminal 1 - Backend
cd backend_cat-tinder
npm run dev
```

ตรวจสอบว่า Backend ทำงาน:
```bash
curl http://localhost:4000/health
# ควรได้: {"ok":true,"message":"API is running 🚀"}
```

### ขั้นตอนที่ 2: เริ่ม Frontend

```bash
# Terminal 2 - Frontend
cd front_cat-tinder
npm start
```

### ขั้นตอนที่ 3: เปิดแอป

เลือกวิธีใดวิธีหนึ่ง:

**Option A: Expo Go (แนะนำ - ง่ายที่สุด)**
1. ติดตั้ง [Expo Go](https://expo.dev/go) บนมือถือ
2. สแกน QR code จาก terminal
3. แอปจะเปิดใน Expo Go

**Option B: iOS Simulator (macOS เท่านั้น)**
```bash
# กด 'i' ใน terminal ที่รัน npm start
```

**Option C: Android Emulator**
```bash
# กด 'a' ใน terminal ที่รัน npm start
```

**Option D: Web Browser (ทดสอบเบื้องต้น)**
```bash
# กด 'w' ใน terminal ที่รัน npm start
```

---

## 📱 User Flow

### 1. Login (Owner Selection)
- เปิดแอป → เห็นหน้า "Cat Tinder"
- เลือก Owner ID:
  - **Quick Select:** กดปุ่ม "Owner 1" หรือ "Owner 2"
  - **Manual:** Paste Owner ID จาก backend seed
- กด "Continue"
- จะ redirect ไป Home screen

### 2. Swipe Screen (Home Tab)
- เห็นการ์ดแมว (ตอนนี้เป็น mock data)
- กดปุ่ม ❤️ = Like
- กดปุ่ม ❌ = Pass
- ถ้า match → แสดง alert "It's a Match!"

### 3. Matches Screen
- แสดงรายการ matches ทั้งหมด
- Pull to refresh เพื่อโหลดใหม่
- กดที่ match → เปิดหน้าแชท

### 4. Chat Screen
- แสดงข้อความทั้งหมด
- พิมพ์ข้อความและกดส่ง
- ข้อความจะถูกบันทึกใน database

### 5. Profile Screen
- แสดงข้อมูล Owner ID
- กด Logout → ลบ Owner ID และกลับไปหน้า login

---

## 🧪 การทดสอบ

### Test Case 1: Login Flow
1. เปิดแอป
2. กด "Owner 1 (Demo User)"
3. กด "Continue"
4. ✅ ควรเข้าสู่ Home screen

### Test Case 2: View Matches
1. Login เป็น Owner 1
2. ไปที่ tab "Matches"
3. ✅ ควรเห็นรายการ matches (ถ้าเคย match ไว้)
4. Pull down to refresh

### Test Case 3: Chat
1. ไปที่ tab "Matches"
2. กดที่ match ใดก็ได้
3. พิมพ์ "Hello!" และกดส่ง
4. ✅ ข้อความควรปรากฏในแชท

### Test Case 4: Logout
1. ไปที่ tab "Profile"
2. กด "Logout"
3. กด "Logout" ใน alert
4. ✅ ควรกลับไปหน้า login

---

## 🐛 Troubleshooting

### 1. แอปไม่เชื่อมต่อ Backend

**อาการ:** Error "Network request failed" หรือ timeout

**แก้ไข:**
```bash
# 1. ตรวจสอบ Backend ทำงานอยู่หรือไม่
curl http://localhost:4000/health

# 2. ถ้าใช้ Expo Go บนมือถือ ต้องแก้ API_URL
# แก้ไฟล์ constants/config.ts:
export const API_URL = 'http://YOUR_COMPUTER_IP:4000';  // เช่น 'http://192.168.1.100:4000'

# 3. หรือใช้ tunnel mode
npx expo start --tunnel
```

### 2. NativeWind styles ไม่แสดงผล

**อาการ:** หน้าจอขาวเปล่า หรือไม่มี styles

**แก้ไข:**
```bash
# Clear Metro cache
npx expo start --clear

# หรือ
rm -rf node_modules/.cache
npm start
```

### 3. TypeScript errors

**อาการ:** แดงเยอะ type errors

**แก้ไข:**
```bash
# Restart TypeScript server
# ใน VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### 4. "Cannot find module" errors

**แก้ไข:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📝 TODO: สิ่งที่ยังทำไม่เสร็จ

### Critical (ต้องทำให้ใช้งานได้)
- [ ] **Home Screen:** ดึงข้อมูลแมวจริงจาก API (ตอนนี้ใช้ mock data)
- [ ] **Home Screen:** โหลดแมวตัวถัดไปหลัง swipe
- [ ] **Home Screen:** Filter แมว (เพศ, พื้นที่, วัตถุประสงค์)
- [ ] **Matches Screen:** แสดงข้อมูลแมวและ owner ที่ถูกต้อง
- [ ] **Chat Screen:** แสดงชื่อแมวใน header
- [ ] **Chat Screen:** Auto refresh ข้อความใหม่

### Nice to Have
- [ ] Image picker สำหรับรูปแมว
- [ ] Cat management (CRUD)
- [ ] Push notifications เมื่อ match
- [ ] Real-time chat (WebSocket)
- [ ] Animations (swipe gesture)
- [ ] Loading skeletons
- [ ] Error boundaries

---

## 🎨 UI/UX Features

### สีหลัก
- **Primary:** Pink-500 (#ec4899)
- **Success:** Green-500
- **Danger:** Red-500
- **Gray:** Gray-100 to Gray-800

### Icons
ใช้ **Ionicons** จาก `@expo/vector-icons`

### Styling
ใช้ **NativeWind** (Tailwind CSS for React Native)

---

## 📂 โครงสร้างโค้ด

```
front_cat-tinder/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Tab Navigator
│   │   ├── _layout.tsx   # Tab config
│   │   ├── home.tsx      # Swipe screen
│   │   ├── matches.tsx   # Matches list
│   │   └── profile.tsx   # Profile
│   ├── chat/
│   │   └── [id].tsx      # Chat screen (dynamic route)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Owner selection
├── services/api/          # API clients
│   ├── client.ts          # Axios instance
│   ├── swipes.ts          # Swipe APIs
│   ├── matches.ts         # Match & Message APIs
│   └── index.ts
├── contexts/              # React Context
│   └── AuthContext.tsx    # Auth state management
├── types/                 # TypeScript types
│   └── index.ts
├── constants/             # Constants
│   └── config.ts          # API config
└── components/            # Reusable components (TODO)
```

---

## 💡 Tips

1. **ใช้ Hot Reload:** โค้ดจะ reload อัตโนมัติเมื่อแก้ไข
2. **ดู Console Log:** เปิด Metro bundler terminal ดู log
3. **ดู Network:** ใช้ React Native Debugger หรือ Flipper
4. **Test บน Real Device:** ดีกว่า Simulator เสมอ

---

## 🎯 เป้าหมายถัดไป

1. เชื่อมต่อ Home screen กับ API จริง
2. สร้าง Cat Feed API endpoint
3. Implement swipe gesture animations
4. เพิ่ม real-time chat updates
5. เพิ่ม image upload
6. Deploy backend to production
7. Build APK/IPA for distribution

---

Happy Coding! 🐱✨
