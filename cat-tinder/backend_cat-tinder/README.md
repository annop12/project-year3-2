# 🐱 Cat Tinder Backend API

แบ็กเอนด์สำหรับแอป Cat Tinder - แอปจับคู่แมว ที่ช่วยให้เจ้าของแมวค้นหาคู่ครองหรือเพื่อนสำหรับแมวของตน

## 🛠 เทคโนโลジีที่ใช้

- **Node.js** + **Express.js** - Web Framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

## 📁 โครงสร้างโปรเจค

```
backend_cat-tinder/
├── src/
│   ├── config/
│   │   ├── db.js              # การเชื่อมต่อ MongoDB
│   │   └── env.js             # Environment configuration
│   ├── models/
│   │   ├── Cat.js             # โมเดลข้อมูลแมว
│   │   ├── Owner.js           # โมเดลข้อมูลเจ้าของ
│   │   ├── Message.js         # โมเดลข้อความ
│   │   └── Swipe.js           # โมเดลการ swipe
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   ├── cats.controller.js # Cat management logic
│   │   ├── swipes.controller.js # Swipe functionality
│   │   └── matches.controller.js # Match management
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── cats.routes.js     # Cat routes
│   │   ├── swipes.routes.js   # Swipe routes
│   │   └── matches.routes.js  # Match routes
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification
│   │   ├── cors.js            # CORS configuration
│   │   └── error.js           # Error handling
│   └── server.js              # Main server file
├── scripts/
│   └── seed.js                # Database seeding script
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🚀 การติดตั้งและเริ่มใช้งาน

### 1. ติดตั้ง Dependencies

```bash
cd backend_cat-tinder
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ root:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/cat_tinder
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES=7d
CORS_ORIGIN=http://localhost:19006,http://localhost:8081,http://localhost:3000
```

### 3. เริ่ม MongoDB

```bash
# สำหรับ macOS (ถ้าใช้ Homebrew)
brew services start mongodb/brew/mongodb-community

# หรือ
mongod
```

### 4. เริ่มเซิร์ฟเวอร์

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

เซิร์ฟเวอร์จะทำงานที่: `http://localhost:4000`

### 5. ทดสอบ API

```bash
curl http://localhost:4000/health
# Response: {"ok": true, "message": "API is running 🚀"}
```

## 📊 API Endpoints

### 🔐 Authentication
```
POST /api/auth/register    # สมัครสมาชิก
POST /api/auth/login       # เข้าสู่ระบบ
GET  /api/auth/profile     # ดูข้อมูลโปรไฟล์
PUT  /api/auth/profile     # แก้ไขโปรไฟล์
POST /api/auth/logout      # ออกจากระบบ
```

### 🐱 Cat Management
```
GET    /api/cats/feed      # ดูแมวสำหรับ swipe
POST   /api/cats           # เพิ่มแมวใหม่
GET    /api/cats/my        # ดูแมวของตัวเอง
PUT    /api/cats/:id       # แก้ไขข้อมูลแมว
DELETE /api/cats/:id       # ลบข้อมูลแมว
POST   /api/cats/:id/photos # อัปโหลดรูปแมว
```

### 💖 Swipe & Match
```
POST /api/swipes           # Swipe แมว (like/pass)
GET  /api/swipes/history   # ประวัติการ swipe
GET  /api/matches          # ดู matches
GET  /api/matches/:id      # ดูรายละเอียด match
```

### 💬 Messages
```
POST /api/matches/:id/messages  # ส่งข้อความ
GET  /api/matches/:id/messages  # ดูข้อความ
```

## 💾 Database Models

### Cat Model
```javascript
{
  ownerId: ObjectId,           // เจ้าของแมว
  name: String,                // ชื่อแมว
  gender: 'male' | 'female',   // เพศ
  ageMonths: Number,           // อายุ (เดือน)
  breed: String,               // สายพันธุ์
  purpose: ['mate','friend','foster'], // วัตถุประสงค์
  health: {                    // ข้อมูลสุขภาพ
    vaccinated: Boolean,
    neutered: Boolean,
    notes: String
  },
  photos: [String],            // รูปภาพ
  location: {                  // ที่อยู่
    province: String,
    district: String,
    lat: Number,
    lng: Number
  },
  active: Boolean              // สถานะการใช้งาน
}
```

### Owner Model
```javascript
{
  email: String,               // อีเมล (unique)
  passwordHash: String,        // รหาส์ผ่าน (hashed)
  displayName: String,         // ชื่อแสดง
  avatarUrl: String,           // รูปโปรไฟล์
  location: Object,            // ที่อยู่
  contact: {                   // ข้อมูลติดต่อ
    lineId: String,
    phone: String,
    facebookUrl: String
  }
}
```

## 🔧 Scripts

```bash
npm run dev        # เริ่มเซิร์ฟเวอร์ในโหมด development
npm start          # เริ่มเซิร์ฟเวอร์ในโหมด production
npm run seed       # เพิ่มข้อมูลทดสอบ (จะสร้างภายหลัง)
```

## 🐛 Debugging

### ตรวจสอบการเชื่อมต่อ MongoDB
```bash
# เข้าไปใน MongoDB shell
mongo cat_tinder
db.owners.find()  # ดูข้อมูล owners
db.cats.find()    # ดูข้อมูล cats
```

### Log Files
เซิร์ฟเวอร์จะแสดง log ใน console รวมถึง:
- HTTP requests (Morgan)
- Database connections
- Error messages

## 🚨 สิ่งที่ต้องทำก่อนใช้งาน Production

1. **เปลี่ยน JWT_SECRET** ให้เป็นค่าที่ปลอดภัย
2. **ตั้งค่า CORS** ให้เฉพาะ domain ที่อนุญาต
3. **เพิ่ม Rate Limiting**
4. **เพิ่ม Input Validation**
5. **เพิ่ม API Documentation** (Swagger)

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. สร้าง Pull Request

## 📞 ติดต่อ

หากมีปัญหาหรือข้อสงสัย กรุณาสร้าง Issue ใน GitHub repository