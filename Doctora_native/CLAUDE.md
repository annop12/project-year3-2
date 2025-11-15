# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a doctor appointment booking system consisting of two main components:

1. **doctora-mobile**: React Native frontend (Expo) - Currently contains placeholder UI from a property listing app that needs to be converted to doctor booking interface
2. **doctora-spring-boot**: Spring Boot backend - Complete doctor appointment booking API

## Development Commands

### Frontend (doctora-mobile)
```bash
cd doctora-mobile

# Development
npm start                    # Start Expo development server
npm run android             # Launch Android emulator
npm run ios                 # Launch iOS simulator
npm run web                 # Launch web version
npm run lint                # Run ESLint

# Clear cache if needed
npx expo start --clear
```

### Backend (doctora-spring-boot)
```bash
cd doctora-spring-boot

# Database setup
docker-compose up -d        # Start PostgreSQL container

# Development
./mvnw spring-boot:run      # Run Spring Boot app (port 8082)
./mvnw test                 # Run all tests
./mvnw test -Dtest=ClassName # Run specific test class

# Build
./mvnw clean compile        # Compile only
./mvnw clean package        # Build JAR
```

## Architecture Overview

### Backend Structure (doctora-spring-boot)
- **Domain Models**: User, Doctor, Appointment, Specialty, Availability
- **User Roles**: PATIENT, DOCTOR, ADMIN with role-based access
- **Authentication**: JWT-based with Spring Security
- **Database**: PostgreSQL with Flyway migrations
- **API Base**: `http://localhost:8082/api/`

Key relationships:
- Users can be Patients, Doctors, or Admins
- Doctors belong to Specialties and have Availability schedules
- Appointments link Patients with Doctors at specific times

### Frontend Structure (doctora-mobile)
- **Navigation**: Expo Router v6 with file-based routing
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: No global state management yet (needs implementation)
- **Authentication**: Mock implementation (needs real JWT integration)

**Important**: The frontend currently shows property/real estate UI as placeholders. When working on the frontend, you need to:
1. Replace property cards with doctor cards
2. Replace property search with doctor search by specialty
3. Replace property booking with appointment booking
4. Implement real authentication flow with backend

### Database Schema
Tables are created via Flyway migrations in `src/main/resources/db/migration/`:
- V1: users (email, password, role, names)
- V2: specialties (medical specialties)
- V3: doctors (extends users, has specialty, license, fees)
- V4: availabilities (doctor schedules)
- V5: appointments (bookings with status)
- V6: reviews (doctor ratings)

## Key Integration Points

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Authentication (returns JWT)
- `GET /api/doctors` - List doctors (filterable by specialty)
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/patient/{id}` - Patient's appointments

### Configuration
- Backend runs on port 8082
- Database on localhost:5433 (via Docker)
- JWT secret and expiration configured in application.properties
- Frontend connects to backend at `http://localhost:8082`

## Current Issues and TODOs

### Frontend Issues
- Bug in `components/Filters.tsx:13` - syntax error with `setSelectedCategory:`
- All UI components show property data instead of medical data
- No API integration - still using mock data
- Authentication is simulated, not connected to backend

### Integration Tasks
- Create API service layer in frontend
- Implement JWT token storage and management
- Replace mock data with real API calls
- Design doctor and appointment UI components
- Add appointment booking flow

## Database Access

PostgreSQL connection (via Docker):
- Host: localhost:5433
- Database: doctorbook
- Username: admin
- Password: password

Access via psql: `psql -h localhost -p 5433 -U admin -d doctorbook`

## Technology Stack

### Frontend
- React Native 0.81.4 + Expo 54.0.8
- Expo Router v6 (file-based navigation)
- NativeWind 4.2.1 (Tailwind CSS)
- TypeScript with strict mode

### Backend
- Spring Boot 3.5.5 + Java 21
- Spring Security + JWT authentication
- PostgreSQL + Flyway migrations
- JPA/Hibernate for ORM

## File Organization Notes

### Frontend App Structure
- `app/_layout.tsx` - Root layout with font loading
- `app/sign-in.tsx` - Login screen (mock auth)
- `app/(root)/(tabs)/` - Protected tab navigation area
- `components/` - Reusable UI components (currently property-themed)
- `constants/data.ts` - Mock data (needs replacement with API calls)

### Backend Package Structure
- `model/` - JPA entities
- `controller/` - REST endpoints
- `service/` - Business logic
- `repository/` - Data access
- `dto/` - Request/response objects
- `config/` - JWT and security configuration