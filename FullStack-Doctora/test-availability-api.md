# Test Availability API

## 1. Get your token first
Login เป็น Doctor แล้วเอา token จาก localStorage

```javascript
// Run in browser console
localStorage.getItem('token')
```

## 2. Test GET /api/availability/my

```bash
curl -X GET http://localhost:8082/api/availability/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## 3. Test POST /api/availability (เพิ่มเวลาทำงาน)

```bash
curl -X POST http://localhost:8082/api/availability \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": 1,
    "startTime": "09:00:00",
    "endTime": "17:00:00"
  }'
```

### Parameters:
- `dayOfWeek`: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday
- `startTime`: format "HH:mm:ss"
- `endTime`: format "HH:mm:ss"

## 4. Expected Response

### Success (200):
```json
{
  "id": 1,
  "dayOfWeek": 1,
  "dayName": "Monday",
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "timeRange": "09:00:00 - 17:00:00",
  "isActive": true,
  "createdAt": "2025-01-15T10:30:00",
  "message": "Availability added successfully!"
}
```

### Error (403):
```json
{
  "message": "Access denied. Doctor role required."
}
```