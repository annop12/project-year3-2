#!/bin/bash

echo "🧪 Testing Doctora Deployment"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Docker is running
echo "1️⃣  Checking Docker..."
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is running${NC}"
else
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi
echo ""

# Test 2: Build Backend
echo "2️⃣  Building Backend Docker image..."
cd doctora-spring-boot
if docker build -t doctora-backend:test . > /tmp/backend-build.log 2>&1; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    echo "Check logs: tail /tmp/backend-build.log"
    exit 1
fi
cd ..
echo ""

# Test 3: Build Frontend
echo "3️⃣  Building Frontend Docker image..."
cd FrontendDoctora
if docker build -t doctora-frontend:test . > /tmp/frontend-build.log 2>&1; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    echo "Check logs: tail /tmp/frontend-build.log"
    exit 1
fi
cd ..
echo ""

# Test 4: Check docker-compose files
echo "4️⃣  Validating docker-compose files..."
if docker-compose -f docker-compose.production.yml config > /dev/null 2>&1; then
    echo -e "${GREEN}✅ docker-compose.production.yml is valid${NC}"
else
    echo -e "${RED}❌ docker-compose.production.yml has errors${NC}"
    exit 1
fi
echo ""

# Test 5: Check environment files
echo "5️⃣  Checking environment files..."
check_env_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
    else
        echo -e "${YELLOW}⚠️  $1 not found (using defaults)${NC}"
    fi
}

check_env_file "doctora-spring-boot/.env.development"
check_env_file "FrontendDoctora/.env.local"
echo ""

# Test 6: List Docker images
echo "6️⃣  Docker images created:"
docker images | grep doctora
echo ""

# Summary
echo "=============================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "  • Test locally: docker-compose -f docker-compose.production.yml up"
echo "  • Deploy to Railway: Follow RAILWAY_DEPLOYMENT.md"
echo ""
