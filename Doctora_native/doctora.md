  1. 🔄 เปลี่ยนจาก Mock Data เป็น Real API

  - แทนที่ mockDoctors ด้วย API calls
  - ใช้ hooks ที่มีอยู่แล้ว (useDoctors, useSpecialties)
  - รองรับการค้นหาและกรองจาก backend

  2. 📄 เพิ่มฟีเจอร์ Pagination

  - โหลดแพทย์เป็น batch (เช่น 10-20 คนต่อครั้ง)
  - Infinite scrolling หรือ pagination buttons
  - ปรับปรุงประสิทธิภาพเมื่อมีแพทย์จำนวนมาก

  3. ⭐ ระบบ Favorites

  - API endpoints สำหรับ favorite doctors
  - บันทึกในฐานข้อมูล
  - UI สำหรับ add/remove favorites

  4. 🔄 Loading & Error States

  - Skeleton loading ที่สมจริง
  - Error handling และ retry mechanisms
  - Empty states ที่ดีขึ้น