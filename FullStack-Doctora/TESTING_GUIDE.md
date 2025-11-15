# 🧪 Testing Guide

## Overview

This guide covers how to test the Doctora application locally before deployment.

---

## Prerequisites

- Docker Desktop running
- All environment files configured
- Terminal/Command line access

---

## Quick Test

### Automated Testing Script

We've created automated test scripts for you:

```bash
# Run full deployment test
./test-deployment.sh

# Test running services
./test-services.sh

# Test services on custom URLs
./test-services.sh http://backend-url http://frontend-url
```

---

## Manual Testing Steps

### 1. Test Docker Build

#### Backend
```bash
cd doctora-spring-boot
docker build -t doctora-backend:test .
```

**Expected output:**
- ✅ Build completes successfully
- ✅ No error messages
- ⏱️ Takes ~5-10 minutes (first time)

**Common issues:**
- ❌ `mvnw not found` → Fixed! We use system Maven now
- ❌ `Cannot connect to Docker daemon` → Start Docker Desktop

#### Frontend
```bash
cd FrontendDoctora
docker build -t doctora-frontend:test .
```

**Expected output:**
- ✅ Build completes successfully
- ✅ Creates standalone output
- ⏱️ Takes ~3-5 minutes

---

### 2. Test with Docker Compose

#### Start Services
```bash
# Development mode (just database + backend)
docker-compose -f docker-compose.dev.yml up -d

# Production mode (all services)
docker-compose -f docker-compose.production.yml up -d
```

#### Check Status
```bash
# View running containers
docker-compose ps

# Should show:
# - doctora-db-prod (or -dev)
# - doctora-backend-prod
# - doctora-frontend-prod (production only)

# All should have status "Up" and be healthy
```

#### View Logs
```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker logs doctora-backend-prod -f

# Last 100 lines
docker logs --tail 100 doctora-backend-prod
```

---

### 3. Test Backend Endpoints

#### Health Checks
```bash
# Basic health check
curl http://localhost:8082/api/health

# Expected:
{
  "status": "UP",
  "database": "UP",
  "service": "Doctora Backend API",
  "version": "1.0.0"
}

# Simple ping
curl http://localhost:8082/api/health/ping

# Readiness check
curl http://localhost:8082/api/health/ready

# Liveness check
curl http://localhost:8082/api/health/live
```

#### Public API Endpoints
```bash
# Get specialties
curl http://localhost:8082/api/specialties | jq

# Get doctors
curl http://localhost:8082/api/doctors | jq

# Get active doctors
curl http://localhost:8082/api/doctors/active | jq
```

---

### 4. Test Frontend

Open browser:
```
http://localhost:3000
```

**Check:**
- ✅ Homepage loads
- ✅ No console errors
- ✅ Specialties display
- ✅ Can navigate to doctor list
- ✅ Images load properly

---

### 5. Test Authentication Flow

#### Register New User
```bash
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected:** Success message with HTTP 200

#### Login
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:** JWT token in response

---

### 6. Test Database

#### Connect to Database
```bash
# Using docker exec
docker exec -it doctora-db-prod psql -U admin -d doctorbook

# Inside psql:
\dt  # List tables
\d users  # Describe users table
SELECT COUNT(*) FROM users;  # Count users
\q  # Quit
```

#### Check Migrations
```bash
# View Flyway migration history
docker exec -it doctora-db-prod psql -U admin -d doctorbook -c \
  "SELECT * FROM flyway_schema_history ORDER BY installed_rank;"
```

**Expected:** 12 migrations (V1 through V12)

---

### 7. Test CORS

#### From Browser Console
```javascript
// Open http://localhost:3000 in browser
// Open browser console (F12)

fetch('http://localhost:8082/api/specialties')
  .then(res => res.json())
  .then(data => console.log('✅ CORS works!', data))
  .catch(err => console.error('❌ CORS error:', err));
