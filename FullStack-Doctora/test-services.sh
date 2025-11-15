#!/bin/bash

echo "🧪 Testing Doctora Services"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="${1:-http://localhost:8082}"
FRONTEND_URL="${2:-http://localhost:3000}"

echo -e "${BLUE}Backend URL: $BACKEND_URL${NC}"
echo -e "${BLUE}Frontend URL: $FRONTEND_URL${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED (HTTP $response, expected $expected_status)${NC}"
        return 1
    fi
}

# Function to test JSON response
test_json_endpoint() {
    local name=$1
    local url=$2

    echo -n "Testing $name... "

    response=$(curl -s "$url" 2>/dev/null)

    if echo "$response" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✅ OK (Valid JSON)${NC}"
        echo -e "${YELLOW}   Response: $(echo $response | jq -c . 2>/dev/null | head -c 100)...${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED (Invalid JSON or no response)${NC}"
        return 1
    fi
}

# Test Backend Health Endpoints
echo "🏥 Backend Health Checks"
echo "------------------------"
test_json_endpoint "Health Check" "$BACKEND_URL/api/health"
test_json_endpoint "Ping" "$BACKEND_URL/api/health/ping"
test_json_endpoint "Liveness" "$BACKEND_URL/api/health/live"
test_json_endpoint "Readiness" "$BACKEND_URL/api/health/ready"
echo ""

# Test Public API Endpoints
echo "🌐 Public API Endpoints"
echo "-----------------------"
test_json_endpoint "Specialties List" "$BACKEND_URL/api/specialties"
test_json_endpoint "Specialties with Count" "$BACKEND_URL/api/specialties/with-count"
test_json_endpoint "Doctors List" "$BACKEND_URL/api/doctors"
test_json_endpoint "Active Doctors" "$BACKEND_URL/api/doctors/active"
echo ""

# Test Authentication Endpoints (should return 400 without body)
echo "🔐 Authentication Endpoints"
echo "---------------------------"
echo -n "Testing Login endpoint... "
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" 2>/dev/null)
if [ "$response" = "400" ] || [ "$response" = "401" ]; then
    echo -e "${GREEN}✅ OK (HTTP $response - endpoint exists)${NC}"
else
    echo -e "${YELLOW}⚠️  Unexpected status: HTTP $response${NC}"
fi

echo -n "Testing Register endpoint... "
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" 2>/dev/null)
if [ "$response" = "400" ] || [ "$response" = "401" ]; then
    echo -e "${GREEN}✅ OK (HTTP $response - endpoint exists)${NC}"
else
    echo -e "${YELLOW}⚠️  Unexpected status: HTTP $response${NC}"
fi
echo ""

# Test Frontend
echo "🎨 Frontend Tests"
echo "-----------------"
test_endpoint "Frontend Homepage" "$FRONTEND_URL" 200
echo ""

# Test CORS
echo "🔗 CORS Configuration"
echo "---------------------"
echo -n "Testing CORS headers... "
cors_header=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/specialties" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" 2>/dev/null | grep -i "access-control-allow-origin")

if [ -n "$cors_header" ]; then
    echo -e "${GREEN}✅ CORS headers present${NC}"
    echo -e "${YELLOW}   $cors_header${NC}"
else
    echo -e "${YELLOW}⚠️  No CORS headers found${NC}"
fi
echo ""

# Summary
echo "============================"
echo -e "${GREEN}Testing completed!${NC}"
echo ""
echo "Note: If any tests failed, check:"
echo "  • Services are running (docker-compose ps)"
echo "  • Ports are not blocked by firewall"
echo "  • Database migrations completed"
echo "  • Environment variables are set correctly"
echo ""
