#!/bin/bash

echo "🔍 Underworld Lords - System Status"
echo "==================================="

# فحص السيرفر
echo "📡 Server Status:"
if curl -s http://localhost:3000/api/health > /dev/null; then
  echo "✅ Server is running"
  curl -s http://localhost:3000/api/health | json_pp
else
  echo "❌ Server is not running"
fi

echo ""
echo "📦 Installed Packages:"
cd server && npm list --depth=0 2>/dev/null | head -10

echo ""
echo "📁 Project Structure:"
cd /workspaces/underworld-lords-game
ls -la

echo ""
echo "🔧 Environment:"
cat server/.env 2>/dev/null || echo "⚠️  No .env file found"

echo ""
echo "==================================="
