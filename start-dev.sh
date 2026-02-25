#!/bin/bash

echo "🚀 Starting Underworld Lords Development Environment"
echo "=================================================="

# تنظيف أي عمليات سابقة
pkill -f node || true

# تشغيل الخادم
cd /workspaces/underworld-lords-game/server
echo "📦 Installing dependencies..."
npm install

echo "🌐 Starting server in development mode..."
NODE_ENV=development nodemon server.js &

# انتظار تشغيل السيرفر
sleep 3

echo ""
echo "📊 Server Status:"
curl -s http://localhost:3000/api/health | json_pp || echo "⚠️  Server not ready yet"

echo ""
echo "✅ Development environment is ready!"
echo "📝 Server logs are being shown above"
echo "🔍 Press Ctrl+C to stop the server"
echo "=================================================="

# إظهار logs السيرفر
wait
