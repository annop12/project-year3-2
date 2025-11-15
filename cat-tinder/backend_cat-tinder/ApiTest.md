✅ พร้อมทดสอบด้วย Postman แล้วครับ!
📦 ไฟล์ที่สร้างให้คุณ
Cat-Tinder-API.postman_collection.json (6.7KB)
Postman Collection พร้อม 8 requests
Cat-Tinder-Local.postman_environment.json (1.3KB)
Environment พร้อม IDs จากการ seed
POSTMAN_GUIDE.md (6.4KB)
คู่มือใช้งาน Postman แบบละเอียด
test-api.sh (2.8KB)
Script ทดสอบด้วย curl (สำรอง)
🚀 วิธีเริ่มต้นใช้ Postman
1. เปิด Postman
ถ้ายังไม่มี ดาวน์โหลดที่: https://www.postman.com/downloads/
2. Import Collection
    1. คลิก "Import" (มุมบนซ้าย)
    2. เลือกไฟล์: Cat-Tinder-API.postman_collection.json
    3. คลิก "Import"

3. Import Environment
    1. คลิก icon เกียร์ (Environments) แถบซ้าย
    2. คลิก "Import"
    3. เลือกไฟล์: Cat-Tinder-Local.postman_environment.json
    4. คลิก "Import"

4. เลือก Environment
มุมบนขวาของ Postman → เลือก "Cat Tinder - Local"


🧪 ลำดับการทดสอบ
1️⃣ Health Check
    เปิด request "Health Check"
    กด Send
    ควรได้ "ok": true

2️⃣ Create First Swipe (Like)
    เปิด Swipe System → Create Swipe (Like)
    กด Send
    Owner1's Milo likes Owner2's Bella
    ผลลพัธ์: "matched": false (ยังไม่ match)

3️⃣ Like Back → MATCH! 💕
    เปิด Swipe System → Create Swipe (Like Back - MATCH!)
    กด Send
    Owner2's Bella likes Milo กลับ
    ผลลพัธ์: "matched": true 🎉
    ⚠️ สำคัญ: Copy matchId จาก response

4️⃣ Update match_id ใน Environment
    1. คลิก Environments (แถบซ้าย)
    2. เลือก "Cat Tinder - Local"
    3. แก้ไข match_id = matchId ที่ copy มา
    4. Save

5️⃣ Get Matches
    เปิด Match System → Get All Matches
    กด Send
    ควรเห็น match ที่สร้างไว้

6️⃣ Send Message
    เปิด Match System → Send Message
    แก้ไข text ใน Body (ถ้าต้องการ)
    กด Send
    ข้อความถูกส่ง!

7️⃣ Get Messages
    เปิด Match System → Get Messages
    กด Send
    ควรเห็นข้อความที่ส่งไป
    📊 ข้อมูลทดสอบปัจจุบัน
    จากการรัน npm run seed ล่าสุด: Owner 1: Demo User
    ID: 68dd76c3ac4c1735681025f0
    Cats:
    Milo (male) - 68dd76c3ac4c1735681025f5
    Luna (female) - 68dd76c3ac4c1735681025f7
    Owner 2: Alice
    ID: 68dd76c3ac4c1735681025f3
    Cats:
    Max (male) - 68dd76c3ac4c1735681025f9
    Bella (female) - 68dd76c3ac4c1735681025fb