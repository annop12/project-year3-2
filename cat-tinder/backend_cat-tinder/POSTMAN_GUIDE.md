# 📮 Postman Testing Guide

## 🚀 Quick Start

### 1. เริ่ม Server
```bash
cd backend_cat-tinder
npm run dev
```

### 2. สร้างข้อมูลทดสอบ
```bash
npm run seed
```

### 3. Import ไฟล์ใน Postman

#### Import Collection
1. เปิด Postman
2. คลิก **Import** (มุมบนซ้าย)
3. เลือกไฟล์ `Cat-Tinder-API.postman_collection.json`
4. คลิก **Import**

#### Import Environment
1. คลิก **Environments** (แถบซ้าย, icon รูปเกียร์)
2. คลิก **Import**
3. เลือกไฟล์ `Cat-Tinder-Local.postman_environment.json`
4. คลิก **Import**

#### เลือก Environment
1. ดูมุมบนขวาของ Postman
2. เลือก **Cat Tinder - Local** จาก dropdown

---

## 🧪 Testing Flow (เรียงตามลำดับ)

### Step 1: Health Check ✅
**Request:** `GET /health`
- ทดสอบว่า server ทำงานหรือไม่
- **Expected Response:**
```json
{
  "ok": true,
  "message": "API is running 🚀"
}
```

---

### Step 2: Create First Swipe (Like) 👍
**Request:** `POST /api/swipes` - Create Swipe (Like)
- Owner1's Milo **likes** Owner2's Bella
- **Expected Response:**
```json
{
  "success": true,
  "swipe": { ... },
  "match": {
    "matched": false  // ยังไม่ match เพราะอีกฝั่งยังไม่ like กลับมา
  }
}
```

---

### Step 3: Create Second Swipe (Like Back) → MATCH! 💕
**Request:** `POST /api/swipes` - Create Swipe (Like Back - MATCH!)
- Owner2's Bella **likes back** Milo
- **Expected Response:**
```json
{
  "success": true,
  "swipe": { ... },
  "match": {
    "matched": true,    // 🎉 MATCH!
    "matchId": "...",   // ⚠️ Copy matchId นี้ไปใส่ใน Environment
    "matchData": { ... }
  }
}
```

**⚠️ IMPORTANT:** Copy `matchId` จาก response
1. คลิกที่ **Environments** (แถบซ้าย)
2. เลือก **Cat Tinder - Local**
3. แก้ไขค่า `match_id` ให้เป็น matchId ที่ได้
4. คลิก **Save**

---

### Step 4: Get Swipe History 📜
**Request:** `GET /api/swipes/history`
- ดูประวัติการ swipe ของ Owner1
- **Expected Response:**
```json
{
  "success": true,
  "swipes": [
    {
      "swiperCatId": { "name": "Milo", ... },
      "targetCatId": { "name": "Bella", ... },
      "action": "like"
    }
  ],
  "pagination": { ... }
}
```

---

### Step 5: Get All Matches 💖
**Request:** `GET /api/matches`
- ดู matches ทั้งหมดของ Owner1
- **Expected Response:**
```json
{
  "success": true,
  "matches": [
    {
      "_id": "...",
      "catAId": { "name": "Milo", ... },
      "catBId": { "name": "Bella", ... },
      "ownerAId": { "displayName": "Demo User" },
      "ownerBId": { "displayName": "Alice" }
    }
  ]
}
```

---

### Step 6: Get Match Details 📋
**Request:** `GET /api/matches/:matchId`
- ดูรายละเอียด match พร้อมข้อมูลติดต่อ
- ⚠️ ต้อง set `match_id` ใน Environment ก่อน
- **Expected Response:**
```json
{
  "success": true,
  "match": {
    "catAId": { "name": "Milo", "location": {...} },
    "catBId": { "name": "Bella", "location": {...} },
    "ownerAId": {
      "displayName": "Demo User",
      "contact": { "lineId": "...", "phone": "..." }
    },
    "ownerBId": {
      "displayName": "Alice",
      "contact": { ... }
    }
  }
}
```

---

### Step 7: Send Message 💬
**Request:** `POST /api/matches/:matchId/messages`
- ส่งข้อความใน match
- แก้ไข `text` ใน Body ตามต้องการ
- **Expected Response:**
```json
{
  "success": true,
  "message": {
    "_id": "...",
    "senderOwnerId": { "displayName": "Demo User" },
    "text": "Hello! Your cat is so cute! 🐱",
    "sentAt": "2025-10-01T...",
    "read": false
  }
}
```

---

### Step 8: Get Messages 📬
**Request:** `GET /api/matches/:matchId/messages`
- ดูข้อความทั้งหมดใน match
- **Expected Response:**
```json
{
  "success": true,
  "messages": [
    {
      "senderOwnerId": { "displayName": "Demo User" },
      "text": "Hello! Your cat is so cute! 🐱",
      "sentAt": "...",
      "read": false
    }
  ]
}
```

---

## 🎯 Additional Tests

### Test Swipe Pass (ปัดซ้าย)
**Request:** `POST /api/swipes` - Create Swipe (Pass)
- Owner1's Luna **passes** Owner2's Max
- ไม่สร้าง match
- **Expected Response:**
```json
{
  "success": true,
  "swipe": { "action": "pass", ... },
  "match": {
    "matched": false
  }
}
```

### Test Duplicate Swipe (Error)
- ลอง swipe แมวตัวเดิมซ้ำ
- **Expected Response:**
```json
{
  "error": "Duplicate swipe",
  "message": "You already swiped this cat"
}
```

---

## 📊 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API Base URL | `http://localhost:4000` |
| `owner1_id` | Owner 1 ID (Demo User) | `68dd76c3...` |
| `owner2_id` | Owner 2 ID (Alice) | `68dd76c3...` |
| `cat1_id` | Milo (male, Owner1) | `68dd76c3...` |
| `cat2_id` | Luna (female, Owner1) | `68dd76c3...` |
| `cat3_id` | Max (male, Owner2) | `68dd76c3...` |
| `cat4_id` | Bella (female, Owner2) | `68dd76c3...` |
| `match_id` | Match ID (หลังจาก match แล้ว) | Copy from response |

---

## 🔧 Troubleshooting

### 1. "Could not get response" error
- ตรวจสอบว่า server ทำงานอยู่ (`npm run dev`)
- ตรวจสอบ `base_url` ใน Environment

### 2. "401 Unauthorized"
- ตรวจสอบว่ามี header `x-owner-id` 
- ตรวจสอบว่า owner ID ถูกต้อง

### 3. "404 Not found"
- ตรวจสอบว่า match_id ถูกต้อง
- ตรวจสอบว่ามี match อยู่จริง (ทำ Step 2-3 ก่อน)

### 4. "Duplicate swipe"
- ปกติ! แปลว่าเคย swipe แมวนั้นแล้ว
- ลองรัน `npm run seed` ใหม่เพื่อ reset ข้อมูล

---

## 🎉 Happy Testing!

หากพบปัญหา:
1. ตรวจสอบ server logs
2. ตรวจสอบ Environment variables
3. ลองรัน `npm run seed` ใหม่


