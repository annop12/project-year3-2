# Test Smart Selection with Availability Check

## ✅ การเปลี่ยนแปลง

### Backend Changes:

1. **AvailabilityService.java** - เพิ่ม 2 methods ใหม่:
   - `hasDoctorAvailabilityOnDate(Long doctorId, String date)` - เช็คว่าแพทย์มี availability ในวันที่กำหนด
   - `getDoctorAvailabilitiesByDate(Long doctorId, String date)` - ดึงรายการ availability ในวันนั้น

2. **DoctorController.java** - อัปเดต `smartSelectDoctor()`:
   - เพิ่ม import `AvailabilityService`
   - เพิ่มการกรองแพทย์ที่มี availability ก่อนเช็คคิว
   - แสดง message ที่ชัดเจนเมื่อไม่มีแพทย์ว่างในวันที่เลือก

---

## 🧪 Test Cases

### Test Case 1: แพทย์มี availability ในวันที่เลือก ✅

**Setup:**
1. มีแพทย์ 2 คนในสาขา "Cardiology"
   - นพ.A: มี availability วันจันทร์ 09:00-17:00 (คิว 3 คน)
   - นพ.B: มี availability วันจันทร์ 09:00-17:00 (คิู 1 คน)

**Request:**
```bash
curl "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-14"
```

**Expected Result:**
```json
{
  "message": "Doctor selected successfully",
  "doctor": {
    "id": 2,
    "doctorName": "นพ.B",
    "specialty": {"id": 1, "name": "Cardiology"}
  },
  "totalDoctorsInSpecialty": 2
}
```

**Reason:** นพ.B มีคิวน้อยกว่า (1 คน vs 3 คน)

---

### Test Case 2: แพทย์ไม่มี availability ในวันที่เลือก ❌

**Setup:**
1. มีแพทย์ 2 คนในสาขา "Cardiology"
   - นพ.A: มี availability วันจันทร์, ไม่มีวันอังคาร
   - นพ.B: มี availability วันจันทร์, ไม่มีวันอังคาร

**Request:**
```bash
# วันอังคาร (ไม่มีแพทย์ทำงาน)
curl "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-15"
```

**Expected Result:**
```json
{
  "message": "No doctors have available time slots on this date. Please select another date.",
  "doctor": null,
  "totalDoctorsInSpecialty": 2,
  "doctorsAvailableOnDate": 0
}
```

---

### Test Case 3: บางคนมี availability บางคนไม่มี ✅

**Setup:**
1. มีแพทย์ 3 คนในสาขา "Cardiology"
   - นพ.A: มี availability วันพุธ (คิว 2 คน)
   - นพ.B: ไม่มี availability วันพุธ
   - นพ.C: มี availability วันพุธ (คิว 5 คน)

**Request:**
```bash
curl "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-16"
```

**Expected Result:**
```json
{
  "message": "Doctor selected successfully",
  "doctor": {
    "id": 1,
    "doctorName": "นพ.A"
  },
  "totalDoctorsInSpecialty": 3
}
```

**Reason:** กรองเหลือแค่ นพ.A และ นพ.C (นพ.B ไม่มี availability), นพ.A คิวน้อยกว่า

---

### Test Case 4: ไม่ระบุวันที่ (แบบเดิม) ✅

**Request:**
```bash
curl "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology"
```

**Expected Result:**
- เลือกแพทย์แบบสุ่ม (ไม่เช็ค availability)
- ทำงานเหมือนเดิม

---

### Test Case 5: แพทย์ inactive ต้องถูกกรองออก ✅

**Setup:**
1. มีแพทย์ 2 คนในสาขา "Cardiology"
   - นพ.A: active=false, มี availability วันจันทร์
   - นพ.B: active=true, มี availability วันจันทร์

**Request:**
```bash
curl "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-14"
```

**Expected Result:**
- เลือก นพ.B (เพราะ นพ.A ถูกกรองออกตั้งแต่ตอนเช็ค isActive)

---

## 📊 Log Output ที่ควรเห็น

```
🎯 Smart select doctor for specialty: Cardiology on date: 2024-10-14
✅ Found 2 active doctors
🔍 Filtering doctors by availability on date: 2024-10-14
Checking availability for doctor 1 on 2024-10-14 (dayOfWeek: 1)
✅ Doctor 1 has 1 availability slot(s) on 2024-10-14
Checking availability for doctor 2 on 2024-10-14 (dayOfWeek: 1)
❌ Doctor 2 has NO availability on 2024-10-14
  ⊘ Doctor นพ.B has NO availability on 2024-10-14
✅ 1 doctors have availability on 2024-10-14
📊 Checking queue for each doctor on date: 2024-10-14
  - นพ.A (ID: 1): 3 appointments
📌 1 doctors have minimum queue (3 appointments)
🎯 Selected doctor: นพ.A (ID: 1) with 3 appointments on 2024-10-14
```

---

## 🔧 วิธีทดสอบจริง

### 1. เตรียมข้อมูลทดสอบ

```sql
-- สร้าง specialty
INSERT INTO specialties (name, description) VALUES ('Cardiology', 'Heart specialist');

-- สร้าง user แพทย์ 2 คน
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('doctor1@test.com', '$2a$10$...', 'สมชาย', 'ใจดี', 'DOCTOR');

INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('doctor2@test.com', '$2a$10$...', 'สมหญิง', 'รักษ์คน', 'DOCTOR');

-- สร้าง doctor profile
INSERT INTO doctors (user_id, specialty_id, license_number, is_active)
VALUES (1, 1, 'D001', true), (2, 1, 'D002', true);

-- เพิ่ม availability (dayOfWeek: 1=Monday)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active)
VALUES
  (1, 1, '09:00:00', '17:00:00', true),  -- Doctor 1 มีวันจันทร์
  (2, 2, '09:00:00', '17:00:00', true);  -- Doctor 2 มีวันอังคาร (ไม่มีวันจันทร์)
```

### 2. ทดสอบ API

```bash
# Test: เลือกวันจันทร์ (2024-10-14) ควรได้ Doctor 1
curl -X GET "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-14"

# Test: เลือกวันอังคาร (2024-10-15) ควรได้ Doctor 2
curl -X GET "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-15"

# Test: เลือกวันพุธ (2024-10-16) ควรได้ "No doctors available"
curl -X GET "http://localhost:8082/api/doctors/smart-select?specialty=Cardiology&date=2024-10-16"
```

---

## ✅ ผลที่คาดหวัง

1. **ถ้ามี availability:** เลือกแพทย์ที่มีคิวน้อยที่สุดในบรรดาแพทย์ที่ทำงานในวันนั้น
2. **ถ้าไม่มี availability:** return message "No doctors have available time slots"
3. **Log ชัดเจน:** เห็นว่าแพทย์คนไหนถูกกรองออกเพราะอะไร

---

## 🎯 Next Steps

หลังจาก test ผ่านแล้ว:
1. ✅ อัปเดต Frontend แสดง available time slots
2. ✅ เพิ่มการ validate เวลาที่เลือก
3. ✅ แสดงเหตุผลว่าทำไมเลือกแพทย์นี้