```

**Expected:** Data returned, no CORS errors

---

### 8. Load Testing (Optional)

#### Install Apache Bench
```bash
# Mac
brew install httpd

# Ubuntu/Debian
sudo apt-get install apache2-utils
```

#### Run Load Test
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:8082/api/health

# Test specialties endpoint
ab -n 100 -c 5 http://localhost:8082/api/specialties
```

**Look for:**
- Response times
- Failed requests (should be 0)
- Requests per second

---

## Test Checklist

### Before Deployment
- [ ] Backend Docker builds successfully
- [ ] Frontend Docker builds successfully
- [ ] Docker compose starts all services
- [ ] Database migrations complete
- [ ] Health check endpoints return 200
- [ ] Can fetch specialties
- [ ] Can register new user
- [ ] Can login
- [ ] Frontend loads correctly
- [ ] CORS works properly
- [ ] No errors in logs

### After Deployment
- [ ] Production health check works
- [ ] Can access frontend
- [ ] API requests work from frontend
- [ ] Can register/login in production
- [ ] Can book appointment
- [ ] Doctor dashboard works
- [ ] Admin panel accessible

---

## Troubleshooting Tests

### Backend won't start
```bash
# Check logs
docker logs doctora-backend-prod

# Common issues:
# - Database not ready: wait 30 seconds
# - Port in use: stop other services
# - Migration failed: check flyway logs
```

### Frontend won't connect
```bash
# Check environment variable
docker exec doctora-frontend-prod env | grep API_BASE_URL

# Should show: NEXT_PUBLIC_API_BASE_URL=http://backend:8082
```

### CORS errors
```bash
# Check backend CORS config
docker logs doctora-backend-prod | grep CORS

# Verify ALLOWED_ORIGINS is set correctly
docker exec doctora-backend-prod env | grep ALLOWED_ORIGINS
```

### Database connection failed
```bash
# Check database is running
docker ps | grep postgres

# Test connection
docker exec doctora-db-prod pg_isready -U admin

# Check backend can connect
docker exec doctora-backend-prod nc -zv postgres 5432
```

---

## Performance Benchmarks

### Expected Response Times
- Health check: < 50ms
- Specialties list: < 200ms
- Doctors list: < 300ms
- Login: < 500ms
- Booking: < 1000ms

### Resource Usage
- Backend: ~512MB RAM
- Frontend: ~256MB RAM
- Database: ~128MB RAM
- Total: ~1GB RAM

---

## Clean Up After Testing

```bash
# Stop services
docker-compose -f docker-compose.production.yml down

# Remove volumes (⚠️ deletes data!)
docker-compose -f docker-compose.production.yml down -v

# Remove images
docker rmi doctora-backend:test
docker rmi doctora-frontend:test

# Clean up everything (⚠️ careful!)
docker system prune -a --volumes
```

---

## Automated Test Suite (Future)

### Backend Tests
```bash
cd doctora-spring-boot
mvn test
```

### Frontend Tests
```bash
cd FrontendDoctora
npm test
```

### Integration Tests
```bash
# Coming soon
./run-integration-tests.sh
```

---

## CI/CD Testing

Our GitHub Actions automatically test:
- ✅ Backend builds
- ✅ Frontend builds
- ✅ Docker images build
- ✅ Tests pass (when added)

View results: GitHub → Actions tab

---

## Test Environment URLs

### Local Development
- Frontend: http://localhost:3000
- Backend: http://localhost:8082
- Database: localhost:5435

### Docker Production
- Frontend: http://localhost:3000
- Backend: http://localhost:8082
- Database: localhost:5432

### Railway (After Deployment)
- Frontend: https://[project].up.railway.app
- Backend: https://[project].up.railway.app

---

## Support

If tests fail:
1. Check logs first
2. Consult TROUBLESHOOTING.md
3. Check DOCKER_GUIDE.md
4. Create GitHub issue with:
   - Error message
   - Logs
   - Steps to reproduce

---

**Happy Testing! 🧪**
