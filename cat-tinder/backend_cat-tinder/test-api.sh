#!/bin/bash

# สี ANSI สำหรับแสดงผล
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ข้อมูลจาก seed (แก้ตาม output จาก npm run seed)
OWNER1_ID="68dd75baaa596603743f8800"
OWNER2_ID="68dd75baaa596603743f8803"
CAT1_ID="68dd75baaa596603743f8805"  # Milo (male, owner1)
CAT2_ID="68dd75baaa596603743f8807"  # Luna (female, owner1)
CAT3_ID="68dd75baaa596603743f8809"  # Max (male, owner2)
CAT4_ID="68dd75baaa596603743f880b"  # Bella (female, owner2)

API_URL="http://localhost:4000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  🐱 Cat Tinder API Testing${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test 1: Health Check
echo -e "${GREEN}1. Testing Health Check${NC}"
curl -s "$API_URL/health" | jq .
echo ""

# Test 2: Create Swipe (Owner1's Milo likes Owner2's Bella)
echo -e "${GREEN}2. Owner1's Milo LIKES Owner2's Bella${NC}"
curl -s -X POST "$API_URL/api/swipes" \
  -H "Content-Type: application/json" \
  -H "x-owner-id: $OWNER1_ID" \
  -d "{
    \"swiperCatId\": \"$CAT1_ID\",
    \"targetCatId\": \"$CAT4_ID\",
    \"action\": \"like\"
  }" | jq .
echo ""

# Test 3: Create Swipe (Owner2's Bella likes back → MATCH!)
echo -e "${GREEN}3. Owner2's Bella LIKES back Milo → Should MATCH! 💕${NC}"
curl -s -X POST "$API_URL/api/swipes" \
  -H "Content-Type: application/json" \
  -H "x-owner-id: $OWNER2_ID" \
  -d "{
    \"swiperCatId\": \"$CAT4_ID\",
    \"targetCatId\": \"$CAT1_ID\",
    \"action\": \"like\"
  }" | jq .
echo ""

# Test 4: Get Swipe History
echo -e "${GREEN}4. Get Owner1's Swipe History${NC}"
curl -s "$API_URL/api/swipes/history?limit=10" \
  -H "x-owner-id: $OWNER1_ID" | jq .
echo ""

# Test 5: Get Matches
echo -e "${GREEN}5. Get Owner1's Matches${NC}"
curl -s "$API_URL/api/matches" \
  -H "x-owner-id: $OWNER1_ID" | jq .
echo ""

# Test 6: Get Match Details (ต้องเอา matchId จากข้อ 5)
echo -e "${YELLOW}6. Get Match Details (copy matchId from above and run manually)${NC}"
echo -e "${YELLOW}   curl \"$API_URL/api/matches/{MATCH_ID}\" -H \"x-owner-id: $OWNER1_ID\" | jq .${NC}"
echo ""

# Test 7: Send Message (ต้องเอา matchId จากข้อ 5)
echo -e "${YELLOW}7. Send Message (copy matchId from above and run manually)${NC}"
echo -e "${YELLOW}   curl -X POST \"$API_URL/api/matches/{MATCH_ID}/messages\" \\${NC}"
echo -e "${YELLOW}     -H \"Content-Type: application/json\" \\${NC}"
echo -e "${YELLOW}     -H \"x-owner-id: $OWNER1_ID\" \\${NC}"
echo -e "${YELLOW}     -d '{\"text\": \"Hello! Your cat is so cute!\"}' | jq .${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  ✅ Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
