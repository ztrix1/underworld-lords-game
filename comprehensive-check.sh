#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "${BLUE}════════════════════════════════════════════${NC}"
echo "${GREEN}   UNDERWORLD LORDS - COMPREHENSIVE CHECK${NC}"
echo "${BLUE}════════════════════════════════════════════${NC}"

# 1. فحص هيكل المشروع
echo "\n${YELLOW}📁 PROJECT STRUCTURE:${NC}"
ls -la --color=always

# 2. فحص السيرفر
echo "\n${YELLOW}🚀 SERVER STATUS:${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo "${GREEN}✓ Server is running on port 3000${NC}"
    
    # اختبار API
    echo "\n${YELLOW}📡 API ENDPOINTS:${NC}"
    
    # الرئيسية
    echo -n "GET / : "
    curl -s http://localhost:3000 | python3 -m json.tool 2>/dev/null | grep -o '"message":"[^"]*"' || echo "✓ OK"
    
    # Health check
    echo -n "GET /api/health : "
    HEALTH=$(curl -s http://localhost:3000/api/health)
    echo $HEALTH | python3 -m json.tool 2>/dev/null | grep -E '"status"|"database"' || echo "✓ OK"
    
    # Users
    echo -n "GET /api/users : "
    USERS=$(curl -s http://localhost:3000/api/users)
    echo "$(echo $USERS | grep -o '\[.*\]' | wc -l) users found"
else
    echo "${RED}✗ Server is NOT running${NC}"
    echo "   Start with: cd server && npm run dev"
fi

# 3. فحص قاعدة البيانات
echo "\n${YELLOW}💾 DATABASE STATUS:${NC}"
if command -v mongosh &> /dev/null; then
    mongosh --eval "
        db = db.getSiblingDB('underworld_lords_db');
        print('✓ MongoDB available');
        print('   Collections: ' + db.getCollectionNames().join(', ') || 'none');
        print('   Users count: ' + db.users.countDocuments());
    " 2>/dev/null || echo "${RED}✗ Cannot connect to MongoDB${NC}"
else
    echo "${YELLOW}⚠️  mongosh not installed (using memory server)${NC}"
    # تحقق من وجود اتصال MongoDB من خلال السيرفر
    curl -s http://localhost:3000/api/health | grep -q "connected" && \
        echo "${GREEN}✓ MongoDB Memory Server active${NC}" || \
        echo "${RED}✗ No database connection${NC}"
fi

# 4. فحص الحزم المثبتة
echo "\n${YELLOW}📦 INSTALLED PACKAGES:${NC}"
cd server && npm list --depth=0 2>/dev/null | tail -n +2 | head -10

# 5. فحص المتغيرات البيئية
echo "\n${YELLOW}🔧 ENVIRONMENT:${NC}"
if [ -f .env ]; then
    echo "${GREEN}✓ .env file exists${NC}"
    echo "   PORT=$(grep PORT .env | cut -d'=' -f2)"
    echo "   NODE_ENV=$(grep NODE_ENV .env | cut -d'=' -f2)"
else
    echo "${RED}✗ .env file missing${NC}"
fi

# 6. اقتراح الخطوات التالية
echo "\n${BLUE}════════════════════════════════════════════${NC}"
echo "${GREEN}✅ CHECK COMPLETE${NC}"
echo "${BLUE}════════════════════════════════════════════${NC}"

echo "\n${YELLOW}🎮 NEXT STEPS FOR UNDERWORLD LORDS:${NC}"
cat << 'EOF'
1. 🔐 **Authentication System**
   - Register/Login with JWT
   - Password hashing (bcrypt)
   - Protected routes

2. 👥 **Player Models**
   - Character creation
   - Inventory system
   - Stats and progression

3. 🎲 **Game Mechanics**
   - Turn-based combat
   - Territory control
   - Economy system

4. 🔌 **Real-time Features**
   - Socket.io for live games
   - Chat system
   - Notifications

5. 🎨 **Frontend Development**
   - Main game interface
   - Lobby system
   - Player dashboard
