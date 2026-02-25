#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${GREEN}🎮 Starting Underworld Lords...${NC}"

# Kill existing processes
echo "${YELLOW}⏹️  Stopping existing processes...${NC}"
lsof -ti:3000,8080 | xargs kill -9 2>/dev/null

# Start server
echo "${GREEN}🚀 Starting server...${NC}"
cd /workspaces/underworld-lords-game/server
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start client
echo "${GREEN}🌐 Starting client...${NC}"
cd /workspaces/underworld-lords-game/client
python3 -m http.server 8080 &
CLIENT_PID=$!

echo ""
echo "${GREEN}✅ System Ready!${NC}"
echo "📡 Server PID: $SERVER_PID"
echo "🌐 Client PID: $CLIENT_PID"
echo ""
echo "${YELLOW}📌 LINKS:${NC}"
echo "   Local:    http://localhost:8080"
echo "   Public:   https://glorious-eureka-v645pqx5q5vxhp646-8080.app.github.dev"
echo ""
echo "${YELLOW}🛑 To stop:${NC} pkill -f node && pkill -f python3"
