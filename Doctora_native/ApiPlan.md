Step 7.1: Medical Services Implementation                       │
     │                                                                 │
     │ 7.1.1 สร้าง services/doctors.t                                  │
     │                                                                 │
     │ - getDoctors(params) - GET /api/doctors/me (with pagination,    │
     │ filtering)                                                      │
     │ - getDoctorById(id) - GET /api/doctors/me/{id}                  │
     │ - searchDoctors(query, specialty, filters) - GET                │
     │ /api/doctors/me with search params                              │
     │ - getDoctorsBySpecialty(specialtyId) - GET                      │
     │ /api/doctors/me/specialty/{id}                                  │
     │ - getDoctorStats() - GET /api/doctors/me/stats                  │
     │                                                                 │
     │ 7.1.2 สร้าง services/specialties.t                              │
     │                                                                 │
     │ - getSpecialties() - GET /api/specialties                       │
     │ - getSpecialtyById(id) - GET /api/specialties/{id}              │
     │ - getSpecialtiesWithDoctorCount() - GET                         │
     │ /api/specialties/with-counts                                    │
     │                                                                 │
     │ 7.1.3 สร้าง services/appointments.t                             │
     │                                                                 │
     │ - bookAppointment(doctorId, dateTime, notes) - POST             │
     │ /api/appointments                                               │
     │ - getMyAppointments(status?, page?) - GET                       │
     │ /api/appointments/patient/me                                    │
     │ - getAppointmentById(id) - GET /api/appointments/{id}           │
     │ - cancelAppointment(id) - PATCH /api/appointments/{id}/cancel   │
     │ - rescheduleAppointment(id, newDateTime) - PATCH                │
     │ /api/appointments/{id}/reschedule                               │
     │                                                                 │
     │ 7.1.4 สร้าง React Query Hooks (services/medical/hooks.ts        │
     │                                                                 │
     │ // Doctors                                                      │
     │ - useDoctors(filters) - infinite query with pagination          │
     │ - useDoctor(id) - single doctor query                           │
     │ - useDoctorsBySpecialty(specialtyId)                            │
     │ - useDoctorSearch(query, filters)                               │
     │                                                                 │
     │ // Specialties                                                  │
     │ - useSpecialties() - cached query                               │
     │ - useSpecialty(id)                                              │
     │                                                                 │
     │ // Appointments                                                 │
     │ - useMyAppointments(status) - real-time updates                 │
     │ - useBookAppointment() - mutation with optimistic updates       │
     │ - useCancelAppointment() - mutation with confirmation           │
     │                                                                 │
     │ Step 7.2: Replace Mock Data Integration                         │
     │                                                                 │
     │ 7.2.1 อัปเดตหน้าหลักที่ใช้ mock data (6                         │
     │                                                                 │
     │ // Replace in:                                                  │
     │ - app/(root)/(tabs)/explore.tsx → use useDoctors,               │
     │ useSpecialties                                                  │
     │ - app/(root)/doctors/[id].tsx → use useDoctor                   │
     │ - app/doctors.tsx → use useDoctorSearch                         │
     │ - app/(root)/(tabs)/appointments.tsx → use useMyAppointments    │
     │ - app/book-appointment.tsx → use useBookAppointment             │
     │ - app/(root)/appointments/[id].tsx → use appointment queries    │
     │                                                                 │
     │ 7.2.2 ปิด Mock Auth Mod                                         │
     │                                                                 │
     │ // contexts/AuthContext.tsx line 9                              │
     │ const MOCK_AUTH_MODE = false; // เปลี่ยนจาก true เป็น fa        │
     │                                                                 │
     │ 7.2.3 เพิ่ม Loading & Error Stat                                │
     │                                                                 │
     │ - เพิ่ม LoadingSkeleton componen                                │
     │ - เพิ่ม Error Boundari                                          │
     │ - เพิ่ม Retry mechanis                                          │
     │ - เพิ่ม Empty States สำหรับข้อ                                  │
     │                                                                 │
     │ Step 7.3: Error Handling & User Experience                      │
     │                                                                 │
     │ 7.3.1 Enhanced Error Handling                                   │
     │                                                                 │
     │ // services/api/errorHandler.ts                                 │
     │ - Network error handling                                        │
     │ - 401 unauthorized → auto logout                                │
     │ - 403 forbidden → show permission error                         │
     │ - 500 server error → show retry option                          │
     │ - Validation errors → show field-specific errors                │
     │                                                                 │
     │ 7.3.2 Offline Support                                           │
     │                                                                 │
     │ // utils/networkStatus.ts                                       │
     │ - เพิ่ม network status detecti                                  │
     │ - เพิ่ม offline indicat                                         │
     │ - เพิ่ม data caching strategi                                   │
     │ - เพิ่ม retry when onli                                         │
     │                                                                 │
     │ 7.3.3 Optimistic Updates                                        │
     │                                                                 │
     │ - Appointment booking → show as pending immediately             │
     │ - Appointment cancellation → remove from list immediately       │
     │ - Doctor favorites → toggle state immediately                   │
     │ - Auto-revert on API failure                                    │
     │                                                                 │
     │ Step 7.4: React Query Configuration                             │
     │                                                                 │
     │ 7.4.1 Query Client Setup (app/_layout.tsx)                      │
     │                                                                 │
     │ - Configure stale time: 5 minutes for doctors, 1 minute for     │
     │ appointments                                                    │
     │ - Configure cache time: 10 minutes                              │
     │ - Configure retry: 3 times with exponential backoff             │
     │ - Configure refetch on window focus for appointments            │
     │                                                                 │
     │ 7.4.2 Background Sync                                           │
     │                                                                 │
     │ - Auto-refresh appointments every 30 seconds when active        │
     │ - Refresh doctor data every 5 minutes                           │
     │ - Invalidate queries after mutations                            │
     │                                                                 │
     │ Expected Outcomes                                               │
     │                                                                 │
     │ 1. Real API Integration: ข้อมูลมาจาก backend แทน mock da        │
     │ 2. Authentication: Login/logout ใช้งานได้จริ                    │
     │ 3. Real-time Data: appointments อัปเดตแบบ real-tim              │
     │ 4. Robust Error Handling: จัดการ network errors, API error      │
     │ 5. Better UX: loading states, optimistic updates, offline       │
     │ support                                                         │
     │ 6. Performance: efficient caching, pagination, background sync