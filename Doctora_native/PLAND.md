Implementation Plan: Doctora Mobile App Development

    Phase 1: Foundation & Infrastructure (วัน 1-2)

    Step 1.1: Dependencies & Setup

    - ติดตั้ง dependencies: axios, @tanstack/react-query, 
    @react-native-async-storage/async-storage
    - สร้างโครงสร้างโฟลเดอร์:
    services/
    ├── api/
    ├── auth/
    contexts/
    types/
    utils/

    Step 1.2: Authentication Infrastructure

    - สร้าง types/auth.ts - TypeScript interfaces
    - สร้าง utils/storage.ts - JWT token management
    - สร้าง services/api/client.ts - Axios configuration
    - สร้าง services/auth.ts - Login/Register API calls
    - สร้าง contexts/AuthContext.tsx - Global state management

    Phase 2: Authentication Screens (วัน 3-4)

    Step 2.1: Design System Setup

    - อัปเดต tailwind.config.js ด้วย color palette ใหม่:
      - Primary: #0891b2 (Cyan-600)
      - Secondary: #64748b (Slate-500)
      - Background: #f8fafc (Slate-50)
    - เพิ่ม custom fonts และ spacing

    Step 2.2: Authentication UI

    - สร้าง components/ui/ - Input, Button, Card components
    - อัปเดต app/sign-in.tsx:
      - ใช้ design จาก Figma
      - เชื่อมต่อ real API authentication
      - เพิ่ม loading states และ error handling
    - สร้าง app/sign-up.tsx ตาม design
    - สร้าง app/welcome.tsx - landing screen

    Step 2.3: Navigation Protection

    - อัปเดต app/_layout.tsx - รองรับ AuthContext
    - สร้าง app/(auth)/ layout สำหรับ login/register
    - เพิ่ม protected routes ใน app/(root)/_layout.tsx

    Phase 3: Core UI Components (วัน 5-7)

    Step 3.1: Medical Data Models

    - สร้าง types/medical.ts:
    interface Doctor {
      id: string;
      name: string;
      specialty: Specialty;
      experience: number;
      rating: number;
      consultationFee: number;
      image: string;
      bio: string;
    }

    interface Appointment {
      id: string;
      doctor: Doctor;
      dateTime: Date;
      status: 'pending' | 'confirmed' | 'completed' | 
    'cancelled';
      notes?: string;
    }

    Step 3.2: Reusable Components

    - สร้าง components/cards/:
      - DoctorCard.tsx - แสดงข้อมูลแพทย์
      - AppointmentCard.tsx - แสดงนัดหมาย
      - SpecialtyCard.tsx - หมวดหมู่แพทย์
    - สร้าง components/forms/:
      - SearchBar.tsx
      - FilterSheet.tsx (bottom sheet)
      - TimeSlotPicker.tsx

    Step 3.3: Layout Components

    - สร้าง components/layout/:
      - Header.tsx - app header with profile
      - EmptyState.tsx - no data states
      - LoadingSkeleton.tsx - loading placeholders

    Phase 4: Main App Screens (วัน 8-12)

    Step 4.1: Home Dashboard

    - อัปเดต app/(root)/(tabs)/index.tsx:
      - Welcome message พร้อม user name
      - Quick action buttons: "จองนัดหมาย", "ค้นหาแพทย์"
      - Upcoming appointments section
      - Featured doctors carousel
      - Emergency contact button

    Step 4.2: Doctor Features

    - อัปเดต app/(root)/(tabs)/explore.tsx → Doctor Search:
      - Search bar with filters
      - Specialty filter chips (horizontal scroll)
      - Doctor list with pagination
      - Sort options: rating, distance, price
    - สร้าง app/(root)/doctors/[id].tsx:
      - Doctor profile header
      - Stats section (experience, patients, rating)
      - About & reviews
      - Available time slots
      - Floating "จองนัดหมาย" button

    Step 4.3: Appointment Booking Flow

    - สร้าง app/(root)/booking/:
      - select-date.tsx - calendar picker
      - select-time.tsx - time slot grid
      - patient-info.tsx - notes และข้อมูลเพิ่มเติม
      - confirmation.tsx - สรุปการจอง
    - เพิ่ม step indicator navigation

    Phase 5: Appointment Management (วัน 13-15)

    Step 5.1: My Appointments

    - สร้าง app/(root)/(tabs)/appointments.tsx:
      - Tab navigation: "กำลังรอ", "วันนี้", "ประวัติ"
      - Appointment cards with status indicators
      - Pull to refresh functionality
      - Empty states สำหรับแต่ละ tab

    Step 5.2: Appointment Actions

    - สร้าง appointment detail screen
    - เพิ่ม action sheets: cancel, reschedule
    - สร้าง rating/review form หลัง appointment
    - เพิ่ม notification system (local notifications)

    Phase 6: Profile & Settings (วัน 16-17)

    Step 6.1: User Profile

    - อัปเดต app/(root)/(tabs)/profile.tsx:
      - User info header พร้อม edit button
      - Menu items: Medical History, Payment Methods, Settings
      - Quick stats: total appointments, favorite doctors
      - Logout functionality

    Step 6.2: Additional Screens

    - สร้าง profile edit screen
    - สร้าง settings screen (notifications, language)
    - สร้าง medical history screen
    - เพิ่ม help center/FAQ

    Phase 7: API Integration (วัน 18-19)

    Step 7.1: Services Implementation

    - สร้าง services/doctors.ts:
      - getDoctors, getDoctorById, searchDoctors
      - getSpecialties, getDoctorAvailability
    - สร้าง services/appointments.ts:
      - bookAppointment, getMyAppointments
      - cancelAppointment, rescheduleAppointment
    - เพิ่ม React Query hooks สำหรับ data fetching

    Step 7.2: Error Handling & Offline Support

    - เพิ่ม error boundaries
    - สร้าง retry mechanisms
    - เพิ่ม offline indicator
    - เพิ่ม data caching strategies

    Phase 8: Polish & Testing (วัน 20-21)

    Step 8.1: Performance Optimization

    - เพิ่ม image optimization และ caching
    - optimize FlatList performance
    - เพิ่ม loading states ทุกหน้า
    - เพิ่ม smooth animations (react-native-reanimated)

    Step 8.2: Final Testing

    - Integration testing กับ backend
    - Manual testing บน iOS/Android
    - Performance testing
    - Bug fixes และ polish

    Key Design Decisions:

    1. Authentication Flow: Welcome → Login/Register → Home
    2. Navigation: Bottom tabs (Home, Search, Appointments, 
    Profile)
    3. Color Scheme: Cyan primary (#0891b2) ตาม Figma design
    4. Components: ใช้ NativeWind + custom component library
    5. State Management: React Query + Context API
    6. Data Flow: REST API calls กับ doctora-spring-boot 
    backend

    Files จะสร้างใหม่:

    - Authentication: app/welcome.tsx, app/sign-up.tsx, 
    updated app/sign-in.tsx
    - Main screens: Doctor search, booking flow, appointments 
    management
    - Components: 15+ reusable components
    - Services: API integration layer
    - Types: TypeScript interfaces สำหรับ medical domain

    Total Timeline: 21 วันทำงาน (~3-4 สัปดาห์)